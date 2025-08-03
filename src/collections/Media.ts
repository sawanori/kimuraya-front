import type { CollectionConfig } from 'payload'
import { setTenantContext } from '../util/dbTenant'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/*', 'video/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
      },
      {
        name: 'medium',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'large',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
  },
  admin: {
    useAsTitle: 'filename',
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        // RLSのためのテナントコンテキスト設定
        if (args.req) {
          await setTenantContext(args.req)
        }
        return args
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: '代替テキスト',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      label: 'テナント',
      admin: {
        description: 'このメディアが属するテナント',
      },
      hooks: {
        beforeChange: [
          async ({ value, req }) => {
            // ユーザーの現在のテナントを自動設定
            if (!value && req.user?.currentTenant) {
              return req.user.currentTenant
            }
            return value
          },
        ],
      },
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.isSuperAdmin) return true
      
      // ユーザーが所属するテナントのメディアのみ閲覧可能
      return {
        tenant: {
          in: user.tenants?.map((tenant: any) => 
            typeof tenant === 'string' ? tenant : tenant.id
          ) || []
        }
      }
    },
    create: ({ req: { user } }) => user?.role === 'admin' || user?.isSuperAdmin || false,
    update: ({ req: { user } }) => user?.role === 'admin' || user?.isSuperAdmin || false,
    delete: ({ req: { user } }) => user?.role === 'admin' || user?.isSuperAdmin || false,
  },
}