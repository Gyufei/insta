import Image from 'next/image';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useClickOutside } from '@/lib/utils/use-click-outside';
import { INetworkConfig, MonadTestnetName, NetworkConfigs } from '@/config/network-config';

const NETWORKS = [
  {
    ...NetworkConfigs.monadTestnet,
    name: MonadTestnetName,
  },
] as const;

export default function NetworkSelect() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<INetworkConfig>(NETWORKS[0]);
  const [ref, hasClickedOutside] = useClickOutside();

  function toggleOpen() {
    setIsOpen(!isOpen);
  }

  function handleClick(network: INetworkConfig) {
    setSelectedNetwork(network);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    if (hasClickedOutside && isOpen) {
      setIsOpen(false);
    }
  }, [hasClickedOutside, isOpen]);

  return (
    <div className="relative text-left" ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="flex flex-grow">
        <button
          className="bg-grey-pure/10 hover:bg-grey-pure/20 focus:bg-grey-pure/20 flex w-full flex-shrink-0 cursor-pointer items-center justify-center rounded-sm px-2 py-2 text-xs leading-5 font-semibold whitespace-nowrap transition-colors duration-75 ease-out select-none focus:outline-none disabled:opacity-50"
          onClick={toggleOpen}
        >
          <div className="mr-2 inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-xs dark:opacity-90">
            <Image src={selectedNetwork.icon} alt={selectedNetwork.name} width={20} height={20} />
          </div>
          <span className="mr-4 hidden capitalize md:inline">{selectedNetwork.name}</span>
          <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-xs bg-white dark:bg-white/15">
            <ChevronDown size={16} className={cn(isOpen && 'rotate-180')} />
          </div>
        </button>
      </div>

      {isOpen && (
        <>
          {NETWORKS.map((network) => (
            <div
              key={network.name}
              onClick={() => handleClick(network)}
              className="absolute right-0 left-0 z-10 mt-1"
            >
              <div className="border-grey-light/75 shadow-notification dark:border-grey-light/50 dark:bg-dark-400 divide-grey-light/50 w-40 flex-shrink-0 origin-top-right flex-col divide-y overflow-hidden rounded border bg-white px-0 py-1 pt-0 pb-0 shadow select-none dark:shadow-none">
                <div className="hover:bg-grey-light/50 focus:bg-grey-light/50 dark:hover:bg-dark-300/50 dark:focus:bg-dark-300/50 flex items-center px-2 py-[12px] leading-5 focus:outline-none">
                  <div className="mr-2 inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-sm dark:opacity-90">
                    <Image src={network.icon} alt={network.name} width={20} height={20} />
                  </div>
                  <span className="capitalize">{network.name}</span>
                  {selectedNetwork.name === network.name && (
                    <div className="ml-auto flex h-6 w-6 items-center justify-center">
                      <Check className="w-5 text-[#3F75FF]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
