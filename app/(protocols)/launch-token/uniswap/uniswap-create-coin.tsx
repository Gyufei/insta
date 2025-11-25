'use client';

import { useAppKitNetwork } from '@reown/appkit/react';
import * as Sentry from '@sentry/nextjs';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { NumberInput } from '@/components/common/number-input';
import { TitleH2 } from '@/components/common/title-h2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useImageUpload } from '@/lib/data/use-image-upload';
import { useUniswapCreateCoin } from '@/lib/data/use-uniswap-create-coin';
import { useEnhancedAnalytics } from '@/lib/hooks/use-enhanced-analytics';
import { useAccountStore } from '@/lib/state/account';
import { cn } from '@/lib/utils';
import { ensureMonadNetworkSync } from '@/lib/utils/network-guard';
import { getTwitterInputError, isValidTwitterInput, toCanonicalXUrl } from '@/lib/utils/twitter';

interface CreateCoinFormData {
  thumbnail: string | null;
  tokenName: string;
  tickerName: string;
  totalSupply: string;
  description: string;
  xLink?: string;
  tgLink?: string;
  websiteLink?: string;
}

interface FormErrors {
  thumbnail?: string;
  tokenName?: string;
  tickerName?: string;
  totalSupply?: string;
  description?: string;
}

const MAX_TOTAL_SUPPLY = 1_000_000_000_000;

function getTickerNameError(v: string): string | undefined {
  const x = v.trim();
  if (!x) return 'Please enter the ticker name';
  if (x.length < 2 || x.length > 10) return 'Ticker must be 2-10 characters';
  if (!/^[A-Z0-9]+$/.test(x)) return 'Ticker allows only A-Z and digits';
  return undefined;
}

function getTotalSupplyError(v: string): string | undefined {
  const x = v.trim();
  if (!x) return 'Please enter the total supply';
  if (!/^\d+$/.test(x)) return 'Total supply must be an integer';
  const n = Number(x);
  if (n <= 0) return 'Total supply must be greater than 0';
  if (n > MAX_TOTAL_SUPPLY) return `Total supply must be ≤ ${MAX_TOTAL_SUPPLY.toLocaleString()}`;
  return undefined;
}

function getTokenNameError(v: string): string | undefined {
  const x = v;
  const t = x.trim();
  if (!t) return 'Please enter the token name';
  if (t.length < 3 || t.length > 50) return 'Token name must be 3-50 characters';
  if (!/^[A-Za-z]/.test(t)) return 'Token name must start with a letter';
  if (!/^[A-Za-z0-9 _-]+$/.test(t)) return 'Only letters, digits, space, hyphen(-), underscore(_)';
  if (t !== x) return 'No leading or trailing spaces';
  if (/\s{2,}/.test(t)) return 'No consecutive spaces';
  return undefined;
}

function getDescriptionError(v: string): string | undefined {
  const x = v;
  const t = x.trim();
  if (!t) return 'Please enter the token description';
  if (t.length > 256) return 'Description must be ≤ 256 characters';
  if (!/^[A-Za-z0-9 _\-.,;:?!]+$/.test(t)) return 'Only letters, digits, space, - , _ and .,;:?!';
  if (t !== x) return 'No leading or trailing spaces';
  return undefined;
}

