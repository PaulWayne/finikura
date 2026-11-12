import React, { useEffect, useState } from "react";
import { contentService } from "@/src/lib/content";
import { commerceService } from "@/src/lib/commerce";
import {
  GlobalSettings,
  HomePageData,
} from "@/src/lib/content/types";
import {
  Category,
  Product,
  CategoryHandle,
  Cart,
  Order,
} from "@/src/lib/commerce/types";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { FilterChips } from "@/components/catalog/FilterChips";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ReassuranceBlock } from "@/components/blocks/ReassuranceBlock";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductBuySection } from "@/components/product/ProductBuySection";
import { ProductRecommendations } from "@/components/product/ProductRecommendations";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { SizeGuidePageContent } from "@/components/size-guide/SizeGuidePageContent";
import { ContactPageContent } from "@/components/contact/ContactPageContent";
import { AboutPageContent } from "@/components/about/AboutPageContent";
import { ShippingReturnsPageContent } from "@/components/shipping/ShippingReturnsPageContent";
import { LegalPageContent } from "@/components/legal/LegalPageContent";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { messages } from "@/src/messages/fr";
import { CART_EVENTS } from "@/src/lib/cart-events";
import { Monitor, Smartphone, CheckCircle, Sparkles } from "lucide-react";

