'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import WithWalletConnectBtn from '../common/with-wallet-connect-btn';
import HoverIcon from './hover-icon';

export function C2CHeader() {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith(`/c2c/dashboard`);
  const isMarketPlace = pathname.startsWith(`/c2c/markets`);

  const router = useRouter();

  function handleClick(href: string) {
    router.push(href);
  }

  return (
    <div className="px-4 md:px-12 flex items-center gap-4">
      <WithWalletConnectBtn onClick={() => handleClick(`/dashboard`)}>
        <div
          data-active={isDashboard}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D3D4D6] data-[active=true]:w-fit data-[active=false]:cursor-pointer data-[active=true]:border-none data-[active=true]:bg-pro-blue data-[active=true]:px-6 data-[active=false]:hover:border-transparent data-[active=false]:hover:bg-pro-blue"
        >
          <HoverIcon
            src={isDashboard ? '/icons/dashboard-white.svg' : '/icons/dashboard.svg'}
            hoverSrc="/icons/dashboard-white.svg"
            width={24}
            height={24}
            alt="dashboard"
            data-active={isDashboard}
            className="data-[active=true]:mr-1"
          />
          {isDashboard && <div className="text-white">Dashboard</div>}
        </div>
      </WithWalletConnectBtn>
      <div className="relative flex items-center">
        <div
          onClick={() => handleClick(`/markets`)}
          data-active={isMarketPlace}
          className="z-20 flex h-12 w-12 items-center justify-center rounded-full border border-[#D3D4D6] data-[active=true]:w-fit data-[active=false]:cursor-pointer data-[active=true]:border-theme data-[active=true]:bg-pro-blue data-[active=true]:px-6 data-[active=false]:hover:border-transparent data-[active=false]:hover:bg-pro-blue"
        >
          <HoverIcon
            src={isMarketPlace ? '/icons/Marketplace-white.svg' : '/icons/Marketplace.svg'}
            hoverSrc="/icons/Marketplace-white.svg"
            width={24}
            height={24}
            alt="marketplace"
            data-active={isMarketPlace}
            className="cursor-pointer data-[active=true]:mr-1"
          />
          {isMarketPlace && <div className="text-white">Marketplace</div>}
        </div>
      </div>
    </div>
  );
}
