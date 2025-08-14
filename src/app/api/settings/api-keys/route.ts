import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import crypto from 'crypto'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

// Encryption key - in production, this should be from environment variable
const ENCRYPTION_KEY = process.env.API_ENCRYPTION_KEY || 'your-32-byte-encryption-key-here-change-in-prod'
const ALGORITHM = 'aes-256-gcm'

// Encrypt sensitive data
function encrypt(text: string): { encrypted: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)), iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

// Decrypt sensitive data
function decrypt(encryptedData: { encrypted: string; iv: string; authTag: string }): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
    Buffer.from(encryptedData.iv, 'hex')
  )
  
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

// GET endpoint to retrieve API settings
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payloadInstance = await getPayload({ config: await configPromise })
    
    // Verify the user is authenticated
    const { user } = await payloadInstance.auth({ headers: request.headers })
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get tenant ID from user
    const tenantId = (user as any).tenantId || (user as any).currentTenantId
    
    if (!tenantId) {
      // Get default tenant if user doesn't have a specific tenant
      const defaultTenant = await prisma.tenant.findFirst({
        where: { isDefault: true }
      })
      
      if (!defaultTenant) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 404 })
      }
    }
    
    // Get tenant-specific settings from database
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId || undefined },
      select: {
        gaApiMeasurementId: true,
        gaApiSecretEncrypted: true,
        gaApiPropertyId: true,
        gbpApiAccountId: true,
        gbpApiLocationId: true,
        gbpApiKeyEncrypted: true,
        gbpApiClientId: true,
        gbpApiClientSecretEncrypted: true,
        serpApiKeyEncrypted: true,
        serpApiEngine: true,
        serpApiDomain: true
      }
    })

    if (!tenant) {
      // Return empty settings if tenant not found
      return NextResponse.json({
        googleAnalytics: {
          measurementId: '',
          apiSecret: '',
          propertyId: ''
        },
        googleBusinessProfile: {
          accountId: '',
          locationId: '',
          apiKey: '',
          clientId: '',
          clientSecret: ''
        },
        serpApi: {
          apiKey: '',
          engine: 'google',
          domain: 'google.co.jp'
        }
      })
    }
    
    // Decrypt sensitive fields
    const settings = {
      googleAnalytics: {
        measurementId: tenant.gaApiMeasurementId || '',
        apiSecret: tenant.gaApiSecretEncrypted ? 
          decrypt(tenant.gaApiSecretEncrypted as any) : '',
        propertyId: tenant.gaApiPropertyId || ''
      },
      googleBusinessProfile: {
        accountId: tenant.gbpApiAccountId || '',
        locationId: tenant.gbpApiLocationId || '',
        apiKey: tenant.gbpApiKeyEncrypted ? 
          decrypt(tenant.gbpApiKeyEncrypted as any) : '',
        clientId: tenant.gbpApiClientId || '',
        clientSecret: tenant.gbpApiClientSecretEncrypted ? 
          decrypt(tenant.gbpApiClientSecretEncrypted as any) : ''
      },
      serpApi: {
        apiKey: tenant.serpApiKeyEncrypted ? 
          decrypt(tenant.serpApiKeyEncrypted as any) : '',
        engine: tenant.serpApiEngine || 'google',
        domain: tenant.serpApiDomain || 'google.co.jp'
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch API settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST endpoint to save API settings
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payloadInstance = await getPayload({ config: await configPromise })
    
    // Verify the user is authenticated
    const { user } = await payloadInstance.auth({ headers: request.headers })
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await request.json()

    // Get tenant ID from user
    const tenantId = (user as any).tenantId || (user as any).currentTenantId
    
    if (!tenantId) {
      // Get default tenant if user doesn't have a specific tenant  
      const defaultTenant = await prisma.tenant.findFirst({
        where: { isDefault: true }
      })
      
      if (!defaultTenant) {
        return NextResponse.json({ error: 'No tenant found' }, { status: 404 })
      }
    }

    // Prepare update data with encrypted sensitive fields
    const updateData: any = {
      gaApiMeasurementId: settings.googleAnalytics.measurementId || null,
      gaApiPropertyId: settings.googleAnalytics.propertyId || null,
      gbpApiAccountId: settings.googleBusinessProfile.accountId || null,
      gbpApiLocationId: settings.googleBusinessProfile.locationId || null,
      gbpApiClientId: settings.googleBusinessProfile.clientId || null,
      serpApiEngine: settings.serpApi.engine || 'google',
      serpApiDomain: settings.serpApi.domain || 'google.co.jp'
    }

    // Encrypt sensitive fields if provided
    if (settings.googleAnalytics.apiSecret) {
      updateData.gaApiSecretEncrypted = encrypt(settings.googleAnalytics.apiSecret)
    }
    
    if (settings.googleBusinessProfile.apiKey) {
      updateData.gbpApiKeyEncrypted = encrypt(settings.googleBusinessProfile.apiKey)
    }
    
    if (settings.googleBusinessProfile.clientSecret) {
      updateData.gbpApiClientSecretEncrypted = encrypt(settings.googleBusinessProfile.clientSecret)
    }
    
    if (settings.serpApi.apiKey) {
      updateData.serpApiKeyEncrypted = encrypt(settings.serpApi.apiKey)
    }

    // Update tenant settings
    await prisma.tenant.update({
      where: { id: tenantId || undefined },
      data: updateData
    })

    return NextResponse.json({ success: true, message: 'Settings saved successfully' })
  } catch (error) {
    console.error('Failed to save API settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}