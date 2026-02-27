function WhatsAppButton({ phoneNumber }) {
  const cleanNumber = phoneNumber.replace(/[^\d]/g, "");

  return (
    <a
      className="floating-btn whatsapp"
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      WhatsApp
    </a>
  );
}

export default WhatsAppButton;
