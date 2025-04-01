'use client';

import { ChevronDown, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function Header({ title }: { title: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-grey-light px-4 py-4 dark:border-dark-600 sm:flex-nowrap xxl:px-12 xxl:py-[20.5px] xxl:dark:bg-dark-500">
      <div className="flex items-center">
        <Image src="/icons/vault.svg" alt="Aave Logo" className="mr-2" width={40} height={40} />
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
        <Button variant="outline" className="bg-blue-50 text-primary border-blue-100 hover:bg-blue-100 font-medium">
          Connect
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="py-1 px-3 h-9 border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
                  <span className="text-white text-[10px]">E</span>
                </div>
                <span className="text-sm font-medium">Mainnet</span>
                <ChevronDown size={16} />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
                  <span className="text-white text-[10px]">E</span>
                </div>
                <span className="text-sm">Mainnet</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#6f41d8]">
                  <span className="text-white text-[10px]">P</span>
                </div>
                <span className="text-sm">Polygon</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#ff4a8d]">
                  <span className="text-white text-[10px]">A</span>
                </div>
                <span className="text-sm">Arbitrum</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600">
          <Settings size={18} />
        </Button>
      </div>
    </header>
  );
}
