import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { isValidInjectionZone } from "@medusajs/admin-shared"

// Upgrade guard: after a Medusa upgrade, every admin widget must still point to a zone
// that exists. A zone renamed or removed by Medusa would hide the widget without any error.
const WIDGETS_DIR = path.join(__dirname, "..", "widgets")

const widgets = readdirSync(WIDGETS_DIR)
  .filter((f) => f.endsWith(".tsx"))
  .map((file) => {
    const source = readFileSync(path.join(WIDGETS_DIR, file), "utf8")
    const zones = [...source.matchAll(/zone:\s*\[?\s*((?:"[^"]+"\s*,?\s*)+)\]?/g)].flatMap((m) =>
      [...m[1].matchAll(/"([^"]+)"/g)].map((z) => z[1])
    )
    return { file, zones }
  })

describe("admin widgets survive a Medusa upgrade", () => {
  it("finds the Fini Kura widgets", () => {
    expect(widgets.map((w) => w.file)).toEqual(
      expect.arrayContaining(["fini-kura-status.tsx", "fini-kura-recent-orders.tsx"])
    )
  })

  it.each(widgets)("$file uses zones that exist in this Medusa version", ({ zones }) => {
    expect(zones.length).toBeGreaterThan(0)
    for (const zone of zones) expect(isValidInjectionZone(zone)).toBe(true)
  })
})
