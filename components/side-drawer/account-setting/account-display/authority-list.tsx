import { useGetAccount } from '@/lib/data/use-get-account';
import { AuthorityCard } from './authority-card';

export function AuthorityList() {
  const { data: accountInfo } = useGetAccount();

  if (!accountInfo?.managers?.length) return null;

  return (
    <div className="mt-4 space-y-4">
      {accountInfo.managers.map((manager) => (
        <AuthorityCard key={manager} manager={manager} />
      ))}
    </div>
  );
}
