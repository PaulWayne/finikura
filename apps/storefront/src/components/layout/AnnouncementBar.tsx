import React from "react";

interface AnnouncementBarProps {
  text: string;
}

export function AnnouncementBar({ text }: AnnouncementBarProps) {
  return (
    <aside
      className="w-full bg-brand-primary text-brand-bg text-xs font-medium tracking-[0.15em] uppercase py-2.5 px-4 text-center select-none"
      data-purpose="announcement-bar"
    >
      {text}
    </aside>
  );
}
