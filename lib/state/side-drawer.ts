import { create } from 'zustand';

import { IToken } from '../data/tokens';
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
  | 'UniswapRemoveLiquidity';

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
  setCurrentComponent: ({ name, props }: CurrentComponent) =>
    set({ currentComponent: { name, props } }),
}));
