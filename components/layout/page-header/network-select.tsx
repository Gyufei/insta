import Image from 'next/image';
import { useState } from 'react';
import { INetworkConfig, MonadTestnetName, NetworkConfigs } from '@/config/network-config';
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
    name: MonadTestnetName,
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
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {NETWORKS.map((network) => (
          <SelectItem key={network.name} value={network.name}>
            <Image src={network.icon} alt={network.name} width={20} height={20} />
            <span className="capitalize">{network.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
