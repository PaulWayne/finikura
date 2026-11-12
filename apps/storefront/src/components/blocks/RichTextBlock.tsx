import React from "react";
import Markdown from "react-markdown";
import { RichTextBlockData } from "@/lib/content/types";

// Server Component: the Markdown from Strapi is rendered on the server, no JS shipped.
export function RichTextBlock({ block }: { block: RichTextBlockData }) {
  return (
    <section className="max-w-[720px] mx-auto px-5" data-purpose="rich-text-block">
      {block.title && (
        <h2 className="font-serif text-2xl md:text-3xl text-brand-text mb-5">{block.title}</h2>
      )}
      <div className="text-base leading-relaxed text-brand-text space-y-4 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:mt-6 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_strong]:font-semibold [&_a]:underline [&_a]:underline-offset-2">
        <Markdown>{block.body}</Markdown>
      </div>
    </section>
  );
}
