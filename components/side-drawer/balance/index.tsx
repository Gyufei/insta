import { SideDrawerLayout } from '../common/side-drawer-layout';
import BalanceActionButtons from './balance-action-buttons';
import BalanceSection from './balance-section';
import BalanceFooterSocial from './footer-social';
import HelpButton from './help-button';
import TokenList from './token-list';

export function Balance() {
  return (
    <SideDrawerLayout>
      <BalanceSection />
      <BalanceActionButtons />
      <HelpButton />
      <TokenList />
      <BalanceFooterSocial className="absolute bottom-[10px] left-0 right-0" />
    </SideDrawerLayout>
  );
}
