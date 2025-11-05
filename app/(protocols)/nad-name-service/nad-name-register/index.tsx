import { useEffect, useState } from 'react';



import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { Button } from '@/components/ui/button';

import { useNadNamePrice } from '@/lib/data/use-nadname-price';
import { useNadNameRegister } from '@/lib/data/use-nadname-register';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ErrorVO } from '@/lib/model/error-vo';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';

import { CurrentGWei } from './current-gwei';
import { NameAvatar } from './name-avatar';
import { NamePrice } from './name-price';
import { RegisterSuccess } from './register-success';
import { UseAsPrimaryName } from './use-as-primary-name';

export function NadNameRegister() {
  const { currentComponent } = useSideDrawerStore();
  const registerName = currentComponent?.props?.registerName;
  const { handleBack } = useUrlPathDrawerChange('/nad-name-service');
  const { trackEvent } = useEnhancedAnalytics();

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

    // Track register attempt
    trackEvent('NAD_NAME_REGISTER', {
      event_category: 'protocol_interaction',
      event_label: 'nad_name_register_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'nad_name_service',
        action: 'register',
        name: `${registerName}.nad`,
        set_as_primary: isPrimary,
      },
    });

    register(
      {
        name: registerName,
        set_as_primary_name: isPrimary,
      },
      {
        onSuccess: () => {
          // Track successful register
          trackEvent('NAD_NAME_REGISTER', {
            event_category: 'protocol_interaction',
            event_label: 'nad_name_register_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'nad_name_service',
              action: 'register_success',
              name: `${registerName}.nad`,
            },
          });
          handleBack();
        },
        onError: (error: Error) => {
          // Track failed register
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'nad_name_register_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'nad_name_service',
              action: 'register_failed',
              name: `${registerName}.nad`,
            },
          });
        },
      }
    );
  };

  if (!registerName) return null;

  return (
    <>
      <SideDrawerBackHeader title={`Register ${registerName}.nad`} onClick={handleBack} />
      <SideDrawerLayout>
        <div className="flex flex-col items-center gap-2">
          <NameAvatar name={registerName ?? ''} />
        </div>
        {isRegisterSuccess ? (
          <>
            <RegisterSuccess name={registerName ?? ''} />
            <Button className="w-full" size="sm" onClick={handleBack}>
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