'use client';

import { EditIcon } from 'lucide-react';

import Image from 'next/image';

import { NumberInput } from '@/components/common/number-input';
import { DepositIcon } from '@/components/icon/deposit';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function TokenStation() {
  return (
    <>
      <div className="my-4 px-4 2xl:px-12">
        <div className="flex justify-between flex-1 gap-0 shadow-none">
          {/* 左侧：From */}
          <Card className="flex-1 p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">From:</span>
              <span className="text-xs bg-muted/40 rounded px-2 py-1 flex items-center gap-1">
                2er6d...8dfg2
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 mb-2">
              {/* Token 选择 */}
              <Select defaultValue="AVAX">
                <SelectTrigger className="w-fit">
                  <div className="flex items-center gap-2">
                    <Image src="/avax.svg" alt="avax" width={20} height={20} />
                    <SelectValue>AVAX</SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAX">AVAX</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xl text-muted-foreground">/</span>
              <Badge variant="outline" className="ml-2 text-red-500 border-red-500 bg-transparent">
                Base
              </Badge>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-xs text-muted-foreground flex justify-between mb-1">
                <span>You pay:</span>
                <span>
                  Available: 23,489.89{' '}
                  <span className="text-green-500 cursor-pointer ml-1">MAX</span>
                </span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <NumberInput
                  className="!text-4xl bg-transparent border-none p-0 shadow-none focus-visible:ring-0 w-full"
                  value="7695.89"
                />
                <span className="text-muted-foreground text-lg">~$24.345</span>
              </div>
            </div>
          </Card>
          {/* 中间分割箭头 */}
          <div className="flex justify-center items-center px-2 -mx-[32px] z-10">
            <div className="rounded-full bg-card shadow-lg p-2 border border-border">
              <DepositIcon />
            </div>
          </div>
          {/* 右侧：To */}
          <Card className="flex-1 p-6 flex flex-col gap-4 min-w-[350px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">To:</span>
              <span className="text-xs bg-muted/40 rounded px-2 py-1 flex items-center gap-1">
                7ed2k...8dbv1
                <EditIcon className="w-4 h-4" />
              </span>
            </div>
            <div className="flex justify-between items-center gap-2 mb-2">
              <Select defaultValue="USDC">
                <SelectTrigger className="w-fit">
                  <div className="flex items-center gap-2">
                    <Image src="/usdc.svg" alt="usdc" width={20} height={20} />
                    <SelectValue>USDC</SelectValue>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xl text-muted-foreground">/</span>
              <Badge variant="outline" className="ml-2 text-red-500 border-red-500 bg-transparent">
                Monad
              </Badge>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-xs text-muted-foreground flex justify-between mb-1">
                <span>You receive:</span>
                <span>Balance: 7,575.93</span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <NumberInput
                  className="!text-4xl bg-transparent border-none p-0 shadow-none focus-visible:ring-0 w-full"
                  value="83924.43"
                />
                <span className="text-muted-foreground text-lg">~$24.345</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-between items-center mx-auto mt-2">
          <div className="flex flex-col justify-between w-full text-xs text-muted-foreground px-2 mb-2">
            <span>1 AVAX = 31.3125 USDT</span>
            <span>No Fees</span>
          </div>
          <Button className="h-12 text-lg font-semibold rounded-xl" size="lg">
            Create swap
          </Button>
        </div>
      </div>
    </>
  );
}
