const API_KEY = process.env.GOOGLE_AI_API_KEY!;
const IMAGEN_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`;

export async function generateMockup(prompt: string) {
  const response = await fetch(IMAGEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
