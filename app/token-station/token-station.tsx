'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import { Loader } from 'lucide-react';
import { divide, multiply, subtract } from 'safebase';
import { toast } from 'sonner';
import { isAddress } from 'viem';
import { useAccount } from 'wagmi';

import { useEffect, useMemo, useRef, useState } from 'react';

import Image from 'next/image';

import { NetworkConfigs } from '@/config/network-config';

import { ButtonWithCheck } from '@/components/common/button-with-check';
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

import { useApiWalletBalance } from '@/lib/data/use-api-wallet-balance';
import { useCheckAllowance } from '@/lib/data/use-check-allowance';
import { useTokenStationPrice } from '@/lib/data/use-token-station-price';
import { useTokenStationSwapBridge } from '@/lib/data/use-token-station-swap-bridge';
import { useTokenStationSwapCCIP } from '@/lib/data/use-token-station-swap-ccip';
import { cn, formatAddress } from '@/lib/utils';
import { formatNumber, truncateNumber } from '@/lib/utils/number';
import { useIsMobile } from '@/lib/utils/use-mobile';
import { useGetAddressBalance } from '@/lib/web3/use-get-address-balance';

import {
  STATION_FROM_TOKENS_BASE,
  STATION_FROM_TOKENS_ETH,
  STATION_TO_TOKENS,
} from './station-config';

const MIN_TRANSACTION_AMOUNT = 2;

function calculateProcessingFee(amount: number): number {
  if (amount < 10) return 0.01;
  if (amount < 100) return 0.02;
  return 0.03;
}

function calculateProcessingRate(amount: number): number {
  if (amount > 87.3) {
    return 0.03;
  }

  if (amount > 9.8) {
    return 0.02;
  }

  return 0.01;
}

