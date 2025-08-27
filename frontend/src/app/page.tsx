import HeadTop from "@/utils/headTop";
import Category from "@/utils/category";
import Hero from "@/utils/hero";
import TopBanner from "@/lib/topBanner";
import { getSettings, Settings } from "@/models/settings";
import ProductGrid from "@/utils/productGrid";

export default async function Page() {
  const settings: Settings = await getSettings();

  return (
    <div>
      {/* Top banner */}
      {settings.showBanner === 1 && (
        <TopBanner href={settings.url} messages={settings.bannerMessages} />
      )}

      <HeadTop settings={settings} />

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

      <ProductGrid
        products={settings.productList}
        currency={settings.currency}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";
