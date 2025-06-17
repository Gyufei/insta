import { Sparkles, UsersRound } from 'lucide-react';

import { BadgeTitle } from './badge-title';
import { SwapPic } from './swap-img';

export function BadgeContent() {
  return (
    <div className="px-4 2xl:px-12">
      <BadgeTitle />

      <div className="flex">
        <div className="flex flex-1 gap-2 flex-col mt-4">
          <SwapPic />

          <div className="mt-8 flex flex-col gap-3.5 flex-wrap">
            <div className="font-medium text-lg leading-6">TROUBLE PENGU🐧</div>
            <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-2 text-sm leading-5">
              <div className="flex gap-2 items-center">
                <Sparkles className="w-4 h-4" />
                <span className="capitalize">legendary</span>
              </div>
              <div className="flex gap-2 items-center">
                <UsersRound className="w-4 h-4" />
                <span>8</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1"></div>
      </div>
    </div>
  );
}
