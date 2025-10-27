import { useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addCuisine,
  removeCuisine,
  addPriceRange,
  removePriceRange,
  setMinRating,
  setMaxDeliveryTime,
  addDietaryOption,
  removeDietaryOption,
  setIsOpen,
  setSortBy,
  resetFilters,
} from '../store/filterSlice';
import type { ActiveFilterTag, FilterState, SortOption, RestaurantFilter } from '@/types';
import { PRICE_RANGE_GUIDE } from '@/mocks/restaurants';

export interface UseSearchFiltersReturn {
  filters: FilterState;
  activeFilterTags: ActiveFilterTag[];
  toggleCuisine: (cuisine: string) => void;
  togglePriceRange: (price: 1 | 2 | 3 | 4) => void;
  toggleDietaryOption: (option: string) => void;
  setMinimumRating: (rating: number | undefined) => void;
  setMaximumDeliveryTime: (time: number | undefined) => void;
  setOpenOnly: (isOpen: boolean | undefined) => void;
  changeSortBy: (sortBy: SortOption) => void;
  removeFilter: (tagId: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  getRestaurantFilter: () => RestaurantFilter;
}

export function useSearchFilters(): UseSearchFiltersReturn {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);

  const activeFilterTags = useMemo((): ActiveFilterTag[] => {
    const tags: ActiveFilterTag[] = [];

    filters.cuisine.forEach((cuisine) => {
      tags.push({
        id: `cuisine-${cuisine}`,
        label: cuisine,
        type: 'cuisine',
        value: cuisine,
      });
    });

    filters.priceRange.forEach((price) => {
      tags.push({
        id: `price-${price}`,
        label: PRICE_RANGE_GUIDE[price],
        type: 'priceRange',
        value: price,
      });
    });

    filters.dietaryOptions.forEach((option) => {
      tags.push({
        id: `dietary-${option}`,
        label: option,
        type: 'dietaryOptions',
        value: option,
      });
    });

    if (filters.minRating) {
      tags.push({
        id: 'min-rating',
        label: `${filters.minRating}+ stars`,
        type: 'minRating',
        value: filters.minRating,
      });
    }

    if (filters.maxDeliveryTime) {
      tags.push({
        id: 'max-delivery',
        label: `Under ${filters.maxDeliveryTime} min`,
        type: 'maxDeliveryTime',
        value: filters.maxDeliveryTime,
      });
    }

    if (filters.isOpen) {
      tags.push({
        id: 'is-open',
        label: 'Open Now',
        type: 'isOpen',
        value: true,
      });
    }

    return tags;
  }, [filters]);

  const toggleCuisine = useCallback(
    (cuisine: string) => {
      if (filters.cuisine.includes(cuisine)) {
        dispatch(removeCuisine(cuisine));
      } else {
        dispatch(addCuisine(cuisine));
      }
    },
    [filters.cuisine, dispatch]
  );

  const togglePriceRange = useCallback(
    (price: 1 | 2 | 3 | 4) => {
      if (filters.priceRange.includes(price)) {
        dispatch(removePriceRange(price));
      } else {
        dispatch(addPriceRange(price));
      }
    },
    [filters.priceRange, dispatch]
  );

  const toggleDietaryOption = useCallback(
    (option: string) => {
      if (filters.dietaryOptions.includes(option)) {
        dispatch(removeDietaryOption(option));
      } else {
        dispatch(addDietaryOption(option));
      }
    },
    [filters.dietaryOptions, dispatch]
  );

  const setMinimumRating = useCallback(
    (rating: number | undefined) => {
      dispatch(setMinRating(rating));
    },
    [dispatch]
  );

  const setMaximumDeliveryTime = useCallback(
    (time: number | undefined) => {
      dispatch(setMaxDeliveryTime(time));
    },
    [dispatch]
  );

  const setOpenOnly = useCallback(
    (isOpen: boolean | undefined) => {
      dispatch(setIsOpen(isOpen));
    },
    [dispatch]
  );

  const changeSortBy = useCallback(
    (sortBy: SortOption) => {
      dispatch(setSortBy(sortBy));
    },
    [dispatch]
  );

  const removeFilter = useCallback(
    (tagId: string) => {
      const tag = activeFilterTags.find((t) => t.id === tagId);
      if (!tag) return;

      switch (tag.type) {
        case 'cuisine':
          dispatch(removeCuisine(tag.value));
          break;
        case 'priceRange':
          dispatch(removePriceRange(tag.value));
          break;
        case 'dietaryOptions':
          dispatch(removeDietaryOption(tag.value));
          break;
        case 'minRating':
          dispatch(setMinRating(undefined));
          break;
        case 'maxDeliveryTime':
          dispatch(setMaxDeliveryTime(undefined));
          break;
        case 'isOpen':
          dispatch(setIsOpen(undefined));
          break;
      }
    },
    [activeFilterTags, dispatch]
  );

  const clearAllFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  const hasActiveFilters = useMemo(
    () => activeFilterTags.length > 0,
    [activeFilterTags.length]
  );

  const getRestaurantFilter = useCallback((): RestaurantFilter => {
    return {
      cuisine: filters.cuisine.length > 0 ? filters.cuisine : undefined,
      priceRange: filters.priceRange.length > 0 ? filters.priceRange : undefined,
      minRating: filters.minRating,
      maxDeliveryTime: filters.maxDeliveryTime,
      dietaryOptions: filters.dietaryOptions.length > 0 ? filters.dietaryOptions : undefined,
      isOpen: filters.isOpen,
    };
  }, [filters]);

  return {
    filters,
    activeFilterTags,
    toggleCuisine,
    togglePriceRange,
    toggleDietaryOption,
    setMinimumRating,
    setMaximumDeliveryTime,
    setOpenOnly,
    changeSortBy,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
    getRestaurantFilter,
  };
}
