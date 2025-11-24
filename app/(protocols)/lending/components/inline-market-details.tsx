'use client';

import { useAccount } from 'wagmi';



import { useEffect, useMemo, useState } from 'react';

import type { IToken } from '@/config/tokens';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAddressBalance } from '@/lib/data/balance/use-address-balance';
import type { ICurvanceMarketUserItem } from '@/lib/data/use-curvance-market-user-info';
import type { ICurvanceMarketInfo } from '@/lib/data/use-curvance-markets';
import { useAccountStore } from '@/lib/state/account';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { formatBig, truncateIfExceeds } from '@/lib/utils/number';

import { TargetTokenSelector } from './target-token-selector';

type InlineMarketDetailsProps = {
  market: ICurvanceMarketInfo;
  user?: ICurvanceMarketUserItem;
  onBack?: () => void;
  actionMode?: 'supply' | 'borrow';
};

function formatUSD(value?: string | number) {
  const num = typeof value === 'string' ? parseFloat(value) : value || 0;
  if (!isFinite(num)) return '$0';
  return num >= 1_000_000_000
    ? `$${(num / 1_000_000_000).toFixed(2)}B`
    : num >= 1_000_000
      ? `$${(num / 1_000_000).toFixed(2)}M`
      : num >= 1_000
        ? `$${(num / 1_000).toFixed(2)}K`
        : `$${num.toFixed(2)}`;
}

function formatPct(value?: string | number) {
  const num = typeof value === 'string' ? parseFloat(value) : value || 0;
  if (!isFinite(num)) return '0%';
  return `${num.toFixed(2)}%`;
}

