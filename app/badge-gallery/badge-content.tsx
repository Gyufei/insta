'use client';

import { Sparkles, UsersRound } from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import { useBadgeWalletNfts } from '@/lib/data/use-badge-account-nfts';
import { useBadgeNfts } from '@/lib/data/use-badge-nfts';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { BadgeList } from './badge-list';
import { BadgeTitle } from './badge-title';
import { SwapImg } from './swap-img';

export function BadgeContent() {
  const { setCurrentComponent } = useSideDrawerStore();

  const { data: allNfts } = useBadgeNfts();
  const { data: userBadgeNfts } = useBadgeWalletNfts();

  const [selectedNftName, setSelectedNftName] = useState(allNfts?.[0]?.name);

  useEffect(() => {
    if (userBadgeNfts?.nftInfo) {
      setSelectedNftName(userBadgeNfts.nftInfo.name);
    }
  }, [userBadgeNfts]);

  const selectedNft = useMemo(() => {
    return allNfts?.find((nft) => nft.name === selectedNftName);
  }, [allNfts, selectedNftName]);

  return (
    <div className="px-4 2xl:px-12">
      <button
        className="bg-black text-white px-4 py-2 rounded-md"
        onClick={() =>
          setCurrentComponent({
            name: 'BadgeNftBuy',
            props: null,
          })
        }
      >
        Buy
      </button>
      <BadgeTitle />

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <div className="flex flex-1 gap-2 flex-col mt-4">
          <SwapImg selectedName={selectedNftName} setSelectedName={setSelectedNftName} />

          <div className="mt-8 flex flex-col gap-3.5 flex-wrap">
            <div className="font-medium text-lg leading-6">{selectedNft?.name}</div>
            <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-2 text-sm leading-5">
              <div className="flex gap-2 items-center">
                <Sparkles className="w-4 h-4" />
                <span className="capitalize">legendary</span>
              </div>
              <div className="flex gap-2 items-center">
                <UsersRound className="w-4 h-4" />
                <span>8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <BadgeList selectedNft={selectedNft} />
        </div>
      </div>
    </div>
  );
}
