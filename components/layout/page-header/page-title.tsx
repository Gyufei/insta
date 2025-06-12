import Image from 'next/image';

export default function PageTitle({ title, src }: { title: string; src: string | null }) {
  return (
    <div className="flex max-w-container-main h-[34px] w-full pt-8 pb-12 justify-start bg-white rounded-t-xl pl-4 sm:pl-12">
      <div className="flex items-center">
        {src && <Image src={src} alt={title} className="mr-2" width={24} height={24} />}
        <h1 className="text-2xl font-semibold text-primary leading-[24px]">{title}</h1>
      </div>
    </div>
  );
}
