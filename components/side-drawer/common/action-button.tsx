import { WithLoading } from '@/components/with-loading';
import { Button } from '@/components/ui/button';

interface ActionButtonProps {
  disabled: boolean;
  onClick: () => void;
  isPending: boolean;
  children: React.ReactNode;
}

export function ActionButton({ disabled, onClick, isPending, children }: ActionButtonProps) {
  return (
    <div className="mt-6 flex flex-shrink-0">
      <Button
        disabled={disabled}
        onClick={onClick}
        className="w-full"
        variant="default"
        size="sm"
      >
        <div className="flex w-full items-center justify-center truncate">
          <WithLoading isLoading={!!isPending} className="mr-2" />
          <div className="flex items-center truncate py-0.5">
            {children}
          </div>
        </div>
      </Button>
    </div>
  );
}
