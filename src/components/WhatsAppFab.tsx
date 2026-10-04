import { generalEnquiryUrl } from "@/lib/whatsapp";

export default function WhatsAppFab() {
  return (
    <a
      className="fab"
      href={generalEnquiryUrl("Hello MORSH Atelier, I have a question.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with MorsH on WhatsApp"
    >
      <span className="fab-dot" aria-hidden />
      Ask MorsH
    </a>
  );
}
