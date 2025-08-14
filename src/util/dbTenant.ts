import type { PayloadRequest } from 'payload'

/**
 * Set PostgreSQL session variables for Row-Level Security
 * This function sets the current tenant, user, and admin status
 * in PostgreSQL session variables that are used by RLS policies
 */
export const setTenantContext = async (req: PayloadRequest) => {
  // Skip if no database connection
  if (!req.payload?.db) {
    return
  }

  try {
    // Get tenant ID from various sources
    let tenantId: string | undefined

    // 1. From authenticated user's current tenant
    if (req.user?.currentTenant) {
      tenantId = typeof req.user.currentTenant === 'object' 
        ? req.user.currentTenant.id 
        : req.user.currentTenant
    }
    // 2. From HTTP header (for SSR/API calls)
    else if (req.headers && typeof req.headers === 'object' && 'x-tenant-id' in req.headers) {
      tenantId = (req.headers as Record<string, string>)['x-tenant-id'] as string
    }
    // 3. From query parameter (for specific operations)
    else if (req.query?.tenant) {
      tenantId = req.query.tenant as string
    }

    // Get user information
    const userId = req.user?.id
    const isSuperAdmin = req.user?.isSuperAdmin || false

    // Set PostgreSQL session variables using raw query
    const client = (req.payload.db as { client?: { query: (sql: string, params: unknown[]) => Promise<unknown> }; pool?: { query: (sql: string, params: unknown[]) => Promise<unknown> } }).client || (req.payload.db as { client?: { query: (sql: string, params: unknown[]) => Promise<unknown> }; pool?: { query: (sql: string, params: unknown[]) => Promise<unknown> } }).pool

    if (client) {
      // Set all context variables in a single query for efficiency
      const contextQuery = `
        SELECT 
          set_config('app.current_tenant', $1, false),
          set_config('app.current_user_id', $2, false),
          set_config('app.is_super_admin', $3, false)
      `
      
      await client.query(contextQuery, [
        tenantId || null,
        userId || null,
        isSuperAdmin.toString()
      ])

      // Log for debugging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('RLS Context Set:', {
          tenantId,
          userId,
          isSuperAdmin,
          user: req.user?.email
        })
      }
    }
  } catch (error) {
    console.error('Error setting tenant context:', error)
    // Don't throw - allow operation to continue without RLS
  }
}

/**
 * Clear PostgreSQL session variables
 * Called after operations to clean up session state
 */
export const clearTenantContext = async (req: PayloadRequest) => {
  if (!req.payload?.db) {
    return
  }

  try {
    const client = (req.payload.db as { client?: { query: (sql: string, params: unknown[]) => Promise<unknown> }; pool?: { query: (sql: string, params: unknown[]) => Promise<unknown> } }).client || (req.payload.db as { client?: { query: (sql: string, params: unknown[]) => Promise<unknown> }; pool?: { query: (sql: string, params: unknown[]) => Promise<unknown> } }).pool

    if (client) {
      await client.query(`
        SELECT 
          set_config('app.current_tenant', NULL, false),
          set_config('app.current_user_id', NULL, false),
          set_config('app.is_super_admin', NULL, false)
      `, [])
    }
  } catch (error) {
    console.error('Error clearing tenant context:', error)
  }
}

/**
 * Middleware to set tenant ID in request headers for internal API calls
 */
export const injectTenantHeader = (tenantId: string) => {
  return (headers: HeadersInit = {}): HeadersInit => {
    return {
      ...headers,
      'x-tenant-id': tenantId,
    }
  }
}