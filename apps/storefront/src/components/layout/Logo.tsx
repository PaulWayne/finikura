// The Fini Kura wordmark. The only place where the logo colours (rose and navy)
// may be used: the charter keeps them out of the rest of the interface.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif font-bold italic ${className}`}>
      <span className="text-brand-rose">Fini</span>{" "}
      <span className="text-brand-navy">Kura</span>
    </span>
  );
}
