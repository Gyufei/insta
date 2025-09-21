'use client';

import { useMemo, useState, useCallback } from 'react';

import Image from 'next/image';

import { IBadgeNft, useBadgeNfts } from '@/lib/data/use-badge-nfts';

const CssColStartAndEnd = [
  [1, 10, 3],
  [2, 11, 2],
  [3, 12, 1],
  [4, 13, 0],
];

export function SwapImg({
  selectedName,
  setSelectedName,
}: {
  selectedName: string | undefined;
  setSelectedName: (v: string) => void;
}) {
  const { data: allNfts } = useBadgeNfts();
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationTarget, setAnimationTarget] = useState<number | null>(null);

  const badgeArr = useMemo(() => {
    if (!allNfts) return [];

    if (!selectedName) return allNfts;

    const nameIndex = allNfts?.findIndex((nft) => nft.name === selectedName);

    if (nameIndex === -1 || nameIndex === 0) {
      return allNfts;
    }

    return [...allNfts.slice(nameIndex), ...allNfts.slice(0, nameIndex)];
  }, [allNfts, selectedName]);

  const handleClickItem = useCallback((index: number, nft: IBadgeNft) => {
    if (isAnimating) return;
    
    // 如果点击的是第一张卡片（最前面的），直接设置选中
    if (index === 0) {
      setSelectedName(nft.name);
      return;
    }

    // 点击后面的卡片，触发轮换动画
    setIsAnimating(true);
    setAnimationTarget(index);
    
    // 动画完成后更新选中状态
    setTimeout(() => {
      setSelectedName(nft.name);
      setIsAnimating(false);
      setAnimationTarget(null);
    }, 600); // 调整动画持续时间以匹配更快的动画速度
  }, [isAnimating, setSelectedName]);

  return (
    <div
      className="relative grid grid-cols-24"
      style={{ 
        transform: 'none', 
        transformOrigin: '50% 50% 0px',
        perspective: '1000px' // 添加透视效果
      }}
    >
      {badgeArr.map((nft, idx) => {
        const isAnimatingCard = animationTarget === idx;
        const isBehindCard = idx > 0;
        const shouldAnimate = isAnimatingCard && isBehindCard;
        const isOtherCard = isAnimating && !isAnimatingCard;
        
        return (
          <div
            key={nft.name}
            className="size-full sm:size-[min(500px,100%)] flex items-center justify-center aspect-square [grid-row:1/2]"
            id={`item-${idx + 1}`}
            onClick={() => handleClickItem(idx, nft)}
              style={{
                gridColumnStart: CssColStartAndEnd[idx][0],
                gridColumnEnd: CssColStartAndEnd[idx][1],
                zIndex: shouldAnimate ? 10 : CssColStartAndEnd[idx][2],
                transition: shouldAnimate ? 'z-index 0.8s ease-in-out' : 'none',
                cursor: isAnimating ? 'default' : 'pointer',
                pointerEvents: isAnimating ? 'none' : 'auto',
              }}
          >
            <div
              className={`relative flex items-center rounded-md justify-center size-full ${
                !isAnimating ? 'hover:scale-105' : ''
              }`}
              style={{
                transform: shouldAnimate 
                  ? `scale(1.05) rotateY(${isAnimating ? '360deg' : '0deg'}) translateZ(${isAnimating ? '150px' : '0px'}) rotateX(${isAnimating ? '15deg' : '0deg'}) translateX(${isAnimating ? `-${40 + idx * 15}px` : '0px'})`
                  : isOtherCard
                    ? `scale(${1 - idx * 0.05 - (isAnimating ? 0.03 : 0.08)}) translateZ(${-idx * 20 - (isAnimating ? 20 : 40)}px) translateX(${idx * 10}px)`
                    : `scale(${1 - idx * 0.05}) translateZ(${-idx * 20}px) translateX(${idx * 10}px)`,
                transition: shouldAnimate 
                  ? 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)'
                  : isOtherCard
                    ? 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)'
                    : 'transform 0.3s ease-out',
                transformStyle: 'preserve-3d',
                opacity: 1,
                filter: `drop-shadow(0 ${idx * 2}px ${idx * 4}px rgba(0,0,0,0.2))`,
              }}
            >
            <div className="overflow-hidden rounded-md pointer-events-none absolute inset-0 size-full">
              <div className="rounded-md">
                <Image
                  src={`/images/badge-nft/${nft.name}.svg`}
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
                src={`/images/badge-nft/${nft.name}.svg`}
                className="rounded-[inherit] opacity-100 [-webkit-user-drag:none] select-none transform-gpu size-full absolute inset-0 object-contain"
                width="320"
                height="320"
                objectFit="cover"
                alt={nft.name}
              />
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}
