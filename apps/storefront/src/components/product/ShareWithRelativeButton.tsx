import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { messages } from "@/messages/fr";

/** Opens WhatsApp with no recipient: the customer picks who to ask (FK-31). */
export function ShareWithRelativeButton({ text }: { text: string }) {
  return (
    <a
      href={`https://wa.me/?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="min-h-11 w-full mb-6 py-3 px-6 rounded-lg border border-brand-text text-brand-text text-xs font-medium uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 hover:bg-brand-surface transition-colors"
    >
      <WhatsAppIcon className="w-4 h-4" />
      <span>{messages.product.askRelativeCta}</span>
    </a>
  );
}
