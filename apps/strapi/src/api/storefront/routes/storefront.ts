// One read for the whole storefront: the site asks Strapi once, not once per page.
export default {
  routes: [
    {
      method: 'GET',
      path: '/storefront-content',
      handler: 'storefront.find',
    },
  ],
};
