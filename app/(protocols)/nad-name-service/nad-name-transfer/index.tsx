import { SendHorizontal } from 'lucide-react';
import { isAddress } from 'viem';



import { useEffect, useState } from 'react';



import { ERROR_MESSAGES } from '@/config/const-msg';



import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';



import { useNadNameTransfer } from '@/lib/data/use-nadname-transfer';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ErrorVO } from '@/lib/model/error-vo';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';

export function NadNameTransfer() {
  const { currentComponent } = useSideDrawerStore();
  const registerName = currentComponent?.props?.registerName;
  const { mutate: transferName, isPending } = useNadNameTransfer();
  const { handleBack } = useUrlPathDrawerChange('/nad-name-service');
  const { trackEvent } = useEnhancedAnalytics();

  const [receiver, setReceiver] = useState('');
  const [error, setError] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (isAddress(receiver)) {
      setError({
        showError: false,
        errorMessage: '',
      });
    }
  }, [receiver]);

  if (!registerName) return null;

  const handleConfirm = () => {
    if (!isAddress(receiver)) {
      setError({
        showError: true,
        errorMessage: ERROR_MESSAGES.INVALID_ADDRESS,
      });
      return;
    }

    setError({
      showError: false,
      errorMessage: '',
    });

    // Track transfer attempt
    trackEvent('NAD_NAME_TRANSFER', {
      event_category: 'protocol_interaction',
      event_label: 'nad_name_transfer_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'nad_name_service',
        action: 'transfer',
        name: `${registerName}.nad`,
        receiver: receiver,
      },
    });

    transferName(
      { name: registerName, receiver },
      {
        onSuccess: () => {
          // Track successful transfer
          trackEvent('NAD_NAME_TRANSFER', {
            event_category: 'protocol_interaction',
            event_label: 'nad_name_transfer_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'nad_name_service',
              action: 'transfer_success',
              name: `${registerName}.nad`,
            },
          });
          handleBack();
        },
        onError: (error: Error) => {
          // Track failed transfer
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'nad_name_transfer_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'nad_name_service',
              action: 'transfer_failed',
              name: `${registerName}.nad`,
            },
          });
        },
      }
    );
  };

  return (
    <>
      <SideDrawerBackHeader title={`Transfer name`} onClick={handleBack} />
      <SideDrawerLayout>
        <div className="flex flex-col items-center content-between">
          <SendHorizontal className="w-20 h-20" />
          <div className="flex flex-col space-y-4 w-full mt-4">
            <div className="flex flex-col md:flex-row md:space-x-16 border p-3 md:items-center rounded-lg justify-between border-gray-300 w-full">
              <p className="shrink font-medium text-gray-400">Name</p>
              <p className="font-semibold overflow-x-auto">{registerName}.nad</p>
            </div>
            <div className="flex flex-col space-y-2 w-full">
              <label htmlFor="receiver" className="text-sm font-medium text-gray-700">
                Receiver Address
              </label>
              <input
                id="receiver"
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Enter receiver's address"
                className={`w-full px-3 py-2 border ${error.showError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </div>
        <ActionButton
          size="sm"
          onClick={handleConfirm}
          disabled={isPending}
          isPending={isPending}
          error={error}
        >
          Confirm
        </ActionButton>
      </SideDrawerLayout>
    </>
  );
}