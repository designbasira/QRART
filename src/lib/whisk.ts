// TODO: Move to Supabase Edge Function (server-side only API key)
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY ?? '';
const IMAGEN_URL = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict';

export async function generateMockup(prompt: string) {
  const response = await fetch(IMAGEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": API_KEY,
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Imagen API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.predictions[0].bytesBase64Encoded;
}
