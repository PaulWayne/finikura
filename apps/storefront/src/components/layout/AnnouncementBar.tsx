import React from "react";

interface AnnouncementBarProps {
  text: string;
}

export function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <aside
      className="w-full bg-brand-sage-soft border-b border-brand-sage-soft text-brand-text text-[11px] sm:text-xs font-medium tracking-[0.08em] sm:tracking-[0.15em] uppercase py-2.5 px-4 text-center select-none"
      data-purpose="announcement-bar"
    >
      {text}
    </aside>
  );
}
