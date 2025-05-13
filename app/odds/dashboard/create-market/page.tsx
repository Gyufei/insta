'use client';

import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import Link from 'next/link';

import { useUserInfo } from '../../common/use-user-info';
import { BasicInformation } from './BasicInformation';
import { MarketDetails } from './MarketDetails';
import { ResolutionRules } from './ResolutionRules';
import { useMarketForm } from './useMarketForm';

export default function CreateMarketPage() {
  const { data: userInfo } = useUserInfo();
  const userId = userInfo?.user_id;

  const {
    // State
    marketType,
    descriptionFormat,
    thumbnailFormat,
    resolutionSource,
    resolutionDescription,
    description,
    initialLiquidity,
    resolutionType,
    resolutionDate,
    resolutionEventName,
    selectedCategories,
    thumbnail,
    title,
    staticLink,
    titleErrors,
    liquidityError,
    isSubmitting,
    outcomes,

    // Handlers
    handleTitleChange,
    handleStaticLinkChange,
    handleCategoryToggle,
    handleAddOutcome,
    handleRemoveOutcome,
    handleOutcomeChange,
    handleImageUpload,
    handlePhotoChange,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    setMarketType,
    setDescriptionFormat,
    setThumbnailFormat,
    setResolutionSource,
    setResolutionDescription,
    setDescription,
    setInitialLiquidity,
    setResolutionType,
    setResolutionDate,
    setResolutionEventName,
    setThumbnail,
  } = useMarketForm();

  const handleCreateMarket = async () => {
    if (!userId) {
      toast.error('Please create an account first');
      return;
    }

    // Validate required fields
    if (!title || !description || !initialLiquidity || !resolutionDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate static link
    if (/^[-_]|[-_]$/.test(staticLink) || staticLink.length < 6) {
      toast.error('Invalid Static Link');
      return;
    }

    if (!thumbnail) {
      toast.error('Please upload a thumbnail image or input a thumbnail url');
      return;
    }

    // Validate categories
    if (selectedCategories.length === 0) {
      toast.error('Must at least pick 1 category');
      return;
    }

    // Validate initial liquidity
    const liquidityAmount = parseFloat(initialLiquidity);
    if (isNaN(liquidityAmount) || liquidityAmount < 100) {
      toast.error('Initial liquidity must be at least $100');
      return;
    }

    // Validate outcomes
    // Resolution type specific validation
    if (resolutionType === 'date' && !resolutionDate) {
      toast.error('Please select a resolution date');
      return;
    }

    if (resolutionType === 'event') {
      if (!resolutionEventName) {
        toast.error('Please enter a resolution event name');
        return;
      }

      // Check if text contains CJK characters
      const hasCJK =
        /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]/.test(
          resolutionEventName
        );

      if (hasCJK) {
        // For CJK text, check length
        if (resolutionEventName.length < 6) {
          toast.error('Resolution event name must be at least 6 characters');
          return;
        }
      } else {
        // For non-CJK text, check word count
        const wordCount = resolutionEventName.trim().split(/\s+/).length;
        if (wordCount < 3) {
          toast.error('Resolution event name must contain at least 3 words');
          return;
        }
      }
    }

    // Validate outcomes based on market type
    const invalidOutcomes =
      marketType === 'binary'
        ? outcomes.some((outcome) => !outcome.name) // For binary, only name is required
        : outcomes.some((outcome) => !outcome.name || !outcome.photo); // For multiple, both name and photo required

    if (invalidOutcomes) {
      const message =
        marketType === 'binary'
          ? 'All outcomes must have a name'
          : 'All outcomes must have a name and logo';

      toast.error(message);
      return;
    }

    try {
      // Convert resolution date to timestamp
      const resolutionTimestamp = new Date(resolutionDate).getTime();

      // Prepare market data
      const marketData = {
        user_id: userId || '',
        market_question: title,
        description_type: descriptionFormat,
        description: description,
        categories: selectedCategories,
        thumb: thumbnail,
        market_static_link: staticLink,
        initial_liquidity: initialLiquidity,
        market_type: marketType,
        resolution_type: resolutionType,
        resolution_source: resolutionSource,
        resolution_details: {
          date: resolutionTimestamp,
          event_name: resolutionEventName,
        },
        outcomes: outcomes.map((outcome) => ({
          name: outcome.name,
          logo: outcome.photo,
        })),
        signature: '0x', // Empty signature for now
      };

      // Create market
      const responseData = await fetch('/market/create', {
        method: 'POST',
        body: JSON.stringify(marketData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await responseData.json();

      if (response.market_id && Number.isInteger(response.market_id)) {
        toast.success('Market created successfully');

        // Navigate to the new market
        window.location.href = `/odds/market/${response.market_id}`;
      } else {
        throw new Error(response?.message || 'Failed to create market');
      }
    } catch (err) {
      console.error('Market creation error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create market');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/dashboard/portfolio" className="text-gray-500 hover:text-gray-900">
          Portfolio
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-gray-900">Create market</span>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Create Market</h1>
        <p className="text-gray-600 mt-2">Create a new prediction market</p>
      </div>

      <form className="space-y-6">
        <BasicInformation
          title={title}
          titleErrors={titleErrors}
          description={description}
          descriptionFormat={descriptionFormat}
          selectedCategories={selectedCategories}
          thumbnail={thumbnail}
          thumbnailFormat={thumbnailFormat}
          onTitleChange={handleTitleChange}
          onDescriptionChange={setDescription}
          onDescriptionFormatChange={setDescriptionFormat}
          onCategoryToggle={handleCategoryToggle}
          onThumbnailChange={setThumbnail}
          onThumbnailFormatChange={setThumbnailFormat}
          onImageUpload={handleImageUpload}
        />

        <MarketDetails
          marketType={marketType}
          staticLink={staticLink}
          initialLiquidity={initialLiquidity}
          liquidityError={liquidityError}
          outcomes={outcomes}
          onMarketTypeChange={setMarketType}
          onStaticLinkChange={handleStaticLinkChange}
          onInitialLiquidityChange={setInitialLiquidity}
          onOutcomeChange={handleOutcomeChange}
          onPhotoChange={handlePhotoChange}
          onAddOutcome={handleAddOutcome}
          onRemoveOutcome={handleRemoveOutcome}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />

        <ResolutionRules
          resolutionType={resolutionType}
          resolutionDate={resolutionDate}
          resolutionEventName={resolutionEventName}
          resolutionSource={resolutionSource}
          resolutionDescription={resolutionDescription}
          onResolutionTypeChange={setResolutionType}
          onResolutionDateChange={setResolutionDate}
          onResolutionEventNameChange={setResolutionEventName}
          onResolutionSourceChange={setResolutionSource}
          onResolutionDescriptionChange={setResolutionDescription}
        />

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleCreateMarket}
          disabled={isSubmitting}
          className={`w-full py-4 bg-[var(--color-odd-main)] text-white text-lg font-medium rounded-lg hover:bg-[var(--color-odd-main-hover)] ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Market'}
        </button>
      </form>
    </div>
  );
}
