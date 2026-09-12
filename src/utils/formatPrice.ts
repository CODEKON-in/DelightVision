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

export function formatAmount(amount: number | string): string {
  const numericAmount = Number(amount ?? 0);
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(numericAmount);
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
  const amount = Number(pricing.amount ?? 0);
  const currency = (pricing.currency ?? "INR").toUpperCase();
  const symbol = currency === "INR" ? "₹" : currency;
  const amountText = formatAmount(amount);
  const unit = (pricing.unit ?? "service").toLowerCase();
  const unitLabel = language === "ta" ? (unit === "plate" ? "தட்டு" : unit === "service" ? "சேவை" : unit === "package" ? "பேக்" : unit === "hour" ? "மணி" : unit === "event" ? "நிகழ்வு" : englishUnitMap[unit] ?? unit) : englishUnitMap[unit] ?? unit;

  if (type === "starting") {
    const prefix = language === "ta" ? "முதல் " : "Starting ";
    if (unit === "plate") return `${prefix}${symbol}${amountText}/${unitLabel}`;
    if (unit === "service" || unit === "package") return `${prefix}${symbol}${amountText}`;
    return `${prefix}${symbol}${amountText}/${unitLabel}`;
  }

  /* Any "per_X" type (per_plate, per_hour, per_event, per_unit for an
     arbitrary material unit like "sq ft" or "kg") reads the same way. */
  if (type.startsWith("per_")) return `${symbol}${amountText}/${unitLabel}`;
  if (type === "fixed") return `${symbol}${amountText}`;
  if (type === "custom") return language === "ta" ? "தனிப்பயன் ஒப்பந்தம்" : "Custom quote";

  return `${symbol}${amountText}`;
}

/* Just the number — no "/sq ft", no "Starting", no unit at all. Used where
   a listing row wants a clean price and the full "per X" detail belongs
   somewhere else (a detail popup). Falls back to the same label/custom
   handling as formatPrice, since those aren't unit-based amounts anyway. */
export function formatPriceAmount(pricing?: PriceInfo, language: "en" | "ta" = "en"): string {
  if (!pricing) return "";

  const label = getText(pricing.label, language);
  if (label) return label;

  const type = (pricing.type ?? "fixed").toLowerCase();
  if (type === "custom") return language === "ta" ? "தனிப்பயன் ஒப்பந்தம்" : "Custom quote";

  const amount = Number(pricing.amount ?? 0);
  const currency = (pricing.currency ?? "INR").toUpperCase();
  const symbol = currency === "INR" ? "₹" : currency;
  return `${symbol}${formatAmount(amount)}`;
}
