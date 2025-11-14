'use client';

import { useMemo, useState } from 'react';

import InlineMarketsSection from '@/app/(protocols)/lending/components/InlineMarketsSection';

import { ProjectSelector } from '@/components/common/project-selector';
import { CommonPageLayout } from '@/components/layout/common-page-layout';

import {
  ICurvanceMarketUserItem,
  useCurvanceMarketUserInfo,
} from '@/lib/data/use-curvance-market-user-info';
import { ICurvanceMarketInfo, useCurvanceMarkets } from '@/lib/data/use-curvance-markets';

import InlineMarketDetails from './components/inline-market-details';
import { LENDING_PROJECT_IDS, type LendingProjectId, getLendingProject } from './lending-config';

export default function Lending() {
  const {
    data: markets,
    isLoading: marketsLoading,
    error: marketsError,
  } = useCurvanceMarkets(true);
  const {
    data: userInfo,
    isLoading: _userLoading,
    error: _userError,
  } = useCurvanceMarketUserInfo(true);

  const byMarket: Record<string, ICurvanceMarketUserItem | undefined> = {};
  const userArray = (userInfo ?? []) as ICurvanceMarketUserItem[];
  userArray.forEach((u) => {
    if (u?.market_address) byMarket[u.market_address] = u;
  });

  const [selectedProject, setSelectedProject] = useState<LendingProjectId>('curvance');
  const [actionMode, setActionMode] = useState<'supply' | 'borrow'>('supply');
  const [selectedMarketAddress, setSelectedMarketAddress] = useState<string | null>(null);

  const isCurvanceSelected = selectedProject === 'curvance';

  const sortedMarkets: ICurvanceMarketInfo[] = useMemo(() => {
    const list = (markets || []) as ICurvanceMarketInfo[];
    // Basic sort by TVL desc if available
    return list.slice().sort((a, b) => {
      const av = parseFloat(a?.total_supply_in_usd || '0');
      const bv = parseFloat(b?.total_supply_in_usd || '0');
      return bv - av;
    });
  }, [markets]);

  const selectedMarket = useMemo(() => {
    if (!selectedMarketAddress) return undefined;
    return sortedMarkets.find(
      (m) => m.market_address?.toLowerCase() === selectedMarketAddress.toLowerCase()
    );
  }, [sortedMarkets, selectedMarketAddress]);

  const selectedUser = useMemo(() => {
    if (!selectedMarketAddress) return undefined;
    return byMarket[selectedMarketAddress];
  }, [byMarket, selectedMarketAddress]);

  return (
    <CommonPageLayout title="Lending" iconSrc={null} titleClassName="pb-5 md:pb-6">
      <div className="w-full px-4 md:px-12 flex flex-col md:flex-row items-start justify-between gap-3 md:gap-0">
        <div className="w-full md:max-w-md">
          <ProjectSelector
            projectIds={LENDING_PROJECT_IDS}
            getProject={(id: string) => getLendingProject(id as LendingProjectId)}
            selectedProject={selectedProject}
            onProjectSelect={(projectId: string) =>
              setSelectedProject(projectId as LendingProjectId)
            }
          />
        </div>
        {/* 右侧 Supply/Borrow 单选胶囊 */}
        <fieldset
          className="w-full md:w-auto mt-3 md:mt-0 flex items-center gap-3 justify-start"
          aria-label="Action Mode"
          role="radiogroup"
        >
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="lending-action"
              className="peer sr-only"
              checked={actionMode === 'supply'}
              onChange={() => setActionMode('supply')}
            />
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border text-sm bg-white select-none transition-colors
              border-[#E6E8F2] text-[var(--color-pro-gray)] hover:bg-slate-50 [--dot-opacity:0] [--ring-color:#E6E8F2]
              peer-checked:border-[var(--color-pro-blue)] peer-checked:text-[var(--color-pro-blue)] peer-checked:[--dot-opacity:1]
              peer-checked:[--ring-color:var(--color-pro-blue)]"
            >
              <span
                className="relative inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border-2
                border-[var(--ring-color)] after:content-[''] after:absolute after:w-[6px] after:h-[6px]
                after:rounded-full after:bg-[var(--color-pro-blue)] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                after:opacity-[var(--dot-opacity)]"
              ></span>
              Supply
            </span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="lending-action"
              className="peer sr-only"
              checked={actionMode === 'borrow'}
              onChange={() => setActionMode('borrow')}
            />
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] border text-sm bg-white select-none transition-colors
              border-[#E6E8F2] text-[var(--color-pro-gray)] hover:bg-slate-50 [--dot-opacity:0] [--ring-color:#E6E8F2]
              peer-checked:border-[var(--color-pro-blue)] peer-checked:text-[var(--color-pro-blue)] peer-checked:[--dot-opacity:1]
              peer-checked:[--ring-color:var(--color-pro-blue)]"
            >
              <span
                className="relative inline-flex items-center justify-center w-[14px] h-[14px] rounded-full border-2
                border-[var(--ring-color)] after:content-[''] after:absolute after:w-[6px] after:h-[6px]
                after:rounded-full after:bg-[var(--color-pro-blue)] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2
                after:opacity-[var(--dot-opacity)]"
              ></span>
              Borrow
            </span>
          </label>
        </fieldset>
      </div>

      {/* 市场列表或内嵌详情 */}
      {!selectedMarket && (
        <InlineMarketsSection
          isCurvanceSelected={isCurvanceSelected}
          marketsLoading={marketsLoading}
          marketsError={!!marketsError}
          sortedMarkets={sortedMarkets}
          byMarket={byMarket}
          actionMode={actionMode}
          onDetails={(addr: string) => setSelectedMarketAddress(addr)}
        />
      )}

      {selectedMarket && (
        <InlineMarketDetails
          market={selectedMarket}
          user={selectedUser}
          actionMode={actionMode}
          onBack={() => setSelectedMarketAddress(null)}
        />
      )}
    </CommonPageLayout>
  );
}
