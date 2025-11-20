'use client';

import * as Sentry from '@sentry/nextjs';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';

import { useOddsUserInfo } from '@/app/odds/common/use-user-info';

import { ProjectSelector } from '@/components/common/project-selector';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAccountStore } from '@/lib/state/account';
import { cn } from '@/lib/utils';

import { StakeTab } from './stake-tab';
import { STAKING_PROJECT_IDS, type StakingProjectId, getStakingProject } from './staking-config';
import { UnstakeTab } from './unstake-tab';

export function StakingContent() {
  const { address: wallet } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();
  const { data: oddsUserInfo } = useOddsUserInfo();
  const [activeTab, setActiveTab] = useState('stake');
  const [selectedProject, setSelectedProject] = useState<StakingProjectId>('apriori');

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

      Sentry.setTag('page', 'staking');
      Sentry.setTag('staking_project', selectedProject);
      Sentry.setTag('active_tab', activeTab);
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
  }, [wallet, currentAccountType, accountInfo?.sandbox_account, oddsUserInfo?.user_id, oddsUserInfo?.user_name, selectedProject, activeTab]);

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
          staking_project: selectedProject,
        },
      });
    } catch {}
  }, [wallet, currentAccountType, accountInfo?.sandbox_account, selectedProject]);

  return (
    <div className="w-full px-4 md:px-12 flex justify-center md:justify-start">
      <div className="w-full max-w-md">
        <ProjectSelector
          projectIds={STAKING_PROJECT_IDS}
          getProject={(id: string) => getStakingProject(id as StakingProjectId)}
          selectedProject={selectedProject}
          onProjectSelect={(projectId: string) => setSelectedProject(projectId as StakingProjectId)}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <div className="w-full mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('stake')}
                className={cn(
                  'px-2 py-2 font-medium transition-colors',
                  activeTab === 'stake'
                    ? 'text-[var(--color-tab-text-active)] border-b-2 border-[var(--color-tab-border-active)]'
                    : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                )}
              >
                Stake
              </button>
              <button
                onClick={() => setActiveTab('unstake')}
                className={cn(
                  'ml-4 px-2 py-2 font-medium transition-colors',
                  activeTab === 'unstake'
                    ? 'text-[var(--color-tab-text-active)] border-b-2 border-[var(--color-tab-border-active)]'
                    : 'text-[var(--color-tab-text)] hover:text-[var(--color-tab-text-hover)]'
                )}
              >
                Unstake
              </button>
            </div>
          </div>

          <TabsContent value="stake" className="mt-0">
            <StakeTab selectedProject={selectedProject} />
          </TabsContent>
          <TabsContent value="unstake" className="mt-0">
            <UnstakeTab selectedProject={selectedProject} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}