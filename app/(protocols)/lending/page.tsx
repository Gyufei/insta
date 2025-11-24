'use client';

import * as Sentry from '@sentry/nextjs';
import { useAccount } from 'wagmi';

import { useEffect, useMemo, useState } from 'react';

import InlineMarketsSection from '@/app/(protocols)/lending/components/InlineMarketsSection';
import { useOddsUserInfo } from '@/app/odds/common/use-user-info';

import { ProjectSelector } from '@/components/common/project-selector';
import { CommonPageLayout } from '@/components/layout/common-page-layout';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import {
  ICurvanceMarketUserItem,
  useCurvanceMarketUserInfo,
} from '@/lib/data/use-curvance-market-user-info';
import { ICurvanceMarketInfo, useCurvanceMarkets } from '@/lib/data/use-curvance-markets';
import { useAccountStore } from '@/lib/state/account';

import InlineMarketDetails from './components/inline-market-details';
import { LENDING_PROJECT_IDS, type LendingProjectId, getLendingProject } from './lending-config';

export default function Lending() {
  const { address: wallet } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();
  const { data: oddsUserInfo } = useOddsUserInfo();

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

  // Initialize Sentry user/environment context
  useEffect(() => {
    try {
      const userId = oddsUserInfo?.user_id || wallet || undefined;
      const userName = oddsUserInfo?.user_name || wallet || undefined;
      if (userId || userName) {
        Sentry.setUser({ id: userId, username: userName });
      } else {
        Sentry.setUser(null);
      }
      Sentry.setTag('wallet', wallet || '');
      if (oddsUserInfo?.user_id) Sentry.setTag('user_id', oddsUserInfo.user_id);
      if (oddsUserInfo?.user_name) Sentry.setTag('user_name', oddsUserInfo.user_name);

      Sentry.setTag('page', 'lending');
      Sentry.setTag('lending_project', selectedProject);
      Sentry.setTag('action_mode', actionMode);
      Sentry.setTag('account_type', currentAccountType);

      Sentry.setContext('account', {
        account_type: currentAccountType,
        eoa_address: wallet || undefined,
        dsa_address: accountInfo?.sandbox_account || undefined,
      });

      Sentry.setContext('user_profile', {
        user_id: oddsUserInfo?.user_id,
        user_name: oddsUserInfo?.user_name,
      });

      if (typeof window !== 'undefined') {
        Sentry.setContext('environment', {
          userAgent: window.navigator.userAgent,
          language: window.navigator.language,
          platform: window.navigator.platform,
          screen: {
            width: window.screen?.width,
            height: window.screen?.height,
          },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          referrer: document.referrer,
          url: window.location.href,
        });
      }
    } catch {}
  }, [wallet, currentAccountType, accountInfo?.sandbox_account, oddsUserInfo?.user_id, oddsUserInfo?.user_name, selectedProject, actionMode]);

  // Breadcrumb for wallet changes
  useEffect(() => {
    try {
      Sentry.addBreadcrumb({
        category: 'wallet',
        message: wallet ? 'wallet_connected' : 'wallet_disconnected',
        level: 'info',
        data: {
          wallet: wallet || '',
          account_type: currentAccountType,
          dsa_address: accountInfo?.sandbox_account || '',
          lending_project: selectedProject,
        },
      });
    } catch {}
  }, [wallet, currentAccountType, accountInfo?.sandbox_account, selectedProject]);

  const sortedMarkets: ICurvanceMarketInfo[] = useMemo(() => {
    const list = (markets || []) as ICurvanceMarketInfo[];
    return list
    // Basic sort by TVL desc if available
    // return list.slice().sort((a, b) => {
    //   const av = parseFloat(a?.total_supply_in_usd || '0');
    //   const bv = parseFloat(b?.total_supply_in_usd || '0');
    //   return bv - av;
    // });
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
      <div className="w-full px-4 md:px-12 flex flex-col md:flex-row items-start justify-between ">
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
          className="w-full md:w-auto mt-0 flex items-center gap-3 justify-start"
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
              className="inline-flex items-center gap-2 px-2 py-2 rounded-[6px] border text-sm bg-white select-none transition-colors
              border-[#E6E8F2] text-[var(--color-pro-gray)] hover:bg-slate-50 [--dot-opacity:0] [--ring-color:#E6E8F2]
              peer-checked:border-[var(--color-pro-blue)] peer-checked:text-[var(--color-pro-blue)] peer-checked:[--dot-opacity:1]
              peer-checked:[--ring-color:var(--color-pro-blue)] leading-0"
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
              className="inline-flex items-center gap-2 px-2 py-2 rounded-[6px] border text-sm bg-white select-none transition-colors
              border-[#E6E8F2] text-[var(--color-pro-gray)] hover:bg-slate-50 [--dot-opacity:0] [--ring-color:#E6E8F2]
              peer-checked:border-[var(--color-pro-blue)] peer-checked:text-[var(--color-pro-blue)] peer-checked:[--dot-opacity:1]
              peer-checked:[--ring-color:var(--color-pro-blue)] leading-0"
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
