import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WithLoading({
  isPending,
  children,
  className,
}: {
  isPending: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <>{isPending ? <LoaderCircle className={cn('h-4 w-4 animate-spin', className)} /> : children}</>
  );
}