export function TokenStation() {
  const { chainId, switchNetwork } = useAppKitNetwork();
  const { address } = useAccount();
  const prevAddressRef = useRef<string | undefined>(undefined);

  const isMobile = useIsMobile();
  const [mode, setMode] = useState<'CCIP' | 'BRIDGE'>('CCIP');

  const [tokenFrom, setTokenFrom] = useState(STATION_FROM_TOKENS_ETH[0]);
  const [tokenTo, setTokenTo] = useState(STATION_TO_TOKENS[0]);

  const [fromAmount, setFromAmount] = useState('0');
  const [toAmount, setToAmount] = useState('0');

  const [toAddress, setToAddress] = useState(address || '');

  useEffect(() => {
    const prevAddress = prevAddressRef.current;
    if (prevAddress && address && prevAddress !== address && toAddress === prevAddress) {
      setToAddress(address);
    }
    prevAddressRef.current = address;
  }, [address, toAddress]);

  const tokenFromAddress = useMemo(() => {
    if (mode === 'CCIP') {
      return (
        STATION_FROM_TOKENS_ETH.find((token) => token.symbol === tokenFrom.symbol)?.address || ''
      );
    }

    return (
      STATION_FROM_TOKENS_BASE.find((token) => token.symbol === tokenFrom.symbol)?.address || ''
    );
  }, [mode, tokenFrom]);

  const currentNet = useMemo(() => {
    if (mode === 'CCIP') {
      return NetworkConfigs.eth;
    } else if (mode === 'BRIDGE') {
      return NetworkConfigs.base;
    }

    return NetworkConfigs.eth;
  }, [mode]);

  const { balance: fromBalance, isBalancePending: isFromBalancePending } = useApiWalletBalance(
    currentNet.id,
    tokenFromAddress
  );

  const { balance: toBalance, isBalancePending: isToBalancePending } = useGetAddressBalance(
    NetworkConfigs.monadTestnet.id,
    toAddress,
    tokenTo.address,
    STATION_TO_TOKENS
  );

  const {
    allowance: fromAllowance,
    isLoading: isFromAllowanceLoading,
    handleApprove: handleFromApprove,
    isApproving: isFromApproving,
  } = useCheckAllowance(
    mode === 'CCIP' ? 'tokenStation-ccip' : 'tokenStation-bridge',
    tokenFrom.symbol
  );

  const { data: priceData } = useTokenStationPrice();

  const { mutate: swapCCIP, isPending: isSwapPendingCCIP } = useTokenStationSwapCCIP();
  const { mutate: swapBridge, isPending: isSwapPendingBridge } = useTokenStationSwapBridge();
  const swap = mode === 'CCIP' ? swapCCIP : swapBridge;
  const isSwapPending = mode === 'CCIP' ? isSwapPendingCCIP : isSwapPendingBridge;

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
    if (tokenTo.symbol === 'MON') {
      return monPrice;
    }
    return 1;
  }, [tokenTo.symbol, monPrice]);

  const fromValue = useMemo(() => {
    if (!fromAmount) return '0';
    return multiply(fromAmount, String(fromPrice));
  }, [fromAmount, fromPrice]);

  // const toValue = useMemo(() => {
  //   if (!toAmount) return '0';
  //   return multiply(toAmount, String(toPrice));
  // }, [toAmount, toPrice]);

  const shouldApprove = useMemo(() => {
    if (!fromAllowance) return true;
    return Number(fromAllowance) < Number(fromValue);
  }, [fromAllowance, fromValue]);

  const fromTokenOptions = useMemo(() => {
    if (mode === 'CCIP') {
      return STATION_FROM_TOKENS_ETH;
    }

    return STATION_FROM_TOKENS_BASE;
  }, [mode]);

  useEffect(() => {
    if (!chainId) {
      return;
    }

    if (chainId === NetworkConfigs.eth.id) {
      setMode('CCIP');
    } else if (chainId === NetworkConfigs.base.id) {
      setMode('BRIDGE');
    } else {
      switchNetwork(NetworkConfigs.eth);
      setMode('CCIP');
    }
  }, [chainId]);

  function handleFromMax() {
    setFromAmount(fromBalance);

    if (fromBalance === '0') {
      setToAmount('0');
      return;
    }

    const withSlippage = calculateToAmount(fromBalance, fromPrice, toPrice);
    setToAmount(withSlippage);
  }

  function handleChangeMode(mode: 'CCIP' | 'BRIDGE') {
    if (mode === 'CCIP' && chainId !== NetworkConfigs.eth.id) {
      switchNetwork(NetworkConfigs.eth);

      const selectedToken = STATION_FROM_TOKENS_ETH.find(
        (token) => token.symbol === tokenFrom.symbol
      );

      if (selectedToken) {
        setTokenFrom(selectedToken as (typeof STATION_FROM_TOKENS_ETH)[number]);
      }
    } else if (mode === 'BRIDGE' && chainId !== NetworkConfigs.base.id) {
      switchNetwork(NetworkConfigs.base);

      const selectedToken = STATION_FROM_TOKENS_BASE.find(
        (token) => token.symbol === tokenFrom.symbol
      );

      if (selectedToken) {
        setTokenFrom(selectedToken as (typeof STATION_FROM_TOKENS_ETH)[number]);
      }
    }

    setMode(mode);
  }

  function handleFromTokenChange(tokenSymbol: string) {
    const allToken = mode === 'CCIP' ? STATION_FROM_TOKENS_ETH : STATION_FROM_TOKENS_BASE;
    const selectedToken = allToken.find((token) => token.symbol === tokenSymbol);

    if (selectedToken) {
      setTokenFrom(selectedToken as (typeof STATION_FROM_TOKENS_ETH)[number]);
    }

    if (!selectedToken) {
      return;
    }

    if (fromAmount === '0') {
      setToAmount('0');
      return;
    }

    const fPrice = selectedToken.symbol === 'ETH' ? Number(ETHPrice) : 1;
    const tPrice = tokenTo.symbol === 'MON' ? Number(monPrice) : 1;

    const withSlippage = calculateToAmount(fromAmount, fPrice, tPrice);
    setToAmount(withSlippage);
  }

  function calculateToAmount(value: string, fPrice: number | string, tPrice: number | string) {
    const fromAmountPrice = multiply(value, String(fPrice));

    // less than 2 USD, return 0
    if (Number(fromAmountPrice) < MIN_TRANSACTION_AMOUNT) {
      return '0';
    }

    const feeRate = calculateProcessingFee(Number(fromAmountPrice));
    const processingFee = multiply(fromAmountPrice, String(feeRate));
    const swapFromExcludeFee = subtract(String(fromAmountPrice), String(processingFee));

    const amount = divide(swapFromExcludeFee, String(tPrice));
    const withSlippage = truncateNumber(multiply(amount, String(0.9)), 8);
    return withSlippage;
  }

  function handleFromChange(value: string) {
    setFromAmount(value);

    if (value === '0') {
      setToAmount('0');
      return;
    }

    const withSlippage = calculateToAmount(value, fromPrice, toPrice);
    setToAmount(withSlippage);
  }

  function handleToChange(value: string) {
    setToAmount(value);

    if (value === '0') {
      setFromAmount('0');
      return;
    }

    const withSlippage = calcFromAmount(value, fromPrice, toPrice);
    setFromAmount(withSlippage.toString());
  }

  function calcFromAmount(value: string, fPrice: number | string, tPrice: number | string) {
    if (Number(value) === 0) {
      return '0';
    }

    const toAmountPrice = multiply(value, String(tPrice));
    const withSlippage = divide(toAmountPrice, String(0.9));

    const feeRate = calculateProcessingRate(Number(withSlippage));
    const swapFromReal = divide(withSlippage, String(1 - feeRate));

    const fromAmount = truncateNumber(divide(swapFromReal, String(fPrice)), 8);
    return fromAmount;
  }

  function handleConfirm() {
    if (shouldApprove) {
      handleFromApprove();
    } else {
      handleSwap();
    }
  }

  function handleSwap() {
    if (Number(fromAmount) < MIN_TRANSACTION_AMOUNT) {
      toast.error('The minimum transaction amount is 2 USD');
      return;
    }

    if (Number(toAmount) === 0) {
      toast.error('There is not enough handling fee to swap');
      return;
    }

    if (mode === 'CCIP' && chainId !== NetworkConfigs.eth.id) {
      switchNetwork(NetworkConfigs.eth);
    } else if (mode === 'BRIDGE' && chainId !== NetworkConfigs.base.id) {
      switchNetwork(NetworkConfigs.base);
    }

    if (Number(fromAmount) > Number(fromBalance)) {
      toast.error('Insufficient balance');
      return;
    }

    swap({
      token_name: tokenFrom.symbol,
      amount_in: fromAmount,
      min_amount_out: toAmount,
      recipient: toAddress,
      token_out_name: tokenTo.symbol,
    });
  }

  const ModeSwitch = () => {
    return (
      <div className="md:flex md:items-center md:justify-start grid grid-cols-2 gap-3 mb-4 md:mb-0">
        <ButtonWithCheck
          className={cn(
            'md:h-12 md:flex-0 flex-1 h-10 flex md:text-xl text-base active:bg-white hover:bg-white items-center border border-[#EBEBEB] text-[#131E40] rounded-[6px] bg-white px-8',
            mode === 'CCIP' && 'border-[#6E75F9] text-[#6E75F9]'
          )}
          label="CCIP"
          value="CCIP"
          activeTab={mode}
          onClick={() => handleChangeMode('CCIP')}
        />
        <ButtonWithCheck
          className={cn(
            'md:h-12 h-10 flex md:flex-0 flex-1 md:text-xl text-base active:bg-white hover:bg-white items-center border border-[#EBEBEB] text-[#131E40] rounded-[6px] bg-white px-8',
            mode === 'BRIDGE' && 'border-[#6E75F9] text-[#6E75F9]'
          )}
          label="Bridge Router"
          value="BRIDGE"
          activeTab={mode}
          onClick={() => handleChangeMode('BRIDGE')}
        />
      </div>
    );
  };

  return (
    <>
      <div className="px-4 2xl:px-12">
        {isMobile && <ModeSwitch />}

        <div className="flex md:flex-row flex-col justify-between flex-1 gap-0 shadow-none">
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
                    handleFromTokenChange(value);
                  }}
                >
                  <SelectTrigger className="w-full focus-visible:ring-0">
                    <div className="flex items-center gap-2">
                      <Image src={tokenFrom.logo} alt={tokenFrom.symbol} width={20} height={20} />
                      <SelectValue>{tokenFrom.symbol}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {fromTokenOptions.map((token) => (
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
              <div className="flex items-end pb-3 self-stretch">
                <span className="text-base md:text-xs text-[#909399]">/</span>
              </div>
              <div className="flex-1 flex flex-col gap-[10px]">
                <div className="text-sm text-[#A5ADC6] font-normal">Network</div>
                <div className="w-full h-9 flex justify-start items-center border-[#00000010] border gap-2 rounded-md px-2 py-1">
                  <Image
                    src={mode === 'CCIP' ? NetworkConfigs.eth.icon : NetworkConfigs.base.icon}
                    alt="eth"
                    width={20}
                    height={20}
                  />
                  <span className="truncate text-nowrap">
                    {mode === 'CCIP' ? NetworkConfigs.eth.name : NetworkConfigs.base.name}
                  </span>
                </div>
              </div>
            </div>
            <Separator className="my-2" />
            <div className="flex flex-col justify-center gap-[10px]">
              <div className="flex justify-between items-center font-normal">
                <span className="text-base text-[#131e40] ">You pay:</span>
                <span className="text-sm flex items-center gap-1 text-[#A5ADC6]">
                  <span>{tokenFrom.symbol}: </span>
                  {isFromBalancePending ? (
                    <Skeleton className="w-10 h-4" />
                  ) : (
                    <span>{formatNumber(fromBalance)}</span>
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
                {/* <span className="text-[#A5ADC6] text-sm font-normal">~${fromValue}</span> */}
              </div>
            </div>
          </Card>

          <div className="flex justify-center items-center md:px-2 px-0 py-2 md:py-0 md:-mx-[20px] mx-0 -my-[20px] md:my-0 z-10">
            <div className="border border-[#ebebeb] rounded-md h-10 w-10 flex items-center justify-center bg-white md:rotate-0 rotate-90">
              <Image src="/icons/right-arrow.svg" alt="switch" width={20} height={20} />
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
              <div className="flex items-end pb-3 self-stretch">
                <span className="text-base md:text-xs text-[#909399]">/</span>
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
                <span className="text-sm flex items-center gap-1 text-[#A5ADC6]">
                  <span>{tokenTo.symbol}: </span>
                  {isToBalancePending ? (
                    <Skeleton className="w-10 h-4" />
                  ) : (
                    <span>{formatNumber(toBalance)}</span>
                  )}
                </span>
              </div>
              <div className="flex flex-col items-start gap-2">
                <NumberInput
                  className="!text-[32px] !font-medium !text-[#131E40] bg-transparent border-none h-10 p-0 shadow-none focus-visible:ring-0 w-full"
                  value={toAmount}
                  onChange={handleToChange}
                />
                {/* <span className="text-[#A5ADC6] text-sm font-normal">~${toValue}</span> */}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex md:flex-row flex-col md:justify-between md:items-center mt-5 gap-2 md:gap-0">
          {!isMobile && <ModeSwitch />}

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
                    <span>Topping up...</span>
                  </span>
                ) : (
                  <span>Top-up &gt;&gt;</span>
                )}
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

  useEffect(() => {
    setInputValue(address);
  }, [address]);

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
