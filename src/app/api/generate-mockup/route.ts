import { generateMockup } from "@/lib/whisk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const image = await generateMockup(prompt);

  return NextResponse.json({ image });
}
