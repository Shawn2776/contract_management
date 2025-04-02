// lib/usps.js
let cachedToken = null;
let tokenExpiresAt = null;

export async function getUspsToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const res = await fetch("https://api.usps.com/oauth2/v3/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.USPS_CLIENT_ID}:${process.env.USPS_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "addresses",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error_description || "Failed to get USPS token");
  }

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000; // cache slightly less than actual expiration

  return cachedToken;
}

export async function lookupCityState(zip) {
  const token = await getUspsToken();

  const res = await fetch(
    `https://apis.usps.com/addresses/v3/city-state?ZIPCode=${zip}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Failed to fetch city/state");
  }

  return {
    city: data.city,
    state: data.state,
    zip: data.ZIPCode,
  };
}
