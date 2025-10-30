import { BookCopy } from 'lucide-react';



import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';



import { useNadNameSetPrimary } from '@/lib/data/use-nadname-set-primary';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';

export function NadNameSetPrimary() {
  const { currentComponent } = useSideDrawerStore();
  const registerName = currentComponent?.props?.registerName;
  const { mutate: setPrimaryName, isPending } = useNadNameSetPrimary();
  const { trackEvent } = useEnhancedAnalytics();

  const { handleBack } = useUrlPathDrawerChange('/nad-name-service');

  if (!registerName) return null;

  const handleConfirm = () => {
    // Track set primary attempt
    trackEvent('NAD_NAME_SET_PRIMARY', {
      event_category: 'protocol_interaction',
      event_label: 'nad_name_set_primary_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'nad_name_service',
        action: 'set_primary',
        name: `${registerName}.nad`,
      },
    });

    setPrimaryName(
      { name: registerName },
      {
        onSuccess: () => {
          // Track successful set primary
          trackEvent('NAD_NAME_SET_PRIMARY', {
            event_category: 'protocol_interaction',
            event_label: 'nad_name_set_primary_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'nad_name_service',
              action: 'set_primary_success',
              name: `${registerName}.nad`,
            },
          });
          handleBack();
        },
        onError: (error: Error) => {
          // Track failed set primary
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'nad_name_set_primary_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'nad_name_service',
              action: 'set_primary_failed',
              name: `${registerName}.nad`,
            },
          });
        },
      }
    );
  };

  return (
    <>
      <SideDrawerBackHeader title={`Set primary name`} onClick={handleBack} />
      <SideDrawerLayout>
        <div className="flex flex-col items-center content-between">
          <BookCopy className="w-20 h-20" />
          <p className="my-4 text-center">
            Are you sure you want to change the primary name to {registerName}.nad?
          </p>
          <div className="flex flex-col space-y-4 w-full ">
            <div className="flex flex-col md:flex-row md:space-x-16 border p-3 md:items-center rounded-lg justify-between border-gray-300 w-full">
              <p className="shrink font-medium text-gray-400">Name</p>
              <p className="  font-semibold overflow-x-auto">{registerName}.nad</p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-16 border p-3 md:items-center rounded-lg justify-between border-gray-300 w-full">
              <p className="shrink font-medium text-gray-400">Action</p>
              <p className="  font-semibold overflow-x-auto">Set primary name</p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-16 border p-3 md:items-center rounded-lg justify-between border-gray-300 w-full">
              <p className="shrink font-medium text-gray-400">Data</p>
              <p className="font-semibold overflow-x-auto">{registerName}.nad</p>
            </div>
          </div>
        </div>
        <ActionButton size="sm" onClick={handleConfirm} disabled={isPending} isPending={isPending}>
          Confirm
        </ActionButton>
      </SideDrawerLayout>
    </>
  );
}