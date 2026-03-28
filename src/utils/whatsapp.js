const DEFAULT_WHATSAPP_MESSAGE =
  "Hello KK Group, I visited your website and would like more information about your services.";

export function buildWhatsAppUrl(phoneNumber, message = DEFAULT_WHATSAPP_MESSAGE) {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");
  const params = new URLSearchParams();

  if (message) {
    params.set("text", message);
  }

  const query = params.toString();
  return `https://wa.me/${cleanNumber}${query ? `?${query}` : ""}`;
}

export { DEFAULT_WHATSAPP_MESSAGE };
