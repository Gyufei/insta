import { BookCopy } from 'lucide-react';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';

import { useNadNameSetPrimary } from '@/lib/data/use-nadname-set-primary';
import { useSideDrawerStore } from '@/lib/state/side-drawer';

export function NadNameSetPrimary() {
  const { currentComponent, setIsOpen } = useSideDrawerStore();
  const registerName = currentComponent?.props?.registerName;
  const { mutate: setPrimaryName, isPending } = useNadNameSetPrimary();

  if (!registerName) return null;

  const handleConfirm = () => {
    setPrimaryName(
      { name: registerName },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <>
      <SideDrawerBackHeader title={`Set primary name`} onClick={() => setIsOpen(false)} />
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
