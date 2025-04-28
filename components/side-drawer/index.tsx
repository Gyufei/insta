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
import { NadNameTransfer } from '@/app/(protocols)/nad-name-server/nad-name-transfer';
import { UniswapAddLiquidity } from '@/app/(protocols)/uniswap/add-liquidity';
import { UniswapCreatePosition } from '@/app/(protocols)/uniswap/create-position';
import { UniswapRemoveLiquidity } from '@/app/(protocols)/uniswap/remove-liquidity';
import { UniswapSwap } from '@/app/(protocols)/uniswap/swap';

import { SideDrawerComponent, useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';

import { AccountSetting } from './account-setting';
import { Balance } from './balance';
import { DepositToken } from './deposit-token';
import { WithdrawToken } from './withdraw-token';

const COMPONENT_MAP: Record<SideDrawerComponent, React.ComponentType> = {
  Balance: Balance,
  AccountSetting: AccountSetting,
  DepositMon: DepositToken,
  WithdrawMon: WithdrawToken,
  AprioriDeposit: AprioriDeposit,
  AprioriWithdraw: AprioriWithdraw,
  NadFunBuyToken: NadFunBuyToken,
  NadFunSellToken: NadFunSellToken,
  NadFunCreateToken: NadFunCreateToken,
  NadNameSetPrimary: NadNameSetPrimary,
  NadNameRegister: NadNameRegister,
  NadNameTransfer: NadNameTransfer,
  MagmaDeposit: MagmaDeposit,
  MagmaWithdraw: MagmaWithdraw,
  UniswapSwap: UniswapSwap,
  UniswapCreatePosition: UniswapCreatePosition,
  UniswapAddLiquidity: UniswapAddLiquidity,
  UniswapRemoveLiquidity: UniswapRemoveLiquidity,
} as const;

const ANIMATION_CONFIG = {
  type: 'spring',
  damping: 30,
  stiffness: 300,
  mass: 0.5,
} as const;

const SideDrawer = () => {
  const { isOpen, currentComponent } = useSideDrawerStore();

  const renderContent = () => {
    if (!currentComponent?.name) return null;
    const Component = COMPONENT_MAP[currentComponent.name as SideDrawerComponent];
    return Component ? <Component /> : null;
  };

  if (!currentComponent) {
    return null;
  }

  const containerStyle = {
    maxWidth: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%)',
  };

  return (
    <div
      className={cn(
        'grid-sidebar-context absolute inset-y-0 right-0 z-10 flex w-full flex-col overflow-hidden ring-1 ring-black/5 duration-200 2xl:relative 2xl:transform-none',
        isOpen ? 'translate-x-0' : 'translate-x-full 2xl:translate-x-0'
      )}
      style={containerStyle}
      data-v-ead27774=""
    >
      <AnimatePresence mode="wait">
        <motion.div
          className="h-full"
          key={currentComponent?.name}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: 0 }}
          transition={ANIMATION_CONFIG}
        >
          <div className="bg-background flex h-full flex-col" style={containerStyle}>
            {renderContent()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SideDrawer;
