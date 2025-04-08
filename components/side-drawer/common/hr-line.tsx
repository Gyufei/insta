import { cn } from '@/lib/utils';

export function HrLine({ className }: { className?: string }) {
  return (
    <hr
      className={cn('border-grey-light mt-4 h-0 border-t 2xl:mt-6 dark:border-white/35', className)}
    />
  );
}
