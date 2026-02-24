// Printful API client
// Docs: https://developers.printful.com/docs/
const PRINTFUL_API = 'https://api.printful.com'

function getHeaders(): HeadersInit {
  const token = import.meta.env.VITE_PRINTFUL_API_KEY ?? ''
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

export function isPrintfulConfigured(): boolean {
  return !!import.meta.env.VITE_PRINTFUL_API_KEY
}

export interface PrintfulProduct {
  id: number
  title: string
  image: string
  variants: number
}

export interface PrintfulVariant {
  id: number
  name: string
  size: string
  color: string
  price: string
  image: string
}

export async function getProducts(): Promise<PrintfulProduct[]> {
  const res = await fetch(`${PRINTFUL_API}/products`, { headers: getHeaders() })
  if (!res.ok) throw new Error(`Printful API error: ${res.status}`)
  const data = await res.json()
  return data.result.map((p: any) => ({
    id: p.id,
    title: p.title,
    image: p.image,
    variants: p.variants,
  }))
}

export async function getProductVariants(productId: number): Promise<PrintfulVariant[]> {
  const res = await fetch(`${PRINTFUL_API}/products/${productId}`, { headers: getHeaders() })
  if (!res.ok) throw new Error(`Printful API error: ${res.status}`)
  const data = await res.json()
  return data.result.variants.map((v: any) => ({
    id: v.id,
    name: v.name,
    size: v.size,
    color: v.color,
    price: v.price,
    image: v.image,
  }))
}

export async function createOrder(params: {
  variantId: number
  imageUrl: string
  recipientName: string
  address1: string
  city: string
  stateCode: string
  countryCode: string
  zip: string
}): Promise<any> {
  const res = await fetch(`${PRINTFUL_API}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      recipient: {
        name: params.recipientName,
        address1: params.address1,
        city: params.city,
        state_code: params.stateCode,
        country_code: params.countryCode,
        zip: params.zip,
      },
      items: [{
        variant_id: params.variantId,
        quantity: 1,
        files: [{ url: params.imageUrl }],
      }],
    }),
  })
  if (!res.ok) throw new Error(`Printful order error: ${res.status}`)
  return (await res.json()).result
}