export default function InlineMarketDetails({
  market,
  user,
  onBack,
  actionMode = 'supply',
}: InlineMarketDetailsProps) {
  const { setCurrentComponent, setLendingContext } = useSideDrawerStore();
  const { address } = useAccount();
  const { currentAccountType } = useAccountStore();
  const { data: accountInfo } = useSelectedAccount();

  const token0 = market.token0;
  const token1 = market.token1;
  const isBorrow = actionMode === 'borrow';
  // 供给代币选择：默认选择已有份额的代币，否则默认 token0
  const defaultSupplyIndex = useMemo(() => {
    const s0 = parseFloat(user?.token0?.user_share_display_balance || '0');
    const s1 = parseFloat(user?.token1?.user_share_display_balance || '0');
    if (Number.isFinite(s0) && s0 > 0 && (!Number.isFinite(s1) || s1 <= 0)) return 0;
    if (Number.isFinite(s1) && s1 > 0 && (!Number.isFinite(s0) || s0 <= 0)) return 1;
    return 0;
  }, [user?.token0?.user_share_display_balance, user?.token1?.user_share_display_balance]);
  const [supplyTokenIndex, setSupplyTokenIndex] = useState<0 | 1>(defaultSupplyIndex as 0 | 1);
  const hasSuppliedAny = useMemo(() => {
    const s0 = parseFloat(user?.token0?.user_share_display_balance || '0');
    const s1 = parseFloat(user?.token1?.user_share_display_balance || '0');
    return (Number.isFinite(s0) && s0 > 0) || (Number.isFinite(s1) && s1 > 0);
  }, [user?.token0?.user_share_display_balance, user?.token1?.user_share_display_balance]);
  const supplyToken = supplyTokenIndex === 0 ? token0 : token1;
  const borrowToken = supplyTokenIndex === 0 ? token1 : token0;
  const mainToken = isBorrow ? borrowToken : supplyToken;
  // 下拉选择器供选择抵押资产（token0 或 token1）
  const selectorTokens: IToken[] = useMemo(
    () => [
      {
        address: token0.address,
        name: token0.name,
        symbol: token0.symbol,
        logo: token0.logoURI,
        decimals: token0.decimals,
      },
      {
        address: token1.address,
        name: token1.name,
        symbol: token1.symbol,
        logo: token1.logoURI,
        decimals: token1.decimals,
      },
    ],
    [
      token0.address,
      token0.name,
      token0.symbol,
      token0.logoURI,
      token0.decimals,
      token1.address,
      token1.name,
      token1.symbol,
      token1.logoURI,
      token1.decimals,
    ]
  );
  // 头部选择器：在 Borrow 模式下展示借款代币；在 Supply 模式下展示抵押代币
  const selectedIToken: IToken = useMemo(
    () => ({
      address: (isBorrow ? borrowToken : supplyToken).address,
      name: (isBorrow ? borrowToken : supplyToken).name,
      symbol: (isBorrow ? borrowToken : supplyToken).symbol,
      logo: (isBorrow ? borrowToken : supplyToken).logoURI,
      decimals: (isBorrow ? borrowToken : supplyToken).decimals,
    }),
    [
      isBorrow,
      borrowToken.address,
      borrowToken.name,
      borrowToken.symbol,
      borrowToken.logoURI,
      borrowToken.decimals,
      supplyToken.address,
      supplyToken.name,
      supplyToken.symbol,
      supplyToken.logoURI,
      supplyToken.decimals,
    ]
  );
  // 根据需求：Supply 显示 total_collateral_in_usd，Borrow 显示 total_debt_in_usd；两者均为 18 位美元精度
  const displayUSDStr = isBorrow
    ? formatBig(String(user?.total_debt_in_usd || '0'), 18)
    : formatBig(String(user?.total_collateral_in_usd || '0'), 18);
  const displayUSDNum = parseFloat(displayUSDStr || '0');
  // 近似代币数量：用 /curvance/markets 接口的 price 计算（按当前主视图代币）
  const price = parseFloat(mainToken.price || '0');
  const approxTokenAmount = price > 0 ? displayUSDNum / price : 0;
  const walletAddress =
    currentAccountType === 'EOA' ? address || '' : accountInfo?.sandbox_account || '';


  // 借款侧指标（基于用户 positions：总债务与最大可借）
  const userMaxDebtUSD = parseFloat(formatBig(String(user?.total_max_debt_in_usd || '0'), 18));
  const userTotalDebtUSD = parseFloat(formatBig(String(user?.total_debt_in_usd || '0'), 18));
  const borrowDebtUSD = Number.isFinite(userMaxDebtUSD) ? userMaxDebtUSD : 0;
  const borrowAvailableUSD =
    Number.isFinite(userMaxDebtUSD) && Number.isFinite(userTotalDebtUSD)
      ? Math.max(userMaxDebtUSD - userTotalDebtUSD, 0)
      : NaN;
    const borrowUtilizationPct =
    Number.isFinite(userMaxDebtUSD) && userMaxDebtUSD > 0 && Number.isFinite(userTotalDebtUSD)
      ? (userTotalDebtUSD / userMaxDebtUSD) * 100
      : parseFloat(market.utilization_rate || '0');
  const { balance: walletBalanceRaw } = useAddressBalance(
    walletAddress,
    token0.address,
    token0.decimals,
    !!walletAddress
  );
  const walletBalanceDisplay = walletBalanceRaw || '0';

  const { balance: walletBalanceRaw1 } = useAddressBalance(
    walletAddress,
    token1.address,
    token1.decimals,
    !!walletAddress
  );
  const walletBalanceDisplay1 = walletBalanceRaw1 || '0';

  const openSupply = () => {
    setCurrentComponent({
      name: 'LendingSupply',
      props: {
        market_address: market.market_address,
        base_token: {
          address: supplyToken.address,
          name: supplyToken.name,
          symbol: supplyToken.symbol,
          decimals: supplyToken.decimals,
          logo: supplyToken.logoURI,
        },
        base_c_token: {
          address: supplyToken.wrapper_address || '',
          decimals: supplyToken.wrapper_decimals || supplyToken.decimals,
        },
      },
    });
  };

  const openWithdraw = () => {
    const userShares =
      supplyTokenIndex === 0
        ? user?.token0?.user_share_display_balance || '0'
        : user?.token1?.user_share_display_balance || '0';
    setCurrentComponent({
      name: 'LendingWithdraw',
      props: {
        market_address: market.market_address,
        base_token: {
          address: supplyToken.address,
          name: supplyToken.name,
          symbol: supplyToken.symbol,
          decimals: supplyToken.decimals,
          logo: supplyToken.logoURI,
        },
        base_c_token: {
          address: supplyToken.wrapper_address || '',
          decimals: supplyToken.wrapper_decimals || supplyToken.decimals,
        },
        user_share_display_balance: userShares,
      },
    });
  };

  const openRepay = () => {
    setCurrentComponent({
      name: 'LendingRepay',
      props: {
        market_address: market.market_address,
        borrowable_token: {
          address: borrowToken.address,
          name: borrowToken.name,
          symbol: borrowToken.symbol,
          decimals: borrowToken.decimals,
          logo: borrowToken.logoURI,
        },
        borrowable_c_token: {
          address: borrowToken.wrapper_address || '',
          decimals: borrowToken.wrapper_decimals || borrowToken.decimals,
        },
        user_debt_display_balance:
          supplyTokenIndex === 0
            ? user?.token1?.user_debt_display_balance || '0'
            : user?.token0?.user_debt_display_balance || '0',
      },
    });
  };

  const openBorrow = () => {
    const maxDebtUSD = parseFloat(user?.total_max_debt_in_usd || '0');
    const totalDebtUSD = parseFloat(user?.total_debt_in_usd || '0');
    const priceBorrow = parseFloat(borrowToken?.price || '0');
    const availableUSD = Math.max((maxDebtUSD || 0) - (totalDebtUSD || 0), 0);
    const tokens = priceBorrow > 0 ? availableUSD / priceBorrow : 0;

    setCurrentComponent({
      name: 'LendingBorrow',
      props: {
        market_address: market.market_address,
        borrowable_token: {
          address: borrowToken.address,
          name: borrowToken.name,
          symbol: borrowToken.symbol,
          decimals: borrowToken.decimals,
          logo: borrowToken.logoURI,
        },
        borrowable_c_token: {
          address: borrowToken.wrapper_address || '',
          decimals: borrowToken.wrapper_decimals || borrowToken.decimals,
        },
        user_max_borrow_display_amount: String(tokens || 0),
      },
    });
  };

  // Borrow/Repay 交互已移至抽屉组件。

  // On mount: only open market info in side drawer on desktop; keep closed on mobile
  useEffect(() => {
    // Detect viewport width directly to avoid initial flicker from mobile hook
    const isMobileViewport = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
    // Persist lending context for header button
    setLendingContext({ market, user, actionMode, supplyTokenIndex });
    if (!isMobileViewport) {
      setCurrentComponent({
        name: 'LendingMarketInfo',
        props: { market, user, actionMode, supplyTokenIndex },
      });
    } else {
      // Ensure drawer is not opened on mobile
      setCurrentComponent({ name: 'Balance' });
    }
    return () => {
      setLendingContext(null);
      setCurrentComponent({ name: 'Balance' });
    };
  }, [market, user, actionMode, supplyTokenIndex, setCurrentComponent]);

  return (
    <div className="w-full px-4 md:px-12">
      {/* Breadcrumb */}
      <div className="mt-6 md:mt-0 mb-6 text-[20px] font-medium text-[#A5ADC6]">
        <button className="hover:underline" onClick={onBack}>
          Markets
        </button>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{market.market_name}</span>
      </div>

      {/* Header info card */}
      <div className="">
        <div className="rounded-lg border bg-white dark:bg-secondary p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:divide-x divide-slate-200">
            <div className="flex items-center gap-3 md:pr-10">
              <TargetTokenSelector
                tokens={selectorTokens}
                selectedToken={selectedIToken}
                onTokenChange={(t) => {
                  if (hasSuppliedAny) return; // 已有抵押则锁定选择
                  const idx =
                    String(t.address).toLowerCase() === String(token0.address).toLowerCase()
                      ? 0
                      : 1;
                  // Borrow 模式下选择的是“借款代币”，需要将抵押侧切到相反的一枚
                  const nextIdx = isBorrow ? (idx === 0 ? 1 : 0) : idx;
                  setSupplyTokenIndex(nextIdx as 0 | 1);
                }}
                disabled={hasSuppliedAny}
                blockedMessage={
                  isBorrow
                    ? 'Borrow asset is determined by your collateral token. Withdraw your current collateral to change.'
                    : 'You cannot deposit as collateral on both tokens.'
                }
                className="!h-[24px]"
              />
            </div>
            {/* 移动端在标题与指标之间增加分割线 */}
            <div className="md:hidden w-full border-t border-gray-200 dark:border-gray-700 mt-3" />
            <div className="w-full md:w-auto md:ml-auto grid grid-cols-3 text-sm md:gap-8 mt-3 md:mt-0 divide-x md:divide-none divide-slate-200">
              {isBorrow ? (
                <>
                  <div className="md:text-left text-center flex flex-col px-4">
                    <div className="order-1 md:order-2 text-lg font-medium mb-1 md:mb-0">
                      {formatUSD(borrowDebtUSD)}
                    </div>
                    <div className="order-2 md:order-1 text-[#A5ADC6]">Total Debt</div>
                  </div>
                  <div className="md:text-left text-center flex flex-col px-4 ">
                    <div className="order-1 md:order-2 text-lg font-medium mb-1 md:mb-0">
                      {formatUSD(borrowAvailableUSD)}
                    </div>
                    <div className="order-2 md:order-1 text-[#A5ADC6]">Available Liquidity</div>
                  </div>
                  <div className="md:text-left text-center flex flex-col">
                    <div className="order-1 md:order-2 text-lg font-medium mb-1 md:mb-0">
                      {formatPct(borrowUtilizationPct)}
                    </div>
                    <div className="order-2 md:order-1 text-[#A5ADC6]">Utilization Rate</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="md:text-left text-center flex flex-col px-1">
                    <div className="order-1 md:order-2 text-lg font-medium mb-1 md:mb-0">
                       {formatUSD(market.total_supply_in_usd)}
                    </div>
                    <div className="order-2 md:order-1 text-[#A5ADC6]">Reserve Size</div>
                  </div>
                  <div className="md:text-left text-center flex flex-col px-1">
                    <div className="order-1 md:order-2 text-lg font-medium mb-1 md:mb-0">
                       {formatUSD(market.available_supply_in_usd)}
                    </div>
                    <div className="order-2 md:order-1 text-[#A5ADC6]">Available Liquidity</div>
                  </div>
                  <div className="md:text-left text-center flex flex-col px-1">
                    <div className="order-1 md:order-2 text-lg font-medium mb-1 md:mb-0">
                      {formatPct(market.utilization_rate)}
                    </div>
                    <div className="order-2 md:order-1 text-[#A5ADC6]">Utilization Rate</div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700" />
          <div className="mt-4">
            <div className="text-[#131E40]">Balance</div>
            <div className="mt-2 text-3xl font-medium tracking-tight">
              $
              {Number(displayUSDNum).toLocaleString(undefined, {
                minimumFractionDigits: 4,
                maximumFractionDigits: 4,
              })}
            </div>
            <div className="mt-1 text-xs text-[#A5ADC6]">
              {truncateIfExceeds(String(approxTokenAmount || 0), 4)} {mainToken.symbol}
            </div>
          </div>
        </div>
      </div>

      {/* Middle content with left main; right info moved into SideDrawer */}
      <div className="mt-4 gap-4">
        {/* Left main */}
        <div className="">
          {/* Balance */}
          {/* Balance 已合并至头部信息卡片中 */}

          {/* Collateral Asset row: only show in Supply mode */}
          {actionMode === 'supply' && (
            <div className="rounded-md border bg-white dark:bg-secondary">
              {/* Desktop header */}
              <div className="hidden md:grid grid-cols-12 items-center px-4 py-3 text-xs font-medium text-[#A5ADC6]">
                <div className="col-span-7 flex items-center gap-3">
                  <span>Collateral Asset</span>
                </div>
                <div className="col-span-5 text-right">Protocol Balance</div>
              </div>
              {/* Desktop row content */}
              <div className="hidden md:block border-t px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={supplyToken.logoURI}
                    className="h-8 w-8 rounded-full"
                    alt={supplyToken.symbol}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{supplyToken.name}</div>
                    <div className="text-xs text-[#A5ADC6]">
                      {supplyToken.symbol} -{' '}
                      {truncateIfExceeds(
                        supplyTokenIndex === 0
                          ? walletBalanceDisplay || '0'
                          : walletBalanceDisplay1 || '0',
                        4
                      )}{' '}
                      in wallet
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">
                        {truncateIfExceeds(
                          supplyTokenIndex === 0
                            ? user?.token0?.user_share_display_balance || '0.0000'
                            : user?.token1?.user_share_display_balance || '0.0000',
                          4
                        )}
                      </div>
                    </div>
                    <button
                      className="h-7 w-7 rounded-[4px] border border-slate-200 flex items-center justify-center"
                      onClick={openSupply}
                      aria-label={'Supply'}
                    >
                      <img src="/icons/plus.svg" alt="Supply" className="h-5 w-5" />
                    </button>
                    <button
                      className="h-7 w-7 rounded-[4px] border border-slate-200 flex items-center justify-center"
                      onClick={openWithdraw}
                      aria-label={'Withdraw'}
                    >
                      <img src="/icons/minus.svg" alt="Withdraw" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile card layout */}
              <div className="md:hidden px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={supplyToken.logoURI}
                    className="h-12 w-12 rounded-full"
                    alt={supplyToken.symbol}
                  />
                  <div className="flex-1">
                    <div className="text-2xl font-medium tracking-tight text-[#131E40]">
                      {supplyToken.name}
                    </div>
                    <div className="text-sm text-[#A5ADC6]">
                      {supplyToken.symbol} -{' '}
                      {truncateIfExceeds(
                        supplyTokenIndex === 0
                          ? walletBalanceDisplay || '0'
                          : walletBalanceDisplay1 || '0',
                        4
                      )}{' '}
                      in wallet
                    </div>
                  </div>
                </div>
                <div className="my-4 border-t border-gray-200" />
                <div className="py-1 text-left ml-15">
                  <span className=" font-medium tracking-tight text-[#131E40]">
                    {truncateIfExceeds(
                      supplyTokenIndex === 0
                        ? user?.token0?.user_share_display_balance || '0.0000'
                        : user?.token1?.user_share_display_balance || '0.0000',
                      4
                    )}
                  </span>
                  <span className="ml-2 text-[14px] text-[#A5ADC6]">Protocol Balance</span>
                </div>
                <div className="my-4 border-t border-gray-200" />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-[5px] rounded-md border border-slate-200 bg-white text-[#131E40]"
                    onClick={openWithdraw}
                    aria-label={'Withdraw'}
                  >
                    <img src="/icons/minus.svg" alt="Withdraw" className="h-5 w-5" />
                  </button>
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-[5px] rounded-md border border-slate-200 bg-white text-[#131E40]"
                    onClick={openSupply}
                    aria-label={'Supply'}
                  >
                    <img src="/icons/plus.svg" alt="Supply" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Borrow asset row: only show in Borrow mode */}
          {actionMode === 'borrow' && (
            <>
              {/* Desktop layout */}
              <div className="mt-3 rounded-md border bg-white dark:bg-secondary hidden md:block">
                <div className="grid grid-cols-12 items-center px-4 py-3 text-xs text-[#A5ADC6]">
                  <div className="col-span-7">Borrow Asset</div>
                  <div className="col-span-5 text-right">Protocol Debt</div>
                </div>
                <div className="border-t px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={borrowToken.logoURI}
                      className="h-8 w-8 rounded-full"
                      alt={borrowToken.symbol}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{borrowToken.name}</div>
                      <div className="text-xs text-[#A5ADC6]">
                        {borrowToken.symbol} -{' '}
                        {truncateIfExceeds(
                          supplyTokenIndex === 0
                            ? walletBalanceDisplay1 || '0'
                            : walletBalanceDisplay || '0',
                          4
                        )}{' '}
                        in wallet
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">
                          {truncateIfExceeds(
                            supplyTokenIndex === 0
                              ? user?.token1?.user_debt_display_balance || '0.0000'
                              : user?.token0?.user_debt_display_balance || '0.0000',
                            4
                          )}
                        </div>
                      </div>
                      <button
                        className="h-7 w-7 rounded-[4px] border border-slate-200 flex items-center justify-center"
                        onClick={openBorrow}
                        aria-label={'Borrow'}
                      >
                        <img src="/icons/plus.svg" alt="Borrow" className="h-5 w-5" />
                      </button>
                      <button
                        className="h-7 w-7 rounded-[4px] border border-slate-200 flex items-center justify-center"
                        onClick={openRepay}
                        aria-label={'Repay'}
                      >
                        <img src="/icons/minus.svg" alt="Repay" className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile card layout */}
              <div className="md:hidden px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={borrowToken.logoURI}
                    className="h-12 w-12 rounded-full"
                    alt={borrowToken.symbol}
                  />
                  <div className="flex-1">
                    <div className="text-[20px] md:text-2xl font-medium tracking-tight text-[#131E40]">
                      {borrowToken.name}
                    </div>
                    <div className="text-sm text-[#A5ADC6]">
                      {borrowToken.symbol} -{' '}
                      {truncateIfExceeds(
                        supplyTokenIndex === 0
                          ? walletBalanceDisplay1 || '0'
                          : walletBalanceDisplay || '0',
                        4
                      )}{' '}
                      in wallet
                    </div>
                  </div>
                </div>
                <div className="my-4 border-t border-gray-200" />
                <div className="text-left">
                  <span className="text-3xl font-medium tracking-tight text-[#131E40]">
                    {truncateIfExceeds(
                      supplyTokenIndex === 0
                        ? user?.token1?.user_debt_display_balance || '0.0000'
                        : user?.token0?.user_debt_display_balance || '0.0000',
                      4
                    )}
                  </span>
                  <span className="ml-2 text-lg text-[#A5ADC6]">Protocol Debt</span>
                </div>
                <div className="my-4 border-t border-gray-200" />
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-[5px] rounded-md border border-slate-200 bg-white text-[#131E40]"
                    onClick={openRepay}
                    aria-label={'Repay'}
                  >
                    <img src="/icons/minus.svg" alt="Repay" className="h-6 w-6" />
                  </button>
                  <button
                    className="w-full inline-flex items-center justify-center px-4 py-[5px] rounded-md border border-slate-200 bg-white text-[#131E40]"
                    onClick={openBorrow}
                    aria-label={'Borrow'}
                  >
                    <img src="/icons/plus.svg" alt="Borrow" className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}