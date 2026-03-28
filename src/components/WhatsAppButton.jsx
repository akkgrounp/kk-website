import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "../utils/whatsapp";

function WhatsAppButton({
  phoneNumber,
  message = DEFAULT_WHATSAPP_MESSAGE,
}) {
  const href = buildWhatsAppUrl(phoneNumber, message);

  return (
    <a
      className="floating-btn whatsapp"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      WhatsApp
    </a>
  );
}

export default WhatsAppButton;
