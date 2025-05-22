'use client';

import { useState } from 'react';

import Image from 'next/image';

import { NetworkConfigs } from '@/config/network-config';

import { NumberInput } from '@/components/common/number-input';
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
import { Separator } from '@/components/ui/separator';

import { formatAddress } from '@/lib/utils';

import { STATION_FROM_TOKENS, STATION_TO_TOKENS } from './station-config';

export function TokenStation() {
  const [tokenFrom, setTokenFrom] = useState(STATION_FROM_TOKENS[0]);
  const [tokenTo, setTokenTo] = useState(STATION_TO_TOKENS[0]);

  function handleFromMax() {
    return;
  }

  return (
    <>
      <div className="px-4 2xl:px-12">
        <div className="flex justify-between flex-1 gap-0 shadow-none">
          {/* 左侧：From */}
          <Card className="flex-1 p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-base text-[#131e40] font-normal">From:</span>
              <AddressBlock address="2er6d...8dfg2" />
            </div>

            <div className="flex justify-between items-center gap-[10px]">
              <div className="flex-1 flex flex-col gap-[10px]">
                <div className="text-sm text-[#A5ADC6] font-normal">Token</div>
                <Select
                  value={tokenFrom.symbol}
                  onValueChange={(value) => {
                    const selectedToken = STATION_FROM_TOKENS.find(
                      (token) => token.symbol === value
                    );
                    if (selectedToken) {
                      setTokenFrom(selectedToken);
                    }
                  }}
                >
                  <SelectTrigger className="w-full focus-visible:ring-0">
                    <div className="flex items-center gap-2">
                      <Image src={tokenFrom.logo} alt={tokenFrom.symbol} width={20} height={20} />
                      <SelectValue>{tokenFrom.symbol}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {STATION_FROM_TOKENS.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <Image src={token.logo} alt={token.symbol} width={20} height={20} />
                          {token.symbol}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-full flex items-end pb-3">
                <span className="text-xs text-[#909399]">/</span>
              </div>
              <div className="flex-1 flex flex-col gap-[10px]">
                <div className="text-sm text-[#A5ADC6] font-normal">Network</div>
                <div className="w-full h-9 flex justify-start items-center border-[#00000010] border gap-2 rounded-md px-2 py-1">
                  <Image src={NetworkConfigs.base.icon} alt="base" width={20} height={20} />
                  <span>{NetworkConfigs.base.name}</span>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col justify-center gap-[10px]">
              <div className="flex justify-between items-center font-normal">
                <span className="text-base text-[#131e40] ">You pay:</span>
                <span className="text-xs text-[#A5ADC6]">
                  {tokenFrom.symbol}: 222.332
                  <span
                    className="text-[#6E75F9] cursor-pointer ml-1 font-medium"
                    onClick={handleFromMax}
                  >
                    MAX
                  </span>
                </span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <NumberInput
                  className="!text-[32px] !font-medium !text-[#131E40] bg-transparent border-none h-10 p-0 shadow-none focus-visible:ring-0 w-full"
                  value="7695.89"
                />
                <span className="text-[#A5ADC6] text-sm font-normal">~$24.345</span>
              </div>
            </div>
          </Card>

          <div className="flex justify-center items-center px-2 -mx-[20px] z-10">
            <div className="border border-[#ebebeb] rounded-md h-10 w-10 flex items-center justify-center bg-white">
              <Image src="/icons/switch.svg" alt="switch" width={20} height={20} />
            </div>
          </div>

          <Card className="flex-1 p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-base text-[#131e40] font-normal">To:</span>
              <AddressBlock withEdit onClick={() => {}} address="2er6d...8dfg2" />
            </div>

            <div className="flex justify-between items-center gap-[10px]">
              <div className="flex-1 flex flex-col gap-[10px]">
                <div className="text-sm text-[#A5ADC6] font-normal">Token</div>
                <Select
                  value={tokenTo.symbol}
                  onValueChange={(value) => {
                    const selectedToken = STATION_TO_TOKENS.find((token) => token.symbol === value);
                    if (selectedToken) {
                      setTokenTo(selectedToken);
                    }
                  }}
                >
                  <SelectTrigger className="w-full focus-visible:ring-0">
                    <div className="flex items-center gap-2">
                      <Image src={tokenTo.logo} alt={tokenTo.symbol} width={20} height={20} />
                      <SelectValue>{tokenTo.symbol}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {STATION_TO_TOKENS.map((token) => (
                      <SelectItem key={token.symbol} value={token.symbol}>
                        <div className="flex items-center gap-2">
                          <Image src={token.logo} alt={token.symbol} width={20} height={20} />
                          {token.symbol}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="h-full flex items-end pb-3">
                <span className="text-xs text-[#909399]">/</span>
              </div>
              <div className="flex-1 flex flex-col gap-[10px]">
                <div className="text-sm text-[#A5ADC6] font-normal">Network</div>
                <div className="w-full h-9 flex justify-start items-center border-[#00000010] border gap-2 rounded-md px-2 py-1">
                  <Image
                    src={NetworkConfigs.monadTestnet.icon}
                    alt="monad"
                    width={20}
                    height={20}
                  />
                  <span>{NetworkConfigs.monadTestnet.name}</span>
                </div>
              </div>
            </div>

            <Separator className="my-2" />
            <div className="flex flex-col justify-center gap-[10px]">
              <div className="flex justify-between items-center font-normal">
                <span className="text-base text-[#131e40]">You receive:</span>
                <span className="text-xs text-[#A5ADC6]">{tokenTo.symbol}: 7,575.93</span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <NumberInput
                  className="!text-[32px] !font-medium !text-[#131E40] bg-transparent border-none h-10 p-0 shadow-none focus-visible:ring-0 w-full"
                  value="83924.43"
                />
                <span className="text-[#A5ADC6] text-sm font-normal">~$24.345</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end items-center mt-5">
          <Button className="h-8 text-sm font-medium flex items-center justify-center rounded-md bg-[#6E75F9] text-white hover:bg-[#6E75F990]">
            Create swap &gt;&gt;
          </Button>
        </div>
      </div>
    </>
  );
}

function AddressBlock({
  address,
  onClick = () => {},
  withEdit = false,
}: {
  address: string;
  onClick?: () => void;
  withEdit?: boolean;
}) {
  const addressShort = formatAddress(address, { prefix: 5, suffix: 5 });

  return (
    <div className="text-xs h-8 flex items-center font-normal text-[#131e40] rounded-md px-[10px] border border-[#00000010] py-1 gap-1">
      <span>{addressShort}</span>
      {withEdit && (
        <Image
          className="cursor-pointer"
          onClick={onClick}
          src="/icons/edit.svg"
          alt="edit"
          width={16}
          height={16}
        />
      )}
    </div>
  );
}
