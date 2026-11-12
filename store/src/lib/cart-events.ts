"use client";
import { Cart } from "./commerce/types";

export const CART_EVENTS = {
  OPEN_CART: "fini-kura:open-cart",
  CLOSE_CART: "fini-kura:close-cart",
  OPEN_MENU: "fini-kura:open-menu",
  CLOSE_MENU: "fini-kura:close-menu",
  CART_UPDATED: "fini-kura:cart-updated",
  MUTATED: "fini-kura:cart-updated",
  TOAST: "fini-kura:toast",
};

export function triggerOpenCart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_EVENTS.OPEN_CART));
  }
}

export function triggerCloseCart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_EVENTS.CLOSE_CART));
  }
}

export function triggerOpenMenu() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_EVENTS.OPEN_MENU));
  }
}

export function triggerCloseMenu() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_EVENTS.CLOSE_MENU));
  }
}

export function triggerCartUpdated(cart: Cart) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_EVENTS.CART_UPDATED, { detail: cart }));
  }
}

export function triggerCartMutated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_EVENTS.CART_UPDATED));
  }
}

export function triggerToast(message: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_EVENTS.TOAST, { detail: message }));
  }
}

export const triggerCartToast = triggerToast;
