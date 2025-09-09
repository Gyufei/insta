'use client';

import { WithLoading } from '@/components/common/with-loading';
import { useAccountList } from '@/components/side-drawer/account-setting/use-account-list';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { AccountCard } from './account-card';

export function AccountList() {
  const {
    allAccounts,
    currAccountInfo,
    isCreatePending: isPending,
    handleCreateAccount,
    handleToggleAccount: handleAccountClick,
    tooLessGasForCreate,
  } = useAccountList();

  return (
    <div className="mt-4 grid grid-cols-1 gap-4">
      {allAccounts?.map((account) => (
        <AccountCard
          key={account.id}
          accountInfo={account}
          isCurrent={currAccountInfo?.sandbox_account === account.sandbox_account}
          onClick={() => handleAccountClick(account.sandbox_account)}
        />
      ))}
      {tooLessGasForCreate ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col gap-2">
              {tooLessGasForCreate && (
                <div className="flex text-sm md:hidden justify-center items-center my-1 text-red-200">
                  Insufficient Monad gas for create account
                </div>
              )}
              <button
                disabled
                className="text-primary hover:border-blue hover:text-blue focus:border-blue focus:text-blue dark:text-primary-foreground dark:hover:text-blue flex h-8 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-primary-foreground text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
              >
                <WithLoading isLoading={!!isPending}>+ New</WithLoading>
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>Insufficient Monad gas for create account</TooltipContent>
        </Tooltip>
      ) : (
        <button
          disabled={isPending}
          onClick={handleCreateAccount}
          className="text-primary hover:border-blue hover:text-blue focus:border-blue focus:text-blue dark:text-primary-foreground dark:hover:text-blue flex h-8 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-primary-foreground text-xs font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
        >
          <WithLoading isLoading={!!isPending}>+ New</WithLoading>
        </button>
      )}
    </div>
  );
}
