import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
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
  ],
}