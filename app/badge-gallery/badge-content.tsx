'use client';

// import { Sparkles, UsersRound } from 'lucide-react';
import { useAppKitNetwork } from '@reown/appkit/react';

import { useEffect, useMemo, useState } from 'react';

import { NetworkConfigs } from '@/config/network-config';

import { useBadgeNfts } from '@/lib/data/use-badge-nfts';
import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';
import { eventBus } from '@/lib/state/eventBus';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useIsMobile } from '@/lib/utils/use-mobile';

import { MbBadgeNftBuy } from './badge-nft-buy/mb-badge-nft-buy';
import { BadgeTitle } from './badge-title';
import { SwapImg } from './swap-img';

export function BadgeContent() {
  const { chainId } = useAppKitNetwork();
  const { setCurrentComponent } = useSideDrawerStore();

  const { data: allNfts } = useBadgeNfts();
  const { data: userBadgeNfts } = useBadgeWalletNfts();
  const [init, setInit] = useState(false);

  const [selectedNftName, setSelectedNftName] = useState(allNfts?.[0]?.name);
  const isMobile = useIsMobile();

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

  useEffect(() => {
    if (init) {
      return;
    }

    if (chainId !== NetworkConfigs.base.id) {
      setTimeout(() => {
        toggleNetwork(NetworkConfigs.base);
      }, 1000);
      return;
    }

    setInit(true);
  }, [init, chainId]);

  function toggleNetwork(net: (typeof NetworkConfigs)[keyof typeof NetworkConfigs]) {
    eventBus.publish('toggle-network', net);
  }

  function handleClickImg(v: string) {
    setSelectedNftName(v);
    if (isMobile) {
      return;
    }
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

      <div className="flex flex-col gap-4 mt-6">
        <SwapImg selectedName={selectedNftName} setSelectedName={handleClickImg} />

        <div className="mt-5 font-medium text-base leading-6">{selectedNft?.name}</div>

        {selectedNftName && (
          <MbBadgeNftBuy
            selectedNftName={selectedNftName as string}
            handleNftName={(name) => handleClickImg(name as string)}
          />
        )}
      </div>
    </div>
  );
}
