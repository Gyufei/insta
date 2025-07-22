import { useMemo } from 'react';

import { useBadgeNfts } from '@/lib/data/use-badge-nfts';
import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';

import { BadgeList } from './badge-list';
import { ClaimBtn } from './claim-btn';
import { PayWithToken } from './pay-with-token';
import { RewardInfo } from './reward-info';

export function BadgeNftBuyContent({
  nftName,
  handleNftName,
}: {
  nftName: string | undefined;
  handleNftName: (v: string | undefined) => void;
}) {
  const { data: allNfts } = useBadgeNfts();

  const selectedNft = useMemo(() => {
    if (!nftName) {
      return allNfts?.[0];
    }

    const tar = allNfts?.find((nft) => nft.name === nftName);
    return tar || allNfts?.[0];
  }, [allNfts, nftName]);

  const { data: userBadgeData } = useBadgeWalletNfts();
  const haveUserNft = userBadgeData?.nftInfo?.name;
  const isUserNft = userBadgeData?.nftInfo?.name === selectedNft?.name;

  return (
    <div className="w-full py-2">
      <BadgeList selectedNft={selectedNft} handleSelectNft={handleNftName} />
      <RewardInfo selectedNft={selectedNft!} />
      {haveUserNft ? isUserNft ? <ClaimBtn /> : <></> : <PayWithToken selectedNft={selectedNft!} />}
    </div>
  );
}
