function generateInvoiceNumber({ tenant }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  if (!tenant.isInvoiceSetup) {
    // DEMO mode
    return `DEMO-${String(tenant.invoiceCounter).padStart(4, "0")}`;
  }

  const format = tenant.invoiceFormat || "{prefix}-{counter}";
  const counter = String(tenant.invoiceCounter).padStart(4, "0");

  return format
    .replace("{prefix}", tenant.invoicePrefix || "INV")
    .replace("{year}", year)
    .replace("{month}", month)
    .replace("{counter}", counter);
}

export default generateInvoiceNumber;
