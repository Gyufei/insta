import { useState } from 'react';

import Image from 'next/image';

import { cn } from '@/lib/utils';

export default function BalanceFooterSocial({ className }: { className?: string }) {
  // 常量定义
  const SOCIAL_LINKS = [
    { href: '', src: '/icons/mail.svg', hoverSrc: '/icons/mail-hover.svg' },
    {
      href: 'https://twitter.com/instadapp',
      src: '/icons/twitter.svg',
      hoverSrc: '/icons/twitter-hover.svg',
    },
    {
      href: 'https://discord.gg/instadapp',
      src: '/icons/discord.svg',
      hoverSrc: '/icons/discord-hover.svg',
    },
    {
      href: 'https://docs.instadapp.io',
      src: '/icons/telegram.svg',
      hoverSrc: '/icons/telegram-hover.svg',
    },
    { href: '/', src: '/icons/setting-two.svg', hoverSrc: '/icons/setting-two-hover.svg' },
  ];

  return (
    <div className={cn(`flex w-full items-center justify-center space-x-4 z-0`, className)}>
      {SOCIAL_LINKS.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pro-gray hover:text-primary dark:hover:text-primary-foreground flex h-4 w-4 items-center justify-center"
        >
          <HoverIcon
            src={link.src}
            hoverSrc={link?.hoverSrc || link.src}
            width={20}
            height={20}
            alt={`social-icon-${index}`}
          />
        </a>
      ))}
    </div>
  );
}

function HoverIcon({
  src,
  hoverSrc,
  width,
  height,
  alt,
  className,
}: {
  src: string;
  hoverSrc: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
}) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Image
      className={cn(className)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      src={isHover ? hoverSrc : src}
      width={width}
      height={height}
      alt={alt}
    />
  );
}
