import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

interface MarketTitleProps {
  title: string;
  id: number;
}

export default function MarketTitle({ title, id }: MarketTitleProps) {
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (titleRef.current) {
      const hasOverflow = titleRef.current.scrollWidth > titleRef.current.clientWidth;
      setShouldScroll(hasOverflow);
    }
  }, [title]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (shouldScroll) {
      hoverTimerRef.current = setTimeout(() => {
        const titleElement = titleRef.current;
        if (titleElement) {
          const distance = titleElement.scrollWidth - titleElement.clientWidth;
          titleElement.style.transform = `translateX(-${distance}px)`;
        }
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    if (titleRef.current) {
      titleRef.current.style.transform = 'translateX(0)';
    }
  };

  return (
    <Link
      href={`/market/${id}`}
      target={process.env.NODE_ENV === 'production' ? '_blank' : undefined}
      className="block h-[30px] overflow-hidden cursor-pointer hover:text-[var(--color-odd-main)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={titleRef}
        className={`font-semibold text-lg leading-tight ${
          shouldScroll ? 'whitespace-nowrap' : 'truncate'
        }`}
        style={{
          transition: isHovering ? 'transform 1.5s ease-in-out' : 'transform 0.3s ease-out',
        }}
      >
        {title}
      </div>
    </Link>
  );
}
