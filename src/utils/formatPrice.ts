export type PriceInfo = {
  type?: string;
  amount?: number | string;
  currency?: string;
  unit?: string;
  label?: string | Record<string, string>;
};

const englishUnitMap: Record<string, string> = {
  service: "service",
  package: "package",
  plate: "plate",
  hour: "hour",
  event: "event",
};

<<<<<<< HEAD
/* Amounts come from the content, so one can arrive as text ("25,000") or
   be missing altogether. Anything that is not a real number returns null
   and the caller prints nothing rather than "₹NaN". */
function toNumber(amount: number | string | undefined): number | null {
  if (typeof amount === "number") return Number.isFinite(amount) ? amount : null;
  if (typeof amount !== "string") return null;
  const parsed = Number(amount.replace(/[,\s₹]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount);
=======
function formatAmount(amount: number | string): string {
  const numericAmount = Number(amount ?? 0);
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(numericAmount);
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
}

function getText(value: string | Record<string, string> | undefined, language: "en" | "ta" = "en"): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] || value.en || Object.values(value)[0] || "";
}

export function formatPrice(pricing?: PriceInfo, language: "en" | "ta" = "en"): string {
  if (!pricing) return "";

  const label = getText(pricing.label, language);
  if (label) return label;

  const type = (pricing.type ?? "fixed").toLowerCase();
<<<<<<< HEAD
  const amount = toNumber(pricing.amount);
  const currency = (pricing.currency ?? "INR").toUpperCase();
  const symbol = currency === "INR" ? "₹" : currency;
  if (type === "custom") return language === "ta" ? "தனிப்பயன் ஒப்பந்தம்" : "Custom quote";
  if (amount === null) return "";
=======
  const amount = Number(pricing.amount ?? 0);
  const currency = (pricing.currency ?? "INR").toUpperCase();
  const symbol = currency === "INR" ? "₹" : currency;
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
  const amountText = formatAmount(amount);
  const unit = (pricing.unit ?? "service").toLowerCase();
  const unitLabel = language === "ta" ? (unit === "plate" ? "தட்டு" : unit === "service" ? "சேவை" : unit === "package" ? "பேக்" : unit === "hour" ? "மணி" : unit === "event" ? "நிகழ்வு" : englishUnitMap[unit] ?? unit) : englishUnitMap[unit] ?? unit;

  if (type === "starting") {
    const prefix = language === "ta" ? "முதல் " : "Starting ";
    if (unit === "plate") return `${prefix}${symbol}${amountText}/${unitLabel}`;
    if (unit === "service" || unit === "package") return `${prefix}${symbol}${amountText}`;
    return `${prefix}${symbol}${amountText}/${unitLabel}`;
  }

  /* Any "per_X" type (per_plate, per_hour, per_event) reads the same way. */
  if (type.startsWith("per_")) return `${symbol}${amountText}/${unitLabel}`;
  if (type === "fixed") return `${symbol}${amountText}`;
<<<<<<< HEAD
=======
  if (type === "custom") return language === "ta" ? "தனிப்பயன் ஒப்பந்தம்" : "Custom quote";
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2

  return `${symbol}${amountText}`;
}
