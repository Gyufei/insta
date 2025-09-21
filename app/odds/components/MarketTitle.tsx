import Link from 'next/link';

interface MarketTitleProps {
  title: string;
  id: number;
}

export default function MarketTitle({ title, id }: MarketTitleProps) {
  return (
    <Link
      className="h-fit w-full relative cursor-pointer group block"
      href={`/odds/market/${id}?chain=monad`}
    >
      <div className="max-w-[calc(100%)] w-full @container mb-2">
        <div className="flex flex-col justify-center min-h-[36px]">
          <div
            className="flex flex-col justify-center min-h-[36px]"
            style={{ paddingRight: '0px' }}
          >
            <p className="text-lg font-semibold w-fit line-clamp-3 lg:line-clamp-2 text-pretty text-text decoration-2 min-w-0 pl-0 leading-[20px] hover:line-clamp-3">
              {title}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}