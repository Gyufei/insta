'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  MONAD_TESTNET_NAME,
  NetworkConfigs,
} from '@/config/network-config';

// URL参数到网络ID的映射
const URL_PARAM_TO_NETWORK: Record<string, string> = {
  'monad': String(NetworkConfigs.monadTestnet.id),
  'base': String(NetworkConfigs.base.id),
  'eth': String(NetworkConfigs.eth.id),
};

export default function UrlParamInitializer() {
  const { chainId, switchNetwork } = useAppKitNetwork();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 只在组件挂载时执行一次，避免无限循环
    const chainParam = searchParams.get('chain');
    
    if (chainParam && URL_PARAM_TO_NETWORK[chainParam]) {
      const targetNetworkId = URL_PARAM_TO_NETWORK[chainParam];
      
              // 如果当前网络与URL参数不匹配，则切换网络
        if (String(chainId) !== targetNetworkId) {
          // 根据URL参数找到对应的网络配置
          let targetNetwork;
          if (chainParam === 'monad') {
            targetNetwork = { ...NetworkConfigs.monadTestnet, name: MONAD_TESTNET_NAME };
          } else if (chainParam === 'base') {
            targetNetwork = NetworkConfigs.base;
          } else if (chainParam === 'eth') {
            targetNetwork = NetworkConfigs.eth;
          }
          
          if (targetNetwork) {
            switchNetwork(targetNetwork);
          }
        }
    }
  }, []); // 空依赖数组，只在组件挂载时执行

  return null; // 这个组件不渲染任何内容
}
