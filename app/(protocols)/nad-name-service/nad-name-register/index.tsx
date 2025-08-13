import { useEffect, useState } from 'react';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { Button } from '@/components/ui/button';

import { useNadNamePrice } from '@/lib/data/use-nadname-price';
import { useNadNameRegister } from '@/lib/data/use-nadname-register';
import { ErrorVO } from '@/lib/model/error-vo';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

import { CurrentGWei } from './current-gwei';
import { NameAvatar } from './name-avatar';
import { NamePrice } from './name-price';
import { RegisterSuccess } from './register-success';
import { UseAsPrimaryName } from './use-as-primary-name';

export function NadNameRegister() {
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const registerName = currentComponent?.props?.registerName;

  const {
    data: priceData,
    isLoading: isPriceLoading,
    error: priceError,
  } = useNadNamePrice(registerName || '');

  const {
    mutate: register,
    isPending: isRegistering,
    isSuccess: isRegisterSuccess,
    error: registerError,
  } = useNadNameRegister();

  const [isPrimary, setIsPrimary] = useState(false);

  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (priceError || registerError) {
      setErrorData({
        showError: true,
        errorMessage: (priceError || registerError)?.message || '',
      });
    } else {
      setErrorData({
        showError: false,
        errorMessage: '',
      });
    }
  }, [priceError, registerError]);

  const handleRegister = () => {
    if (!registerName) return;

    register({
      name: registerName,
      set_as_primary_name: isPrimary,
    });
  };

  if (!registerName) return null;

  return (
    <>
      <SideDrawerBackHeader
        title={`Register ${registerName}.nad`}
        onClick={() => setIsOpen(false)}
      />
      <SideDrawerLayout>
        <div className="flex flex-col items-center gap-2">
          <NameAvatar name={registerName ?? ''} />
        </div>
        {isRegisterSuccess ? (
          <>
            <RegisterSuccess name={registerName ?? ''} />
            <Button className="w-full" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </>
        ) : (
          <>
            <CurrentGWei />
            <NamePrice priceData={priceData} isLoading={isPriceLoading} />
            <UseAsPrimaryName checked={isPrimary} onCheckedChange={setIsPrimary} />
            <ActionButton
              disabled={isPriceLoading || isRegistering}
              onClick={handleRegister}
              isPending={isRegistering}
              error={errorData}
            >
              Register
            </ActionButton>
          </>
        )}
      </SideDrawerLayout>
    </>
  );
}
