import Image from 'next/image';
import { Check } from 'lucide-react';

export function DSAInfo() {
  const features = [
    { text: 'Multiple Owners' },
    { text: 'DeFi Composability' },
    { text: 'Assets Optimiztion' },
    { text: 'Authorities' },
    { text: 'Automation' },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-xxl">DeFi Smart Account</h2>
        <h3 className="text-xxl">(DSA)</h3>
      </div>

      <Image src="/images/account-cover.png" alt="DeFi Smart Account Cover" width={290} height={190} />

      <div>
        <h3 className="text-grey-pure mb-6">
          Build your Smart Account to enable Smart DeFi things.
        </h3>
        <ul className="mb-6 flex flex-col gap-4">
          {features.map((feature, index) => (
            <li key={index} className="text-base flex items-center justify-between">
              {feature.text}
              <Check className="text-green-pure h-5 w-5 dark:opacity-90" strokeWidth={2} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
