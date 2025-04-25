'use client';

import {
  BookOpen,
  ChevronDown,
  Circle,
  CircleUserRound,
  Cog,
  Mail,
  MessageCircle,
  Orbit,
  Package,
  ServerCog,
  Waypoints,
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
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

import { useSelectedAccount } from '@/lib/data/use-account';

import { ToggleTheme } from './toggle-theme';
import { Version } from './version';

const SOCIAL_LINKS = [
  { href: '', icon: Mail },
  { href: 'https://twitter.com/instadapp', icon: X },
  { href: 'https://discord.gg/instadapp', icon: MessageCircle },
  { href: 'https://docs.instadapp.io', icon: BookOpen },
];

// 定义菜单组类型
type MenuGroup = {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
  }>;
};

export default function AppSidebar() {
  const { data: accountInfo } = useSelectedAccount();
  const pathname = usePathname();
  const { open } = useSidebar();
  const isMobile = false; // 可以根据需要设置移动设备检测

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
        <Image src="/icons/apriori.svg" alt="aprior" width={20} height={20} className="h-4 w-4 filter grayscale" />
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
          className="h-4 w-4 rounded-full filter grayscale"
        />
      ),
    },
    {
      href: '/uniswap',
      label: 'Uniswap V3',
      icon: (
        <Image src="/icons/uniswap.svg" alt="uniswap" width={20} height={20} className="h-4 w-4 filter grayscale" />
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
          className="h-4 w-4 rounded-full filter grayscale"
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
          className="h-4 w-4 filter grayscale"
        />
      ),
    },
    {
      href: '/ambient',
      label: 'Ambient',
      icon: (
        <Image src="/icons/ambient.svg" alt="ambient" width={20} height={20} className="h-4 w-4 filter grayscale" />
      ),
    },
    {
      href: '/meme',
      label: 'Meme',
      icon: (
        <Image
          src="/icons/monad.svg"
          alt="meme"
          width={20}
          height={20}
          className="h-4 w-4 rounded-full filter grayscale"
        />
      ),
    },
    {
      href: '/curvance',
      label: 'Curvance',
      icon: (
        <Image
          src="/icons/curvance.svg"
          alt="curvance"
          width={20}
          height={20}
          className="h-4 w-4 filter grayscale"
        />
      ),
    },
  ];

  const utilitiesItems = [
    { href: '/authority', label: 'Authority', icon: <CircleUserRound className="h-4 w-4" /> },
  ];

  // 定义菜单组
  const menuGroups: MenuGroup[] = [
    {
      id: 'protocols',
      label: 'Protocols',
      icon: <ServerCog className="h-4 w-4" />,
      items: protocolItems,
    },
    {
      id: 'modules',
      label: 'Modules',
      icon: <Package className="h-4 w-4" />,
      items: modules,
    },
    {
      id: 'testnet',
      label: 'Testnet',
      icon: <Waypoints className="h-4 w-4" />,
      items: testnetItems,
    },
  ];

  // 条件渲染菜单组
  const renderMenuGroup = (group: MenuGroup) => {
    if (open) {
      return (
        <Collapsible key={group.id} defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center">
                {group.icon}
                <span className="ml-2">{group.label}</span>
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenuSub>
                  {group.items.map((item) => (
                    <SidebarMenuSubItem key={item.href}>
                      <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                        <Link href={item.href} className="flex items-center">
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      );
    } else {
      return (
        <DropdownMenu key={group.id}>
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
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="relative flex items-center justify-center py-4">
        <Link href="/" className="flex items-center justify-center">
          {open ? (
            <Image src="/icons/logo.svg" alt="logo" width={140} height={40} className="filter grayscale" />
          ) : (
            <Image src="/icons/logo-small.svg" alt="logo" width={30} height={30} className="filter grayscale" />
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="scrollbar-hover">
        <SidebarMenu>
          {menuGroups.map(renderMenuGroup)}

          {accountInfo?.sandbox_account && (
            <>
              {open ? (
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarGroup>
                    <SidebarGroupLabel asChild>
                      <CollapsibleTrigger className="flex w-full items-center">
                        <Cog className="h-4 w-4" />
                        <span className="ml-2">Utilities</span>
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </CollapsibleTrigger>
                    </SidebarGroupLabel>
                    <CollapsibleContent>
                      <SidebarGroupContent>
                        <SidebarMenuSub>
                          {utilitiesItems.map((item) => (
                            <SidebarMenuSubItem key={item.href}>
                              <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                                <Link href={item.href} className="flex items-center">
                                  {item.icon}
                                  <span className="ml-2">{item.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </SidebarGroupContent>
                    </CollapsibleContent>
                  </SidebarGroup>
                </Collapsible>
              ) : (
                <DropdownMenu>
                  <SidebarMenuItem>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ml-2">
                        <Cog className="h-4 w-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side={isMobile ? 'bottom' : 'right'}
                      align={isMobile ? 'end' : 'start'}
                      className="min-w-56 rounded-lg"
                    >
                      {utilitiesItems.map((item) => (
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
              )}
            </>
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
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
        <ToggleTheme isCollapsed={!open} />
        {open && <Version version="v0.1.0" />}
      </SidebarFooter>
    </Sidebar>
  );
}
