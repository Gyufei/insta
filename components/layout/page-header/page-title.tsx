import Image from 'next/image';

export default function PageTitle({ title, src }: { title: string; src: string | null }) {
  return (
    <div className="flex w-full md:pt-8 md:pb-12 pt-5 pb-6 justify-start pl-4 md:pl-12">
      <div className="flex items-center h-6">
        {src && <Image src={src} alt={title} className="mr-2" width={24} height={24} />}
        <h1 className="text-2xl font-semibold text-primary leading-[24px]">{title}</h1>
      </div>
    </div>
  );
}
