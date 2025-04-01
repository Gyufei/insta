import Aave from '@/app/aave/aave';
import BorrowForm from './aave/borrow-form';

export default function Home() {
  return (
    <>
      <div className="grid-main relative flex flex-grow flex-col overflow-x-hidden dark:bg-dark-600 2xl:bg-white" data-v-ead27774="">
        <Aave />
      </div>

      <div
        className="absolute inset-y-0 right-0 z-10 flex flex-col w-full overflow-hidden bg-background ring-1 ring-black/5 dark:bg-dark-500 dark:shadow-none 2xl:relative 2xl:translate-x-0 2xl:transform-none grid-sidebar-context translate-x-full duration-200"
        style={{ maxWidth: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%' }}
        data-v-ead27774=""
      >
        <BorrowForm />
      </div>
    </>
  );
}
