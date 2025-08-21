import Image from 'next/image';

export const Logo = () => (
  <div className="h-[36px] w-[120px] relative">
    <Image
      alt="wow-logo"
      fill
      sizes="120px"
      className="object-contain"
      src="/images/logo.png"
      priority={true}
    />
  </div>
);

export const LogoSidebar = () => (
  <div className="w-[100px] h-[48px] relative">
    <Image
      alt="wow-logo"
      fill
      sizes="100px"
      className="object-contain"
      src="/images/logo.png"
      priority={false}
    />
  </div>
);

export const LogoMobile = () => (
  <div className="h-[68px] w-[142px] relative">
    <Image
      alt="wow-logo"
      fill
      sizes="142px"
      className="object-contain"
      src="/images/logo.png"
      priority={false}
    />
  </div>
);