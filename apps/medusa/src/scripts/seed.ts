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
  updateProductCategoriesWorkflow,
  updateProductsWorkflow,
  updateStoresWorkflow,
  uploadFilesWorkflow,
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
// Mock images referenced by the fixtures as /mock-media/… (copies of the mock-up photos).
const MOCK_PUBLIC = path.resolve(process.cwd(), "../storefront/public")

/** Placeholder images that the seed moves to the file storage: mock files, or the old mock-up host. */
const isPlaceholder = (url?: string | null) => !!url && (url.startsWith("/mock-media/") || url.includes("googleusercontent.com"))
const readFixture = <T>(file: string): T =>
  JSON.parse(fs.readFileSync(path.join(FIXTURES, file), "utf-8")) as T

const OCCASION_TAGS = ["tous-les-jours", "fete", "ceremonie"]
const AGE_OPTION = "Âge"

export default async function seed({ container }: ExecArgs) {
  // Uploads a /mock-media/… fixture image to the File module (Garage in dev and production) once,
  // and returns its public URL. Other URLs (real photos already in storage) are kept as they are.
  const uploaded = new Map<string, string>()
  const toStorage = async (url?: string | null): Promise<string | undefined> => {
    if (!url) return undefined
    if (!url.startsWith("/mock-media/")) return url
    const cached = uploaded.get(url)
    if (cached) return cached
    const file = path.join(MOCK_PUBLIC, url)
    const { result } = await uploadFilesWorkflow(container).run({
      input: {
        files: [
          {
            filename: path.basename(file),
            mimeType: file.endsWith(".png") ? "image/png" : file.endsWith(".webp") ? "image/webp" : "image/jpeg",
            content: fs.readFileSync(file).toString("base64"),
            access: "public",
          },
        ],
      },
    })
    uploaded.set(url, result[0].url)
    return result[0].url
  }
  const categoryMetadata = async (metadata?: Record<string, unknown>) =>
    metadata && typeof metadata.image === "string"
      ? { ...metadata, image: await toStorage(metadata.image) }
      : metadata

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
        product_categories: await Promise.all(missingCategories.map(async (c) => ({
          name: c.name,
          handle: c.handle,
          description: c.description,
          metadata: await categoryMetadata(c.metadata),
          is_active: true,
        }))),
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
        products: await Promise.all(toCreate.map(async (p) => ({
          title: p.title,
          handle: p.handle,
          subtitle: p.subtitle,
          description: p.description,
          material: p.material,
          thumbnail: await toStorage(p.thumbnail),
          images: await Promise.all((p.images ?? []).map(async (img) => ({ url: (await toStorage(img.url))! }))),
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
        }))),
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

  // Existing products and categories still showing placeholder images (mock files or the old
  // mock-up host): move them to the file storage. Real photos added in the admin are never touched.
  const fixtureByHandle = new Map(fixtureProducts.map((p) => [p.handle, p]))
  const placed = await productModule.listProducts(
    { handle: fixtureProducts.map((p) => p.handle) },
    { select: ["id", "handle", "thumbnail"], relations: ["images"] }
  )
  let moved = 0
  for (const product of placed) {
    const fixture = fixtureByHandle.get(product.handle)
    const urls = [product.thumbnail, ...(product.images ?? []).map((i) => i.url)]
    if (!fixture || !urls.some(isPlaceholder) || !urls.every((u) => !u || isPlaceholder(u))) continue
    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: product.id },
        update: {
          thumbnail: await toStorage(fixture.thumbnail),
          images: await Promise.all((fixture.images ?? []).map(async (img) => ({ url: (await toStorage(img.url))! }))),
        },
      },
    })
    moved++
  }
  const placedCategories = await productModule.listProductCategories(
    { handle: fixtureCategories.map((c) => c.handle) },
    { select: ["id", "handle", "metadata"] }
  )
  for (const category of placedCategories) {
    const fixture = fixtureCategories.find((c) => c.handle === category.handle)
    if (!fixture || !isPlaceholder(category.metadata?.image as string | undefined)) continue
    await updateProductCategoriesWorkflow(container).run({
      input: { selector: { id: category.id }, update: { metadata: await categoryMetadata(fixture.metadata) } },
    })
    moved++
  }

  logger.info(`Produits créés : ${toCreate.length} (déjà présents : ${existingProducts.length})`)
  if (moved) logger.info(`Images déplacées vers le stockage : ${moved} produits ou catégories`)
  logger.info(`Clé publiable du site : ${apiKey.token}`)
}
