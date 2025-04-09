import { ERROR_MESSAGES } from '@/config/error-msg';
import { MonadTestnetName, NetworkConfigs } from '@/config/network-config';
import { useAppKitNetwork } from '@reown/appkit/react';
import { TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

export function CurrentNetwork() {
  const { chainId, caipNetwork, switchNetwork } = useAppKitNetwork();
  const isRightNetwork = chainId === NetworkConfigs.monadTestnet.id;
  const networkName = isRightNetwork ? MonadTestnetName : caipNetwork?.name;

  async function handleSwitchNetwork() {
    if (isRightNetwork) {
      return;
    }

    try {
      await switchNetwork(NetworkConfigs.monadTestnet);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : ERROR_MESSAGES.FAIL_TO_SWITCH_NETWORK);
    }
  }

  return (
    <>
      {isRightNetwork ? (
        <div className="bg-green-light text-green-pure dark:bg-green-pure/15 ml-4 hidden items-center rounded-sm px-2 py-1 text-xs font-medium whitespace-nowrap select-none sm:flex">
          <div>
            <div className="text-center text-xs leading-none uppercase">{networkName}</div>
            <div className="font-regular text-center text-xs leading-none">connected</div>
          </div>
        </div>
      ) : (
        <div className="sm:dark:border-yellow-pure ml-4 flex flex-col rounded-sm sm:border-[1.5px]">
          <div className="bg-yellow-light/15 text-yellow-pure dark:bg-yellow-pure/15 hidden items-center rounded-t-sm px-2 py-1 text-xs font-medium whitespace-nowrap select-none sm:flex">
            <TriangleAlert className="mr-1 h-4 dark:opacity-90" />
            <div className="text-center text-xs leading-none font-semibold">
              <span className="uppercase">{networkName}</span>
              <span className="text-[10px] font-medium">&nbsp;Connected</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSwitchNetwork}
            className="text-ocean-blue-pure cursor-pointer text-[10px] leading-6"
          >
            Switch to {MonadTestnetName}
          </button>
        </div>
      )}
    </>
  );
}
