import { ButtonWithCheck } from '@/components/common/button-with-check';

export function PayWithToken() {
  return (
    <div className="flex flex-col gap-5 mt-6">
      <div className="text-[#131E40] font-medium text-sm">Select payment token</div>

      <div className="flex justify-between">
        <ButtonWithCheck
          className="w-[93px]"
          label="ETH"
          value="ETH"
          activeTab="ETH"
          onClick={() => {}}
        />
        <ButtonWithCheck
          className="w-[93px]"
          label="USDT"
          value="USDT"
          activeTab="USDT"
          onClick={() => {}}
        />
        <ButtonWithCheck
          className="w-[93px]"
          label="USDC"
          value="USDC"
          activeTab="USDC"
          onClick={() => {}}
        />
      </div>
    </div>
  );
}
