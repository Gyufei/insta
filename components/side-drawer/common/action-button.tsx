import { WithLoading } from '@/components/with-loading';

interface ActionButtonProps {
  disabled: boolean;
  onClick: () => void;
  isPending: boolean;
  children: React.ReactNode;
}

export function ActionButton({ disabled, onClick, isPending, children }: ActionButtonProps) {
  return (
    <div className="mt-6 flex flex-shrink-0">
      <button
        disabled={disabled}
        onClick={onClick}
        className="disabled:bg-gray-200 disabled:text-gray-300 dark:bg-slate-200 scale-down-sm bg-blue hover:bg-blue active:bg-blue flex h-8 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-3 text-sm leading-none font-semibold text-white shadow-none duration-0 outline-none select-none focus:outline-none active:shadow-none disabled:pointer-events-none disabled:cursor-not-allowed"
      >
        <div data-v-da16570e="" className="flex w-full items-center justify-center truncate">
          <WithLoading isLoading={!!isPending} className="mr-2" />
          <div data-v-da16570e="" className="flex items-center truncate py-0.5">
            {children}
          </div>
        </div>
      </button>
    </div>
  );
}
