'use client';

import { useMemo } from 'react';

import Image from 'next/image';

import { IBadgeNft, useBadgeNfts } from '@/lib/data/use-badge-nfts';

const CssColStartAndEnd = [
  [1, 11, 3],
  [2, 12, 2],
  [3, 13, 1],
];

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

  function handleClickItem(index: number, nft: IBadgeNft) {
    setSelectedName(nft.name);
  }

  return (
    <div
      className="relative grid grid-cols-12"
      style={{ transform: 'none', transformOrigin: '50% 50% 0px' }}
    >
      {badgeArr.map((nft, idx) => (
        <div
          key={nft.name}
          className="size-full sm:size-[min(500px,100%)] flex items-center justify-center aspect-square [grid-row:1/2]"
          id={`item-${idx + 1}`}
          onClick={() => handleClickItem(idx, nft)}
          style={{
            gridColumnStart: idx < 2 ? CssColStartAndEnd[idx][0] : CssColStartAndEnd[2][0],
            gridColumnEnd: idx < 2 ? CssColStartAndEnd[idx][1] : CssColStartAndEnd[2][1],
            zIndex: idx < 2 ? CssColStartAndEnd[idx][2] : CssColStartAndEnd[2][2],
            visibility: idx < 2 ? 'visible' : 'hidden',
            animation: idx < 2 ? 'scale 0.5s ease-in-out' : 'none',
          }}
        >
          <div
            className="relative flex items-center rounded-md justify-center size-full transition-transform duration-300"
            id="item-2"
            style={{
              transform: `scale(${idx > 3 ? '0.8' : 1 - idx * 0.05}) translateZ(0)`,
            }}
          >
            <div className="overflow-hidden rounded-md pointer-events-none absolute inset-0 size-full">
              <div className="rounded-md">
                <Image
                  src={`/images/badge-nft/${nft.name}.jpeg`}
                  className="rounded-[inherit] opacity-100 object-cover scale-125 blur-md [-webkit-user-drag:none] select-none transform-gpu size-full"
                  width="320"
                  height="320"
                  alt={nft.name}
                />
              </div>
              <div className="absolute inset-0 bg-black/[0.56]"></div>
            </div>
            <div className="rounded-md">
              <Image
                src={`/images/badge-nft/${nft.name}.jpeg`}
                className="rounded-[inherit] opacity-100 [-webkit-user-drag:none] select-none transform-gpu size-full absolute inset-0 object-contain"
                width="320"
                height="320"
                objectFit="cover"
                alt={nft.name}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
