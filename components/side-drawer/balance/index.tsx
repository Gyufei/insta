import { SideDrawerLayout } from '../common/side-drawer-layout';
import BalanceActionButtons from './balance-action-buttons';
import BalanceSection from './balance-section';
import HelpButton from './help-button';
import TokenList from './token-list';

export function Balance() {
  return (
    <SideDrawerLayout>
      <BalanceSection />
      <BalanceActionButtons />
      <HelpButton />
      <TokenList />
    </SideDrawerLayout>
  );
}
