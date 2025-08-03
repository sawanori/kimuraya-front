import { decrypt } from '../crypto'

interface TenantApiSettings {
  apiSettings?: {
    googleBusinessProfile?: {
      apiKeyEncrypted?: string
      placeId?: string
      isEnabled?: boolean
    }
    customApiEndpoint?: string
  }
}

export async function getGoogleReviews(tenant: TenantApiSettings) {
  if (!tenant.apiSettings?.googleBusinessProfile?.isEnabled) {
    return null
  }

  const { apiKeyEncrypted, placeId } = tenant.apiSettings.googleBusinessProfile

  if (!apiKeyEncrypted || !placeId) {
    return null
  }

  try {
    // サーバーサイドでのみAPIキーを復号化
    const secret = process.env.PAYLOAD_SECRET || 'default-secret-key'
    const apiKey = decrypt(apiKeyEncrypted, secret)

    // Google Places API呼び出し
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`,
      {
        next: { revalidate: 3600 } // 1時間キャッシュ
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch reviews')
    }

    const data = await response.json()
    
    return {
      reviews: data.result?.reviews || [],
      rating: data.result?.rating || 0,
      totalRatings: data.result?.user_ratings_total || 0
    }
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
    return null
  }
}

export async function getCustomApiReviews(tenant: TenantApiSettings) {
  const endpoint = tenant.apiSettings?.customApiEndpoint

  if (!endpoint) {
    return null
  }

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 3600 } // 1時間キャッシュ
    })

    if (!response.ok) {
      throw new Error('Failed to fetch reviews from custom API')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching custom reviews:', error)
    return null
  }
}