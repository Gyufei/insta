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
    { id: 'trade', href: '/odds/dashboard/trade', label: 'Trade', icon: Layers },
    { id: 'portfolio', href: '/odds/dashboard/portfolio', label: 'Portfolio', icon: SwatchBook },
    { id: 'watchlist', href: '/odds/dashboard/watchlist', label: 'WatchList', icon: Star },
  ];

  function isActive(view: IView) {
    return pathname === view.href || pathname.includes(view.id);
  }

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center w-full pt-2">
        <div className="flex items-center gap-2 h-16 px-4">
          {allViews.map((view) => {
            const Icon = view.icon;
            return (
              <Link
                key={view.id}
                href={view.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 ${
                  isActive(view)
                    ? 'bg-[var(--color-odd-main-light)] text-[var(--color-odd-main)]'
                    : 'text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{view.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-64">
        <div className="p-6">
          <h1 className="text-sm font-medium text-gray-500 uppercase">Dashboard</h1>
          <nav className="mt-6 space-y-1">
            {allViews.map((view) => {
              const Icon = view.icon;
              return (
                <Link
                  key={view.id}
                  href={view.href}
                  className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left ${
                    isActive(view)
                      ? 'bg-[var(--color-odd-main-light)] text-[var(--color-odd-main)]'
                      : 'text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]'
                  } rounded-lg`}
                >
                  <Icon className="h-5 w-5" />
                  {view.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
