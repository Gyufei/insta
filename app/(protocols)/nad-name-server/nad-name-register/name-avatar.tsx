import Image from 'next/image';

export function NameAvatar({ name }: { name: string }) {
  return (
    <div className="relative">
      <div className="w-32 rounded aspect-square flex flex-col justify-between p-3 bg-gradient-to-br from-[hsl(326deg,94%,32%)] via-[hsl(303deg,100%,18%)] to-[hsl(263deg,100%,16%)]">
        <div className="flex flex-row items-start">
          <Image
            alt="Monad"
            loading="lazy"
            width="24"
            height="24"
            decoding="async"
            src="/icons/monad.svg"
            className="text-transparent"
          />
          <div className="flex-grow" />
        </div>
        <div className="flex flex-row justify-center">
          <p className="text-primary-foreground font-bold text-xs">{name}.nad</p>
        </div>
      </div>
    </div>
  );
}
