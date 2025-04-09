import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CurrentAccountAddressKey = 'Current_Account_Address';

type AccountState = {
  currentAccountAddress: string | null;
  setCurrentAccountAddress: (address: string | null) => void;
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      currentAccountAddress: null,
      setCurrentAccountAddress: (address) => set({ currentAccountAddress: address }),
    }),
    {
      name: CurrentAccountAddressKey,
    }
  )
);
