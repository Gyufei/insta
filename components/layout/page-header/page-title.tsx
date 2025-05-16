import Image from 'next/image';
import { CurrentNetwork } from './current-network';

export default function PageTitle({ title, src }: { title: string; src: string | null }) {
  return (
    <div className="flex items-center">
      {src && <Image src={src} alt={title} className="mr-2" width={20} height={20} />}
      <h1 className="text-xl font-semibold text-primary">{title}</h1>
      <CurrentNetwork />
    </div>
  );
}
