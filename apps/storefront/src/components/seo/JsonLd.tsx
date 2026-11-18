/**
 * A schema.org description in the HTML sent by the server. The script is data, never run by
 * the browser; « < » is escaped so a text typed in an admin cannot close the tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
