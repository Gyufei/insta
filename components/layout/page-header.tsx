'use client';

import { ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function Header({ title }: { title: string }) {
  return (
    <header className="border-grey-light dark:border-dark-600 2xl:dark:bg-dark-500 flex flex-wrap items-center justify-between gap-4 border-b px-4 py-4 sm:flex-nowrap 2xl:px-12 2xl:py-[20.5px]">
      <div className="flex items-center">
        <Image src="/icons/aave.svg" alt="Aave Logo" className="mr-2" width={40} height={40} />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        <Button
          variant="outline"
          className="bg-ocean-blue-pure/10 dark:text-ocean-blue-pale dark:bg-ocean-blue-pure/17 hover:bg-ocean-blue-pure/25 focus:bg-ocean-blue-pure/25 active:bg-ocean-blue-pure/30 dark:active:bg-ocean-blue-pure/38 dark:hover:bg-ocean-blue-pure/25 dark:focus:bg-ocean-blue-pure/25 text-ocean-blue-pure hover:text-ocean-blue-pure flex w-18 flex-shrink-0 cursor-pointer items-center justify-center rounded-sm py-2 text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50 2xl:w-[92px]"
        >
          <div className="leading-5">Connect</div>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 cursor-pointer border-gray-200 px-3 py-1"
            >
              <div className="flex items-center space-x-2">
                <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full">
                  <span className="text-[10px] text-white">E</span>
                </div>
                <span className="text-sm font-medium">Mainnet</span>
                <ChevronDown size={16} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <div className="flex items-center space-x-2">
                <div className="bg-primary flex h-5 w-5 items-center justify-center rounded-full">
                  <span className="text-[10px] text-white">E</span>
                </div>
                <span className="text-sm">Mainnet</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center space-x-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#6f41d8]">
                  <span className="text-[10px] text-white">P</span>
                </div>
                <span className="text-sm">Polygon</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center space-x-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4a8d]">
                  <span className="text-[10px] text-white">A</span>
                </div>
                <span className="text-sm">Arbitrum</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer text-gray-400 hover:text-gray-600"
        >
          <Settings size={18} />
        </Button>
      </div>
    </header>
  );
}
