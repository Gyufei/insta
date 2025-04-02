import { create } from 'zustand'

export type SideDrawerComponent = 'Balance' | 'AccountSetting' | 'DepositMon' | 'WithdrawMon' | null

type SideDrawerState = {
  currentComponent: SideDrawerComponent
  setCurrentComponent: (component: SideDrawerComponent) => void
}

export const useSideDrawerStore = create<SideDrawerState>((set) => ({
  currentComponent: 'Balance',
  setCurrentComponent: (component) => set({ currentComponent: component }),
}))
