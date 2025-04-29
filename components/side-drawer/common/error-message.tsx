import { CircleX } from 'lucide-react';

import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  show: boolean;
  message: string;
  className?: string;
}

export function ErrorMessage({ show, message, className }: ErrorMessageProps) {
  if (!show) return null;

  let displayMessage = message;

  if (message.includes('User rejected the request.')) {
    displayMessage = 'User rejected the request.';
  }

  return (
    <div className={cn('mt-6 rounded-sm bg-red-400/15 dark:bg-red-500/10 p-2', className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          <CircleX className="h-5 w-5 text-red-500 dark:text-red-400" />
        </div>
        <div className="ml-2 w-[calc(100%-30px)]">
          <div className="mb-1 text-xs leading-5 font-medium text-red-700 dark:text-red-300 last:mb-0">
            <ul className="list-disc pl-4">
              <li>{displayMessage}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
