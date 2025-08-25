import HeadTop from "@/utils/headTop";
import CategoryDemo from "@/utils/category";
import Hero from "@/utils/hero";
import TopBanner from "@/lib/topBanner";
import { getSettings, Settings } from "@/models/settings";

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

      <CategoryDemo />
    </div>
  );
}

export const dynamic = "force-dynamic";
