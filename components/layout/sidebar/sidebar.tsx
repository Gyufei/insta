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
        className={`scrollbar-hover flex h-full select-none flex-col overflow-y-auto pt-4 ${
          isCollapsed ? 'items-center' : 'items-start'
        } px-0`}
      >
        <div data-v-7fd64a2e="" className="flex flex-col w-full flex-grow">
          <BarItem
            icon={<Home className="w-full transition-colors duration-150 group-hover:text-brand dark:group-hover:text-light" />}
            name="Dashboard"
            href="/"
            isCollapsed={isCollapsed}
          />

          <BarItem
            icon={<HelpCircle className="w-full transition-colors duration-150 group-hover:text-brand dark:group-hover:text-light" />}
            name="Refinance"
            href="/"
            isCollapsed={isCollapsed}
          />

          <BarWithSubItem
            icon={<HelpCircle className="h-6 w-6 transition-colors duration-150 hover:text-brand dark:hover:text-light" />}
            name="Fluid"
            isCollapsed={isCollapsed}
            openSub={openSub}
            setOpenSub={setOpenSub}
          >
            <div className="flex flex-col space-y-1">
              <a
                href="/fluid-lending"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/fluid-lending' && 'text-brand',
                )}
              >
                <div className="leading-none">Lending</div>
              </a>
              <a
                href="/fluid-vaults"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/fluid-vaults' && 'text-brand',
                )}
              >
                <div className="leading-none">Vaults</div>
              </a>
            </div>
          </BarWithSubItem>

          <BarWithSubItem
            icon={<HelpCircle className="h-6 w-6 transition-colors duration-150 hover:text-brand dark:hover:text-light" />}
            name="Protocols"
            isCollapsed={isCollapsed}
            openSub={openSub}
            setOpenSub={setOpenSub}
          >
            <div className="flex flex-col space-y-1">
              <a
                href="/inst-pools"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/inst-pools' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
                <div className="leading-none">FLUID Pools</div>
              </a>
              <a
                href="/makerdao"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/makerdao' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
                <div className="leading-none">Maker</div>
              </a>
              <a
                href="/compound"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/compound' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
                <div className="leading-none">Compound</div>
              </a>
              <a
                href="/compound-v3"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/compound-v3' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
                <div className="leading-none">Compound v3</div>
              </a>
              <a
                href="/aave-v2"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/aave-v2' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
                <div className="leading-none">Aave v2</div>
              </a>
              <a
                href="/aave-v3"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/aave-v3' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
                <div className="leading-none">Aave v3</div>
              </a>
              <div className="flex flex-col space-y-1 mt-1">
                <a
                  href="/aave-v3"
                  className={cn(
                    'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                    pathname === '/aave-v3' && 'text-brand',
                  )}
                >
                  <div className="leading-none">Main</div>
                </a>
                <a
                  href="/aave-v3-lido"
                  className={cn(
                    'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                    pathname === '/aave-v3-lido' && 'text-brand',
                  )}
                >
                  <div className="leading-none">Lido</div>
                </a>
                <a
                  href="/aave-v3-etherfi"
                  className={cn(
                    'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                    pathname === '/aave-v3-etherfi' && 'text-brand',
                  )}
                >
                  <div className="leading-none">Etherfi</div>
                </a>
              </div>
            </div>
          </BarWithSubItem>

          <BarWithSubItem
            icon={<HelpCircle className="h-6 w-6 transition-colors duration-150 hover:text-brand dark:hover:text-light" />}
            name="Automation"
            isCollapsed={isCollapsed}
            openSub={openSub}
            setOpenSub={setOpenSub}
          >
            <div className="flex flex-col space-y-1">
              <a
                href="/automation"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/automation' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
                <div className="leading-none">Automation</div>
              </a>
              <a
                href="/import-positions"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/import-positions' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
                <div className="leading-none">Import Positions</div>
              </a>
              <a
                href="/sign-eip1271"
                className={cn(
                  'relative flex items-center py-2 px-3 hover:text-brand dark:hover:text-light rounded-sm hover:bg-grey-light hover:bg-opacity-38 dark:hover:bg-dark-600',
                  pathname === '/sign-eip1271' && 'text-brand',
                )}
              >
                <HelpCircle className="w-4 h-4 mr-4" />
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
      className={`fixed inset-y-0 left-0 z-10 flex flex-col bg-background text-grey-pure ring-1 ring-black/5 dark:bg-dark-500 dark:text-grey-pure dark:shadow-none  grid-sidebar-nav 2xl:relative 2xl:translate-x-0 2xl:transform-none  -translate-x-full duration-200`}
      style={{ width: isCollapsed ? '60px' : '270px' }}
    >
      {navContent}
      <button
        className={`flex cursor-pointer items-center justify-center flex-shrink-0 font-semibold transition-colors duration-75 ease-out select-none whitespace-nowrap disabled:opacity-50 focus:outline-none rounded-xs text-xs 2xl:text-12  absolute h-5 w-5 border border-grey-light bg-light text-grey-pure hover:text-ocean-blue-pure dark:border-grey-pure dark:bg-dark-500 dark:text-grey-pure dark:hover:border-grey-light dark:hover:text-light py-1`}
        style={{ top: '71px', right: isCollapsed ? '20px' : '30px' }}
        onClick={toggleCollapse}
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </nav>
  );
}
