import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

interface MarketTitleProps {
  title: string;
  id: number;
}

export default function MarketTitle({ title, id }: MarketTitleProps) {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      const el = textRef.current;
      if (!el) return;
      const overflows = el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth;
      setIsOverflowing(overflows);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <Link
      className="h-fit w-full relative cursor-pointer group block"
      href={`/odds/market/${id}?chain=monad`}
    >
      <div className="relative h-[24px] mb-2">
        <div
          className={
            'w-full' +
            (isOverflowing
              ? ' group-hover:absolute group-hover:top-0 group-hover:inset-x-0 group-hover:z-20 group-hover:rounded-md group-hover:bg-white group-hover:pt-1 group-hover:pb-2 group-hover:px-2 group-hover:shadow-[0px_0px_10px_0px_rgba(19,30,64,0.05)]'
              : '')
          }
        >
          <p
            ref={textRef}
            className={
              'text-base font-normal w-fit line-clamp-1 text-pretty text-text decoration-2 min-w-0 pl-0 leading-5' +
              (isOverflowing ? ' group-hover:line-clamp-none' : '')
            }
          >
            {title}
          </p>
        </div>
      </div>
    </Link>
  );
}
