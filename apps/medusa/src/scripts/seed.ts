import fs from "node:fs"
import path from "node:path"
import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductTagsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  deleteApiKeysWorkflow,
  deleteSalesChannelsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  revokeApiKeysWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Fini Kura seed: Mali region (XOF), Bamako stock location, manual payment,
 * hidden 0 FCFA "Livraison à Bamako" option, and the catalog taken from the
 * storefront mock fixtures (same handles).
 *
 * Run: pnpm --filter medusa seed
 * Idempotent for setup entities: anything that already exists is reused.
 */

type FixtureVariant = {
  title: string
  sku: string
  inventory_quantity: number
  // Same shape as the Store API response (see storefront raw.ts).
  calculated_price: { calculated_amount: number; currency_code: string }
}
type FixtureProduct = {
  title: string
  handle: string
  subtitle?: string
  description?: string
  material?: string
  metadata?: { care_instructions?: string }
  thumbnail?: string
  images?: { url: string }[]
  categories?: { handle: string }[]
  collection?: { handle: string } | null
  tags?: { value: string }[]
  variants: FixtureVariant[]
}

const FIXTURES = path.resolve(process.cwd(), "../storefront/src/mocks/medusa")
const readFixture = <T>(file: string): T =>
  JSON.parse(fs.readFileSync(path.join(FIXTURES, file), "utf-8")) as T

