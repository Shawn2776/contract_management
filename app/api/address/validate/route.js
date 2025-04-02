import { validateAddress } from "@/lib/usps";

export async function POST(req) {
  const body = await req.json();

  try {
    const result = await validateAddress(body);
    return Response.json(result);
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }
}
