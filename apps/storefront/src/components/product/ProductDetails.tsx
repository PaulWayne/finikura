import type { ReactNode } from "react";
import { Bike, ChevronDown, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { messages } from "@/messages/fr";

/** Static part of the product column (server): reassurance, description and the Medusa fields. */
export function ProductDetails({ product }: { product: Product }) {
  return (
    <>
      <div className="bg-brand-surface/40 border border-brand-surface rounded-xl p-4 flex flex-col gap-3 mb-6">
        <Reassurance
          icon={<CreditCard className="w-4 h-4" />}
          title={messages.product.reassurancePayments}
          text={messages.product.reassurancePaymentsDesc}
        />
        <div className="w-full h-px bg-brand-surface/80" />
        <Reassurance
          icon={<Bike className="w-4 h-4" />}
          title={messages.product.reassuranceDelivery}
          text={messages.product.reassuranceDeliveryDesc}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xs uppercase tracking-[0.2em] text-brand-text font-semibold mb-2">
          {messages.product.spiritTitle}
        </h2>
        <p className="text-sm text-brand-text leading-relaxed font-light">{product.description}</p>
      </div>

      {/* Accordions: only the fields filled in Medusa */}
      {(product.material || product.careInstructions) && (
        <div className="flex flex-col rounded-xl overflow-hidden bg-brand-surface/30 border border-brand-surface divide-y divide-brand-surface">
          {product.material && (
            <Accordion icon={<Sparkles className="w-4 h-4 text-brand-primary" />} title={messages.product.materialAccordion} open>
              {product.material}
            </Accordion>
          )}
          {product.careInstructions && (
            <Accordion icon={<ShieldCheck className="w-4 h-4 text-brand-primary" />} title={messages.product.careAccordion}>
              {product.careInstructions}
            </Accordion>
          )}
        </div>
      )}
    </>
  );
}

function Reassurance({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-brand-bg border border-brand-surface flex items-center justify-center text-brand-primary shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-brand-text">{title}</span>
        <span className="text-[11px] text-brand-text font-light">{text}</span>
      </div>
    </div>
  );
}

function Accordion(props: { icon: ReactNode; title: string; open?: boolean; children: ReactNode }) {
  return (
    <details className="group p-4 open:bg-brand-surface/50 transition-colors" open={props.open}>
      <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs font-medium text-brand-text">
        <span className="flex items-center gap-2">
          {props.icon}
          {props.title}
        </span>
        <ChevronDown className="w-4 h-4 text-brand-primary transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <p className="pt-3 pr-2 text-xs text-brand-text leading-relaxed font-light">{props.children}</p>
    </details>
  );
}
