import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Outcome {
  id: number;
  name: string;
  photo: string | null;
  order: number;
}

export function useMarketForm() {
  const [marketType, setMarketType] = useState<'binary' | 'multiple'>('binary');
  const [descriptionFormat, setDescriptionFormat] = useState<'plaintext' | 'markdown'>('plaintext');
  const [thumbnailFormat, setThumbnailFormat] = useState<'link' | 'file'>('link');
  const [resolutionSource, setResolutionSource] = useState<'chainlink' | 'uma'>('chainlink');
  const [resolutionDescription, setResolutionDescription] = useState('');
  const [description, setDescription] = useState('');
  const [initialLiquidity, setInitialLiquidity] = useState('');
  const [resolutionType, setResolutionType] = useState<'date' | 'event'>('date');
  const [resolutionDate, setResolutionDate] = useState('');
  const [resolutionEventName, setResolutionEventName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [staticLink, setStaticLink] = useState('');
  const [titleErrors, setTitleErrors] = useState<string[]>([]);
  const [liquidityError, setLiquidityError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcomes, setOutcomes] = useState<Outcome[]>([
    { id: 1, name: 'Yes', photo: null, order: 0 },
    { id: 2, name: 'No', photo: null, order: 1 },
  ]);
  const [draggedOutcome, setDraggedOutcome] = useState<number | null>(null);

  // Generate static link from title
  const generateStaticLink = (text: string): string => {
    const words = text.trim().split(/\s+/);
    const processedWords = words.map((word) => {
      if (/[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]/.test(word)) {
        return encodeURIComponent(word)
          .toLowerCase()
          .replace(/%/g, '')
          .replace(/^-+|-+$/g, '');
      }
      return word.toLowerCase().replace(/[^a-z0-9-]/g, '');
    });

    const result = processedWords
      .filter(Boolean)
      .join('-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    return result || `market-${Date.now()}`;
  };

  // Validate title
  const validateTitle = (value: string): string[] => {
    const errors: string[] = [];

    if (value.length < 5) {
      errors.push('Title must be at least 5 characters long');
    }

    if (value.length > 120) {
      errors.push('Title cannot be longer than 120 characters');
    }

    if (/[<>{}[\]\\\/]|&[a-z]+;/i.test(value)) {
      errors.push('Title cannot contain special characters or HTML tags');
    }

    const hasCJK = /[\u4e00-\u9fff\u3400-\u4dbf\u20000-\u2a6df\u2a700-\u2b73f\u2b740-\u2b81f\u2b820-\u2ceaf]/.test(value);

    if (!hasCJK) {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 3) {
        errors.push('Title must contain at least 3 words');
      }
    }

    return errors;
  };

  // Handle title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value.trim().replace(/\s+/g, ' ');
    setTitle(newTitle);
    setTitleErrors(validateTitle(newTitle));
    setStaticLink(generateStaticLink(newTitle));
  };

  // Handle static link change
  const handleStaticLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaticLink(generateStaticLink(e.target.value));
  };

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, category];
    });
  };

  // Handle outcome changes
  const handleAddOutcome = () => {
    if (outcomes.length >= 10) return;
    setOutcomes((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        photo: null,
        order: prev.length,
      },
    ]);
  };

  const handleRemoveOutcome = (id: number) => {
    if (outcomes.length <= 2) return;
    setOutcomes((prev) => prev.filter((outcome) => outcome.id !== id));
  };

  const handleOutcomeChange = (id: number, name: string) => {
    if (marketType === 'binary') return;
    setOutcomes((prev) =>
      prev.map((outcome) => (outcome.id === id ? { ...outcome, name } : outcome))
    );
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error('File size must be less than 1MB');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const responseData = await fetch('/user/uploadImage', {
        method: 'POST',
        body: formData,
      });
      const response = await responseData.json();

      if (!response?.url) {
        throw new Error('Invalid response format');
      }

      setThumbnail(response.url);
      toast.success('Market thumbnail uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(`Failed to upload market thumbnail. ${JSON.stringify(err)}`);
    }
  };

  const handlePhotoChange = async (id: number, file: File) => {
    if (file.size > 1024 * 1024) {
      toast.error('File size must be less than 1MB');
      return;
    }

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Only JPG and PNG files are allowed');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const responseData = await fetch('/user/uploadImage', {
        method: 'POST',
        body: formData,
      });
      const response = await responseData.json();

      if (!response?.data?.url) {
        throw new Error('Invalid response format');
      }

      setOutcomes((prev) =>
        prev.map((outcome) =>
          outcome.id === id ? { ...outcome, photo: response.data.url } : outcome
        )
      );

      toast.success('Outcome logo uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(`Failed to upload outcome logo. ${JSON.stringify(err)}`);
    }
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    if (marketType === 'binary') {
      e.preventDefault();
      return;
    }

    setDraggedOutcome(id);
    e.currentTarget.classList.add('opacity-50');
    const dragIcon = document.createElement('div');
    dragIcon.className = 'w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center';
    dragIcon.innerHTML = '⋮⋮';
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 5, 5);
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedOutcome(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-[var(--color-odd-main)]');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('border-[var(--color-odd-main)]');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-[var(--color-odd-main)]');

    if (draggedOutcome === null) return;

    setOutcomes((prev) => {
      const draggedOrder = prev.find((o) => o.id === draggedOutcome)?.order || 0;
      const targetOrder = prev.find((o) => o.id === targetId)?.order || 0;

      return prev
        .map((outcome) => {
          if (outcome.id === draggedOutcome) {
            return { ...outcome, order: targetOrder };
          }
          if (draggedOrder < targetOrder) {
            if (outcome.order <= targetOrder && outcome.order > draggedOrder) {
              return { ...outcome, order: outcome.order - 1 };
            }
          } else {
            if (outcome.order >= targetOrder && outcome.order < draggedOrder) {
              return { ...outcome, order: outcome.order + 1 };
            }
          }
          return outcome;
        })
        .sort((a, b) => a.order - b.order);
    });
  };

  // Reset outcome names when market type changes
  useEffect(() => {
    if (marketType === 'binary') {
      setOutcomes((prev) =>
        prev.map((outcome, index) => ({
          ...outcome,
          name: index === 0 ? 'Yes' : 'No',
        }))
      );
    } else {
      setOutcomes((prev) =>
        prev.map((outcome) => ({
          ...outcome,
          name: '',
        }))
      );
    }
  }, [marketType]);

  return {
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
    draggedOutcome,

    // Setters
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
    setSelectedCategories,
    setThumbnail,
    setTitle,
    setStaticLink,
    setTitleErrors,
    setLiquidityError,
    setIsSubmitting,
    setOutcomes,
    setDraggedOutcome,

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
  };
} 