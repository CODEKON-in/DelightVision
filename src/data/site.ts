
import companyData from "../../content/company.json";
import { getLocalizedText } from "../content";

const addressParts = (companyData.address ?? "").split(",").map((part) => part.trim());

export const business = {
  name: getLocalizedText(companyData.name, "en"),
  tagline: getLocalizedText(companyData.tagline, "en"),
  phoneDisplay: companyData.phone,
  phoneDial: companyData.phoneDial,
  whatsappNumber: companyData.whatsapp,
  whatsappMessage: "Hello Delight Vision! I found your website and I would like to know more about your wedding services.",
  addressLine1: addressParts[0] ?? "",
  addressLine2: addressParts.slice(1).join(", ") || "",
  hours: companyData.hours,
  mapQuery: companyData.mapQuery,
};

export const telHref = `tel:${business.phoneDial}`;

export const whatsappHrefFor = (message: string) =>
  `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  business.mapQuery
)}&output=embed`;

export const mapLinkHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  business.mapQuery
)}`;
