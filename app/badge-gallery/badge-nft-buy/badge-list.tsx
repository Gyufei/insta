import Image from 'next/image';

import { IBadgeNft, useBadgeNfts } from '@/lib/data/use-badge-nfts';
import { useBadgeWalletNfts } from '@/lib/data/use-badge-wallet-nfts';
import { cn } from '@/lib/utils';

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
          gridTemplateColumns: haveUserNft ? '110px 20px 90px 1fr' : '110px 20px 1fr',
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
            className={cn(
              'grid grid-cols-4 rounded-[8px] bg-white text-sm text-[#131E40] font-medium relative px-[10px] py-[10px] h-14 transition-colors duration-300 ease-out items-center cursor-pointer',
              selectedNft?.name === nft.name && 'border border-[#6E75F9]'
            )}
            onClick={() => handleSelectNft(nft.name)}
            style={{
              gridTemplateColumns: haveUserNft ? '110px 20px 90px 1fr' : '110px 20px 1fr',
            }}
          >
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

            {haveUserNft && (
              <span className="basis-[10%] h-[22px] flex items-center gap-2">
                {haveUserNft === nft.name && (
                  <span className="bg-[#6E75F910] text-[#6E75F9] text-xs px-2 rounded-[6px]">
                    Holding
                  </span>
                )}
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
