import type { Access } from 'payload'

export const isSuperAdmin: Access = ({ req: { user } }) => {
  return user?.isSuperAdmin || false
}

export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.isSuperAdmin || false
}

export const isLoggedIn: Access = ({ req: { user } }) => {
  return !!user
}

export const tenantAccess: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.isSuperAdmin) return true
  
  // ユーザーが所属するテナントのデータのみアクセス可能
  return {
    tenant: {
      in: user.tenants?.map((tenant: string | { id: string }) => 
        typeof tenant === 'string' ? tenant : tenant.id
      ) || []
    }
  }
}

export const tenantFieldAccess = ({ req: { user } }: { req: { user?: { isSuperAdmin?: boolean; role?: string } } }) => {
  if (!user) return false
  if (user.isSuperAdmin) return true
  
  // 管理者のみテナントフィールドを編集可能
  return user.role === 'admin'
}

// コレクションフックでテナントを自動設定
export const autoSetTenant = async ({ data, req }: { data: Record<string, unknown>; req: { user?: { currentTenant?: string } } }) => {
  if (!data.tenant && req.user?.currentTenant) {
    data.tenant = req.user.currentTenant
  }
  return data
}

// クエリフックでテナントフィルタを自動適用
export const filterByTenant = async ({ query, req }: { query: Record<string, unknown>; req: { user?: { isSuperAdmin?: boolean; currentTenant?: string } } }) => {
  if (req.user?.isSuperAdmin) return query
  
  if (req.user?.currentTenant) {
    query.where = {
      ...query.where,
      tenant: {
        equals: req.user.currentTenant
      }
    }
  }
  
  return query
}