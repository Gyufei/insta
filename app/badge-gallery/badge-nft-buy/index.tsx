import { useEffect, useState } from 'react';

import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { eventBus } from '@/lib/state/eventBus';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';

import { BadgeNftBuyContent } from './badge-nft-buy-content';

export function BadgeNftBuy() {
  const { currentComponent } = useSideDrawerStore();
  const { handleBack } = useUrlPathDrawerChange('/badge-gallery');

  const { selectedNftName } = currentComponent?.props || {};

  const [drawerSelectedNftName, setDrawerSelectedNftName] = useState(selectedNftName);

  function handleSelectNftName(name: string | undefined) {
    setDrawerSelectedNftName(name);
    eventBus.publish('badge-gallery-drawer-select-nft', name);
  }

  useEffect(() => {
    const unsubscribe = eventBus.subscribe(
      'badge-gallery-page-select-nft',
      (nftName: string | undefined) => {
        setDrawerSelectedNftName(nftName);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <SideDrawerBackHeader title="Buy Badge NFT" onClick={handleBack} />
      <SideDrawerLayout>
        <BadgeNftBuyContent
          nftName={drawerSelectedNftName as string}
          handleNftName={handleSelectNftName}
        />
      </SideDrawerLayout>
    </>
  );
}
