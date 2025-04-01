import Aave from '@/app/aave/aave';
import BalanceDisplay from '@/components/balance/wallet-dashboard';

export default function Home() {
  return (
    <>
      <div
        className="grid-main dark:bg-dark-600 relative flex flex-grow flex-col overflow-x-hidden 2xl:bg-white"
        data-v-ead27774=""
      >
        <Aave />
      </div>

      <div
        className="bg-background dark:bg-dark-500 grid-sidebar-context absolute inset-y-0 right-0 z-10 flex w-full translate-x-full flex-col overflow-hidden ring-1 ring-black/5 duration-200 2xl:relative 2xl:translate-x-0 2xl:transform-none dark:shadow-none"
        style={{ maxWidth: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%' }}
        data-v-ead27774=""
      >
        <BalanceDisplay />
      </div>
    </>
  );
}
