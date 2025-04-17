import { create } from 'zustand';

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
  | 'MagmaDeposit'
  | 'MagmaWithdraw'
  | null;

type CurrentComponent = {
  name: SideDrawerComponent;
  props?: CompProps;
};

type CompProps = {
  token?: {
    address: string;
    symbol: string;
    name: string;
    logo: string;
    balance: string;
  };
  registerName?: string;
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
