'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, ServerCog, Cog, CircleUserRound } from 'lucide-react';
import BarFooter from './bar-footer';
import BarHeader from './bar-header';
import { BarItem, BarWithSubItem } from './bar-item';
import { usePathname } from 'next/navigation';
import SubMenu from './sub-menu';
import { useSidebarStore } from '@/lib/state/sidebar';
import { cn } from '@/lib/utils';
import { useSelectedAccount } from '@/lib/data/use-account';

export default function SideBar() {
  const { data: accountInfo } = useSelectedAccount();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebarStore();

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed);
  }

  const protocolItems = [
    {
      href: '/apriori',
      label: 'Apriori',
      icon: (
        <Image
          src="/icons/apriori.svg"
          alt="aprior"
          width={16}
          height={16}
          className="mr-4 h-4 w-4"
        />
      ),
    },
    {
      href: '/nad-fun',
      label: 'Nad.Fun',
      icon: (
        <Image
          src="/icons/nad-fun.svg"
          alt="nad-fun"
          width={16}
          height={16}
          className="mr-4 h-4 w-4"
        />
      ),
    },
    {
      href: '/uniswap',
      label: 'Uniswap V3',
      icon: (
        <Image
          src="/icons/uniswap.svg"
          alt="uniswap"
          width={16}
          height={16}
          className="mr-4 h-4 w-4"
        />
      ),
    },
    {
      href: '/magma',
      label: 'Magma',
      icon: (
        <Image src="/icons/magma.jpg" alt="magma" width={16} height={16} className="mr-4 h-4 w-4" />
      ),
    },
    {
      href: '/nad-name-server',
      label: 'Nad Name Server',
      icon: (
        <Image
          src="/icons/nad-name-server.svg"
          alt="nad-name-server"
          width={16}
          height={16}
          className="mr-4 h-4 w-4"
        />
      ),
    },
    {
      href: '/ambient',
      label: 'Ambient',
      icon: (
        <Image
          src="/icons/ambient.svg"
          alt="ambient"
          width={16}
          height={16}
          className="mr-4 h-4 w-4"
        />
      ),
    },
    {
      href: '/meme',
      label: 'Meme',
      icon: (
        <Image src="/icons/monad.svg" alt="meme" width={16} height={16} className="mr-4 h-4 w-4" />
      ),
    },
    {
      href: '/curvance',
      label: 'Curvance',
      icon: (
        <Image
          src="/icons/curvance.svg"
          alt="curvance"
          width={16}
          height={16}
          className="mr-4 h-4 w-4"
        />
      ),
    },
  ];

  const utilitiesItems = [
    { href: '/authority', label: 'Authority', icon: <CircleUserRound className="mr-4 h-4 w-4" /> },
  ];

  const navContent = (
    <>
      <BarHeader isCollapsed={isCollapsed} />
      <div
        className={`scrollbar-hover flex h-full flex-col overflow-y-auto pt-4 select-none ${
          isCollapsed ? 'items-center' : 'items-start'
        } px-0`}
      >
        <div data-v-7fd64a2e="" className="flex w-full flex-grow flex-col">
          <BarItem
            icon={
              <Home className="group-hover:text-brand dark:group-hover:text-light w-full transition-colors duration-150" />
            }
            name="Dashboard"
            href="/"
            isCollapsed={isCollapsed}
          />

          <BarWithSubItem
            icon={
              <ServerCog className="hover:text-brand dark:hover:text-light h-6 w-6 transition-colors duration-150" />
            }
            name="Protocols"
            isCollapsed={isCollapsed}
            openSub={openSub}
            setOpenSub={setOpenSub}
          >
            <SubMenu items={protocolItems} currentPath={pathname} />
          </BarWithSubItem>

          {accountInfo?.sandbox_account && (
            <BarWithSubItem
              icon={
                <Cog className="hover:text-brand dark:hover:text-light h-6 w-6 transition-colors duration-150" />
              }
              name="Utilities"
              isCollapsed={isCollapsed}
              openSub={openSub}
              setOpenSub={setOpenSub}
            >
              <SubMenu items={utilitiesItems} currentPath={pathname} />
            </BarWithSubItem>
          )}
        </div>
        <BarFooter isCollapsed={isCollapsed} />
      </div>
    </>
  );

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="dark:bg-dark-500/70 fixed top-0 right-0 bottom-0 left-0 z-10 bg-white/70 2xl:hidden"
        ></div>
      )}
      <nav
        className={cn(
          'bg-background text-grey-pure dark:bg-dark-500 dark:text-grey-pure grid-sidebar-nav fixed inset-y-0 left-0 z-10 flex flex-col ring-1 ring-black/5 duration-200 2xl:relative 2xl:transform-none dark:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full 2xl:translate-x-0'
        )}
        style={{ width: isCollapsed ? '60px' : '270px' }}
        data-v-ead27774
      >
        {navContent}
        <button
          className={`border-grey-light bg-light text-grey-pure hover:text-ocean-blue-pure dark:border-grey-pure dark:bg-dark-600 dark:text-grey-pure dark:hover:border-grey-light dark:hover:text-light absolute flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50 2xl:text-xs`}
          style={{ top: '71px', right: isCollapsed ? '20px' : '30px' }}
          onClick={toggleCollapse}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </nav>
    </>
  );
}
