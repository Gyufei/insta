'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import { CircleUserRound, Codesandbox, Minus, Plus, X } from 'lucide-react';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { NetworkConfigs } from '@/config/network-config';

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

import { useSelectedAccount } from '@/lib/data/use-account';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/lib/utils/use-mobile';

import { Version } from './version';

// 类型定义
type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  hoverIcon?: React.ReactNode;
};

type MenuGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  hoverIcon?: React.ReactNode;
  items: MenuItem[];
};

const BaseNetUrlPath = ['/token-station', '/badge-gallery'];

const NETWORK_TO_URL_PARAM: Record<string, string> = {
  [String(NetworkConfigs.monadTestnet.id)]: 'monad',
  [String(NetworkConfigs.base.id)]: 'base',
  [String(NetworkConfigs.eth.id)]: 'eth',
};

// 组件定义
function MenuItemLink({ item, isActive }: { item: MenuItem; isActive: boolean }) {
  const [isHover, setIsHover] = useState(false);

  return (
    <Link
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      href={item.href}
      className={cn(
        'flex p-[10px] relative items-center text-pro-gray overflow-visible rounded-md',
        (isActive || isHover) && 'bg-white text-primary'
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
    </Link>
  );
}

function checkIsGroupActive(group: MenuGroup, pathname: string) {
  return group.items.some((item) => item.href.startsWith(pathname) || pathname.includes(item.href));
}

const ExpandedMenuGroup = ({ group, pathname }: { group: MenuGroup; pathname: string }) => {
  const [isHover, setIsHover] = useState(false);
  const isGroupActive = checkIsGroupActive(group, pathname);

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup className="py-0 px-[10px]">
        <SidebarGroupLabel
          asChild
          className={cn(
            'h-10',
            isHover && 'text-primary bg-white',
            isGroupActive ? 'text-primary bg-white/60' : 'text-pro-gray'
          )}
        >
          <CollapsibleTrigger
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            className={cn('flex w-full items-center')}
          >
            {isGroupActive ? group.hoverIcon || group.icon : group.icon}
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
                    <MenuItemLink
                      item={item}
                      isActive={item.href.startsWith(pathname) || pathname.includes(item.href)}
                    />
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
  const isGroupActive = checkIsGroupActive(group, pathname);

  return (
    <DropdownMenu>
      <SidebarMenuItem>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            className={cn('ml-2', isGroupActive ? 'text-primary bg-white' : 'text-pro-gray')}
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
              <Link href={item.href} className="flex items-center">
                {isGroupActive ? item.hoverIcon || item.icon : item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </SidebarMenuItem>
    </DropdownMenu>
  );
};

let prevPath = '';

export default function AppSidebar() {
  const { data: accountInfo } = useSelectedAccount();

  const pathname = usePathname();
  const isBasePath = BaseNetUrlPath.includes(pathname);

  const { open, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  const { chainId } = useAppKitNetwork();

  function getCurrentChainNameHref(href: string) {
    if (BaseNetUrlPath.includes(href)) {
      const chainName = NETWORK_TO_URL_PARAM[String(chainId)];
      if (chainName === 'monad') return href;
      return `${href}?chain=${chainName}`;
    }

    return `${href}?chain=monad`;
  }

  const testnetItems = [
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
    },
  ];

  const monadModulesItems = [
    {
      href: getCurrentChainNameHref('/trade'),
      label: 'Trade',
      icon: (
        <Image src="/icons/trade-gray.svg" alt="trade" width={12} height={12} className="h-3 w-3" />
      ),
      hoverIcon: (
        <Image src="/icons/trade.svg" alt="trade" width={12} height={12} className="h-3 w-3" />
      ),
    },
    {
      href: getCurrentChainNameHref('/odds'),
      label: 'Odds',
      icon: (
        <Image src="/icons/odds-gray.svg" alt="odds" width={12} height={12} className="h-3 w-3" />
      ),
      hoverIcon: (
        <Image src="/icons/odds.svg" alt="odds" width={12} height={12} className="h-3 w-3" />
      ),
    },
    // {
    //   href: '/c2c',
    //   label: 'C2C',
    //   icon: <Circle className="h-3 w-3" />,
    // },
  ];

  const baseModulesItems = [
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

  const protocolItems = [
    {
      href: getCurrentChainNameHref('/uniswap'),
      label: 'Uniswap V3',
      icon: (
        <Image src="/icons/uniswap.svg" alt="uniswap" width={12} height={12} className="h-3 w-3" />
      ),
    },
    {
      href: getCurrentChainNameHref('/apriori'),
      label: 'Apriori',
      icon: (
        <Image src="/icons/apriori.svg" alt="aprior" width={12} height={12} className="h-3 w-3" />
      ),
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
      href: getCurrentChainNameHref('/magma'),
      label: 'Magma',
      icon: (
        <Image
          src="/icons/magma.jpg"
          alt="magma"
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
    {
      href: getCurrentChainNameHref('/ambient'),
      label: 'Ambient',
      icon: (
        <Image src="/icons/ambient.svg" alt="ambient" width={12} height={12} className="h-3 w-3" />
      ),
    },
  ];

  const utilitiesItems = [
    {
      href: getCurrentChainNameHref('/authority'),
      label: 'Authority',
      icon: <CircleUserRound className="h-3 w-3" />,
    },
  ];

  const initGroup = [
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
    },
    {
      id: 'testnet',
      label: 'Testnet',
      icon: (
        <Image
          src="/icons/testnet-gray.svg"
          alt="testnet"
          width={12}
          height={12}
          className="h-5 w-5"
        />
      ),
      hoverIcon: (
        <Image src="/icons/testnet.svg" alt="testnet" width={12} height={12} className="h-5 w-5" />
      ),
      items: testnetItems,
    },
  ];

  const [menuGroups, setMenuGroup] = useState<MenuGroup[]>([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && window.innerWidth < 1440 && open) {
        toggleSidebar(); // 折叠侧边栏
      }

      if (window.innerWidth < 768 && !open) {
        toggleSidebar(); // 展开侧边栏
      }
    };

    window.addEventListener('resize', handleResize);

    // 初始化时检查窗口大小
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let groups: MenuGroup[] = [];
    if (isBasePath) {
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
          items: baseModulesItems,
        },
      ];
    } else {
      groups = groups.concat(...initGroup);

      if (accountInfo?.sandbox_account) {
        groups.push({
          id: 'utilities',
          label: 'Utilities',
          icon: <Codesandbox className="h-5 w-5" />,
          items: utilitiesItems,
        });
      }
    }

    setMenuGroup(groups);
  }, [isBasePath, accountInfo?.sandbox_account]);

  function MobileCloseBtn() {
    return (
      <Button
        onClick={() => toggleSidebar()}
        variant="ghost"
        size="icon"
        className="h-9 w-9 bg-transparent"
      >
        <X className="h-5 w-5" />
      </Button>
    );
  }

  useEffect(() => {
    const isInsideOdd = prevPath.includes('/odds') && pathname.includes('/odds');
    const isInsideC2C = prevPath.includes('/c2c') && pathname.includes('/c2c');

    if (prevPath !== pathname && isMobile && open && !isInsideOdd && !isInsideC2C) {
      toggleSidebar();
    }

    prevPath = pathname;
  }, [isMobile, open, pathname]);

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
        {isMobile ? <MobileCloseBtn /> : <SidebarTrigger className="text-muted-foreground/80" />}
      </SidebarHeader>

      <SidebarContent className="scrollbar-hover mt-[10px]">
        <SidebarMenu>
          {menuGroups.map((group) =>
            open ? (
              <ExpandedMenuGroup key={group.id} group={group} pathname={pathname} />
            ) : (
              <CollapsedMenuGroup
                key={group.id}
                group={group}
                isMobile={isMobile}
                pathname={pathname}
              />
            )
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>{open && <Version version="v0.1.0" />}</SidebarFooter>
    </Sidebar>
  );
}
