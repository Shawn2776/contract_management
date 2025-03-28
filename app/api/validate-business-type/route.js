export async function POST(req) {
  const { businessType } = await req.json();

  const validTypes = [
    "sole-proprietorship",
    "partnership",
    "llc",
    "corporation",
    "unincorporated",
    "individual",
  ];

  if (!validTypes.includes(businessType)) {
    return new Response(
      JSON.stringify(
        {
          message: "Invalid business type.",
        },
        { status: 400 }
      )
    );
  }

  return new Response(JSON.stringify({ success: true }));
}
