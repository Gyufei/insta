'use client';

import {
  BookOpen,
  Circle,
  CircleUserRound,
  Codesandbox,
  Mail,
  MessageCircle,
  Minus,
  Orbit,
  Plus,
  X,
} from 'lucide-react';

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

// 常量定义
const SOCIAL_LINKS = [
  { href: '', icon: Mail },
  { href: 'https://twitter.com/instadapp', icon: X },
  { href: 'https://discord.gg/instadapp', icon: MessageCircle },
  { href: 'https://docs.instadapp.io', icon: BookOpen },
];

// 组件定义
const MenuItemLink = ({ item, isActive }: { item: MenuItem; isActive: boolean }) => (
  <Link
    href={item.href}
    className={cn(
      'flex p-[10px] relative items-center overflow-visible rounded-md',
      isActive && 'bg-accent/20'
    )}
  >
    <div
      className={cn(
        'absolute h-6 w-[2px] bg-primary transition-all duration-300 -left-[11px]',
        isActive ? 'opacity-100' : 'opacity-0'
      )}
    />
    {item.icon}
    <span className="ml-2 text-xs font-medium">{item.label}</span>
  </Link>
);

const ExpandedMenuGroup = ({ group, pathname }: { group: MenuGroup; pathname: string }) => (
  <Collapsible defaultOpen className="group/collapsible">
    <SidebarGroup>
      <SidebarGroupLabel asChild>
        <CollapsibleTrigger className="flex w-full items-center group-data-[state=open]/collapsible:text-primary text-muted-foreground/80 group-data-[state=open]/collapsible:bg-accent/20">
          {group.icon}
          <span className="ml-2 text-sm font-medium">{group.label}</span>
          <Minus className="ml-auto h-5 w-5 transition-transform group-data-[state=open]/collapsible:hidden" />
          <Plus className="ml-auto h-5 w-5 transition-transform hidden group-data-[state=open]/collapsible:inline-block" />
        </CollapsibleTrigger>
      </SidebarGroupLabel>
      <CollapsibleContent>
        <SidebarGroupContent>
          <SidebarMenuSub className='pr-0 !mr-0 mt-2'>
            {group.items.map((item) => (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton
                  className="relative"
                  asChild
                  isActive={pathname === item.href}
                >
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

const CollapsedMenuGroup = ({ group, isMobile }: { group: MenuGroup; isMobile: boolean }) => (
  <DropdownMenu>
    <SidebarMenuItem>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ml-2">
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

export default function AppSidebar() {
  const { data: accountInfo } = useSelectedAccount();
  const pathname = usePathname();
  const { open } = useSidebar();
  const isMobile = false;

  const testnetItems = [{ href: '/faucet', label: 'Faucet', icon: <Orbit className="h-4 w-4" /> }];

  const modules = [
    {
      href: 'https://odds.tadle.com/',
      label: 'Odds',
      icon: <Circle className="h-4 w-4" />,
    },
  ];

  const protocolItems = [
    {
      href: '/apriori',
      label: 'Apriori',
      icon: (
        <Image src="/icons/apriori.svg" alt="aprior" width={20} height={20} className="h-4 w-4" />
      ),
    },
    {
      href: '/nad-fun',
      label: 'Nad.Fun',
      icon: (
        <Image
          src="/icons/nad-fun.svg"
          alt="nad-fun"
          width={20}
          height={20}
          className="h-4 w-4 rounded-full"
        />
      ),
    },
    {
      href: '/uniswap',
      label: 'Uniswap V3',
      icon: (
        <Image src="/icons/uniswap.svg" alt="uniswap" width={20} height={20} className="h-4 w-4" />
      ),
    },
    {
      href: '/magma',
      label: 'Magma',
      icon: (
        <Image
          src="/icons/magma.jpg"
          alt="magma"
          width={20}
          height={20}
          className="h-4 w-4 rounded-full"
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
          width={20}
          height={20}
          className="h-4 w-4"
        />
      ),
    },
    {
      href: '/ambient',
      label: 'Ambient',
      icon: (
        <Image src="/icons/ambient.svg" alt="ambient" width={20} height={20} className="h-4 w-4" />
      ),
    },
  ];

  const utilitiesItems = [
    { href: '/authority', label: 'Authority', icon: <CircleUserRound className="h-4 w-4" /> },
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
      items: modules,
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
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn(
          'relative flex flex-row border-b border-border items-center justify-between py-2',
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
              <CollapsedMenuGroup key={group.id} group={group} isMobile={isMobile} />
            )
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div
          className={`flex w-full items-center justify-center ${!open ? 'flex-col space-y-3' : 'space-x-4'}`}
        >
          {SOCIAL_LINKS.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:hover:text-primary-foreground flex h-4 w-4 items-center justify-center"
            >
              <link.icon className="h-full" />
            </a>
          ))}
        </div>
        {open && <Version version="v0.1.0" />}
      </SidebarFooter>
    </Sidebar>
  );
}
