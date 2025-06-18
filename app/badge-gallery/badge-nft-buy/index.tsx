import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { BadgeNftBuyContent } from './badge-nft-buy-content';

export function BadgeNftBuy() {
  const { setIsOpen } = useSideDrawerStore();

  return (
    <>
      <SideDrawerBackHeader title="Buy Badge NFT" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <BadgeNftBuyContent />
      </SideDrawerLayout>
    </>
  );
}
