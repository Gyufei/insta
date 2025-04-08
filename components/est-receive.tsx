import Image from 'next/image';

export function EstReceive({
  symbol,
  logo,
  amount
}: {
  symbol: string;
  logo: string;
  amount: string;
}) {
  return (
    <>
      <div className="mt-6 flex flex-shrink-0 flex-wrap items-center justify-between">
        <div className="mr-3 flex flex-col items-start">
          <div className="text-grey-pure mb-5 flex text-sm leading-none">
            <div className="flex">Estimated Receive {symbol}</div>
          </div>
          <div className="h-6 text-xl leading-none font-medium text-ocean-blue-pure">{amount}</div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center dark:opacity-90">
          <div className="flex max-w-full flex-shrink-0 flex-grow overflow-visible rounded-full">
            <Image
              src={logo}
              className="h-10 w-10 flex-grow object-contain"
              width={40}
              height={40}
              alt="receive token"
            />
          </div>
        </div>
      </div>
    </>
  );
}
