'use client';

// React imports
// Third-party libraries
import { useAppKitNetwork } from '@reown/appkit/react';
import { Minus, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

import { useCallback, useEffect, useMemo, useState } from 'react';

// Next.js imports
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { DEX_PROJECTS, DEX_PROJECT_IDS } from '@/app/(protocols)/dex/dex-config';
import { LENDING_PROJECTS, LENDING_PROJECT_IDS } from '@/app/(protocols)/lending/lending-config';
import { STAKING_PROJECTS, STAKING_PROJECT_IDS } from '@/app/(protocols)/staking/staking-config';

import { BaseNetUrlPath } from '@/config/env-url';
import { TAB_ENABLED } from '@/config/feature-flags';
// Internal imports
import { NetworkConfigs } from '@/config/network-config';

import { ProjectLogoStack } from '@/components/common/project-logo-stack';
// UI components
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useVersionCheck } from '@/lib/hooks/use-version-check';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/lib/utils/use-mobile';

// Local components
import { Version } from './version';

// Type definitions
type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  hoverIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
};

type MenuGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  hoverIcon?: React.ReactNode;
  items: MenuItem[];
  isMenuItem: boolean;
  href?: string;
};

const NETWORK_TO_URL_PARAM: Record<string, string> = {
  [String(NetworkConfigs.monadTestnet.id)]: 'monad',
  [String(NetworkConfigs.base.id)]: 'base',
  [String(NetworkConfigs.eth.id)]: 'eth',
};

const WINDOW_BREAKPOINTS = {
  MOBILE: 768,
  DESKTOP: 1440,
} as const;

const FALLBACK_APP_VERSION = '3.2.0';

// Global state
let previousPathname = '';

// Feature flags are managed globally in config/feature-flags.ts

// Menu configuration function
function createMenuItemsConfig(getCurrentChainNameHref: (href: string) => string) {
  const monadModulesItems: MenuItem[] = [
    {
      href: getCurrentChainNameHref('/faucet'),
      label: 'Faucet',
      icon: (
        <Image
          src="/icons/faucet-gray.svg"
          alt="faucet"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      ),
      hoverIcon: (
        <Image src="/icons/faucet.svg" alt="faucet" width={12} height={12} className="h-3 w-3" />
      ),
      disabled: !TAB_ENABLED.faucet,
    },
    // {
    //   href: getCurrentChainNameHref('/trade'),
    //   label: 'Trade',
    //   icon: (
    //     <Image src="/icons/trade-gray.svg" alt="trade" width={12} height={12} className="h-3 w-3" />
    //   ),
    //   hoverIcon: (
    //     <Image src="/icons/trade.svg" alt="trade" width={12} height={12} className="h-3 w-3" />
    //   ),
    // },
    {
      href: getCurrentChainNameHref('/odds'),
      label: 'Odds',
      icon: (
        <Image src="/icons/odds-gray.svg" alt="odds" width={12} height={12} className="h-3 w-3" />
      ),
      hoverIcon: (
        <Image src="/icons/odds.svg" alt="odds" width={12} height={12} className="h-3 w-3" />
      ),
      disabled: !TAB_ENABLED.odds,
    },
  ];

  const baseModulesItems: MenuItem[] = [
    {
      href: getCurrentChainNameHref('/badge-gallery'),
      label: 'Badge Gallery',
      icon: (
        <Image
          src="/icons/badge-gallery-gray.svg"
          alt="badge-gallery"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      ),
      hoverIcon: (
        <Image
          src="/icons/badge-gallery.svg"
          alt="badge-gallery"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      ),
    },
    {
      href: getCurrentChainNameHref('/token-station'),
      label: 'Token Station',
      icon: (
        <Image
          src="/icons/token-station-gray.svg"
          alt="token-station"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      ),
      hoverIcon: (
        <Image
          src="/icons/token-station.svg"
          alt="token-station"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      ),
    },
  ];

  const protocolItems: MenuItem[] = [
    {
      href: getCurrentChainNameHref('/dex'),
      label: 'DEX',
      icon: <Image src="/icons/dex.svg" alt="dex" width={12} height={12} className="h-3 w-3" />,
      rightIcon: (
        <ProjectLogoStack
          logos={DEX_PROJECT_IDS.map((id) => DEX_PROJECTS[id].icon).filter(Boolean) as string[]}
          size={16}
          className="h-4 w-8"
        />
      ),
      // Disable navigation when not enabled
      disabled: !TAB_ENABLED.dex,
    },
    {
      href: getCurrentChainNameHref('/staking'),
      label: 'Staking',
      icon: (
        <Image src="/icons/staking.svg" alt="staking" width={12} height={12} className="h-3 w-3" />
      ),
      rightIcon: (
        <ProjectLogoStack
          logos={STAKING_PROJECT_IDS.map((id) => STAKING_PROJECTS[id].icon)}
          size={16}
          className="h-4 w-8"
        />
      ),
      disabled: !TAB_ENABLED.staking,
    },
    {
      href: getCurrentChainNameHref('/launch-token'),
      label: 'Launch Token',
      icon: (
        <Image
          src="/icons/launch-token.svg"
          alt="launch-token"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      ),
      disabled: !TAB_ENABLED.launchToken,
    },
    {
      href: getCurrentChainNameHref('/lending'),
      label: 'Lending',
      icon: (
        <Image src="/icons/lending.svg" alt="lending" width={12} height={12} className="h-3 w-3" />
      ),
      rightIcon: (
        <ProjectLogoStack
          logos={
            LENDING_PROJECT_IDS.map((id) => LENDING_PROJECTS[id].icon).filter(Boolean) as string[]
          }
          size={16}
          className="h-4 w-[22px]"
        />
      ),
      disabled: !TAB_ENABLED.lending,
    },
    {
      href: getCurrentChainNameHref('/nad-fun'),
      label: 'Nad.Fun',
      icon: (
        <Image
          src="/icons/nad-fun.svg"
          alt="nad-fun"
          width={12}
          height={12}
          className="h-3 w-3 rounded-full"
        />
      ),
    },
    {
      href: getCurrentChainNameHref('/nad-name-service'),
      label: 'Nad Name Service',
      icon: (
        <Image
          src="/icons/nad-name-service.svg"
          alt="nad-name-service"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      ),
    },
  ];

  return {
    monadModulesItems,
    baseModulesItems,
    protocolItems,
  };
}

