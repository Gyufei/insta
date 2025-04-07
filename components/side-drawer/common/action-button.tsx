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
        className="disabled:bg-grey-light disabled:text-grey-pure dark:bg-dark-300 scale-down-sm bg-ocean-blue-pure hover:bg-ocean-blue-pale active:bg-ocean-blue-deep flex h-8 w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-3 text-sm leading-none font-semibold text-white shadow-none duration-0 outline-none select-none focus:outline-none active:shadow-none disabled:pointer-events-none disabled:cursor-not-allowed"
      >
        <div data-v-da16570e="" className="flex w-full items-center justify-center truncate">
          <WithLoading isPending={!!isPending} className="mr-2" />
          <div data-v-da16570e="" className="flex items-center truncate py-0.5">
            {children}
          </div>
        </div>
      </button>
    </div>
  );
}
