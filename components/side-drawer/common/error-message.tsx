import { CircleX } from 'lucide-react';

interface ErrorMessageProps {
  show: boolean;
  message: string;
}

export function ErrorMessage({ show, message }: ErrorMessageProps) {
  if (!show) return null;

  return (
    <div className="mt-6 rounded-sm bg-red-400/15 p-2">
      <div className="flex">
        <div className="flex-shrink-0">
          <CircleX className="h-5 w-5 text-red-500 dark:opacity-90" />
        </div>
        <div className="ml-2">
          <div className="mb-1 text-xs leading-5 font-medium text-red-700 last:mb-0">
            <ul className="list-disc pl-4">
              <li>{message}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
