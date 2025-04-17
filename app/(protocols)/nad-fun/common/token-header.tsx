import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect } from 'react';

import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';

import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';

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
    <Card className="py-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col items-start">
            <div className="text-muted-foreground mb-1 flex text-xs font-medium">{token?.name}</div>
            <div className="text-foreground text-xl leading-none font-semibold">
              {token?.symbol}
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center">
            {token?.logo && (
              <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full bg-white/80 p-1 shadow-sm dark:bg-white/10">
                <Image
                  src={token?.logo}
                  alt={token?.name}
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain rounded-full"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-sm bg-gray-200/20 p-1 text-gray-400">
          <span className="text-gray-400 flex items-center truncate font-mono text-xs">
            {token?.address || '0x916e57F62e068635E93942Cd9Ee65e3fd4De2379'}
          </span>
          <button onClick={copyToClipboard} className="flex cursor-pointer items-center">
            <Copy className="text-gray-300-500 h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