function createInitialMenuGroups(getCurrentChainNameHref: (href: string) => string): MenuGroup[] {
  const { monadModulesItems, protocolItems } = createMenuItemsConfig(getCurrentChainNameHref);

  return [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: getCurrentChainNameHref('/dashboard'),
      icon: (
        <Image
          src="/icons/metrics-gray.svg"
          alt="modules"
          width={12}
          height={12}
          className="h-5 w-5"
        />
      ),
      hoverIcon: (
        <Image src="/icons/metrics.svg" alt="modules" width={12} height={12} className="h-5 w-5" />
      ),
      isMenuItem: true,
      items: [],
    },
    {
      id: 'modules',
      label: 'Modules',
      icon: (
        <Image
          src="/icons/modules-gray.svg"
          alt="modules"
          width={12}
          height={12}
          className="h-5 w-5"
        />
      ),
      hoverIcon: (
        <Image src="/icons/modules.svg" alt="modules" width={12} height={12} className="h-5 w-5" />
      ),
      items: monadModulesItems,
      isMenuItem: false,
    },
    {
      id: 'protocols',
      label: 'Protocols',
      icon: (
        <Image
          src="/icons/protocols-gray.svg"
          alt="protocol"
          width={12}
          height={12}
          className="h-5 w-5"
        />
      ),
      hoverIcon: (
        <Image
          src="/icons/protocols.svg"
          alt="protocol"
          width={12}
          height={12}
          className="h-5 w-5"
        />
      ),
      items: protocolItems,
      isMenuItem: false,
    },
  ];
}

// Internal components
const MenuItemLink = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => {
  const [isHover, setIsHover] = useState(false);
  const isDisabled = !!item.disabled;
  const router = useRouter();

  return (
    <Link
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault();
          const isDex = item.href.includes('/dex');
          if (isDex) {
            const tradeHref = item.href.replace('/dex', '/trade');
            toast.warning('DEX coming soon. Redirecting to Trade');
            router.push(tradeHref);
          } else {
            toast.warning('Coming soon');
          }
        }
      }}
      href={item.href}
      className={cn(
        'flex p-[10px] relative items-center text-pro-gray overflow-visible rounded-md',
        (isActive || isHover) && 'bg-white text-primary',
        isDisabled && 'opacity-60 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'absolute h-6 w-[2px] bg-primary transition-all duration-300 -left-[11px]',
          isActive || isHover ? 'opacity-100' : 'opacity-0'
        )}
      />
      {isActive || isHover ? item.hoverIcon || item.icon : item.icon}
      <span className="ml-2 text-xs font-medium">{item.label}</span>
      {item.rightIcon && <div className="ml-auto">{item.rightIcon}</div>}
    </Link>
  );
};

// Utility functions
const isGroupActive = (group: MenuGroup, pathname: string): boolean => {
  return group.items.some((item) => item.href.startsWith(pathname) || pathname.includes(item.href));
};

const isItemActive = (item: MenuItem, pathname: string): boolean => {
  const itemHref = item.href.split('?')[0] || '';
  return itemHref?.startsWith(pathname) || pathname.includes(itemHref);
};

const ExpandedMenuItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => {
  const [isHover, setIsHover] = useState(false);
  const isDisabled = !!item.disabled;
  const router = useRouter();

  return (
    <SidebarMenuItem className="py-0 px-[10px]" key={item.href}>
      <Link
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={(e) => {
          if (isDisabled) {
            e.preventDefault();
            const isDex = item.href.includes('/dex');
            if (isDex) {
              const tradeHref = item.href.replace('/dex', '/trade');
              toast.warning('DEX coming soon. Redirecting to Trade');
              router.push(tradeHref);
            } else {
              toast.warning('Coming soon');
            }
          }
        }}
        href={item.href}
        className={cn(
          'flex p-[10px] relative items-center text-pro-gray overflow-visible rounded-md',
          (isActive || isHover) && 'bg-white text-primary',
          isDisabled && 'opacity-60 cursor-not-allowed'
        )}
      >
        {isActive || isHover ? item.hoverIcon || item.icon : item.icon}
        <span className="ml-2 text-sm font-medium">{item.label}</span>
      </Link>
    </SidebarMenuItem>
  );
};

const CollapsedMenuItem = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => {
  const [isHover, setIsHover] = useState(false);
  const isDisabled = !!item.disabled;
  const router = useRouter();

  return (
    <SidebarMenuItem key={item.href}>
      <SidebarMenuButton
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className={cn('ml-2', isActive ? 'text-primary bg-white' : 'text-pro-gray')}
      >
        <Link
          href={item.href}
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
              const isDex = item.href.includes('/dex');
              if (isDex) {
                const tradeHref = item.href.replace('/dex', '/trade');
                toast.warning('DEX coming soon. Redirecting to Trade');
                router.push(tradeHref);
              } else {
                toast.warning('Coming soon');
              }
            }
          }}
        >
          {isActive || isHover ? item.hoverIcon || item.icon : item.icon}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const ExpandedMenuGroup = ({ group, pathname }: { group: MenuGroup; pathname: string }) => {
  const [isHover, setIsHover] = useState(false);
  const groupIsActive = isGroupActive(group, pathname);

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup className="py-0 px-[10px]">
        <SidebarGroupLabel
          asChild
          className={cn(
            'h-10',
            isHover && 'text-primary bg-white',
            groupIsActive ? 'text-primary bg-white/60' : 'text-pro-gray'
          )}
        >
          <CollapsibleTrigger
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={cn('flex w-full items-center')}
          >
            {groupIsActive ? group.hoverIcon || group.icon : group.icon}
            <span className="ml-2 text-sm font-medium">{group.label}</span>
            <Minus className="ml-auto h-5 w-5 transition-transform hidden group-data-[state=open]/collapsible:inline-block" />
            <Plus className="ml-auto h-5 w-5 transition-transform inline-block group-data-[state=open]/collapsible:hidden" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenuSub className="pr-0 !mr-0 mt-2">
              {group.items.map((item) => (
                <SidebarMenuSubItem key={item.href}>
                  <SidebarMenuSubButton className="relative" asChild>
                    <MenuItemLink item={item} isActive={isItemActive(item, pathname)} />
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
};

const CollapsedMenuGroup = ({
  group,
  isMobile,
  pathname,
}: {
  group: MenuGroup;
  isMobile: boolean;
  pathname: string;
}) => {
  const groupIsActive = isGroupActive(group, pathname);
  const router = useRouter();

  return (
    <DropdownMenu>
      <SidebarMenuItem>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className={cn('ml-2', groupIsActive ? 'text-primary bg-white' : 'text-pro-gray')}
          >
            {group.icon}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
          className="min-w-56 rounded-lg"
        >
          {group.items.map((item) => (
            <DropdownMenuItem asChild key={item.href}>
              <Link
                href={item.href}
                className="flex items-center"
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                    const isDex = item.href.includes('/dex');
                    if (isDex) {
                      const tradeHref = item.href.replace('/dex', '/trade');
                      toast.warning('DEX coming soon. Redirecting to Trade');
                      router.push(tradeHref);
                    } else {
                      toast.warning('Coming soon');
                    }
                  }
                }}
              >
                {groupIsActive ? item.hoverIcon || item.icon : item.icon}
                <span className="ml-2">{item.label}</span>
                {item.rightIcon && <div className="ml-auto">{item.rightIcon}</div>}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </SidebarMenuItem>
    </DropdownMenu>
  );
};

export default function AppSidebar() {
  const { data: accountInfo } = useSelectedAccount();

  const pathname = usePathname();
  const isBasePath = BaseNetUrlPath.includes(pathname);

  const { open, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const { chainId } = useAppKitNetwork();
  const { currentVersion } = useVersionCheck({ enableAutoCheck: false });

  const getCurrentChainNameHref = useCallback(
    (href: string): string => {
      if (BaseNetUrlPath.includes(href)) {
        const chainName = NETWORK_TO_URL_PARAM[String(chainId)];
        if (chainName === 'monad') return href;
        return `${href}?chain=${chainName}`;
      }
      return `${href}?chain=monad`;
    },
    [chainId]
  );

  const memoGetCurrentChainNameHref = useCallback(
    (href: string): string => getCurrentChainNameHref(href),
    [getCurrentChainNameHref]
  );

  const { baseModulesItems } = useMemo(
    () => createMenuItemsConfig(memoGetCurrentChainNameHref),
    [memoGetCurrentChainNameHref]
  );

  const initialMenuGroups = useMemo(
    () => createInitialMenuGroups(memoGetCurrentChainNameHref),
    [memoGetCurrentChainNameHref]
  );

  const [menuGroups, setMenuGroup] = useState<MenuGroup[]>([]);

  // Handle window resize changes
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      if (
        windowWidth > WINDOW_BREAKPOINTS.MOBILE &&
        windowWidth < WINDOW_BREAKPOINTS.DESKTOP &&
        open
      ) {
        toggleSidebar();
      }

      if (windowWidth < WINDOW_BREAKPOINTS.MOBILE && !open) {
        toggleSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initialization

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open, toggleSidebar]);

  useEffect(() => {
    let groups: MenuGroup[] = [];

    if (isBasePath) {
      const isEth = chainId === NetworkConfigs.eth.id;

      let menuItems: MenuItem[] = baseModulesItems;
      if (isEth) {
        menuItems = baseModulesItems.filter((item) => !item.href.includes('badge-gallery'));
      }

      groups = [
        {
          id: 'modules',
          label: 'Modules',
          icon: (
            <Image
              src="/icons/modules-gray.svg"
              alt="modules"
              width={12}
              height={12}
              className="h-5 w-5"
            />
          ),
          hoverIcon: (
            <Image
              src="/icons/modules.svg"
              alt="modules"
              width={12}
              height={12}
              className="h-5 w-5"
            />
          ),
          items: menuItems,
          isMenuItem: false,
        },
      ];
    } else {
      groups = [...initialMenuGroups];
    }

    setMenuGroup(groups);
  }, [isBasePath, accountInfo?.sandbox_account, baseModulesItems, initialMenuGroups, chainId]);

  const MobileCloseButton = () => (
    <Button onClick={toggleSidebar} variant="ghost" size="icon" className="h-9 w-9 bg-transparent">
      <X className="h-5 w-5" />
    </Button>
  );

  // Close sidebar on mobile route changes
  useEffect(() => {
    const isInsideOdds = previousPathname.includes('/odds') && pathname.includes('/odds');
    const shouldCloseSidebar = previousPathname !== pathname && isMobile && open && !isInsideOdds;

    if (shouldCloseSidebar) {
      toggleSidebar();
    }

    previousPathname = pathname;
  }, [isMobile, open, pathname, toggleSidebar]);

  return (
    <Sidebar className="grid-sidebar-nav border-none" collapsible="icon">
      <SidebarHeader
        className={cn(
          'relative flex flex-row items-center justify-between py-2',
          !open && 'flex-col'
        )}
        style={{
          height: 'var(--height-navbar)',
        }}
      >
        <Link
          href={getCurrentChainNameHref('/')}
          className={cn('flex items-center justify-center')}
        >
          {open ? (
            <Image
              src="https://cdn.tadle.com/images/logo-black.svg"
              alt="logo"
              width={100}
              height={26}
              className=""
            />
          ) : (
            <Image src="/icons/logo-small.svg" alt="logo" width={30} height={30} className="" />
          )}
        </Link>
        {isMobile ? <MobileCloseButton /> : <SidebarTrigger className="text-muted-foreground/80" />}
      </SidebarHeader>

      <SidebarContent className="scrollbar-hover mt-[10px]">
        <SidebarMenu>
          {menuGroups.map((group) => {
            const itemIsActive = group.href ? isItemActive(group as MenuItem, pathname) : false;

            return group.isMenuItem ? (
              open ? (
                <ExpandedMenuItem
                  key={group.id}
                  item={{
                    ...group,
                    href: group.href || '',
                  }}
                  isActive={itemIsActive}
                />
              ) : (
                <CollapsedMenuItem
                  key={group.id}
                  item={{
                    ...group,
                    href: group.href || '',
                  }}
                  isActive={itemIsActive}
                />
              )
            ) : open ? (
              <ExpandedMenuGroup key={group.id} group={group} pathname={pathname} />
            ) : (
              <CollapsedMenuGroup
                key={group.id}
                group={group}
                isMobile={isMobile}
                pathname={pathname}
              />
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {open && <Version version={`v${currentVersion?.version || FALLBACK_APP_VERSION}`} />}
      </SidebarFooter>
    </Sidebar>
  );
}
