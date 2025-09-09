'use client';

import { AnimatePresence, motion } from 'framer-motion';

import useOnclickOutside from 'react-cool-onclickoutside';

import { AmbientAddLiquidity } from '@/app/(protocols)/ambient/add-liquidity';
import { AmbientCreatePosition } from '@/app/(protocols)/ambient/create-position';
import { AmbientRemoveLiquidity } from '@/app/(protocols)/ambient/remove-liquidity';
import { AprioriDeposit } from '@/app/(protocols)/apriori/apriori-deposit';
import { AprioriWithdraw } from '@/app/(protocols)/apriori/apriori-withdraw';
import { MagmaDeposit } from '@/app/(protocols)/magma/magma-deposit';
import { MagmaWithdraw } from '@/app/(protocols)/magma/magma-withdraw';
import { NadFunCreateToken } from '@/app/(protocols)/nad-fun/nad-fun-create-token';
import { NadFunBuyToken } from '@/app/(protocols)/nad-fun/nadfun-buy-token';
import { NadFunSellToken } from '@/app/(protocols)/nad-fun/nadfun-sell-token';
import { NadNameRegister } from '@/app/(protocols)/nad-name-service/nad-name-register';
import { NadNameSetPrimary } from '@/app/(protocols)/nad-name-service/nad-name-set-primary';
import { NadNameTransfer } from '@/app/(protocols)/nad-name-service/nad-name-transfer';
import { UniswapAddLiquidity } from '@/app/(protocols)/uniswap/add-liquidity';
import { UniswapCreatePosition } from '@/app/(protocols)/uniswap/create-position';
import { UniswapRemoveLiquidity } from '@/app/(protocols)/uniswap/remove-liquidity';
import { BadgeNftBuy } from '@/app/badge-gallery/badge-nft-buy';
import { OddsMarketSellAndBuy } from '@/app/odds/market/market-sell-and-buy';

import { SideDrawerComponent, useSideDrawerStore } from '@/lib/state/side-drawer';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/lib/utils/use-mobile';

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
  UniswapCreatePosition: UniswapCreatePosition,
  UniswapAddLiquidity: UniswapAddLiquidity,
  UniswapRemoveLiquidity: UniswapRemoveLiquidity,
  AmbientCreatePosition: AmbientCreatePosition,
  AmbientAddLiquidity: AmbientAddLiquidity,
  AmbientRemoveLiquidity: AmbientRemoveLiquidity,
  OddsMarketSellAndBuy: OddsMarketSellAndBuy,
  BadgeNftBuy: BadgeNftBuy,
} as const;

const ANIMATION_CONFIG = {
  type: 'spring',
  damping: 30,
  stiffness: 300,
  mass: 0.5,
} as const;

const SideDrawer = () => {
  const isMobile = useIsMobile();
  const { isOpen, currentComponent, setIsOpen } = useSideDrawerStore();

  const ref = useOnclickOutside(() => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  });

  const renderContent = () => {
    if (!currentComponent?.name) return null;
    const Component = COMPONENT_MAP[currentComponent.name as SideDrawerComponent];
    return Component ? <Component /> : null;
  };

  if (!currentComponent) {
    return null;
  }

  return (
    <div
      className={cn(
        'grid-sidebar-context md:w-[360px] absolute bg-bg-gray inset-y-0 right-0 z-10 flex w-full flex-col overflow-hidden duration-200 2xl:relative 2xl:transform-none',
        !isMobile ? 'translate-x-0' : isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      ref={ref}
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
          <div className="flex h-full flex-col w-full md:w-[360px]">{renderContent()}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SideDrawer;
