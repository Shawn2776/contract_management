export function getSubdomain(hostname) {
  if (!hostname.includes(".")) return null;
  const parts = hostname.split(".");
  if (parts.length < 3) return null; // skip www.domain.com or localhost
  return parts[0]; // return subdomain (e.g. "test" in test.rental.com)
}
