import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WithLoading({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <>{isLoading ? <LoaderCircle className={cn('h-4 w-4 animate-spin', className)} /> : children}</>
  );
}
