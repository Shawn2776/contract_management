import { cn } from "@/lib/utils"; // or your classNames utility

const PAYMENT_OPTIONS = [
  { label: "CASH", value: "CASH" },
  { label: "CHECK", value: "CHECK" },
  { label: "CHARGE", value: "CHARGE" },
  { label: "C.O.D.", value: "COD" },
  { label: "ON ACCT.", value: "ON_ACCOUNT" },
  { label: "PAID OUT", value: "PAID_OUT" },
  { label: "MDSE RETD", value: "RETURNED" },
  { label: "SOLD BY", value: null }, // just visual
];

export default function PaymentTypeGrid({ selected }) {
  return (
    <div className="grid grid-cols-8 text-center text-xs border border-t-0">
      {PAYMENT_OPTIONS.map(({ label, value }, i) => (
        <div
          key={i}
          className={cn(
            "border p-2 flex items-center justify-center text-center min-h-[48px]",
            selected === value ? "bg-primary text-white font-bold" : ""
          )}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
