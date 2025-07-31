import type { CollectionConfig } from 'payload'
import { setTenantContext } from '../util/dbTenant'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'createdAt'],
    description: 'テナント（店舗）の管理',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.isSuperAdmin) return true
      
      // ユーザーが所属するテナントのみ閲覧可能
      return {
        id: {
          in: user.tenants?.map((tenant: any) => 
            typeof tenant === 'string' ? tenant : tenant.id
          ) || []
        }
      }
    },
    create: ({ req: { user } }) => user?.isSuperAdmin || false,
    update: ({ req: { user } }) => user?.isSuperAdmin || false,
    delete: ({ req: { user } }) => user?.isSuperAdmin || false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: '店舗名',
      required: true,
      admin: {
        description: '例: 木村屋本店',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'スラッグ',
      required: true,
      unique: true,
      admin: {
        description: 'URL等で使用される識別子（半角英数字とハイフンのみ）',
      },
      validate: (value: any) => {
        if (!value) return 'スラッグは必須です'
        if (!/^[a-z0-9-]+$/.test(value)) {
          return '半角英数字（小文字）とハイフンのみ使用可能です'
        }
        return true
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'ステータス',
      required: true,
      defaultValue: 'active',
      options: [
        {
          label: 'アクティブ',
          value: 'active',
        },
        {
          label: '非アクティブ',
          value: 'inactive',
        },
        {
          label: 'メンテナンス中',
          value: 'maintenance',
        },
      ],
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      label: 'デフォルトテナント',
      defaultValue: false,
      admin: {
        description: '新規ユーザーのデフォルトテナントとして使用',
      },
    },
    {
      name: 'domains',
      type: 'array',
      label: 'ドメイン設定',
      admin: {
        description: 'このテナントに紐付くドメインを登録',
      },
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'ドメイン/ホスト名',
          required: true,
          admin: {
            description: '例: ramen-taro.localhost, ramen-taro.jp',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          label: '有効',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      label: 'テナント設定',
      fields: [
        {
          name: 'domain',
          type: 'text',
          label: 'カスタムドメイン',
          admin: {
            description: '例: shinjuku.kimuraya.com (廃止予定 - domainsを使用してください)',
          },
        },
        {
          name: 'theme',
          type: 'group',
          label: 'テーマ設定',
          fields: [
            {
              name: 'primaryColor',
              type: 'text',
              label: 'プライマリカラー',
              defaultValue: '#0066ff',
              admin: {
                description: 'HEX形式で入力（例: #0066ff）',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'ロゴ画像',
            },
          ],
        },
        {
          name: 'features',
          type: 'group',
          label: '機能設定',
          fields: [
            {
              name: 'enableNews',
              type: 'checkbox',
              label: '新着情報機能',
              defaultValue: true,
            },
            {
              name: 'enableReservation',
              type: 'checkbox',
              label: '予約機能',
              defaultValue: true,
            },
            {
              name: 'enableAnalytics',
              type: 'checkbox',
              label: 'アナリティクス機能',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'limits',
          type: 'group',
          label: '制限設定',
          fields: [
            {
              name: 'maxUsers',
              type: 'number',
              label: '最大ユーザー数',
              defaultValue: 10,
              min: 1,
            },
            {
              name: 'maxArticles',
              type: 'number',
              label: '最大記事数',
              defaultValue: 1000,
              min: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: '連絡先情報',
      fields: [
        {
          name: 'address',
          type: 'text',
          label: '住所',
        },
        {
          name: 'phone',
          type: 'text',
          label: '電話番号',
        },
        {
          name: 'email',
          type: 'email',
          label: 'メールアドレス',
        },
        {
          name: 'businessHours',
          type: 'textarea',
          label: '営業時間',
          admin: {
            description: '例: 平日 17:00-23:00, 土日祝 11:00-23:00',
          },
        },
      ],
    },
  ],
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
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && !data.slug && data.name) {
          // 名前からスラッグを自動生成（簡易版）
          data.slug = data.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          console.log(`新しいテナントが作成されました: ${doc.name} (${doc.slug})`)
        }
        return doc
      },
    ],
  },
  timestamps: true,
}