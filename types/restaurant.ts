export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string[];
  deliveryTime: { min: number; max: number };
  rating: number;
  priceRange: 1 | 2 | 3 | 4;
  dietaryOptions: string[];
  isOpen: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  dietaryTags: string[];
  isAvailable: boolean;
  preparationTime?: number;
}

export interface RestaurantWithMenu extends Restaurant {
  menu: MenuItem[];
  deliveryFee: number;
  minimumOrder: number;
  promotions: string[];
}

export type RestaurantFilter = {
  cuisine?: string[];
  maxDeliveryTime?: number;
  minRating?: number;
  priceRange?: (1 | 2 | 3 | 4)[];
  dietaryOptions?: string[];
  isOpen?: boolean;
};

export type SortOption = 'rating' | 'deliveryTime' | 'price' | 'distance';

export interface FilterState {
  cuisine: string[];
  priceRange: (1 | 2 | 3 | 4)[];
  minRating?: number;
  maxDeliveryTime?: number;
  dietaryOptions: string[];
  isOpen?: boolean;
  sortBy: SortOption;
}

export interface ActiveFilterTag {
  id: string;
  label: string;
  type: keyof FilterState;
  value: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
}
