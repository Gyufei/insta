import Image from 'next/image';

import { MONAD } from '@/config/tokens';

import { Button } from '@/components/ui/button';

import { IBadgeNft, useBadgeNfts } from '@/lib/data/use-badge-nfts';

export function BadgeList({ selectedNft }: { selectedNft: IBadgeNft | undefined }) {
  const { data: allNfts } = useBadgeNfts();

  return (
    <>
      <div className="flex items-center flex-wrap justify-between gap-x-1 gap-y-3">
        <h2 className="flex flex-1 gap-3 items-center text-lg leading-6 tracking-[-1.4%]">
          Collectibles
          <span className="text-xs min-w-5 px-1 h-5 grid place-items-center bg-black/20 rounded leading-[18px]">
            {allNfts?.length}
          </span>
        </h2>
        <div className="flex items-center basis-[10%] max-w-[90px] text-sm leading-5 tracking-[-0.06%]">
          Level
        </div>
        <div className="flex items-center justify-center gap-2 flex-1 text-sm leading-5 tracking-[-0.06%]">
          Claimable Rewards
        </div>
        <div className="flex items-center justify-end basis-[10%] max-w-[100px]"></div>
      </div>
      <div className="mt-4 overflow-auto scrollbar-hover max-h-[450px]">
        {allNfts?.map((nft) => (
          <div
            key={nft.name}
            className="flex rounded relative py-1.5 transition-colors duration-300 ease-out gap-x-1 items-center px-2 bg-base-bg-emphasized"
          >
            {selectedNft?.name === nft.name && (
              <div
                className="bg-black/20 z-elevate absolute w-0.5 h-full top-0 left-0"
                style={{
                  backgroundColor: 'black',
                  width: '2px',
                  height: '100%',
                  opacity: 1,
                }}
              ></div>
            )}
            <span className="flex-1 flex items-center gap-2.5 max-w-[calc(100%-100px-100px)]">
              <span className="relative shrink-0 size-[38px]">
                <Image
                  src={`/images/badge-nft/${nft.name}.jpeg`}
                  alt={nft.name}
                  width={38}
                  height={38}
                  className="size-[38px] rounded object-cover [-webkit-user-drag:none] select-none"
                />
              </span>
              <span className="truncate text-sm leading-5 tracking-[-0.06%]">{nft.name}</span>
            </span>

            <span className="basis-[10%] flex items-center gap-2 pl-3 max-w-[90px]">1</span>

            <span className="flex flex-1 items-center justify-center">
              <span className="flex items-center gap-1">
                <span className="text-sm leading-5 tracking-[-0.06%]">
                  {nft.total_release_amount}
                </span>
                <Image src={MONAD.logo} alt="mon" width={16} height={16} />
              </span>
            </span>

            <span className="basis-[10%] flex items-center gap-2 max-w-[100px]">
              <Button className="h-8 flex text-sm active:bg-white hover:bg-white cursor-pointer items-center border border-[#EBEBEB] text-[#131E40] rounded-[6px] bg-white px-2">
                Select
              </Button>
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
