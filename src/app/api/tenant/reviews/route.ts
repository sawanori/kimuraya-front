import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getGoogleReviews, getCustomApiReviews } from '@/lib/api/googleBusinessProfile'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // ホストからテナントを特定
    const host = request.headers.get('host') || ''
    
    // テナントを検索
    const tenants = await payload.find({
      collection: 'tenants',
      where: {
        or: [
          {
            'domains.url': {
              equals: host
            }
          },
          {
            'settings.domain': {
              equals: host
            }
          }
        ]
      },
      limit: 1
    })

    if (!tenants.docs || tenants.docs.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const tenant = tenants.docs[0]

    // Google Business Profileレビューを取得
    const googleReviews = await getGoogleReviews(tenant.settings || {})
    
    // カスタムAPIレビューを取得
    const customReviews = await getCustomApiReviews(tenant.settings || {})

    return NextResponse.json({
      googleReviews,
      customReviews,
      tenantName: tenant.name
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}