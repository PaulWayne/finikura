import type { Core, UID } from '@strapi/strapi';

// Everything the storefront displays, in one answer. The populate rules live here, next to the
// content types: the site sends no query parameters and gets each document in the same shape
// as its own REST route (published version only, same output filtering).

const TESTIMONIALS = { populate: { items: { populate: { photo: true } } } };
const HOME_BLOCKS = {
  on: {
    'blocks.hero': { populate: '*' },
    'blocks.category-cards': { populate: { cards: { populate: { image: true } } } },
    'blocks.product-section': { populate: '*' },
    'blocks.reassurance': { populate: '*' },
    'blocks.about-excerpt': { populate: '*' },
    'blocks.testimonials': TESTIMONIALS,
  },
};
const PAGE_BLOCKS = {
  on: {
    'blocks.rich-text': { populate: '*' },
    'blocks.image-text': { populate: '*' },
    'blocks.values': { populate: '*' },
    'blocks.faq': { populate: '*' },
    'blocks.cta': { populate: '*' },
    'blocks.testimonials': TESTIMONIALS,
  },
};

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const read = async (ctx: { state: { auth?: unknown } }, uid: UID.ContentType, populate: unknown, single = false) => {
    const documents = strapi.documents(uid);
    const params = { status: 'published', populate } as never;
    const found = single ? await documents.findFirst(params) : await documents.findMany(params);
    if (!found) return null;
    return strapi.contentAPI.sanitize.output(found, strapi.contentType(uid), { auth: ctx.state.auth as never });
  };

  return {
    async find(ctx: { state: { auth?: unknown }; body: unknown }) {
      const [global_setting, home_page, campaigns, category_banners, size_guides, pages] = await Promise.all([
        read(ctx, 'api::global-setting.global-setting', '*', true),
        read(ctx, 'api::home-page.home-page', { seo: true, blocks: HOME_BLOCKS }, true),
        read(ctx, 'api::campaign.campaign', '*'),
        read(ctx, 'api::category-banner.category-banner', { image: true }),
        read(ctx, 'api::size-guide.size-guide', '*'),
        read(ctx, 'api::page.page', { seo: true, blocks: PAGE_BLOCKS }),
      ]);
      ctx.body = {
        data: {
          global_setting,
          home_page,
          campaigns: campaigns ?? [],
          category_banners: category_banners ?? [],
          size_guides: size_guides ?? [],
          pages: pages ?? [],
        },
      };
    },
  };
};
