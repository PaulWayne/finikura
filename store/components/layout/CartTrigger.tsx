"use client";
import React, { useEffect, useState } from "react";
import { triggerOpenCart, CART_EVENTS } from "@/src/lib/cart-events";
import { messages } from "@/src/messages/fr";
import { Cart } from "@/src/lib/commerce/types";

interface CartTriggerProps {
  initialCount?: number;
}

export function CartTrigger({ initialCount = 2 }: CartTriggerProps) {
  const [itemCount, setItemCount] = useState(initialCount);

  useEffect(() => {
    function handleCartUpdate(e: Event) {
      const customEvent = e as CustomEvent<Cart>;
      if (customEvent.detail && Array.isArray(customEvent.detail.items)) {
        const count = customEvent.detail.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        setItemCount(count);
      }
    }

    window.addEventListener(CART_EVENTS.CART_UPDATED, handleCartUpdate);
    return () => {
      window.removeEventListener(CART_EVENTS.CART_UPDATED, handleCartUpdate);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={messages.header.cartAria}
      onClick={triggerOpenCart}
      className="relative p-2.5 text-[#5E5245] hover:text-[#CA7154] transition focus:outline-none min-touch-btn flex items-center justify-center cursor-pointer"
    >
      <svg
        className="w-6 h-6 stroke-[1.5]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {itemCount > 0 && (
        <span className="absolute top-1 right-0.5 w-4 h-4 bg-[#8A7058] text-[#FDF7F2] text-[10px] font-semibold flex items-center justify-center rounded-full leading-none shadow-xs">
          {itemCount}
        </span>
      )}
    </button>
  );
}
