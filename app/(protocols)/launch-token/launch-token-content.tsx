'use client';

import * as Sentry from '@sentry/nextjs';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';

import { Tabs, TabsContent } from '@/components/ui/tabs';
import { ProjectSelector } from '@/components/common/project-selector';

import { useOddsUserInfo } from '@/app/odds/common/use-user-info';

import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useAccountStore } from '@/lib/state/account';

import {
  LAUNCH_TOKEN_PROJECT_IDS,
  type LaunchTokenProjectId,
  getLaunchTokenProject,
} from './launch-token-config';
import { UniswapCreateCoin } from './uniswap/uniswap-create-coin';

/**
 * Launch Token Content Component - Manages different token launch functionalities
 * Provides tabbed interface for token creation, liquidity management, and position management
 * Similar structure to staking-content.tsx but for token launch operations
 */
export function LaunchTokenContent() {
  const { address: wallet } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const { currentAccountType } = useAccountStore();
  const { data: oddsUserInfo } = useOddsUserInfo();
  const [selectedProject, setSelectedProject] = useState<LaunchTokenProjectId>('uniswap');

  // Initialize Sentry user/environment context on mount and when deps change
  useEffect(() => {
    try {
      // User context
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

      // Tags for quick filtering
      Sentry.setTag('page', 'launch-token');
      Sentry.setTag('launch_token_project', selectedProject);
      Sentry.setTag('account_type', currentAccountType);

      // Account context
      Sentry.setContext('account', {
        account_type: currentAccountType,
        eoa_address: wallet || undefined,
        dsa_address: accountInfo?.sandbox_account || undefined,
      });

      // User profile context
      Sentry.setContext('user_profile', {
        user_id: oddsUserInfo?.user_id,
        user_name: oddsUserInfo?.user_name,
      });

      // Environment context
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
  }, [wallet, currentAccountType, accountInfo?.sandbox_account, oddsUserInfo?.user_id, oddsUserInfo?.user_name, selectedProject]);

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
          user_id: oddsUserInfo?.user_id || '',
          user_name: oddsUserInfo?.user_name || '',
          launch_token_project: selectedProject,
        },
      });
    } catch {}
  }, [wallet, currentAccountType, accountInfo?.sandbox_account, oddsUserInfo?.user_id, oddsUserInfo?.user_name, selectedProject]);

  /**
   * Render the content for the selected module
   * @param moduleId - The module ID to render content for
   * @returns The corresponding component for the module
   */
  const renderModuleContent = (moduleId: LaunchTokenProjectId) => {
    switch (moduleId) {
      case 'uniswap':
        return <UniswapCreateCoin />;
      default:
        return <UniswapCreateCoin />;
    }
  };

  return (
    <div className="w-full px-4 md:px-12 flex justify-center md:justify-start">
      <div className="w-full max-w-4xl">
        {/* Module Selection Tabs */}
        <ProjectSelector
          projectIds={LAUNCH_TOKEN_PROJECT_IDS}
          getProject={(id) => getLaunchTokenProject(id as LaunchTokenProjectId)}
          selectedProject={selectedProject}
          onProjectSelect={(id) => setSelectedProject(id as LaunchTokenProjectId)}
        />

        {/* Module Content */}
        <Tabs
          value={selectedProject}
          onValueChange={(value) => setSelectedProject(value as LaunchTokenProjectId)}
          className="w-full"
        >
          <TabsContent value="uniswap" className="mt-0">
            {renderModuleContent('uniswap')}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
