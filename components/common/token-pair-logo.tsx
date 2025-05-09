import { NetworkConfigs } from '@/config/network-config';

import { LogoWithPlaceholder } from '@/components/common/logo-placeholder';

import { IToken } from '@/config/tokens';

export function TokenPairLogo({ token0, token1 }: { token0: IToken; token1: IToken }) {
  const network = NetworkConfigs.monadTestnet;
  const networkLogo = network?.icon;

  return (
    <div className="flex items-stretch flex-basis-auto box-border relative min-h-0 min-w-0 flex-shrink-0 flex-col h-11 w-11">
      <div className="flex items-stretch flex-basis-auto box-border min-h-0 min-w-0 flex-shrink-0 flex-col left-0 overflow-hidden absolute top-0 w-[21px]">
        <div className="flex flex-basis-auto box-border min-h-0 min-w-0 flex-shrink-0 flex-col items-center h-11 justify-center pointer-events-auto w-11 relative">
          <LogoWithPlaceholder
            src={token0?.logo}
            className="h-8 w-8 object-contain rounded-full z-10 pr-4"
            width={37.07}
            height={37.07}
            name={token0?.symbol || ''}
          />
          <div className="flex items-stretch flex-basis-auto box-border min-h-0 min-w-0 flex-shrink-0 flex-col rounded-[22px] border-2 border-dashed border-neutral-300 h-11 w-11 absolute" />
        </div>
      </div>

      <div className="flex items-stretch flex-basis-auto box-border min-h-0 min-w-0 flex-shrink-0 flex-row-reverse overflow-hidden absolute right-0 top-0 w-[21px]">
        <div className="flex flex-basis-auto box-border min-h-0 min-w-0 flex-shrink-0 flex-col items-center h-11 justify-center pointer-events-auto w-11 relative">
          <LogoWithPlaceholder
            src={token1?.logo}
            className="h-8 w-8 object-contain rounded-full z-10 pl-4"
            width={37.07}
            height={37.07}
            name={token1?.symbol || ''}
          />
          <div className="flex items-stretch flex-basis-auto box-border min-h-0 min-w-0 flex-shrink-0 flex-col rounded-[22px] border-2 border-dashed border-neutral-300 h-11 w-11 absolute" />
        </div>
      </div>

      <div className="flex items-stretch flex-basis-auto min-h-0 min-w-0 flex-shrink-0 flex-col absolute -bottom-1 -right-1 z-10">
        <div className="flex bg-white items-center justify-center rounded-full w-5 h-5 flex-basis-auto relative min-h-0 min-w-0 flex-shrink-0 flex-col overflow-hidden z-10">
          <LogoWithPlaceholder
            src={networkLogo}
            className="w-4 h-4"
            width={16}
            height={16}
            name={network.name}
          />
        </div>
      </div>
    </div>
  );
}
