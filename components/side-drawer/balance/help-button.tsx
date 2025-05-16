import { HelpCircle } from 'lucide-react';

export default function HelpButton() {
  return (
    <div className="mt-4 h-10 flex justify-start">
      <button
        className="text-xs bg-[#FFF6E1] hover:bg-[#FFF6E180] text-[#F3C024] flex flex-1 flex-shrink-0 items-center justify-center rounded-sm px-4 py-2 whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none"
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
