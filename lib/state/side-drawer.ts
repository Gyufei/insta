import { create } from 'zustand';

import { IMarketData } from '@/app/odds/common/use-market-detail';

import { IToken } from '../../config/tokens';
import { IAmbientPosition } from '../data/use-ambient-position';
import { IUniswapPosition } from '../data/use-uniswap-position';

export type SideDrawerComponent =
  | 'Balance'
  | 'AccountSetting'
  | 'DepositMon'
  | 'WithdrawMon'
  | 'AprioriDeposit'
  | 'AprioriWithdraw'
  | 'NadFunCreateToken'
  | 'NadFunBuyToken'
  | 'NadFunSellToken'
  | 'NadNameSetPrimary'
  | 'NadNameRegister'
  | 'NadNameTransfer'
  | 'MagmaDeposit'
  | 'MagmaWithdraw'
  | 'UniswapSwap'
  | 'UniswapCreatePosition'
  | 'UniswapAddLiquidity'
  | 'UniswapRemoveLiquidity'
  | 'AmbientCreatePosition'
  | 'AmbientAddLiquidity'
  | 'AmbientRemoveLiquidity'
  | 'OddsMarketSellAndBuy';

type CurrentComponent = {
  name: SideDrawerComponent | null;
  props?: CompProps;
};

type CompProps = {
  token?: IToken & {
    balance?: string;
  };
  registerName?: string;
  uniswapPosition?: IUniswapPosition;
  ambientPosition?: IAmbientPosition;
  oddsMarket?: IMarketData;
  [key: string]: unknown;
} | null;

type SideDrawerState = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentComponent: CurrentComponent | null;
  setCurrentComponent: (comp: CurrentComponent) => void;
};

export const useSideDrawerStore = create<SideDrawerState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => {
    set({ isOpen });
    if (!isOpen) {
      set({ currentComponent: { name: 'Balance' } });
    }
  },
  currentComponent: { name: 'Balance' },
  setCurrentComponent: ({ name, props }: CurrentComponent) => {
    set({ currentComponent: { name, props } });
    if (name !== 'Balance') {
      set({ isOpen: true });
    }
  },
}));
