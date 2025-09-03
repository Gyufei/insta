'use client';

import { Layers, Star, SwatchBook } from 'lucide-react';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IView {
  id: string;
  href: string;
  label: string;
  icon: React.ElementType;
}

export default function DashboardNav() {
  const pathname = usePathname();

  // Define all possible views and their icons
  const allViews = [
    { id: 'trade', href: '/odds/dashboard/trade?chain=monad', label: 'Trade', icon: Layers },
    {
      id: 'portfolio',
      href: '/odds/dashboard/portfolio?chain=monad',
      label: 'Portfolio',
      icon: SwatchBook,
    },
    {
      id: 'watchlist',
      href: '/odds/dashboard/watchlist?chain=monad',
      label: 'WatchList',
      icon: Star,
    },
  ];

  function isActive(view: IView) {
    return pathname === view.href || pathname.includes(view.id);
  }

  return (
    <div className="overflow-visible no-scrollbar mt-5 border-b border-[#EBEBEB]">
      <div className="flex items-center gap-6 min-w-max">
        {allViews.map((views) => (
          <Link
            key={views.id}
            href={views.href}
            className={`px-2 relative py-3 -mb-px whitespace-nowrap font-medium ${
              isActive(views)
                ? 'text-[var(--color-tab-text-active)]'
                : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
            }`}
          >
            <span>{views.label}</span>
            {isActive(views) && (
              <div className="w-full h-[2px] bg-[#131E40] absolute bottom-[-0.5px] left-0"></div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
