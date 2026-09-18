
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
  /* A non-breaking space between a time and its AM/PM, so a narrow screen
     wraps between the two times rather than leaving "PM" alone on a line. */
  hours: (companyData.hours ?? "").replace(/(\d) (am|pm)\b/gi, "$1\u00a0$2"),
  mapQuery: companyData.mapQuery,
};

export const telHref = `tel:${business.phoneDial}`;

/* The same WhatsApp mechanism as everywhere else on the site, with the thing
   the visitor was looking at written into the message — so the enquiry
   arrives already saying which decoration it is about. */
export const enquiryMessageFor = (subject: string) =>
  `Hello Delight Vision! I saw ${subject} on your website and I would like to enquire about it.`;

export const whatsappHrefFor = (message: string) =>
  `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  business.mapQuery
)}&output=embed`;

export const mapLinkHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  business.mapQuery
)}`;
