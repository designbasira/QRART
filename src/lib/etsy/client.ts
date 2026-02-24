// Etsy API v3 client
// Docs: https://developers.etsy.com/
const ETSY_API = 'https://openapi.etsy.com/v3/application'

export function isEtsyConfigured(): boolean {
  return !!import.meta.env.VITE_ETSY_API_KEY
}

function getApiKey(): string {
  return import.meta.env.VITE_ETSY_API_KEY ?? ''
}

// OAuth 2.0 PKCE flow
export function getEtsyAuthUrl(redirectUri: string, state: string, codeChallenge: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: getApiKey(),
    redirect_uri: redirectUri,
    scope: 'listings_w listings_r shops_r',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })
  return `https://www.etsy.com/oauth/connect?${params}`
}

export async function exchangeToken(params: {
  code: string
  redirectUri: string
  codeVerifier: string
}): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
  const res = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: getApiKey(),
      redirect_uri: params.redirectUri,
      code: params.code,
      code_verifier: params.codeVerifier,
    }),
  })
  if (!res.ok) throw new Error(`Etsy token error: ${res.status}`)
  const data = await res.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
}> {
  const res = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: getApiKey(),
      refresh_token: refreshToken,
    }),
  })
  if (!res.ok) throw new Error(`Etsy refresh error: ${res.status}`)
  const data = await res.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
  }
}

export async function getShop(accessToken: string): Promise<{ shopId: number; shopName: string; url: string }> {
  const res = await fetch(`${ETSY_API}/users/me`, {
    headers: {
      'x-api-key': getApiKey(),
      'Authorization': `Bearer ${accessToken}`,
    },
  })
  if (!res.ok) throw new Error(`Etsy user error: ${res.status}`)
  const user = await res.json()

  const shopRes = await fetch(`${ETSY_API}/users/${user.user_id}/shops`, {
    headers: {
      'x-api-key': getApiKey(),
      'Authorization': `Bearer ${accessToken}`,
    },
  })
  if (!shopRes.ok) throw new Error(`Etsy shop error: ${shopRes.status}`)
  const shopData = await shopRes.json()
  const shop = shopData.results?.[0]
  if (!shop) throw new Error('Aucune boutique Etsy trouvée')

  return {
    shopId: shop.shop_id,
    shopName: shop.shop_name,
    url: shop.url,
  }
}

export async function createDraftListing(params: {
  accessToken: string
  shopId: number
  title: string
  description: string
  price: number
  tags: string[]
  quantity?: number
}): Promise<{ listingId: number }> {
  const res = await fetch(`${ETSY_API}/shops/${params.shopId}/listings`, {
    method: 'POST',
    headers: {
      'x-api-key': getApiKey(),
      'Authorization': `Bearer ${params.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: params.title,
      description: params.description,
      price: { amount: Math.round(params.price * 100), divisor: 100, currency_code: 'EUR' },
      quantity: params.quantity ?? 999,
      tags: params.tags.slice(0, 13),
      who_made: 'i_did',
      when_made: 'made_to_order',
      taxonomy_id: 482, // Clothing > Shirts & Tees
      shipping_profile_id: 0, // Must be set by user
      type: 'physical',
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Etsy listing error: ${res.status} - ${err}`)
  }
  const data = await res.json()
  return { listingId: data.listing_id }
}

export async function uploadListingImage(params: {
  accessToken: string
  shopId: number
  listingId: number
  imageBlob: Blob
  fileName: string
}): Promise<void> {
  const formData = new FormData()
  formData.append('image', params.imageBlob, params.fileName)

  const res = await fetch(
    `${ETSY_API}/shops/${params.shopId}/listings/${params.listingId}/images`,
    {
      method: 'POST',
      headers: {
        'x-api-key': getApiKey(),
        'Authorization': `Bearer ${params.accessToken}`,
      },
      body: formData,
    }
  )
  if (!res.ok) throw new Error(`Etsy image upload error: ${res.status}`)
}
