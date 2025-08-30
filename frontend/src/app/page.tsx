import Category from "@/utils/category";
import Hero from "@/utils/hero";
import TopBanner from "@/lib/topBanner";
import { getSettings, Settings } from "@/models/settings";
import ProductGrid from "@/utils/productGrid";
import FeatureGrid from "@/utils/featureGrid";

export default async function Page() {
  const settings: Settings = await getSettings();
  const allProducts = Array.isArray(settings.productList)
    ? settings.productList
    : [];
  const featuredProducts = allProducts
    .filter((p) => p.featured === 1)
    .slice(0, 12);
  const newProducts = allProducts.filter((p) => p.featured !== 1);

  return (
    <div>
      {/* Top banner */}
      {settings.showBanner === 1 && (
        <TopBanner
          {...settings}
          href={settings.url}
          messages={settings.bannerMessages}
        />
      )}

      <Hero
        heroData={settings.heroData}
        autoSlide={settings.autoSlideHero === 1}
      />

      <Category
        categoryData={settings.categoryData}
        cardSize={settings.cardSize}
        imageSize={settings.imageSize}
        imageBgColor={settings.imageBg}
        cardBgColor={settings.cardBg}
        textColor={settings.textColor}
      />

      {featuredProducts.length > 0 && (
        <FeatureGrid products={featuredProducts} currency={settings.currency} />
      )}

      {newProducts.length > 0 && (
        <ProductGrid products={newProducts} currency={settings.currency} />
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
