import { ERROR_MESSAGES } from '@/config/const-msg';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ActionButton } from '@/components/side-drawer/common/action-button';
import { ErrorMessage } from '@/components/side-drawer/common/error-message';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useSelectedAccount } from '@/lib/data/use-account';
import { useNadFunCreateToken } from '@/lib/data/use-nadfun-create-token';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { parseBig } from '@/lib/utils/number';

import { ImageUpload } from './image-upload';

type FormValues = {
  name: string;
  symbol: string;
  initialBuy: string;
};

export function NadFunCreateToken() {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();

  const { setIsOpen } = useSideDrawerStore();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [btnDisabled, setBtnDisabled] = useState(true);
  const [errorData, setErrorData] = useState({
    showError: false,
    errorMessage: '',
  });

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      symbol: '',
      initialBuy: '',
    },
    mode: 'onChange',
  });

  const { isValid } = form.formState;
  const { mutate: createToken, isPending } = useNadFunCreateToken();

  function onSubmit(values: FormValues) {
    if (!logoPreview) {
      setErrorData({
        showError: true,
        errorMessage: 'Please upload a token logo',
      });
      return;
    }

    if (!isValid) {
      setErrorData({
        showError: true,
        errorMessage: 'Please fill in required fields',
      });
      return;
    }

    const amountIn = parseBig(values.initialBuy);

    createToken({
      token_name: values.name,
      token_symbol: values.symbol,
      token_logo: logoPreview,
      amount_in: amountIn,
    });
  }

  useEffect(() => {
    if (!address) {
      setBtnDisabled(true);
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
      });
      return;
    }

    if (!accountInfo) {
      setBtnDisabled(true);
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.ACCOUNT_NOT_CREATED,
      });
      return;
    }

    if (isValid && logoPreview) {
      setBtnDisabled(false);
      setErrorData({
        showError: false,
        errorMessage: '',
      });
    }
  }, [isValid, logoPreview, address, accountInfo]);

  return (
    <>
      <SideDrawerBackHeader title="Create Coin" onClick={() => setIsOpen(false)} />
      <SideDrawerLayout>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormItem>
              <FormLabel>Token Logo</FormLabel>
              <div className="flex items-center justify-center">
                <ImageUpload value={logoPreview} onChange={setLogoPreview} />
              </div>
            </FormItem>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Token Name <span className="text-green-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="bg-white" placeholder="Enter token name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Token Symbol <span className="text-green-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input className="bg-white" placeholder="Enter token symbol" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialBuy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Buy Amount <span className="text-green-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white"
                      placeholder="how many you want to buy"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ActionButton
              type="submit"
              disabled={btnDisabled}
              onClick={() => {}}
              isPending={isPending}
            >
              Create Coin
            </ActionButton>
            <ErrorMessage show={errorData.showError} message={errorData.errorMessage} />
          </form>
        </Form>
      </SideDrawerLayout>
    </>
  );
}
