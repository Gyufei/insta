'use client';

import { ChevronUp, Info } from 'lucide-react';

interface SlippageSettingsProps {
  slippage: string;
  onSlippageChange: (value: string) => void;
  customSlippage: boolean;
  onCustomSlippageChange: (value: boolean) => void;
}

export default function SlippageSettings({
  slippage,
  onSlippageChange,
  customSlippage,
  onCustomSlippageChange,
}: SlippageSettingsProps) {
  return (
    <div className="mt-4 flex items-center justify-between xxl:mt-6">
      <div className="flex h-18 w-full flex-col">
        <div className="mb-4 flex items-center">
          <div className="text-14 leading-none text-grey-pure">
            <div className="flex">Slippage</div>
          </div>
          <div
            role="tooltip"
            className="flex cursor-pointer items-center justify-center text-9 leading-none text-grey-pure transition-colors duration-150 hover:text-ocean-blue-pure dark:hover:text-light ml-1 h-4 w-4"
          >
            <Info width="16" height="16" />
          </div>
        </div>

        <div className="flex w-full items-center justify-between dark:text-white">
          <div className="flex items-center">
            <div
              className="group flex cursor-pointer items-center mr-3"
              onClick={() => onCustomSlippageChange(false)}
            >
              <div
                className={`transition-color flex h-5 w-5 items-center justify-center rounded-full border duration-150 group-hover:border-ocean-blue-pure dark:group-hover:border-light ${!customSlippage ? 'border-ocean-blue-pure dark:border-light' : 'border-grey-pure'}`}
              >
                {!customSlippage && (
                  <div className="h-2 w-2 rounded-full bg-ocean-blue-pure dark:bg-light"></div>
                )}
              </div>
            </div>

            <div className="relative text-left">
              <div className="flex flex-grow">
                <button
                  aria-label="Select Price Impact"
                  aria-haspopup="true"
                  className="flex items-center justify-center flex-shrink-0 font-semibold transition-colors duration-75 ease-out select-none whitespace-nowrap disabled:opacity-50 focus:outline-none rounded-xs text-11 xxl:text-12 flex items-center justify-between gap-8 px-3 py-2 bg-ocean-blue-pure bg-opacity-10 dark:text-ocean-blue-pale dark:bg-opacity-17 hover:bg-opacity-25 focus:bg-opacity-25 active:bg-opacity-38 dark:active:bg-opacity-38 dark:hover:bg-opacity-25 dark:focus:bg-opacity-25 text-ocean-blue-pure !w-20 xxl:!w-24"
                  style={{ height: '38px' }}
                >
                  <div className="flex w-full items-center justify-between">
                    <span>{slippage}%</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-xs bg-white dark:bg-opacity-17">
                      <ChevronUp className="h-3 w-3" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div
              className="group flex cursor-pointer items-center mr-3"
              onClick={() => onCustomSlippageChange(true)}
            >
              <div
                className={`transition-color flex h-5 w-5 items-center justify-center rounded-full border duration-150 group-hover:border-ocean-blue-pure dark:group-hover:border-light ${customSlippage ? 'border-ocean-blue-pure dark:border-light' : 'border-grey-pure'}`}
              >
                {customSlippage && (
                  <div className="h-2 w-2 rounded-full bg-ocean-blue-pure dark:bg-light"></div>
                )}
              </div>
            </div>

            <div className="w-24">
              <div className="flex w-full flex-shrink-0 flex-col">
                <div className="relative rounded-sm">
                  <input
                    autoComplete="off"
                    type="text"
                    inputMode="decimal"
                    placeholder="Custom"
                    disabled={!customSlippage}
                    className="form-input w-full pl-2 pr-6"
                  />
                </div>
                <div className="h-0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