export function UniswapCreateCoin() {
  const { chainId } = useAppKitNetwork();
  const { chainId: walletChainId } = useAccount();
  const { currentAccountType } = useAccountStore();
  const { trackEvent } = useEnhancedAnalytics();
  const [formData, setFormData] = useState<CreateCoinFormData>({
    thumbnail: null,
    tokenName: '',
    tickerName: '',
    totalSupply: '',
    description: '',
    xLink: '',
    tgLink: '',
    websiteLink: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  // Popover 状态管理
  const [twitterPopoverOpen, setTwitterPopoverOpen] = useState(false);
  const [websitePopoverOpen, setWebsitePopoverOpen] = useState(false);
  const [twitterInput, setTwitterInput] = useState('');
  const [websiteInput, setWebsiteInput] = useState('');

  // 链接验证错误状态
  const [twitterInputError, setTwitterInputError] = useState('');
  const [websiteInputError, setWebsiteInputError] = useState('');

  const { uploadImage, isPending: isUploading } = useImageUpload((data) => {
    // 上传成功后，将返回的 URL 设置为表单的图片值
    setFormData((prev) => ({ ...prev, thumbnail: data.url }));
  });

  const {
    mutate: createCoin,
    isPending: isCreating,
    isSuccess: isCreated,
  } = useUniswapCreateCoin();

  // URL 验证函数 (用于网站链接)
  const isValidUrl = (url: string): boolean => {
    const raw = url.trim();
    if (!raw) return true; // 空值允许通过

    // 不允许空格
    if (/\s/.test(raw)) return false;

    try {
      // 检查是否包含协议，如果没有则添加 https://
      let urlToCheck = raw;
      if (!/^https?:\/\//i.test(urlToCheck)) {
        urlToCheck = 'https://' + urlToCheck;
      }

      const urlObj = new URL(urlToCheck);

      // 检查协议
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return false;
      }

      const hostname = urlObj.hostname;

      // 类型：域名（不允许 IP）
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(hostname)) {
        return false;
      }

      // 长度：最小 3 字符，最大 253 字符
      if (hostname.length < 3 || hostname.length > 253) {
        return false;
      }

      // 允许的域名部分：字母、数字、连接符；不允许以连接符开头或结尾
      const parts = hostname.split('.');
      if (parts.length < 2) return false; // 至少需要 domain.tld
      if (parts.some((p) => p.length === 0)) return false;
      const labelRegex = /^[A-Za-z0-9-]+$/;
      if (parts.some((p) => !labelRegex.test(p))) return false;
      if (parts.some((p) => p.startsWith('-') || p.endsWith('-'))) return false;

      // 必须以字母开头（忽略 www. 前缀）
      const hostForStart = hostname.replace(/^www\./i, '');
      if (!/^[A-Za-z]/.test(hostForStart)) return false;

      // 顶级域名：仅字母，长度 2–63（支持新 gTLD，如 .fun）
      const tld = parts[parts.length - 1];
      if (!/^[A-Za-z]{2,63}$/.test(tld)) return false;

      return true;
    } catch {
      return false;
    }
  };

  // Twitter 输入验证状态
  const isTwitterInputValid = isValidTwitterInput(twitterInput);

  // Website 输入验证状态
  const isWebsiteInputValid = isValidUrl(websiteInput);

  // 处理 Twitter 链接确认
  const handleTwitterConfirm = () => {
    if (!isValidTwitterInput(twitterInput)) {
      setTwitterInputError(getTwitterInputError(twitterInput));
      return;
    }

    setTwitterInputError('');
    setFormData((prev) => ({ ...prev, xLink: twitterInput }));
    setTwitterPopoverOpen(false);
    setTwitterInput('');
  };

  // 处理 Website 链接确认
  const handleWebsiteConfirm = () => {
    if (!isValidUrl(websiteInput)) {
      setWebsiteInputError('Please enter a valid website link');
      return;
    }

    setWebsiteInputError('');
    setFormData((prev) => ({ ...prev, websiteLink: websiteInput }));
    setWebsitePopoverOpen(false);
    setWebsiteInput('');
  };

  // 打开 Twitter Popover 时初始化输入值
  const handleTwitterPopoverOpen = (open: boolean) => {
    setTwitterPopoverOpen(open);
    if (open) {
      setTwitterInput(formData.xLink || '');
      setTwitterInputError(''); // 清除之前的错误
    }
  };

  // 打开 Website Popover 时初始化输入值
  const handleWebsitePopoverOpen = (open: boolean) => {
    setWebsitePopoverOpen(open);
    if (open) {
      setWebsiteInput(formData.websiteLink || '');
      setWebsiteInputError(''); // 清除之前的错误
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小 (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // 检查文件类型
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (PNG, JPEG, JPG, GIF, WEBP)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          // 检查图片尺寸
          if (img.width < 130 || img.height < 130) {
            toast.error('Image must be at least 130x130 pixels');
            return;
          }

          // 检查宽高比是否为 1:1
          if (img.width !== img.height) {
            toast.error('Image must have a 1:1 aspect ratio (square)');
            return;
          }

          // 验证通过，上传图片到服务器
          uploadImage(file);
          // 清除该字段的错误
          setErrors((prev) => ({ ...prev, thumbnail: undefined }));
        };
        img.onerror = () => {
          toast.error('Failed to load image. Please try again.');
        };
        img.src = reader.result as string;
      };

      reader.onerror = () => {
        toast.error('Failed to read file. Please try again.');
      };

      reader.readAsDataURL(file);
    } else {
      // 如果没有选择文件，清除图片并设置错误
      setFormData((prev) => ({ ...prev, thumbnail: null }));
      setErrors((prev) => ({ ...prev, thumbnail: 'Please upload the token icon' }));
    }
  };

  const handleInputChange =
    (field: keyof CreateCoinFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // 实时计算并设置该字段的错误，便于立即展示提示
      let error: string | undefined;
      if (field === 'tickerName') {
        error = getTickerNameError(value);
      } else if (field === 'totalSupply') {
        error = getTotalSupplyError(value);
      } else if (field === 'tokenName') {
        error = getTokenNameError(value);
      } else if (field === 'description') {
        error = getDescriptionError(value);
      }
      setErrors((prev) => ({ ...prev, [field]: error }));
    };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证必填字段
    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Please upload the token icon';
    }

    const tokenNameErr = getTokenNameError(formData.tokenName);
    if (tokenNameErr) newErrors.tokenName = tokenNameErr;

    const tickerErr = getTickerNameError(formData.tickerName);
    if (tickerErr) newErrors.tickerName = tickerErr;

    const supplyErr = getTotalSupplyError(formData.totalSupply);
    if (supplyErr) newErrors.totalSupply = supplyErr;

    const descErr = getDescriptionError(formData.description);
    if (descErr) newErrors.description = descErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    setShowErrors(true);

    if (!validateForm()) {
      Sentry.addBreadcrumb({
        category: 'validation',
        message: 'create_token_validation_failed',
        level: 'warning',
        data: {
          errors: errors,
          token_name: formData.tokenName,
          token_symbol: formData.tickerName,
        },
      });
      return;
    }

    Sentry.addBreadcrumb({
      category: 'action',
      message: 'click_create_token',
      level: 'info',
      data: {
        token_name: formData.tokenName,
        token_symbol: formData.tickerName,
        initial_supply: formData.totalSupply,
        has_thumbnail: !!formData.thumbnail,
        has_x_link: !!formData.xLink,
        has_tg_link: !!formData.tgLink,
        has_website: !!formData.websiteLink,
      },
    });

    // Track create token attempt (align event name with existing)
    trackEvent('UNISWAP_POSITION_CREATE', {
      event_category: 'protocol_interaction',
      event_label: 'uniswap_create_token_attempt',
      include_user_id: true,
      custom_parameters: {
        protocol: 'uniswap',
        action: 'create_token_attempt',
        token_name: formData.tokenName,
        token_symbol: formData.tickerName,
        initial_supply: formData.totalSupply,
      },
    });

    const payload = {
      wallet_type: currentAccountType,
      token_name: formData.tokenName,
      token_symbol: formData.tickerName,
      token_url: formData.thumbnail || '',
      token_description: formData.description,
      x_link: toCanonicalXUrl(formData.xLink || ''),
      telegram_link: formData.tgLink || '',
      website: formData.websiteLink || '',
      initial_supply: formData.totalSupply,
    };

    const canProceed = ensureMonadNetworkSync({
      chainId: walletChainId,
    });
    if (!canProceed) {
      Sentry.addBreadcrumb({
        category: 'warning',
        message: 'wrong_network_create_token',
        level: 'warning',
        data: { chain_id: chainId },
      });
      return;
    }

    try {
      createCoin(payload, {
        onSuccess: () => {
          Sentry.addBreadcrumb({
            category: 'action',
            message: 'create_token_success',
            level: 'info',
            data: {
              token_name: formData.tokenName,
              token_symbol: formData.tickerName,
              initial_supply: formData.totalSupply,
            },
          });

          // Track successful token creation (align event name with existing)
          trackEvent('UNISWAP_POSITION_CREATE', {
            event_category: 'protocol_interaction',
            event_label: 'uniswap_create_token_success',
            include_user_id: true,
            custom_parameters: {
              protocol: 'uniswap',
              action: 'create_token_success',
              token_name: formData.tokenName,
              token_symbol: formData.tickerName,
              initial_supply: formData.totalSupply,
            },
          });
        },
        onError: (error: Error) => {
          // Capture error in Sentry
          Sentry.captureException(error, {
            tags: {
              page: 'launch-token',
              protocol: 'uniswap',
              error_type: 'create_token',
            },
            extra: {
              token_name: formData.tokenName,
              token_symbol: formData.tickerName,
              initial_supply: formData.totalSupply,
              account_type: currentAccountType,
            },
          });

          // Track failure and capture in Sentry
          trackEvent('ERROR_OCCURRED', {
            event_category: 'protocol_interaction',
            event_label: 'uniswap_create_token_failed',
            error_message: error?.message || 'Unknown error',
            include_user_id: true,
            custom_parameters: {
              protocol: 'uniswap',
              action: 'create_token_failed',
              token_symbol: formData.tickerName,
            },
          });
        },
      });
    } catch (err) {
      Sentry.captureException(err, {
        tags: {
          page: 'launch-token',
          protocol: 'uniswap',
          error_type: 'create_token_exception',
        },
        extra: payload,
      });
      throw err;
    }
  };

  const hasErrors =
    showErrors && Object.keys(errors).some((key) => errors[key as keyof FormErrors]);

  // Check if all required fields are filled
  const isFormIncomplete =
    !formData.thumbnail ||
    !!getTokenNameError(formData.tokenName) ||
    !!getTickerNameError(formData.tickerName) ||
    !!getTotalSupplyError(formData.totalSupply) ||
    !!getDescriptionError(formData.description);

  function resetForm() {
    setFormData({
      thumbnail: null,
      tokenName: '',
      tickerName: '',
      totalSupply: '',
      description: '',
      xLink: '',
      tgLink: '',
      websiteLink: '',
    });
    setErrors({});
    setShowErrors(false);
  }

  useEffect(() => {
    if (isCreated) {
      resetForm();
    }
  }, [isCreated]);

  return (
    <div className="flex w-full flex-grow flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-3">
          <TitleH2>Create Coin</TitleH2>
          <span className="text-[#A5ADC6] text-sm leading-[140%] font-normal">
            Data cannot be changed after creation
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-6 md:gap-4">
        <div className="flex-col md:flex-shrink-0">
          <Label className="text-sm font-medium text-[#131E40]">
            Thumbnail Image <RedStart />
          </Label>
          <div className="mt-3">
            <div
              className={cn(
                'group w-full md:w-[216px] relative h-[216px] overflow-hidden rounded-lg border-2 border-dashed bg-primary-foreground hover:border-primary/50 transition-colors',
                showErrors && errors.thumbnail ? 'border-red-500' : 'border-[#ebebeb]'
              )}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0 p-[14px]"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-muted mb-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                  <p className="text-sm font-medium leading-[140%] text-center text-[#131E40]">
                    Uploading...
                  </p>
                </div>
              ) : formData.thumbnail ? (
                <div className="relative h-full w-full p-2">
                  <Image
                    src={formData.thumbnail}
                    alt="Token thumbnail preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-muted mb-3">
                    <Image src="/icons/upload.svg" alt="Upload" width={72} height={72} />
                  </div>
                  <p className="text-sm font-medium leading-[140%] text-center text-[#131E40]">
                    Drag file here or choose file
                  </p>
                  <p className="text-xs text-[#A5ADC6] font-medium leading-[140%] mt-2">
                    1:1 ratio • Min 130x130px • Max 5MB
                  </p>
                </div>
              )}
            </div>
            {showErrors && errors.thumbnail && (
              <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-4 w-full md:w-auto">
            <Popover open={twitterPopoverOpen} onOpenChange={handleTwitterPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'relative flex items-center flex-1 h-10 border-[#EBEBEB]',
                    formData.xLink && 'border-[#6E75F9]'
                  )}
                >
                  <Image
                    src={formData.xLink ? '/icons/twitter-main.svg' : '/icons/twitter.svg'}
                    alt="Upload"
                    width={20}
                    height={20}
                  />
                  {formData.xLink && (
                    <Image
                      alt="check"
                      src="/icons/check.svg"
                      width="16"
                      height="16"
                      className="absolute -top-[6px] -right-[6px]"
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-foreground">X Username</Label>
                    <Input
                      placeholder="Enter X Username"
                      value={twitterInput}
                      onChange={(e) => {
                        setTwitterInput(e.target.value);
                        if (twitterInputError) {
                          setTwitterInputError('');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleTwitterConfirm();
                        }
                      }}
                      className={cn(
                        'mt-1',
                        (twitterInputError || (twitterInput && !isTwitterInputValid)) &&
                          'border-red-500 input-error'
                      )}
                    />
                    {twitterInputError && (
                      <p className="text-red-500 text-xs mt-1">{twitterInputError}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleTwitterConfirm}
                      disabled={!!(twitterInput && !isTwitterInputValid)}
                      className="flex-1 bg-[#6E75F9] hover:bg-[#6E75F9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setTwitterPopoverOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={websitePopoverOpen} onOpenChange={handleWebsitePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'relative flex items-center flex-1 h-10 border-[#EBEBEB]',
                    formData.websiteLink && 'border-[#6E75F9]'
                  )}
                >
                  <Image
                    src={formData.websiteLink ? '/icons/website-main.svg' : '/icons/website.svg'}
                    alt="website"
                    width={20}
                    height={20}
                  />
                  {formData.websiteLink && (
                    <Image
                      alt="check"
                      src="/icons/check.svg"
                      width="16"
                      height="16"
                      className="absolute -top-[6px] -right-[6px]"
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Website Link</Label>
                    <Input
                      placeholder="eg: http://tadle.com"
                      value={websiteInput}
                      onChange={(e) => {
                        setWebsiteInput(e.target.value);
                        if (websiteInputError) {
                          setWebsiteInputError('');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleWebsiteConfirm();
                        }
                      }}
                      className={cn(
                        'mt-1',
                        (websiteInputError || (websiteInput && !isWebsiteInputValid)) &&
                          'border-red-500 input-error'
                      )}
                    />
                    {websiteInputError && (
                      <p className="text-red-500 text-xs mt-1">{websiteInputError}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleWebsiteConfirm}
                      disabled={!!(websiteInput && !isWebsiteInputValid)}
                      className="flex-1 bg-[#6E75F9] hover:bg-[#6E75F9]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setWebsitePopoverOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 md:space-y-6 flex-1">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            {/* Ticker Name */}
            <div className="flex-1">
              <Label className="text-sm font-medium text-[#131E40]">
                Ticker Name <RedStart />
              </Label>
              <div className="mt-2">
                <Input
                  type="text"
                  placeholder="Enter the ticker name"
                  value={formData.tickerName}
                  onChange={handleInputChange('tickerName')}
                  className={cn('w-full', errors.tickerName && 'border-red-500')}
                />
                {errors.tickerName && (
                  <p className="text-red-500 text-xs mt-1">{errors.tickerName}</p>
                )}
              </div>
            </div>

            {/* Total Supply */}
            <div className="flex-1">
              <Label className="text-sm font-medium text-[#131E40]">
                Total Supply <RedStart />
              </Label>
              <div className="mt-2">
                <NumberInput
                  placeholder="Enter the total supply"
                  value={formData.totalSupply}
                  onChange={(v) =>
                    handleInputChange('totalSupply')({
                      target: { value: v },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                  className={cn('w-full', errors.totalSupply && 'border-red-500')}
                />
                {errors.totalSupply && (
                  <p className="text-red-500 text-xs mt-1">{errors.totalSupply}</p>
                )}
              </div>
            </div>
          </div>

          {/* Token Name */}
          <div>
            <Label className="text-sm font-medium text-[#131E40]">
              Token Name <RedStart />
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Enter the token name"
                value={formData.tokenName}
                onChange={handleInputChange('tokenName')}
                className={cn('w-full', errors.tokenName && 'border-red-500')}
              />
              {errors.tokenName && <p className="text-red-500 text-xs mt-1">{errors.tokenName}</p>}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-[#131E40]">
              Token Description <RedStart />
            </Label>
            <div className="mt-2">
              <textarea
                placeholder="Enter the description"
                value={formData.description}
                onChange={handleInputChange('description')}
                rows={4}
                className={cn(
                  'w-full px-3 py-2 border border-input rounded-md bg-transparent text-sm focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 resize-none',
                  errors.description && 'border-red-500'
                )}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-5 flex flex-col items-start gap-2">
            <div className="w-full md:w-auto flex items-center gap-2">
              <Button
                onClick={handleCreate}
                disabled={isCreating || isFormIncomplete}
                variant="ghost"
                className="bg-[#6E75F9] flex items-center text-[#fff] hover:bg-[#6E75F9]/90 hover:text-[#fff] px-8 h-10 text-base font-medium w-full md:w-auto"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
            {hasErrors && (
              <div className="text-red-500 text-sm">Please fill in all required fields</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RedStart() {
  return <span className="text-[#FC4E08]">*</span>;
}