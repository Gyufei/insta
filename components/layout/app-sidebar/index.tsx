'use client';

import { Circle, CircleUserRound, Codesandbox, Minus, Orbit, Plus } from 'lucide-react';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

import { Version } from './version';

// 类型定义
type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type MenuGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: MenuItem[];
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
        isActive && 'bg-white text-primary',
        isHover && 'bg-white text-primary'
      )}
    >
      <div
        className={cn(
          'absolute h-6 w-[2px] bg-primary transition-all duration-300 -left-[11px]',
          isActive || isHover ? 'opacity-100' : 'opacity-0'
        )}
      />
      {item.icon}
      <span className="ml-2 text-xs font-medium">{item.label}</span>
    </Link>
  );
}

function checkIsGroupActive(group: MenuGroup, pathname: string) {
  return group.items.some((item) => pathname.includes(item.href));
}

const ExpandedMenuGroup = ({ group, pathname }: { group: MenuGroup; pathname: string }) => {
  const isGroupActive = checkIsGroupActive(group, pathname);

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup className="py-0 px-[10px]">
        <SidebarGroupLabel
          asChild
          className={cn('h-10', isGroupActive ? 'text-primary bg-white' : 'text-pro-gray')}
        >
          <CollapsibleTrigger className={cn('flex w-full items-center')}>
            {group.icon}
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
                    <MenuItemLink item={item} isActive={pathname === item.href} />
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
                {item.icon}
                <span className="ml-2">{item.label}</span>
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
  const { open } = useSidebar();
  const isMobile = false;

  const testnetItems = [{ href: '/faucet', label: 'Faucet', icon: <Orbit className="h-3 w-3" /> }];

  const modulesItems = [
    {
      href: '/odds',
      label: 'Odds',
      icon: <Circle className="h-3 w-3" />,
    },
  ];

  const protocolItems = [
    {
      href: '/apriori',
      label: 'Apriori',
      icon: (
        <Image src="/icons/apriori.svg" alt="aprior" width={12} height={12} className="h-3 w-3" />
      ),
    },
    {
      href: '/nad-fun',
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
      href: '/uniswap',
      label: 'Uniswap V3',
      icon: (
        <Image src="/icons/uniswap.svg" alt="uniswap" width={12} height={12} className="h-3 w-3" />
      ),
    },
    {
      href: '/magma',
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
      href: '/nad-name-server',
      label: 'Nad Name Server',
      icon: (
        <Image
          src="/icons/nad-name-server.svg"
          alt="nad-name-server"
          width={12}
          height={12}
          className="h-3 w-3"
        />
      ),
    },
    {
      href: '/ambient',
      label: 'Ambient',
      icon: (
        <Image src="/icons/ambient.svg" alt="ambient" width={12} height={12} className="h-3 w-3" />
      ),
    },
  ];

  const utilitiesItems = [
    { href: '/authority', label: 'Authority', icon: <CircleUserRound className="h-3 w-3" /> },
  ];

  const menuGroups: MenuGroup[] = [
    {
      id: 'protocols',
      label: 'Protocols',
      icon: <Codesandbox className="h-5 w-5" />,
      items: protocolItems,
    },
    {
      id: 'modules',
      label: 'Modules',
      icon: <Codesandbox className="h-5 w-5" />,
      items: modulesItems,
    },
    {
      id: 'testnet',
      label: 'Testnet',
      icon: <Codesandbox className="h-5 w-5" />,
      items: testnetItems,
    },
  ];

  if (accountInfo?.sandbox_account) {
    menuGroups.push({
      id: 'utilities',
      label: 'Utilities',
      icon: <Codesandbox className="h-5 w-5" />,
      items: utilitiesItems,
    });
  }

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
        <Link href="/" className={cn('flex items-center justify-center')}>
          {open ? (
            <Image src="/icons/logo.svg" alt="logo" width={100} height={26} className="" />
          ) : (
            <Image src="/icons/logo-small.svg" alt="logo" width={30} height={30} className="" />
          )}
        </Link>
        <SidebarTrigger className="text-muted-foreground/80" />
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
