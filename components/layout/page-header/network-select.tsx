import Image from 'next/image';
import { useState } from 'react';
import { INetworkConfig, MONAD_TESTNET_NAME, NetworkConfigs } from '@/config/network-config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NETWORKS = [
  {
    ...NetworkConfigs.monadTestnet,
    name: MONAD_TESTNET_NAME,
  },
] as const;

export default function NetworkSelect() {
  const [selectedNetwork, setSelectedNetwork] = useState<INetworkConfig>(NETWORKS[0]);

  return (
    <Select
      value={selectedNetwork.name}
      onValueChange={(value) => {
        const network = NETWORKS.find((n) => n.name === value);
        if (network) {
          setSelectedNetwork(network);
        }
      }}
    >
      <SelectTrigger className="shadow-none bg-transparent border-black/10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {NETWORKS.map((network) => (
          <SelectItem key={network.name} value={network.name}>
            <Image src={network.icon} alt={network.name} width={20} height={20} />
            <span className="capitalize text-primary">{network.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
