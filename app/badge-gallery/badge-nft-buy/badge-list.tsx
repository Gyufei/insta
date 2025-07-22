import Image from 'next/image';

import { Button } from '@/components/ui/button';

import { IBadgeNft, useBadgeNfts } from '@/lib/data/use-badge-nfts';
import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';

export function BadgeList({
  selectedNft,
  handleSelectNft,
}: {
  selectedNft: IBadgeNft | undefined;
  handleSelectNft: (name: string | undefined) => void;
}) {
  const { data: allNfts } = useBadgeNfts();

  const { data: userBadgeData } = useBadgeWalletNfts();
  const haveUserNft = userBadgeData?.nftInfo?.name;

  return (
    <>
      <h2 className="pl-3 flex gap-1 items-center text-xs font-medium text-[#131E40] leading-6 tracking-[-1.4%]">
        Collectibles <span>({allNfts?.length})</span>
      </h2>
      <div
        className="grid text-xs text-[#A5ADC6] grid-cols-4 font-medium mt-4 px-[10px]"
        style={{
          gridTemplateColumns: !haveUserNft ? '110px 20px 90px 1fr' : '110px 20px 1fr',
        }}
      >
        <div className="flex items-center justify-start">#</div>
        <div className="flex items-center justify-center">Lv.</div>
        <div className="flex items-center justify-center">Claimable</div>
        {!haveUserNft && <div className="flex items-center"></div>}
      </div>
      <div className="mt-4 mb-6 overflow-auto scrollbar-hover max-h-[450px] space-y-2">
        {allNfts?.map((nft, index) => (
          <div
            key={nft.name}
            className="grid grid-cols-4 rounded-[8px] bg-white text-sm text-[#131E40] font-medium relative px-[10px] py-[10px] h-14 transition-colors duration-300 ease-out items-center"
            style={{
              gridTemplateColumns: !haveUserNft ? '110px 20px 90px 1fr' : '110px 20px 1fr',
            }}
          >
            {selectedNft?.name === nft.name && (
              <div className="bg-black/20 z-elevate absolute w-0.5 h-full top-0 left-0"></div>
            )}
            <span className="flex items-center gap-2">
              <Image
                src={`/images/badge-nft/${nft.name}.svg`}
                alt={nft.name}
                width={36}
                height={36}
                className="size-[36px] rounded object-cover [-webkit-user-drag:none] select-none"
              />
              <span className="truncate text-sm leading-5 tracking-[-0.06%]">{nft.name}</span>
            </span>

            <span className="flex items-center pl-3">{index + 1}</span>

            <span className="flex flex-1 items-center justify-center">
              <span className="flex items-center gap-1">
                <span className="text-sm leading-5 tracking-[-0.06%]">
                  {nft.total_release_amount}
                </span>
              </span>
            </span>

            {!haveUserNft && (
              <span className="basis-[10%] flex items-center gap-2 max-w-[100px]">
                <Button
                  onClick={() => handleSelectNft(nft.name)}
                  className="h-8 flex text-xs font-medium active:bg-white hover:bg-white cursor-pointer items-center border border-[#EBEBEB] text-[#131E40] rounded-[6px] bg-white px-2"
                >
                  Select
                </Button>
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
