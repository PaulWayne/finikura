import { messages } from "@/messages/fr";

const h = messages.header;

/** Departments of the main menu: gender by age band, each one a filtered category page. */
export const DEPARTMENTS = [
  { href: "/categorie/filles?age=3-6", label: h.navLittleGirl, ages: h.navAges["3-6"] },
  { href: "/categorie/filles?age=7-14", label: h.navGirl, ages: h.navAges["7-14"] },
  { href: "/categorie/garcons?age=3-6", label: h.navLittleBoy, ages: h.navAges["3-6"] },
  { href: "/categorie/garcons?age=7-14", label: h.navBoy, ages: h.navAges["7-14"] },
] as const;
