'use client';

import { useCallback, useMemo } from 'react';

import Image from 'next/image';

import { IBadgeNft, useBadgeNfts } from '@/lib/data/use-badge-nfts';
import { cn } from '@/lib/utils';

export function SwapImg({
  selectedName,
  setSelectedName,
}: {
  selectedName: string | undefined;
  setSelectedName: (v: string) => void;
}) {
  const { data: allNfts } = useBadgeNfts();

  const badgeArr = useMemo(() => {
    if (!allNfts) return [];

    if (!selectedName) return allNfts;

    const nameIndex = allNfts?.findIndex((nft) => nft.name === selectedName);

    if (nameIndex === -1 || nameIndex === 0) {
      return allNfts;
    }

    return [...allNfts.slice(nameIndex), ...allNfts.slice(0, nameIndex)];
  }, [allNfts, selectedName]);

  const handleClickItem = useCallback(
    (index: number, nft: IBadgeNft) => {
      // 简化交互：点击任何图片，直接将其设为选中（置顶）
      setSelectedName(nft.name);
    },
    [setSelectedName]
  );

  return (
    <div className="relative size-full sm:size-[min(500px,100%)] aspect-square">
      {badgeArr.map((nft, idx) => {
        const zIndex = badgeArr.length - idx; // 越前面的索引 zIndex 越大
        const left = idx * 40;
        const scale = 1 - idx * 0.02;
        return (
          <div
            key={nft.name}
            className={cn(
              'absolute top-0 size-full flex items-center justify-center cursor-pointer',
              'transition-all duration-300 ease-out'
            )}
            style={{
              zIndex,
              left,
              transform: `scale(${scale})`,
              willChange: 'left, transform',
            }}
            onClick={() => handleClickItem(idx, nft)}
          >
            <Image
              src={`/images/badge-nft/${nft.name}.svg`}
              className="select-none object-contain size-full"
              width={500}
              height={500}
              alt={nft.name}
            />
          </div>
        );
      })}
    </div>
  );
}
