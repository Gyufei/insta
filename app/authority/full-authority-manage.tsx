import { AuthorityAdd } from '@/components/side-drawer/account-setting/account-display/authority-add';
import { AuthorityList } from '@/components/side-drawer/account-setting/account-display/authority-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FullAuthorityManage() {
  return (
    <Card className="w-full flex-shrink-0 gap-4">
      <CardHeader>
        <CardTitle className="text-sm leading-none text-gray-500">Add new Authority</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <AuthorityAdd />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AuthorityList />
        </div>
      </CardContent>
    </Card>
  );
}
