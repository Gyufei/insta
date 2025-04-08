import { CommonPageLayout } from '@/components/layout/common-page-layout';
import { NadFunTokens } from './nadfun-tokens';
import { NadFunMyTokens } from './nadfun-my-tokens';

export default function NadFun() {
  return (
    <CommonPageLayout title="Nad.Fun" src="/icons/nad-fun.svg">
      <NadFunTokens />
      <NadFunMyTokens />
    </CommonPageLayout>
  );
}
