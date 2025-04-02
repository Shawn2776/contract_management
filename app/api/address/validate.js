import { validateAddress } from "@/lib/usps";

export async function POST(req) {
  const body = await req.json();
  try {
    const validated = await validateAddress(body);
    return Response.json(validated);
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
