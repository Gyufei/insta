import Image from 'next/image';

export function TokenPairImg({
  src1,
  src2,
  width1 = 56,
  height1 = 56,
  width2 = 14,
  height2 = 14,
}: {
  src1: string;
  src2: string | undefined;
  width1?: number;
  height1?: number;
  width2?: number;
  height2?: number;
}) {
  return (
    <div className="relative h-fit">
      <Image src={src1} width={width1} height={height1} alt="token1" className="rounded-full" />
      {src2 && (
        <div className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-white">
          <Image src={src2} width={width2} height={height2} alt="token2" className="rounded-full" />
        </div>
      )}
    </div>
  );
}
