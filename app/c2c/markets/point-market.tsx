'use client';

import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { format } from 'date-fns';
import { multiply } from 'safebase';

import { useMemo } from 'react';

import { useRouter } from 'next/navigation';

import { NetworkConfigs } from '@/config/network-config';

import { Skeleton } from '@/components/ui/skeleton';

import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils/number';

import { ProjectDecimalsMap } from '../common/const';
import { IMarketplace, useMarketplaces } from '../common/use-marketplaces';
import { useSalesVolume } from '../common/use-sales-volume';
import Sparkline from '../components/snapshot';
import { TokenPairImg } from '../components/token-pair-img';

export default function PointMarket({ className }: { className?: string }) {
  const router = useRouter();

  const { data, isLoading: isLoadingFlag } = useMarketplaces();

  const theme = useTheme({
    Table: `
      grid-template-rows: 40px repeat(auto-fit, 64px);
      grid-template-columns: repeat(7,minmax(0,1fr)),
      font-weight: 400;

      &::-webkit-scrollbar {
        display: none;
      }
    `,
    Header: '',
    Body: '',
    BaseRow: `
    `,
    HeaderRow: `
      background: #fff;
    `,
    Row: `
    `,
    BaseCell: `
      font-size: 14px;
      font-weight: normal;
      text-align: right;

      &:first-of-type {
        text-align: left;
      }
    `,
    HeaderCell: `
      color: #c0c4cc;
      &:first-of-type {
        padding-left: 8px;
      }
      border-bottom: 1px solid #eee;
    `,
    Cell: `
      color: #2d2e33;
      height: 64px;
    `,
  });

  const tableData = useMemo(() => {
    if (isLoadingFlag) {
      const nodes = Array.from({ length: 4 }, () => {
        return {
          id: Math.floor(Math.random() * 100000),
        };
      });

      return {
        nodes,
      };
    }

    const nodes = (data || [])
      .filter((m: IMarketplace) => m.status !== 'offline')
      .map((item: IMarketplace) => {
        return {
          ...item,
        };
      });

    return {
      nodes,
    };
  }, [data, isLoadingFlag]);

  function handleGo(marketId: string) {
    const path = `/points/${marketId}`;

    router.push(path);
  }

  const COLUMNS = [
    {
      label: 'Asset',
      renderCell: (item: IMarketplace) => {
        const chainInfo = NetworkConfigs.monadTestnet;

        return isLoadingFlag ? (
          <div className="flex items-center">
            <Skeleton className="h-[32px] w-[32px] rounded-full" />
            <div className="ml-3 flex flex-col">
              <Skeleton className="h-[18px] w-[80px] sm:w-[100px]" />
              <Skeleton className="mt-2 h-[16px] w-[60px] sm:w-[80px]" />
            </div>
          </div>
        ) : (
          <div
            className="flex w-[120px] cursor-pointer items-center pl-2"
            onClick={() => handleGo(item.market_symbol)}
          >
            <TokenPairImg
              src1={item?.projectLogo}
              src2={chainInfo?.icon}
              width1={32}
              height1={32}
              width2={14}
              height2={14}
            />
            <div className="ml-3 flex flex-col">
              <div className="text-sm leading-5 text-black">{item.market_name}</div>
            </div>
          </div>
        );
      },
    },
    {
      label: 'Initial Listing',
      renderCell: (item: IMarketplace) => {
        const pointDecimalNum = ProjectDecimalsMap[item.market_symbol]
          ? 10 ** ProjectDecimalsMap[item.market_symbol]
          : 1;

        return isLoadingFlag ? (
          <Skeleton className="h-[16px] w-[120px]" />
        ) : (
          <div className="flex flex-col items-end">
            <PriceText
              num={Number(multiply(String(item.initial_listing_price), String(pointDecimalNum)))}
            />
          </div>
        );
      },
    },
    {
      label: 'All Time High',
      renderCell: (item: IMarketplace) => {
        const pointDecimalNum = ProjectDecimalsMap[item.market_symbol]
          ? 10 ** ProjectDecimalsMap[item.market_symbol]
          : 1;
        return isLoadingFlag ? (
          <div className="flex justify-end">
            <Skeleton className="h-[16px] w-[60px]" />
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <PriceText
              num={Number(multiply(String(item.all_time_high_price), String(pointDecimalNum)))}
            />
          </div>
        );
      },
    },
    {
      label: 'Vol24h',
      renderCell: (item: IMarketplace) => {
        return isLoadingFlag ? (
          <div className="flex justify-end">
            <Skeleton className="h-[16px] w-[60px]" />
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <PriceText num={Number(item.vol_24h)} />
          </div>
        );
      },
    },
    {
      label: '24h Change',
      renderCell: (item: IMarketplace) => {
        const pointDecimalNum = ProjectDecimalsMap[item.market_symbol]
          ? 10 ** ProjectDecimalsMap[item.market_symbol]
          : 1;
        return isLoadingFlag ? (
          <div className="flex justify-end">
            <Skeleton className="h-[16px] w-[60px]" />
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <ChangeText
              vol={multiply(String(item.last_price), String(pointDecimalNum))}
              percent={+item.change_rate_24h}
            />
          </div>
        );
      },
    },
    {
      label: 'Total Vol',
      renderCell: (item: IMarketplace) => {
        return isLoadingFlag ? (
          <div className="flex justify-end">
            <Skeleton className="h-[16px] w-[60px]" />
          </div>
        ) : (
          <div className="flex flex-col items-end">
            <PriceText num={Number(item.total_vol)} />
          </div>
        );
      },
    },
    {
      label: 'Trading Ends',
      renderCell: (item: IMarketplace) =>
        isLoadingFlag ? (
          <div className="flex justify-end">
            <Skeleton className="h-[16px] w-[60px]" />
          </div>
        ) : (
          <div className="flex flex-col items-end">
            {item.trading_ends_at === '0' ? (
              <div>N/A</div>
            ) : (
              <>
                <div className="text-sm leading-5 text-black">
                  {format(Number(item.trading_ends_at) * 1000, 'dd/MM/yyyy')}
                </div>
                <div className="text-[10px] leading-4 text-gray">
                  {format(Number(item.trading_ends_at) * 1000, 'HH:mm a')}
                </div>
              </>
            )}
          </div>
        ),
    },
    {
      label: 'Snapshot',
      renderCell: (item: IMarketplace) => <Snapshot marketplace={item} />,
    },
  ];

  return (
    <div
      className={cn(
        className,
        'flex w-full flex-1 flex-col overflow-x-scroll pr-6 md:mt-6 sm:overflow-x-hidden sm:pr-0'
      )}
    >
      <div className="hidden items-center justify-between sm:flex">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 rounded-lg bg-pro-blue"></div>
          <div className="font-medium leading-6 text-black">Point Market</div>
        </div>
      </div>
      {!tableData.nodes.length ? (
        <div className="flex h-full flex-1 items-center justify-center text-base text-gray">
          No Market Data
        </div>
      ) : (
        <div className="max-h-auto relative w-[820px] flex-1 flex-col overflow-y-hidden sm:w-full sm:min-w-0">
          <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-1 flex-col">
            <CompactTable
              columns={COLUMNS}
              data={tableData}
              theme={theme}
              layout={{ fixedHeader: true }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PriceText({ num }: { num: number }) {
  return <div className="text-sm leading-5 text-black ">${formatNumber(num)}</div>;
}

function ChangeText({ vol, percent }: { vol: number; percent: number }) {
  const isGreater = percent > 0;
  const prev = isGreater ? '+' : '-';
  return (
    <div
      data-greater={percent === 0 ? 'zero' : isGreater}
      className="text-sm leading-4 data-[greater=false]:text-red data-[greater=true]:text-green data-[greater=zero]:text-black"
    >
      {Number(vol) === 0 ? '$0' : `${percent === 0 ? '' : prev}$${formatNumber(vol)}`}/
      {Number(percent) === 0 ? '0' : `${prev}${Math.abs(percent).toFixed(2)}`}%
    </div>
  );
}

function Snapshot({ marketplace }: { marketplace: IMarketplace }) {
  const { data: salesData, isLoading } = useSalesVolume(marketplace?.market_place_account);

  const data = useMemo(() => {
    const showData = (salesData || [])
      ?.filter((item) => {
        return item.create_at > new Date().getTime() - 3600 * 1000 * 24;
      })
      ?.map((o) => Number(o.sales_price));
    if (showData?.length < 2) {
      return [10, 10];
    }
    return showData;
  }, [salesData]);

  return isLoading ? (
    <div className="flex justify-end">
      <Skeleton className="h-[16px] w-[60px]" />
    </div>
  ) : (
    <div className="flex h-[64px] items-center justify-end ">
      <div className="mt-[10px] flex items-center justify-end">
        <Sparkline data={data || []} isRedColor={+marketplace.change_rate_24h < 0} />
      </div>
    </div>
  );
}
