import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FilterState, SortOption } from '@/types';

const initialState: FilterState = {
  cuisine: [],
  priceRange: [],
  minRating: undefined,
  maxDeliveryTime: undefined,
  dietaryOptions: [],
  isOpen: undefined,
  sortBy: 'rating',
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCuisine(state, action: PayloadAction<string[]>) {
      state.cuisine = action.payload;
    },
    addCuisine(state, action: PayloadAction<string>) {
      if (!state.cuisine.includes(action.payload)) {
        state.cuisine.push(action.payload);
      }
    },
    removeCuisine(state, action: PayloadAction<string>) {
      state.cuisine = state.cuisine.filter((c) => c !== action.payload);
    },
    setPriceRange(state, action: PayloadAction<(1 | 2 | 3 | 4)[]>) {
      state.priceRange = action.payload;
    },
    addPriceRange(state, action: PayloadAction<1 | 2 | 3 | 4>) {
      if (!state.priceRange.includes(action.payload)) {
        state.priceRange.push(action.payload);
      }
    },
    removePriceRange(state, action: PayloadAction<1 | 2 | 3 | 4>) {
      state.priceRange = state.priceRange.filter((p) => p !== action.payload);
    },
    setMinRating(state, action: PayloadAction<number | undefined>) {
      state.minRating = action.payload;
    },
    setMaxDeliveryTime(state, action: PayloadAction<number | undefined>) {
      state.maxDeliveryTime = action.payload;
    },
    setDietaryOptions(state, action: PayloadAction<string[]>) {
      state.dietaryOptions = action.payload;
    },
    addDietaryOption(state, action: PayloadAction<string>) {
      if (!state.dietaryOptions.includes(action.payload)) {
        state.dietaryOptions.push(action.payload);
      }
    },
    removeDietaryOption(state, action: PayloadAction<string>) {
      state.dietaryOptions = state.dietaryOptions.filter((d) => d !== action.payload);
    },
    setIsOpen(state, action: PayloadAction<boolean | undefined>) {
      state.isOpen = action.payload;
    },
    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
    },
    resetFilters(state) {
      return initialState;
    },
  },
});

export const {
  setCuisine,
  addCuisine,
  removeCuisine,
  setPriceRange,
  addPriceRange,
  removePriceRange,
  setMinRating,
  setMaxDeliveryTime,
  setDietaryOptions,
  addDietaryOption,
  removeDietaryOption,
  setIsOpen,
  setSortBy,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