export default function App() {
  // Navigation & preview mode states
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [selectedAge, setSelectedAge] = useState<string>("");
  const [selectedOccasion, setSelectedOccasion] = useState<string>("");
  const [viewportMode, setViewportMode] = useState<"fluid" | "desktop" | "mobile">("fluid");

  // Data states
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [homeData, setHomeData] = useState<HomePageData | null>(null);
  const [collectionProducts, setCollectionProducts] = useState<Record<string, Product[]>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [currentProductSizeGuide, setCurrentProductSizeGuide] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [currentCart, setCurrentCart] = useState<Cart | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial store settings & home data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [settingsRes, homeRes, catsRes, newProds] = await Promise.all([
          contentService.getGlobalSettings(),
          contentService.getHomePage(),
          commerceService.getCategories(),
          commerceService.getCollectionProducts("nouveautes", 4),
        ]);

        setSettings(settingsRes);
        setHomeData(homeRes);
        setCategories(catsRes);
        setCollectionProducts({
          nouveautes: newProds,
        });
      } catch (err) {
        console.error("Error loading store data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Listen to toast events
  useEffect(() => {
    function handleToast(e: Event) {
      const customEvent = e as CustomEvent<string>;
      setToastMessage(customEvent.detail);
      setTimeout(() => {
        setToastMessage((prev) => (prev === customEvent.detail ? null : prev));
      }, 3200);
    }
    window.addEventListener(CART_EVENTS.TOAST, handleToast);
    return () => window.removeEventListener(CART_EVENTS.TOAST, handleToast);
  }, []);

  // Intercept local anchor clicks so the preview works seamlessly
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      // Handle in-page smooth scroll for anchors
      if (href.startsWith("#")) {
        e.preventDefault();
        const element = document.getElementById(href.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      // Handle internal routes
      if (href.startsWith("/")) {
        e.preventDefault();
        const [path, queryStr] = href.split("?");
        setCurrentPath(path);
        const queryParams = new URLSearchParams(queryStr || "");
        setSelectedAge(queryParams.get("age") || "");
        setSelectedOccasion(queryParams.get("occasion") || "");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  // Load category products when path or filters change
  useEffect(() => {
    if (currentPath.startsWith("/categorie/")) {
      const handle = currentPath.replace("/categorie/", "") as CategoryHandle;
      const cat = categories.find((c) => c.handle === handle) || null;
      setCurrentCategory(cat);

      commerceService
        .getProducts({
          categoryHandle: handle,
          age: selectedAge || undefined,
          occasion: selectedOccasion || undefined,
        })
        .then((prods) => {
          setCategoryProducts(prods);
        });
    }
  }, [currentPath, selectedAge, selectedOccasion, categories]);

  // Load product when path starts with /produit/
  useEffect(() => {
    if (currentPath.startsWith("/produit/")) {
      const handle = currentPath.replace("/produit/", "");
      commerceService.getProductByHandle(handle).then(async (prod) => {
        setCurrentProduct(prod);
        if (prod) {
          const [guide, siblings] = await Promise.all([
            contentService.getSizeGuide(prod.categoryHandle),
            commerceService.getProducts({
              categoryHandle: prod.categoryHandle,
            }),
          ]);
          setCurrentProductSizeGuide(guide);
          setRecommendations(
            siblings.filter((s) => s.id !== prod.id).slice(0, 3)
          );
        }
      });
    }
  }, [currentPath]);

  // Sync cart
  const refreshCart = () => {
    commerceService.getCart("cart_client_session").then((c) => setCurrentCart(c));
  };

  useEffect(() => {
    refreshCart();
    const handleCartMutated = () => refreshCart();
    window.addEventListener(CART_EVENTS.MUTATED, handleCartMutated);
    return () => window.removeEventListener(CART_EVENTS.MUTATED, handleCartMutated);
  }, []);

  useEffect(() => {
    if (currentPath === "/commande") {
      refreshCart();
    }
    if (currentPath.startsWith("/commande/confirmation")) {
      const orderId = currentPath
        .replace("/commande/confirmation/", "")
        .replace("/commande/confirmation", "");
      commerceService.getOrderById(orderId || "FK-2025-0842").then((ord) => {
        if (ord) setCurrentOrder(ord);
      });
    }
  }, [currentPath]);

  if (isLoading || !settings || !homeData) {
    return (
      <div className="min-h-screen bg-[#FDF7F2] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#8A7058] border-t-transparent animate-spin mb-4" />
        <span className="font-serif text-2xl font-normal text-[#5E5245] italic">
          <span className="text-[#C8807C]">Fini</span>{" "}
          <span className="text-[#304054]">Kura</span>
        </span>
        <span className="text-xs uppercase tracking-[0.2em] text-[#8A7058] mt-2">
          Chargement de l'atelier de Bamako...
        </span>
      </div>
    );
  }

  // Determine active view
  const isHome = currentPath === "/" || currentPath === "";
  const isCategory = currentPath.startsWith("/categorie/");
  const isProduct = currentPath.startsWith("/produit/");
  const isCheckout = currentPath === "/commande";
  const isConfirmation = currentPath.startsWith("/commande/confirmation");
  const isSizeGuide = currentPath === "/guide-des-tailles";
  const isContact = currentPath === "/contact" || currentPath === "/contact-faq";
  const isHistory = currentPath === "/notre-histoire";
  const isShippingReturns =
    currentPath === "/livraison-et-echanges" ||
    currentPath === "/livraison" ||
    currentPath === "/echanges";
  const isLegal =
    currentPath === "/mentions-legales" ||
    currentPath === "/mentions-legales-cgv" ||
    currentPath === "/cgv";

  return (
    <div className="min-h-screen bg-[#EADCCC]/40 flex flex-col items-center">
      {/* Top Device Simulator Bar for testing mobile 390px and desktop 1440px mockups */}
      <div className="w-full bg-[#5E5245] text-[#FDF7F2] py-2 px-4 shadow-sm z-50 sticky top-0 flex flex-wrap items-center justify-between text-xs border-b border-[#5E5245]/20">
        <div className="flex items-center space-x-2">
          <span className="font-serif font-medium text-sm">Fini Kura Storefront</span>
          <span className="hidden sm:inline text-white/50">•</span>
          <span className="hidden sm:inline text-white/80">Bamako, Mali (3 à 14 ans)</span>
        </div>

        {/* Viewport switcher */}
        <div className="flex items-center space-x-1.5 bg-[#4a4035] p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setViewportMode("fluid")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
              viewportMode === "fluid"
                ? "bg-[#FDF7F2] text-[#5E5245] shadow-xs"
                : "text-white/80 hover:text-white"
            }`}
          >
            Plein écran
          </button>
          <button
            type="button"
            onClick={() => setViewportMode("desktop")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition cursor-pointer ${
              viewportMode === "desktop"
                ? "bg-[#FDF7F2] text-[#5E5245] shadow-xs"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>Desktop (1440px)</span>
          </button>
          <button
            type="button"
            onClick={() => setViewportMode("mobile")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition cursor-pointer ${
              viewportMode === "mobile"
                ? "bg-[#FDF7F2] text-[#5E5245] shadow-xs"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>Mobile (390px)</span>
          </button>
        </div>

        {/* Quick Route Links */}
        <div className="hidden lg:flex items-center space-x-3 text-[11px]">
          <span className="text-white/60">Écrans :</span>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isHome ? "text-[#CA7154] font-semibold" : "text-white/90"
            }`}
          >
            Accueil
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/categorie/filles");
              setSelectedAge("");
              setSelectedOccasion("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              currentPath === "/categorie/filles"
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Filles 3-14 ans
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/categorie/garcons");
              setSelectedAge("");
              setSelectedOccasion("");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              currentPath === "/categorie/garcons"
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Garçons 3-14 ans
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/produit/robe-terracotta-brodee");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isProduct
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Fiche Produit
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/guide-des-tailles");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isSizeGuide
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Guide des tailles
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/notre-histoire");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isHistory
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Notre histoire
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/livraison-et-echanges");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isShippingReturns
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Livraison & Échanges
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/mentions-legales");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isLegal
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Mentions Légales & CGV
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/contact");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isContact
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Contact & FAQ
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/commande");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isCheckout
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Commande
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentPath("/commande/confirmation/FK-2025-0842");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`cursor-pointer underline-offset-4 hover:underline ${
              isConfirmation
                ? "text-[#CA7154] font-semibold"
                : "text-white/90"
            }`}
          >
            Confirmation
          </button>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("finikura:open-cart"));
            }}
            className="cursor-pointer px-2.5 py-0.5 rounded-full bg-[#CA7154] text-white hover:bg-[#b05d42] transition font-medium"
          >
            Voir Panier Tiroir
          </button>
        </div>
      </div>

      {/* Frame container matching chosen viewport */}
      <div
        className={`w-full bg-[#FDF7F2] text-[#5E5245] flex flex-col transition-all duration-300 min-h-screen ${
          viewportMode === "mobile"
            ? "max-w-[390px] my-6 rounded-3xl shadow-2xl border-8 border-[#304054] overflow-hidden"
            : viewportMode === "desktop"
            ? "max-w-[1440px] my-6 rounded-2xl shadow-2xl border border-[#ded2c2] overflow-hidden"
            : "w-full"
        }`}
      >
        {/* Global Announcement Bar */}
        <AnnouncementBar text={settings.announcementBar} />

        {/* Global Header */}
        <Header initialCartCount={2} />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6">
          {/* SCREEN 1: HOME PAGE */}
          {isHome && (
            <div className="space-y-10 md:space-y-16 py-4 md:py-8">
              {homeData.blocks.map((block) => (
                <div
                  key={String(block.id)}
                  id={block.type === "productSection" ? "nouveautes" : undefined}
                >
                  <BlockRenderer
                    block={block}
                    collectionProductsMap={collectionProducts}
                    reassuranceItems={settings.reassuranceItems}
                  />
                </div>
              ))}
            </div>
          )}

          {/* SCREEN 2 & 3: CATEGORY CATALOG (FILLES & GARÇONS) */}
          {isCategory && currentCategory && (
            <div className="py-4 md:py-8 space-y-6 md:space-y-8" data-purpose="category-view">
              {/* Breadcrumb */}
              <nav
                aria-label="Fil d'Ariane"
                className="flex items-center space-x-2 text-xs text-[#5E5245]/70"
              >
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath("/");
                  }}
                  className="hover:text-[#CA7154] transition-colors"
                >
                  {messages.catalog.homeBreadcrumb}
                </a>
                <span>/</span>
                <span className="text-[#5E5245] font-medium">
                  {currentCategory.name}
                </span>
              </nav>

              {/* Category Header */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h1 className="font-serif text-3xl md:text-[40px] uppercase font-normal text-[#5E5245] tracking-[0.08em] leading-tight">
                  {currentCategory.name}
                </h1>
                <p className="text-sm md:text-base text-[#5E5245]/80 font-light leading-relaxed">
                  {currentCategory.description}
                </p>
              </div>

              {/* Filter Chips */}
              <FilterChips
                categoryHandle={currentCategory.handle}
                selectedAge={selectedAge}
                selectedOccasion={selectedOccasion}
                onFilterChange={(age, occasion) => {
                  setSelectedAge(age || "");
                  setSelectedOccasion(occasion || "");
                }}
              />

              {/* Product Count Indicator */}
              <div className="text-center pb-2">
                <span className="text-[11px] md:text-xs font-medium uppercase tracking-[0.2em] text-[#5E5245]/80">
                  {messages.catalog.creationsCount(categoryProducts.length)}
                </span>
              </div>

              {/* Product Grid */}
              {categoryProducts.length === 0 ? (
                <div className="py-16 text-center rounded-2xl bg-[#EADCCC]/30 border border-[#EADCCC] p-8">
                  <p className="text-base text-[#5E5245] font-serif mb-3">
                    {messages.catalog.noProductsFound}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAge("");
                      setSelectedOccasion("");
                    }}
                    className="min-touch-btn inline-flex items-center justify-center px-5 py-2 rounded-[4px] border border-[#8A7058] text-[#8A7058] text-xs font-medium uppercase tracking-[0.15em] hover:bg-[#8A7058] hover:text-white transition cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-6">
                  {categoryProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      showCategoryBadge={false}
                    />
                  ))}
                </div>
              )}

              {/* Reassurance Strip */}
              <div className="pt-8 md:pt-14">
                <ReassuranceBlock items={settings.reassuranceItems} />
              </div>
            </div>
          )}

          {/* SCREEN 4: PRODUCT PAGE (/produit/[handle]) */}
          {isProduct && currentProduct && (
            <div className="py-4 md:py-8 space-y-8" data-purpose="product-view">
              {/* Breadcrumb */}
              <nav
                aria-label="Fil d'Ariane"
                className="flex items-center space-x-2 text-xs text-[#5E5245]/70 truncate"
              >
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath("/");
                  }}
                  className="hover:text-[#CA7154] transition-colors shrink-0"
                >
                  {messages.catalog.homeBreadcrumb}
                </a>
                <span className="shrink-0">/</span>
                <a
                  href={`/categorie/${currentProduct.categoryHandle}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPath(`/categorie/${currentProduct.categoryHandle}`);
                  }}
                  className="hover:text-[#CA7154] transition-colors shrink-0"
                >
                  {currentProduct.categoryHandle === "filles"
                    ? messages.header.navGirls
                    : messages.header.navBoys}
                </a>
                <span className="shrink-0">/</span>
                <span className="text-[#5E5245] font-medium truncate">
                  {currentProduct.title}
                </span>
              </nav>

              {/* Two-Column Product Layout: 7 cols Gallery, 5 cols Buy Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                <div className="lg:col-span-7">
                  <ProductGallery
                    images={currentProduct.images}
                    productTitle={currentProduct.title}
                  />
                </div>
                <div className="lg:col-span-5">
                  <ProductBuySection
                    product={currentProduct}
                    sizeGuide={currentProductSizeGuide}
                    whatsappUrl={settings.whatsappUrl}
                  />
                </div>
              </div>

              {/* Recommendations */}
              <ProductRecommendations
                products={recommendations}
                categoryHandle={currentProduct.categoryHandle}
              />
            </div>
          )}

          {/* SCREEN 5: CHECKOUT PAGE (/commande) */}
          {isCheckout && (
            <div className="py-2 md:py-4" data-purpose="checkout-view">
              <CheckoutForm
                cart={
                  currentCart || {
                    id: "cart_client_session",
                    items: [],
                    subtotal: 0,
                    total: 0,
                    currency: "XOF",
                  }
                }
                onOrderSuccess={(order) => {
                  setCurrentOrder(order);
                  setCurrentPath(`/commande/confirmation/${order.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </div>
          )}

          {/* SCREEN 6: ORDER CONFIRMATION PAGE (/commande/confirmation/[orderId]) */}
          {isConfirmation && (
            <div
              className="py-6 md:py-10 flex items-center justify-center"
              data-purpose="confirmation-view"
            >
              {currentOrder ? (
                <OrderConfirmation
                  order={currentOrder}
                  whatsappUrl={settings.whatsappUrl}
                />
              ) : (
                <div className="py-16 text-center">
                  <div className="w-10 h-10 border-2 border-[#8A7058] border-t-transparent animate-spin rounded-full mx-auto mb-3" />
                  <p className="text-xs text-[#5E5245] uppercase tracking-wider">
                    Chargement de la confirmation d'atelier...
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 7 & 8: SIZE GUIDE PAGE (/guide-des-tailles) */}
          {isSizeGuide && (
            <div className="py-2 md:py-4" data-purpose="size-guide-view">
              <SizeGuidePageContent whatsappUrl={settings.whatsappUrl} />
            </div>
          )}

          {/* SCREEN 10 & 11: ABOUT / NOTRE HISTOIRE PAGE (/notre-histoire) */}
          {isHistory && (
            <div className="py-2 md:py-4" data-purpose="history-view">
              <AboutPageContent />
            </div>
          )}

          {/* SCREEN: CONTACT & FAQ PAGE (/contact or /contact-faq) */}
          {isContact && (
            <div className="py-2 md:py-4" data-purpose="contact-view">
              <ContactPageContent whatsappUrl={settings.whatsappUrl} />
            </div>
          )}

          {/* SCREEN: LIVRAISON ET ÉCHANGES (/livraison-et-echanges) */}
          {isShippingReturns && (
            <div className="py-2 md:py-4" data-purpose="shipping-returns-view">
              <ShippingReturnsPageContent whatsappUrl={settings.whatsappUrl} />
            </div>
          )}

          {/* SCREEN: MENTIONS LÉGALES & CGV (/mentions-legales) */}
          {isLegal && (
            <div className="py-2 md:py-4" data-purpose="legal-view">
              <LegalPageContent whatsappUrl={settings.whatsappUrl} />
            </div>
          )}
        </main>

        {/* Global Footer */}
        <Footer
          footerLinks={settings.footerLinks}
          socialLinks={settings.socialLinks}
        />

        {/* Mobile Menu Drawer */}
        <MobileMenu whatsappUrl={settings.whatsappUrl} />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* Mobile Bottom Navigation Tab Bar (hidden on checkout for smooth ordering) */}
        {!isCheckout && (
          <MobileTabBar
            currentPath={currentPath}
            onNavigate={(path) => {
              setCurrentPath(path);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            cartCount={
              currentCart?.items.reduce((sum, item) => sum + item.quantity, 0) || 2
            }
          />
        )}

        {/* Floating Toast notification */}
        {toastMessage && (
          <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#5E5245] text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-medium tracking-wide animate-fade-in border border-[#8A7058]">
            <CheckCircle className="w-4 h-4 text-[#9EA593]" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