const OCCASION_TAGS = ["tous-les-jours", "fete", "ceremonie"]
const AGE_OPTION = "Âge"

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const storeModule = container.resolve(Modules.STORE)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const regionModule = container.resolve(Modules.REGION)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const apiKeyModule = container.resolve(Modules.API_KEY)
  const productModule = container.resolve(Modules.PRODUCT)

  // --- Sales channel -------------------------------------------------------
  let [salesChannel] = await salesChannelModule.listSalesChannels({ name: "Site Fini Kura" })
  if (!salesChannel) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Site Fini Kura", description: "Boutique en ligne" }] },
    })
    salesChannel = result[0]
  }

  // --- Store: XOF only, default sales channel ------------------------------
  const [store] = await storeModule.listStores()
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Fini Kura",
        supported_currencies: [{ currency_code: "xof", is_default: true }],
        default_sales_channel_id: salesChannel.id,
      },
    },
  })

  // --- Region Mali, manual payment (paiement à la réception) ---------------
  let [region] = await regionModule.listRegions({ name: "Mali" })
  if (!region) {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Mali",
            currency_code: "xof",
            countries: ["ml"],
            payment_providers: ["pp_system_default"],
            automatic_taxes: false,
          },
        ],
      },
    })
    region = result[0]
  }
  logger.info(`Région Mali : ${region.id}`)

  // --- Stock location Bamako, linked to the sales channel and fulfillment --
  let [location] = await stockLocationModule.listStockLocations({ name: "Bamako" })
  if (!location) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [{ name: "Bamako", address: { city: "Bamako", country_code: "ML", address_1: "" } }],
      },
    })
    location = result[0]
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    })
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: location.id, add: [salesChannel.id] },
    })
  }

  // --- Shipping: hidden 0 FCFA "Livraison à Bamako" ------------------------
  let [shippingProfile] = await fulfillmentModule.listShippingProfiles({ type: "default" })
  if (!shippingProfile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Standard", type: "default" }] },
    })
    shippingProfile = result[0]
  }

  const existingOptions = await fulfillmentModule.listShippingOptions({ name: "Livraison à Bamako" })
  if (!existingOptions.length) {
    const fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
      name: "Livraison Bamako",
      type: "shipping",
      service_zones: [{ name: "Bamako", geo_zones: [{ country_code: "ml", type: "country" }] }],
    })
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    })
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: "Livraison à Bamako",
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: fulfillmentSet.service_zones[0].id,
          shipping_profile_id: shippingProfile.id,
          type: { label: "Livraison", description: "Montant confirmé sur WhatsApp", code: "bamako" },
          prices: [
            { currency_code: "xof", amount: 0 },
            { region_id: region.id, amount: 0 },
          ],
          rules: [
            { attribute: "enabled_in_store", value: "true", operator: "eq" },
            { attribute: "is_return", value: "false", operator: "eq" },
          ],
        },
      ],
    })
  }

  // --- Publishable API key for the storefront ------------------------------
  let [apiKey] = await apiKeyModule.listApiKeys({ title: "Site Fini Kura", type: "publishable" })
  if (!apiKey) {
    const { result } = await createApiKeysWorkflow(container).run({
      input: { api_keys: [{ title: "Site Fini Kura", type: "publishable", created_by: "seed" }] },
    })
    apiKey = result[0]
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: { id: apiKey.id, add: [salesChannel.id] },
    })
  }

  // --- Remove Medusa's default channel and key (FK-18): the site only uses "Site Fini Kura" ---
  const [defaultKey] = await apiKeyModule.listApiKeys({ title: "Default Publishable API Key", type: "publishable" })
  if (defaultKey) {
    if (!defaultKey.revoked_at) {
      await revokeApiKeysWorkflow(container).run({
        input: { selector: { id: defaultKey.id }, revoke: { revoked_by: "seed" } },
      })
    }
    await deleteApiKeysWorkflow(container).run({ input: { ids: [defaultKey.id] } })
    logger.info("Removed the Default Publishable API Key")
  }
  const [defaultChannel] = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" })
  const [currentStore] = await storeModule.listStores()
  if (defaultChannel && defaultChannel.id !== currentStore?.default_sales_channel_id) {
    await deleteSalesChannelsWorkflow(container).run({ input: { ids: [defaultChannel.id] } })
    logger.info("Removed the Default Sales Channel")
  }

  // --- Categories, collections, occasion tags ------------------------------
  const { product_categories: fixtureCategories } = readFixture<{
    product_categories: { name: string; handle: string; description?: string; metadata?: Record<string, unknown> }[]
  }>("categories.json")
  const existingCategories = await productModule.listProductCategories({
    handle: fixtureCategories.map((c) => c.handle),
  })
  const missingCategories = fixtureCategories.filter(
    (c) => !existingCategories.some((e) => e.handle === c.handle)
  )
  if (missingCategories.length) {
    await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missingCategories.map((c) => ({
          name: c.name,
          handle: c.handle,
          description: c.description,
          metadata: c.metadata,
          is_active: true,
        })),
      },
    })
  }
  const categories = await productModule.listProductCategories({
    handle: fixtureCategories.map((c) => c.handle),
  })

  const { collections: fixtureCollections } = readFixture<{
    collections: { title: string; handle: string }[]
  }>("collections.json")
  const existingCollections = await productModule.listProductCollections({
    handle: fixtureCollections.map((c) => c.handle),
  })
  const missingCollections = fixtureCollections.filter(
    (c) => !existingCollections.some((e) => e.handle === c.handle)
  )
  if (missingCollections.length) {
    await createCollectionsWorkflow(container).run({
      input: { collections: missingCollections.map((c) => ({ title: c.title, handle: c.handle })) },
    })
  }
  const collections = await productModule.listProductCollections({
    handle: fixtureCollections.map((c) => c.handle),
  })

  const existingTags = await productModule.listProductTags({ value: OCCASION_TAGS })
  const missingTags = OCCASION_TAGS.filter((v) => !existingTags.some((t) => t.value === v))
  if (missingTags.length) {
    await createProductTagsWorkflow(container).run({
      input: { product_tags: missingTags.map((value) => ({ value })) },
    })
  }
  const tags = await productModule.listProductTags({ value: OCCASION_TAGS })

  // --- Products -------------------------------------------------------------
  const { products: fixtureProducts } = readFixture<{ products: FixtureProduct[] }>("products.json")
  const existingProducts = await productModule.listProducts(
    { handle: fixtureProducts.map((p) => p.handle) },
    { select: ["handle"] }
  )
  const toCreate = fixtureProducts.filter(
    (p) => !existingProducts.some((e) => e.handle === p.handle)
  )

  if (toCreate.length) {
    await createProductsWorkflow(container).run({
      input: {
        products: toCreate.map((p) => ({
          title: p.title,
          handle: p.handle,
          subtitle: p.subtitle,
          description: p.description,
          material: p.material,
          thumbnail: p.thumbnail,
          images: (p.images ?? []).map((img) => ({ url: img.url })),
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          sales_channels: [{ id: salesChannel.id }],
          category_ids: categories
            .filter((c) => p.categories?.some((pc) => pc.handle === c.handle))
            .map((c) => c.id),
          collection_id: collections.find((c) => c.handle === p.collection?.handle)?.id,
          tag_ids: tags
            .filter((t) => p.tags?.some((pt) => pt.value === t.value))
            .map((t) => t.id),
          metadata: p.metadata,
          options: [{ title: AGE_OPTION, values: p.variants.map((v) => v.title) }],
          variants: p.variants.map((v) => ({
            title: v.title,
            sku: v.sku,
            manage_inventory: true,
            allow_backorder: false,
            options: { [AGE_OPTION]: v.title },
            prices: [
              {
                currency_code: v.calculated_price.currency_code,
                amount: v.calculated_price.calculated_amount,
              },
            ],
          })),
        })),
      },
    })

    // Stock levels at Bamako, from the fixture quantities.
    const skus = toCreate.flatMap((p) => p.variants.map((v) => v.sku))
    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id", "sku"],
      filters: { sku: skus },
    })
    const quantityBySku = new Map(
      toCreate.flatMap((p) => p.variants.map((v) => [v.sku, v.inventory_quantity] as const))
    )
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryItems.map((item) => ({
          inventory_item_id: item.id,
          location_id: location.id,
          stocked_quantity: quantityBySku.get(item.sku as string) ?? 0,
        })),
      },
    })
  }

  logger.info(`Produits créés : ${toCreate.length} (déjà présents : ${existingProducts.length})`)
  logger.info(`Clé publiable du site : ${apiKey.token}`)
}
