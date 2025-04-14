import Image from 'next/image';
import { Cable } from 'lucide-react';

export function ConnectWalletButton({ address }: { address: string }) {
  return (
    <button className="dark:bg-slate-600 text-blue flex w-full items-center gap-2.5 rounded-sm border bg-white p-4">
      <Image src="/icons/logo-small.svg" alt="logo" width={20} height={20} />
      <div className="flex flex-col gap-2">
        <h1 className="text-base dark:text-primary-foreground text-left leading-[11px] font-semibold text-slate-900">
          Connect Wallet
        </h1>
        <h2 className="text-xs text-left leading-[8px] font-semibold text-slate-400">{address}</h2>
      </div>
      <Cable className="text-blue ml-auto"  />
    </button>
  );
}
