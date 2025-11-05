'use client';

import { toast } from 'sonner';
import { useAccount } from 'wagmi';



import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';



import { ERROR_MESSAGES } from '@/config/const-msg';



import { NumberInput } from '@/components/common/number-input';
import { ActionButton } from '@/components/side-drawer/common/action-button';
import { SideDrawerLayout } from '@/components/side-drawer/common/side-drawer-layout';
import { SideDrawerBackHeader } from '@/components/side-drawer/side-drawer-back-header';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';



import { useSelectedAccount } from '@/lib/data/account-address/use-selected-account';
import { useNadFunCreateToken } from '@/lib/data/use-nadfun-create-token';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { ErrorVO } from '@/lib/model/error-vo';
import { useUrlPathDrawerChange } from '@/lib/state/use-url-path-drawer-change';
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

  const { handleBack } = useUrlPathDrawerChange('/nad-fun');
  const { trackEvent } = useEnhancedAnalytics();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [btnDisabled, setBtnDisabled] = useState(true);
  const [errorData, setErrorData] = useState<ErrorVO>({
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
      toast.error('Please upload a token logo');
      return;
    }

    if (!isValid) {
      toast.error('Please fill in required fields');
      return;
    }

    const amountIn = parseBig(values.initialBuy);

    // Track token creation attempt
    trackEvent('NAD_TOKEN_CREATE', {
      event_category: 'protocol_interaction',
      event_label: 'nad_fun_create_token_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'nad_fun',
        action: 'create_token',
        token_name: values.name,
        token_symbol: values.symbol,
        initial_buy_amount: values.initialBuy,
      },
    });

    createToken(
      {
        token_name: values.name,
        token_symbol: values.symbol,
        token_logo: logoPreview,
        amount_in: amountIn,
      },
      {
        onSuccess: () => {
          // Track successful token creation
          trackEvent('NAD_TOKEN_CREATE', {
            event_category: 'protocol_interaction',
            event_label: 'nad_fun_create_token_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'nad_fun',
              action: 'create_token_success',
              token_name: values.name,
              token_symbol: values.symbol,
            },
          });
          handleBack();
        },
        onError: (error: Error) => {
          // Track failed token creation
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'nad_fun_create_token_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'nad_fun',
              action: 'create_token_failed',
              token_name: values.name,
              token_symbol: values.symbol,
            },
          });
        },
      }
    );
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
      <SideDrawerBackHeader title="Create Coin" onClick={handleBack} />
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
                    <Input
                      className="bg-primary-foreground"
                      placeholder="Enter token name"
                      {...field}
                    />
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
                    <Input
                      className="bg-primary-foreground"
                      placeholder="Enter token symbol"
                      {...field}
                    />
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
                    <NumberInput
                      className="bg-primary-foreground"
                      placeholder="how many you want to buy"
                      {...field}
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
              error={errorData}
            >
              Create Coin
            </ActionButton>
          </form>
        </Form>
      </SideDrawerLayout>
    </>
  );
}