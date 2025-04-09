import { Copy } from 'lucide-react';
import Image from 'next/image';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface TokenHeaderProps {
  token: {
    symbol: string;
    name: string;
    logo?: string;
    address?: string;
  };
}

export function TokenHeader({ token }: TokenHeaderProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard(token?.address || '');

  useEffect(() => {
    if (isCopied) {
      toast.success('Copied to clipboard');
    }
  }, [isCopied]);

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center">
          <h2 className="text-3xl font-bold">{token?.symbol}</h2>
          <span className="rounded px-2 py-1 text-sm text-gray-400">{token?.name}</span>
        </div>
        <div className="flex h-12 w-12 items-center rounded-full">
          {token?.logo && (
            <Image
              src={token?.logo}
              alt={token?.name}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
        </div>
      </div>

      <div className="bg-grey-pure/20 mt-4 mb-4 flex items-center gap-2 rounded-sm p-1">
        <span className="flex items-center truncate font-mono text-xs text-gray-500">
          {token?.address || '0x916e57F62e068635E93942Cd9Ee65e3fd4De2379'}
        </span>
        <button onClick={copyToClipboard} className="flex cursor-pointer items-center">
          <Copy className="h-4 w-4 text-gray-500" />
        </button>
      </div>
    </>
  );
}
