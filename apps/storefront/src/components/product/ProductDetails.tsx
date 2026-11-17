import type { ReactNode } from "react";
import { Bike, ChevronDown, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import type { Product } from "@/lib/commerce/types";
import { messages } from "@/messages/fr";

/** Static part of the product column (server): reassurance, description and the Medusa fields. */
export function ProductDetails({ product }: { product: Product }) {
  return (
    <>
      <div className="border-y border-brand-surface py-4 flex flex-col gap-3 mb-6">
        <Reassurance
          icon={<CreditCard className="w-5 h-5" />}
          title={messages.product.reassurancePayments}
          text={messages.product.reassurancePaymentsDesc}
        />
        <Reassurance
          icon={<Bike className="w-5 h-5" />}
          title={messages.product.reassuranceDelivery}
          text={messages.product.reassuranceDeliveryDesc}
        />
      </div>

      <div className="mb-6">
        <h2 className="font-serif text-base text-brand-text mb-2">
          {messages.product.spiritTitle}
        </h2>
        <p className="text-base text-brand-text leading-relaxed">{product.description}</p>
        {/* Facts validated by the client for the whole collection; the cotton line gives way to the Medusa material. */}
        <ul className="mt-3 space-y-1 text-sm text-brand-text list-disc pl-5 marker:text-brand-terracotta">
          {!product.material && <li>{messages.product.factCotton}</li>}
          <li>{messages.product.factDesigned}</li>
          <li>{messages.product.factSmallBatch}</li>
        </ul>
      </div>

      {/* Accordions: only the fields filled in Medusa */}
      {(product.material || product.careInstructions) && (
        <div className="flex flex-col border-y border-brand-surface divide-y divide-brand-surface">
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
    <div className="flex items-start gap-3">
      <span className="text-brand-primary shrink-0 mt-0.5">{icon}</span>
      <p className="text-sm text-brand-text leading-snug">
        <span className="font-medium block">{title}</span>
        {text}
      </p>
    </div>
  );
}

function Accordion(props: { icon: ReactNode; title: string; open?: boolean; children: ReactNode }) {
  return (
    <details className="group py-4" open={props.open}>
      <summary className="flex items-center justify-between cursor-pointer list-none select-none min-h-11 text-sm font-medium text-brand-text">
        <span className="flex items-center gap-2">
          {props.icon}
          {props.title}
        </span>
        <ChevronDown className="w-4 h-4 text-brand-primary transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <p className="pt-1 pr-2 text-sm text-brand-text leading-relaxed">{props.children}</p>
    </details>
  );
}
