'use client';

// import { Sparkles, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useBadgeNfts } from '@/lib/data/use-badge-nfts';
import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';
import { eventBus } from '@/lib/state/eventBus';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { BadgeTitle } from './badge-title';
import { SwapImg } from './swap-img';

export function BadgeContent() {
  const { setCurrentComponent } = useSideDrawerStore();

  const { data: allNfts } = useBadgeNfts();
  const { data: userBadgeNfts } = useBadgeWalletNfts();

  const [selectedNftName, setSelectedNftName] = useState(allNfts?.[0]?.name);

  const selectedNft = useMemo(() => {
    return allNfts?.find((nft) => nft.name === selectedNftName);
  }, [allNfts, selectedNftName]);

  useEffect(() => {
    if (userBadgeNfts?.nftInfo) {
      setSelectedNftName(userBadgeNfts.nftInfo.name);
    } else {
      setSelectedNftName(allNfts?.[0]?.name);
    }
  }, [userBadgeNfts, allNfts]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe(
      'badge-gallery-drawer-select-nft',
      (nftName: string | undefined) => {
        setSelectedNftName(nftName);
      }
    );

    return () => unsubscribe();
  }, []);

  function handleClickImg(v: string) {
    setSelectedNftName(v);
    setCurrentComponent({
      name: 'BadgeNftBuy',
      props: {
        selectedNftName: v,
      },
    });
    eventBus.publish('badge-gallery-page-select-nft', v);
  }

  return (
    <div className="px-4 2xl:px-12">
      <BadgeTitle />

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="flex flex-1 flex-col">
          <SwapImg selectedName={selectedNftName} setSelectedName={handleClickImg} />

          <div className="mt-5 flex flex-col gap-3.5 flex-wrap">
            <div className="font-medium text-base leading-6">{selectedNft?.name}</div>
            {/* <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-2 text-sm leading-5">
              <div className="flex gap-2 items-center">
                <Sparkles className="w-4 h-4" />
                <span className="capitalize">legendary</span>
              </div>
              <div className="flex gap-2 items-center">
                <UsersRound className="w-4 h-4" />
                <span>8</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
