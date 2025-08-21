import HeadTop from "@/utils/headTop";
import { getSettings } from "@/models/settings";

export default async function Page() {
  const settings = await getSettings();

  return <HeadTop settings={settings} />;
}

export const revalidate = 60;
