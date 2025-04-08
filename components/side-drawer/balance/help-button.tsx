import { HelpCircle } from 'lucide-react';

export default function HelpButton() {
  return (
    <div className="mt-4 h-10 flex justify-start">
      <button
        className="text-xs bg-yellow-pure/10 hover:bg-yellow-pure/25 active:bg-yellow-pure/20 text-yellow-pure flex flex-1 flex-shrink-0 items-center justify-center rounded-sm px-4 py-2 font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
        style={{ justifyContent: 'start' }}
      >
        <div className="flex items-center">
          <div className="mr-2">
            <HelpCircle className="w-5 dark:opacity-90" />
          </div>
          <div>Not able to see your wallet balance?</div>
        </div>
      </button>
    </div>
  );
}
