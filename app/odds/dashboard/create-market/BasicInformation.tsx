import { FileUp, Link2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CATEGORIES } from '@/app/odds/common/odds-const';

interface BasicInformationProps {
  title: string;
  titleErrors: string[];
  description: string;
  descriptionFormat: 'plaintext' | 'markdown';
  selectedCategories: string[];
  thumbnail: string | null;
  thumbnailFormat: 'link' | 'file';
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (value: string) => void;
  onDescriptionFormatChange: (format: 'plaintext' | 'markdown') => void;
  onCategoryToggle: (category: string) => void;
  onThumbnailChange: (value: string) => void;
  onThumbnailFormatChange: (format: 'link' | 'file') => void;
  onImageUpload: (file: File) => void;
}

export function BasicInformation({
  title,
  titleErrors,
  description,
  descriptionFormat,
  selectedCategories,
  thumbnail,
  thumbnailFormat,
  onTitleChange,
  onDescriptionChange,
  onDescriptionFormatChange,
  onCategoryToggle,
  onThumbnailChange,
  onThumbnailFormatChange,
  onImageUpload,
}: BasicInformationProps) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-bold mb-4">Basic Information</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Market Title / Topic</label>
          <input
            type="text"
            placeholder="e.g., Will Bitcoin reach $100,000 by end of 2025?"
            value={title}
            onBlur={onTitleChange}
            onChange={(e) => onTitleChange(e)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)]"
          />
          {titleErrors.length > 0 && (
            <div className="mt-2 space-y-1">
              {titleErrors.map((error, index) => (
                <div key={index} className="text-red-500 text-sm">
                  - {error}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Description</label>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onDescriptionFormatChange('plaintext')}
                      className={`p-1.5 rounded transition-colors ${
                        descriptionFormat === 'plaintext'
                          ? 'bg-white text-gray-900 shadow-none'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                      </svg>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p className="text-xs">Plain text</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Provide detailed information about your market..."
            rows={4}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)] resize-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Categories</label>
            <span className="text-sm text-gray-500">Select up to 3</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryToggle(category)}
                disabled={!selectedCategories.includes(category) && selectedCategories.length >= 3}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategories.includes(category)
                    ? 'bg-[var(--color-odd-main-light)] text-[var(--color-odd-main)] border border-[var(--color-odd-main)]'
                    : selectedCategories.length >= 3
                      ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Thumbnail</label>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onThumbnailFormatChange('link')}
                      className={`p-1.5 rounded transition-colors ${
                        thumbnailFormat === 'link'
                          ? 'bg-white text-gray-900 shadow-none'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Link2 className="w-3 h-3 currentColor" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p className="text-xs">Manually input</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onThumbnailFormatChange('file')}
                      className={`p-1.5 rounded transition-colors ${
                        thumbnailFormat === 'file'
                          ? 'bg-white text-gray-900 shadow-none'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FileUp className="w-3 h-3 currentColor" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p className="text-xs">Upload image on disk</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-start gap-4">
            {thumbnailFormat === 'link' ? (
              <div className="flex-1">
                <input
                  type="text"
                  value={thumbnail || ''}
                  placeholder="e.g., https://example.com/image.jpg"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)]"
                  onChange={(e) => onThumbnailChange(e.target.value)}
                />
              </div>
            ) : thumbnail ? (
              <div className="relative">
                <Image
                  src={thumbnail}
                  alt="Thumbnail"
                  className="w-32 h-32 object-cover rounded-lg border"
                  width={128}
                  height={128}
                />
                <button
                  type="button"
                  onClick={() => onThumbnailChange('')}
                  className="absolute -top-2 -right-2 p-1 bg-white rounded-full border shadow-none hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50"
                style={{ width: '410px', height: '108px' }}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">Upload</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onImageUpload(file);
                  }}
                />
              </label>
            )}
            <div
              className={`${thumbnailFormat === 'link' ? 'hidden' : 'flex-1'} text-sm text-gray-500`}
            >
              Recommended size: 410x108px
              <br />
              Max file size: 1MB
              <br />
              Supported formats: JPG, PNG
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 