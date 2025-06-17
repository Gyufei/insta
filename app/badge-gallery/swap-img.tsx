'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { useState } from 'react';

import Image from 'next/image';

import { All_BADGES } from './gallery-config';

export function SwapPic() {
  const colStartAndEnd = [
    [1, 11, 3],
    [2, 12, 2],
    [3, 13, 1],
  ];

  const [badgeArr, setBadgeArr] = useState(All_BADGES);

  function handleClickItem(index: number) {
    const newArr = [...badgeArr.slice(index), ...badgeArr.slice(0, index)];
    setBadgeArr(newArr);
  }

  return (
    <div
      className="relative grid grid-cols-12"
      style={{ transform: 'none', transformOrigin: '50% 50% 0px' }}
    >
      {badgeArr.map((nft, idx) => (
        <div
          key={nft.name}
          className="size-full sm:size-[min(320px,100%)] flex items-center justify-center aspect-square [grid-row:1/2]"
          id={`item-${idx + 1}`}
          onClick={() => handleClickItem(idx)}
          style={{
            gridColumnStart: idx < 2 ? colStartAndEnd[idx][0] : colStartAndEnd[2][0],
            gridColumnEnd: idx < 2 ? colStartAndEnd[idx][1] : colStartAndEnd[2][1],
            zIndex: idx < 2 ? colStartAndEnd[idx][2] : colStartAndEnd[2][2],
            visibility: idx < 3 ? 'visible' : 'hidden',
            animation: idx < 3 ? 'scale 0.5s ease-in-out' : 'none',
          }}
        >
          <div
            className="relative flex items-center rounded-md justify-center size-full"
            id="item-2"
            style={{
              transform: `scale(${idx > 3 ? '0.8' : 1 - idx * 0.05}) translateZ(0)`,
            }}
          >
            <div className="overflow-hidden rounded-md pointer-events-none absolute inset-0 size-full">
              <div className="rounded-md">
                <Image
                  src={nft.pic}
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
                src={nft.pic}
                className="opacity-100 [-webkit-user-drag:none] select-none transform-gpu size-full absolute inset-0 object-contain"
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
