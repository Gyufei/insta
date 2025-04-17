'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { AprioriDeposit } from '@/app/(protocols)/apriori/apriori-deposit';
import { AprioriWithdraw } from '@/app/(protocols)/apriori/apriori-withdraw';
import { MagmaDeposit } from '@/app/(protocols)/magma/magma-deposit';
import { MagmaWithdraw } from '@/app/(protocols)/magma/magma-withdraw';
import { NadFunCreateToken } from '@/app/(protocols)/nad-fun/nad-fun-create-token';
import { NadFunBuyToken } from '@/app/(protocols)/nad-fun/nadfun-buy-token';
import { NadFunSellToken } from '@/app/(protocols)/nad-fun/nadfun-sell-token';
import { NadNameRegister } from '@/app/(protocols)/nad-name-server/nad-name-register';
import { NadNameSetPrimary } from '@/app/(protocols)/nad-name-server/nad-name-set-primary';

import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';

import { AccountSetting } from './account-setting';
import { Balance } from './balance';
import { DepositToken } from './deposit-token';
import { WithdrawToken } from './withdraw-token';

const SideDrawer = () => {
  const { isOpen, currentComponent } = useSideDrawerStore();

  const renderContent = () => {
    switch (currentComponent?.name) {
      case 'Balance':
        return <Balance />;
      case 'AccountSetting':
        return <AccountSetting />;
      case 'DepositMon':
        return <DepositToken />;
      case 'WithdrawMon':
        return <WithdrawToken />;
      case 'AprioriDeposit':
        return <AprioriDeposit />;
      case 'AprioriWithdraw':
        return <AprioriWithdraw />;
      case 'NadFunBuyToken':
        return <NadFunBuyToken />;
      case 'NadFunSellToken':
        return <NadFunSellToken />;
      case 'NadFunCreateToken':
        return <NadFunCreateToken />;
      case 'NadNameSetPrimary':
        return <NadNameSetPrimary />;
      case 'NadNameRegister':
        return <NadNameRegister />;
      case 'MagmaDeposit':
        return <MagmaDeposit />;
      case 'MagmaWithdraw':
        return <MagmaWithdraw />;
      default:
        return null;
    }
  };

  if (!currentComponent) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid-sidebar-context absolute inset-y-0 right-0 z-10 flex w-full flex-col overflow-hidden ring-1 ring-black/5 duration-200 2xl:relative 2xl:transform-none',
        isOpen ? 'translate-x-0' : 'translate-x-full 2xl:translate-x-0'
      )}
      style={{ maxWidth: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%)' }}
      data-v-ead27774=""
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="h-full"
          key={currentComponent?.name}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: 0 }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300,
            mass: 0.5,
          }}
        >
          <div
            className="bg-background flex h-full flex-col"
            style={{
              width: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%)',
            }}
          >
            {renderContent()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SideDrawer;
