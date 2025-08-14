import type { CollectionConfig } from 'payload'
import { setTenantContext } from '../util/dbTenant'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'isSuperAdmin'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.isSuperAdmin) return true
      
      // 同じテナントのユーザーのみ閲覧可能
      return {
        tenants: {
          in: user.tenants?.map((tenant: any) => 
            typeof tenant === 'string' ? tenant : tenant.id
          ) || []
        }
      }
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.isSuperAdmin || false,
    update: ({ req: { user }, id }) => {
      if (!user) return false
      if (user.isSuperAdmin) return true
      if (user.id === id) return true // 自分自身は編集可能
      return user.role === 'admin'
    },
    delete: ({ req: { user } }) => user?.isSuperAdmin || false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '名前',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: '役割',
      options: [
        {
          label: '管理者',
          value: 'admin',
        },
        {
          label: 'ユーザー',
          value: 'user',
        },
      ],
      defaultValue: 'user',
      required: true,
    },
    {
      name: 'isSuperAdmin',
      type: 'checkbox',
      label: 'スーパー管理者',
      defaultValue: false,
      admin: {
        description: '全テナントへのアクセス権限を持つ',
        condition: (data, siblingData, { user }) => user?.isSuperAdmin || false,
      },
    },
    {
      name: 'tenants',
      type: 'relationship',
      relationTo: 'tenants',
      hasMany: true,
      label: 'アクセス可能なテナント',
      admin: {
        description: 'ユーザーがアクセスできるテナント（スーパー管理者は全テナントアクセス可能）',
      },
      hooks: {
        beforeChange: [
          async ({ value, data, req }) => {
            // スーパー管理者は少なくとも1つのテナントが必要
            if (data?.isSuperAdmin && (!value || value.length === 0)) {
              // デフォルトテナントを探す
              const payload = req.payload
              const defaultTenant = await payload.find({
                collection: 'tenants',
                where: {
                  isDefault: {
                    equals: true,
                  },
                },
                limit: 1,
              })
              
              if (defaultTenant.docs.length > 0) {
                return [defaultTenant.docs[0].id]
              }
            }
            return value
          },
        ],
      },
    },
    {
      name: 'currentTenant',
      type: 'relationship',
      relationTo: 'tenants',
      label: '現在のテナント',
      admin: {
        description: '現在操作中のテナント',
        condition: (data) => data?.tenants && data.tenants.length > 1,
      },
    },
  ],
  hooks: {
    beforeOperation: [
      async ({ args, operation: _operation }) => {
        // RLSのためのテナントコンテキスト設定
        if (args.req) {
          await setTenantContext(args.req)
        }
        return args
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          // 新規ユーザーにデフォルトテナントを設定
          if (!data.tenants || data.tenants.length === 0) {
            const payload = req.payload
            const defaultTenant = await payload.find({
              collection: 'tenants',
              where: {
                isDefault: {
                  equals: true,
                },
              },
              limit: 1,
            })
            
            if (defaultTenant.docs.length > 0) {
              data.tenants = [defaultTenant.docs[0].id]
              data.currentTenant = defaultTenant.docs[0].id
            }
          }
        }
        return data
      },
    ],
  },
}