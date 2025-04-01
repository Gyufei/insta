'use client';
import { useState } from 'react';
import { HelpCircle, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import BarFooter from './bar-footer';
import BarHeader from './bar-header';
import { BarItem, BarWithSubItem } from './bar-item';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function SideBar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const pathname = usePathname();

  function toggleCollapse() {
    setIsCollapsed(!isCollapsed);
  }

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

          <BarItem
            icon={
              <HelpCircle className="group-hover:text-brand dark:group-hover:text-light w-full transition-colors duration-150" />
            }
            name="Refinance"
            href="/"
            isCollapsed={isCollapsed}
          />

          <BarWithSubItem
            icon={
              <HelpCircle className="hover:text-brand dark:hover:text-light h-6 w-6 transition-colors duration-150" />
            }
            name="Fluid"
            isCollapsed={isCollapsed}
            openSub={openSub}
            setOpenSub={setOpenSub}
          >
            <div className="flex flex-col space-y-1">
              <a
                href="/fluid-lending"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/fluid-lending' && 'text-brand'
                )}
              >
                <div className="leading-none">Lending</div>
              </a>
              <a
                href="/fluid-vaults"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/fluid-vaults' && 'text-brand'
                )}
              >
                <div className="leading-none">Vaults</div>
              </a>
            </div>
          </BarWithSubItem>

          <BarWithSubItem
            icon={
              <HelpCircle className="hover:text-brand dark:hover:text-light h-6 w-6 transition-colors duration-150" />
            }
            name="Protocols"
            isCollapsed={isCollapsed}
            openSub={openSub}
            setOpenSub={setOpenSub}
          >
            <div className="flex flex-col space-y-1">
              <a
                href="/inst-pools"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/inst-pools' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">FLUID Pools</div>
              </a>
              <a
                href="/makerdao"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/makerdao' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">Maker</div>
              </a>
              <a
                href="/compound"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/compound' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">Compound</div>
              </a>
              <a
                href="/compound-v3"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/compound-v3' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">Compound v3</div>
              </a>
              <a
                href="/aave-v2"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/aave-v2' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">Aave v2</div>
              </a>
              <a
                href="/aave-v3"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/aave-v3' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">Aave v3</div>
              </a>
              <div className="mt-1 flex flex-col space-y-1">
                <a
                  href="/aave-v3"
                  className={cn(
                    'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                    pathname === '/aave-v3' && 'text-brand'
                  )}
                >
                  <div className="leading-none">Main</div>
                </a>
                <a
                  href="/aave-v3-lido"
                  className={cn(
                    'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                    pathname === '/aave-v3-lido' && 'text-brand'
                  )}
                >
                  <div className="leading-none">Lido</div>
                </a>
                <a
                  href="/aave-v3-etherfi"
                  className={cn(
                    'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                    pathname === '/aave-v3-etherfi' && 'text-brand'
                  )}
                >
                  <div className="leading-none">Etherfi</div>
                </a>
              </div>
            </div>
          </BarWithSubItem>

          <BarWithSubItem
            icon={
              <HelpCircle className="hover:text-brand dark:hover:text-light h-6 w-6 transition-colors duration-150" />
            }
            name="Automation"
            isCollapsed={isCollapsed}
            openSub={openSub}
            setOpenSub={setOpenSub}
          >
            <div className="flex flex-col space-y-1">
              <a
                href="/automation"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/automation' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">Automation</div>
              </a>
              <a
                href="/import-positions"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/import-positions' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">Import Positions</div>
              </a>
              <a
                href="/sign-eip1271"
                className={cn(
                  'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
                  pathname === '/sign-eip1271' && 'text-brand'
                )}
              >
                <HelpCircle className="mr-4 h-4 w-4" />
                <div className="leading-none">Sign in (EIP-1271)</div>
              </a>
            </div>
          </BarWithSubItem>
        </div>
        <BarFooter isCollapsed={isCollapsed} />
      </div>
    </>
  );

  return (
    <nav
      className={`bg-background text-grey-pure dark:bg-dark-500 dark:text-grey-pure grid-sidebar-nav fixed inset-y-0 left-0 z-10 flex -translate-x-full flex-col ring-1 ring-black/5 duration-200 2xl:relative 2xl:translate-x-0 2xl:transform-none dark:shadow-none`}
      style={{ width: isCollapsed ? '60px' : '270px' }}
    >
      {navContent}
      <button
        className={`2xl:text-12 border-grey-light bg-light text-grey-pure hover:text-ocean-blue-pure dark:border-grey-pure dark:bg-dark-600 dark:text-grey-pure dark:hover:border-grey-light dark:hover:text-light absolute flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border py-1 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50`}
        style={{ top: '71px', right: isCollapsed ? '20px' : '30px' }}
        onClick={toggleCollapse}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </nav>
  );
}
