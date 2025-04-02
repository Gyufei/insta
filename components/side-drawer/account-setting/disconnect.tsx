import { useDisconnect } from '@reown/appkit/react';
import { Power } from 'lucide-react';

export function Disconnect() {
  const { disconnect } = useDisconnect();

  function handleDisconnect() {
    disconnect();
  }

  return (
    <div className="border-grey-light/50 relative mx-auto flex h-18 w-full items-center justify-center border-t py-2">
      <button
        onClick={handleDisconnect}
        className="cursor-pointer text-xs text-passion-orange-pure hover:bg-passion-orange-light flex flex-shrink-0 items-center justify-center rounded-sm bg-none px-4 py-2 font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
      >
        <Power className="mr-2 h-4 w-4" />
        Disconnect
      </button>
      <div
        className="to-background dark:to-dark-500 pointer-events-none absolute inset-x-0 h-8 w-full bg-gradient-to-b from-transparent"
        style={{ top: '-33px' }}
      ></div>
    </div>
  );
}
