import { execFileSync } from "node:child_process";
import { expect, test } from "@playwright/test";
import { CUSTOMER, orderFromProductPage } from "../flows";

// Live mode (FK-35): same journey against the seeded Medusa and Strapi, then the order is checked
// in the Medusa database of the throwaway container started by scripts/e2e-live.mjs.
const container = process.env.E2E_PG_CONTAINER;
const sql = (query: string) =>
  execFileSync("docker", ["exec", container!, "psql", "-U", "test", "-d", "medusa", "-tAF", "|", "-c", query], {
    encoding: "utf-8",
  }).trim();

const HANDLE = "robe-terracotta-brodee";
const reserved = (size: string) =>
  Number(
    sql(`select coalesce(sum(il.reserved_quantity), 0) from product p
      join product_variant v on v.product_id = p.id and v.deleted_at is null
      join product_variant_inventory_item pvi on pvi.variant_id = v.id and pvi.deleted_at is null
      join inventory_level il on il.inventory_item_id = pvi.inventory_item_id and il.deleted_at is null
      where p.handle = '${HANDLE}' and v.title = '${size}'`)
  );

test("commande en mode live, enregistrée dans Medusa", async ({ page }) => {
  test.skip(!container, "Lancer avec pnpm test:e2e:live");

  // The size picked is the second available one: read its reservation before ordering.
  await page.goto(`/produit/${HANDLE}`);
  const size = ((await page.getByRole("radio", { disabled: false }).nth(1).textContent()) ?? "").trim();
  const before = reserved(size);

  await orderFromProductPage(page, HANDLE, "Robe Terracotta Brodée");

  const row = sql(`select a.first_name, a.phone, a.address_1, a.address_2, a.city, a.country_code, o.currency_code,
      coalesce(o.email, ''), li.variant_title, li.unit_price
    from "order" o
    join order_address a on a.id = o.shipping_address_id
    join order_item oi on oi.order_id = o.id
    join order_line_item li on li.id = oi.item_id
    order by o.created_at desc limit 1`);
  const [firstName, phone, address1, address2, city, country, currency, email, variant, unitPrice] = row.split("|");

  expect(firstName).toBe(CUSTOMER.fullName);
  expect(phone).toBe("+22376123456");
  expect(address1).toBe(CUSTOMER.neighborhood);
  expect(address2).toBe(CUSTOMER.landmarks);
  expect(city).toBe("Bamako");
  expect(country).toBe("ml");
  expect(currency).toBe("xof");
  expect(email).toBe(""); // no e-mail, neither asked nor made up
  expect(variant).toBe(size);
  expect(Number(unitPrice)).toBe(12500);
  expect(reserved(size)).toBe(before + 1);
});
