import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface TokenCardProps {
  /**
   * 代币图标URL
   */
  logo: string;
  /**
   * 代币符号
   */
  symbol?: string;
  /**
   * 标题文本
   */
  title: string;
  /**
   * 内容区域，可以是文本或自定义组件
   */
  content: ReactNode;
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 代币信息卡片组件
 * 用于显示代币相关信息，包括图标、标题和内容
 */
export function TokenDisplayCard({
  logo,
  symbol,
  title,
  content,
  className
}: TokenCardProps) {
  return (
    <Card className={`py-0 ${className || ''}`}>
      <CardContent className="flex items-center justify-between p-3">
        <div className="flex flex-col items-start">
          <div className="text-muted-foreground mb-1 flex text-xs font-medium">
            {title} {symbol ? symbol : ''}
          </div>
          <div className="text-foreground h-6 text-lg leading-none font-semibold">
            {content}
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center">
          <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full bg-primary-foreground/80 p-1 shadow-none dark:bg-primary-foreground/10">
            <Image
              src={logo}
              className="h-8 w-8 flex-grow object-contain rounded-full"
              width={32}
              height={32}
              alt={symbol ? `${symbol} token` : 'token'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 