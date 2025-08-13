import { useNadNameMyNames } from '@/lib/data/use-nadname-my-names';
import { useNadNameMyPrimaryName } from '@/lib/data/use-nadname-my-primary-name';

export interface INadNameCombinedName {
  id: number;
  name: string;
  isPrimary: boolean;
}

export function useNadNameCombinedNames() {
  const { data: myNamesData, isLoading: isLoadingNames } = useNadNameMyNames();
  const { data: primaryNameData, isLoading: isLoadingPrimary } = useNadNameMyPrimaryName();

  const isLoading = isLoadingNames || isLoadingPrimary;

  const combinedNames: INadNameCombinedName[] =
    myNamesData?.names.map((name: string, index: number) => ({
      id: index + 1,
      name,
      isPrimary: name === primaryNameData?.name,
    })) || [];

  // 对 combinedNames 进行排序，将 isPrimary 为 true 的项排在第一位
  const sortedCombinedNames = [...combinedNames].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return 0;
  });

  return {
    data: sortedCombinedNames,
    isLoading,
    isError: !myNamesData || !primaryNameData,
  };
}
