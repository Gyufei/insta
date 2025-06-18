import { ButtonWithCheck } from '@/components/common/button-with-check';
import { Button } from '@/components/ui/button';

export function PayWithToken() {
  const payNum = '0.005';
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

      <Button className="w-full bg-[#6E75F9] text-white rounded text-xs font-medium hover:bg-[#6E75F990] disabled:bg-gray-200 disabled:text-gray-500">
        Pay {payNum} ETH
      </Button>
    </div>
  );
}
