'use client';

import { Loader } from 'lucide-react';
import { divide, multiply, utils } from 'safebase';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import { NetworkConfigs } from '@/config/network-config';

import { NumberInput } from '@/components/common/number-input';
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
import { Skeleton } from '@/components/ui/skeleton';

import { useCheckAllowance } from '@/lib/data/use-check-allowance';
import { useTokenStationPrice } from '@/lib/data/use-token-station-price';
import { useTokenStationSwap } from '@/lib/data/use-token-station-swap';
import { cn, formatAddress } from '@/lib/utils';
import { useWalletTokenBalance } from '@/lib/web3/use-wallet-token-balance';

import { STATION_FROM_TOKENS, STATION_TO_TOKENS } from './station-config';

export function TokenStation() {
  const { address } = useAccount();

  const [tokenFrom, setTokenFrom] = useState(STATION_FROM_TOKENS[0]);
  const [tokenTo, setTokenTo] = useState(STATION_TO_TOKENS[0]);

  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState('0');

  const [toAddress, setToAddress] = useState(address || '');

  const { balance: fromBalance, isPending: isFromBalancePending } = useWalletTokenBalance(
    tokenFrom.address
  );
  const { balance: toBalance, isPending: isToBalancePending } = useWalletTokenBalance(
    tokenTo.address
  );

  const {
    allowance: fromAllowance,
    isLoading: isFromAllowanceLoading,
    handleApprove: handleFromApprove,
    isApproving: isFromApproving,
  } = useCheckAllowance('tokenStation', tokenFrom.symbol);

  const { data: priceData } = useTokenStationPrice();

  const { mutate: swap, isPending: isSwapPending } = useTokenStationSwap();

  const ETHPrice = useMemo(() => {
    if (!priceData) return '0';
    return priceData.eth_price;
  }, [priceData]);

  const monPrice = useMemo(() => {
    if (!priceData) return '0';
    return priceData.mon_price;
  }, [priceData]);

  const isFromIsETH = useMemo(() => {
    return tokenFrom.symbol === 'ETH';
  }, [tokenFrom.symbol]);

  const fromPrice = useMemo(() => {
    if (isFromIsETH) {
      return ETHPrice;
    }
    return 1;
  }, [isFromIsETH, ETHPrice]);

  const toPrice = useMemo(() => {
    if (tokenTo.symbol === 'MONAD') {
      return monPrice;
    }
    return 1;
  }, [tokenTo.symbol, monPrice]);

  const fromValue = useMemo(() => {
    if (!fromAmount) return '0';
    return multiply(fromAmount, String(fromPrice));
  }, [fromAmount, fromPrice]);

  const toValue = useMemo(() => {
    if (!toAmount) return '0';
    return multiply(toAmount, String(toPrice));
  }, [toAmount, toPrice]);

  const shouldApprove = useMemo(() => {
    if (!fromAllowance) return true;
    return Number(fromAllowance) < Number(fromValue);
  }, [fromAllowance, fromValue]);

  function handleFromMax() {
    setFromAmount(fromBalance);
    return;
  }

  function handleFromChange(value: string) {
    setFromAmount(value);

    if (value === '0') {
      setToAmount('0');
      return;
    }

    const amount = divide(multiply(value, String(fromPrice)), String(toPrice));
    const withSlippage = utils.roundResult(multiply(amount, String(0.99)), 8);
    setToAmount(withSlippage);
  }

  function handleToChange(value: string) {
    setToAmount(value);

    if (value === '0') {
      setFromAmount('0');
      return;
    }

    const amount = divide(multiply(value, String(toPrice)), String(fromPrice));
    const withSlippage = utils.roundResult(multiply(amount, String(1.01)), 8);
    setFromAmount(withSlippage.toString());
  }

  function handleConfirm() {
    if (shouldApprove) {
      handleFromApprove();
    } else {
      handleSwap();
    }
  }

  function handleSwap() {
    console.log('handleSwap');
    if (Number(fromAmount) > Number(fromBalance)) {
      toast.error('Insufficient balance');
      return;
    }

    swap({
      token_name: tokenFrom.symbol,
      amount_in: fromAmount,
      min_amount_out: toAmount,
    });
  }

  return (
    <>
      <div className="px-4 2xl:px-12">
        <div className="flex justify-between flex-1 gap-0 shadow-none">
          {/* 左侧：From */}
          <Card className="flex-1 p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-base text-[#131e40] font-normal">From:</span>
              <AddressBlock address={address || ''} />
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
                <span className="text-sm text-[#A5ADC6]">
                  {tokenFrom.symbol}:{' '}
                  {isFromBalancePending ? (
                    <Skeleton className="w-10 h-4" />
                  ) : (
                    <span>{fromBalance}</span>
                  )}
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
                  className={cn(
                    '!text-[32px] !font-medium bg-transparent border-none h-10 p-0 shadow-none focus-visible:ring-0 w-full',
                    Number(fromAmount) < Number(fromBalance) ? '!text-red' : '!text-[#131E40]'
                  )}
                  value={fromAmount}
                  onChange={handleFromChange}
                />
                <span className="text-[#A5ADC6] text-sm font-normal">~${fromValue}</span>
              </div>
            </div>
          </Card>

          <div className="flex justify-center items-center px-2 -mx-[20px] z-10">
            <div className="border border-[#ebebeb] rounded-md h-10 w-10 flex items-center justify-center bg-white">
              <Image src="/icons/switch.svg" alt="switch" width={20} height={20} />
            </div>
          </div>

          <Card className="flex-1 p-5 flex flex-col border border-[#ebebeb] gap-[10px] rounded-md">
            <div className="flex items-center justify-between gap-2">
              <span className="text-base text-[#131e40] font-normal">To:</span>
              <AddressEditBlock address={toAddress} onChange={setToAddress} />
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
                  <span className="truncate text-nowrap">{NetworkConfigs.monadTestnet.name}</span>
                </div>
              </div>
            </div>

            <Separator className="my-2" />
            <div className="flex flex-col justify-center gap-[10px]">
              <div className="flex justify-between items-center font-normal">
                <span className="text-base text-[#131e40]">You receive:</span>
                <span className="text-sm text-[#A5ADC6]">
                  {tokenTo.symbol}:{' '}
                  {isToBalancePending ? (
                    <Skeleton className="w-10 h-4" />
                  ) : (
                    <span>{toBalance}</span>
                  )}
                </span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <NumberInput
                  className="!text-[32px] !font-medium !text-[#131E40] bg-transparent border-none h-10 p-0 shadow-none focus-visible:ring-0 w-full"
                  value={toAmount}
                  onChange={handleToChange}
                />
                <span className="text-[#A5ADC6] text-sm font-normal">~${toValue}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-between items-center mt-5">
          <div className="flex items-center gap-3">
            <Button className="h-12 flex text-xl active:bg-white hover:bg-white items-center border border-[#EBEBEB] text-[#131E40] rounded-[6px] bg-white px-8">
              CCIP
            </Button>
            <Button className="h-12 flex text-xl active:bg-white hover:bg-white items-center border border-[#EBEBEB] text-[#131E40] rounded-[6px] bg-white px-8">
              Bridge Router
            </Button>
          </div>

          <Button
            className="min-w-40 h-12 text-xl font-medium flex leading-[24px] items-center justify-center rounded-md bg-[#6E75F9] text-white hover:bg-[#6E75F990]"
            onClick={handleConfirm}
          >
            {isFromAllowanceLoading ? (
              <Loader className="w-6 h-6 animate-spin" />
            ) : shouldApprove ? (
              <span className="flex items-center">
                {isFromApproving ? (
                  <span className="flex items-center">
                    <Loader className="w-6 h-6 mr-1 animate-spin" />
                    <span>Approving...</span>
                  </span>
                ) : (
                  'Approve'
                )}
              </span>
            ) : (
              <span>
                {isSwapPending ? (
                  <span className="flex items-center">
                    <Loader className="w-6 h-6 mr-1 animate-spin" />
                    <span>Creating...</span>
                  </span>
                ) : (
                  'Create swap'
                )}{' '}
                &gt;&gt;
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}

function AddressEditBlock({
  address,
  onChange,
}: {
  address: string;
  onChange: (value: string) => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(address);
  const [isError, setIsError] = useState(false);

  function handleEdit() {
    setIsEdit(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function handleInput(val: string) {
    const isAddr = isAddress(val);
    if (isAddr) {
      setIsError(false);
    }

    setInputValue(val);
  }

  function handleBlur() {
    const isAddr = isAddress(inputValue);
    if (isAddr) {
      onChange(inputValue);
      setIsEdit(false);
    } else {
      setIsError(true);
    }
  }

  return (
    <div className="flex flex-1 justify-end items-center gap-1">
      {isEdit ? (
        <input
          ref={inputRef}
          type="text"
          className={cn(
            'w-full h-8 text-xs font-normal text-[#131e40] rounded-md px-[10px] border border-[#00000010] py-1 gap-1',
            isError && 'border-red-500'
          )}
          value={inputValue}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <AddressBlock withEdit onClick={handleEdit} address={address} />
      )}
    </div>
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
  const addressShort = address ? formatAddress(address, { prefix: 5, suffix: 5 }) : '-';

  return (
    <div className="text-xs h-8 flex items-center font-normal text-[#131e40] rounded-md px-[10px] border border-[#00000010] py-1 gap-[10px]">
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
