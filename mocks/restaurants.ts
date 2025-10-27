import type { Restaurant } from '@/types';

export const NIGERIAN_CUISINES = [
  'Nigerian',
  'Yoruba',
  'Igbo',
  'Hausa',
  'Suya',
  'Swallow',
  'Pepper Soup',
  'Jollof',
  'Continental',
  'Fast Food',
  'Desserts',
  'Grill',
  'African',
];

export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free Options',
  'Halal',
  'Spicy Options',
  'Dairy-Free',
];

export const PRICE_RANGE_GUIDE = {
  1: '₦500 - ₦1,500',
  2: '₦1,500 - ₦4,000',
  3: '₦4,000 - ₦8,000',
  4: '₦8,000+',
};

export const mockRestaurants: Restaurant[] = [
  {
    id: 'sweet-kiwi-001',
    name: 'Sweet Kiwi Cafe',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    cuisine: ['Nigerian', 'Continental', 'Desserts'],
    deliveryTime: { min: 25, max: 45 },
    rating: 4.5,
    priceRange: 2,
    dietaryOptions: ['Vegetarian', 'Gluten-Free Options'],
    isOpen: true,
    location: {
      latitude: 6.5244,
      longitude: 3.3792,
    },
  },
  {
    id: 'suya-palace-002',
    name: 'Suya Palace',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&q=80',
    cuisine: ['Nigerian', 'Grill', 'African'],
    deliveryTime: { min: 35, max: 60 },
    rating: 4.7,
    priceRange: 2,
    dietaryOptions: ['Halal', 'Spicy Options'],
    isOpen: true,
    location: {
      latitude: 6.6018,
      longitude: 3.3515,
    },
  },
  {
    id: 'mama-put-003',
    name: "Mama's Kitchen",
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
    cuisine: ['Nigerian', 'Yoruba', 'Swallow'],
    deliveryTime: { min: 20, max: 35 },
    rating: 4.2,
    priceRange: 1,
    dietaryOptions: ['Halal', 'Spicy Options'],
    isOpen: true,
    location: {
      latitude: 6.5355,
      longitude: 3.3087,
    },
  },
  {
    id: 'jollof-junction-004',
    name: 'Jollof Junction',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&q=80',
    cuisine: ['Nigerian', 'Jollof', 'African'],
    deliveryTime: { min: 30, max: 50 },
    rating: 4.8,
    priceRange: 2,
    dietaryOptions: ['Halal', 'Vegetarian'],
    isOpen: true,
    location: {
      latitude: 6.4281,
      longitude: 3.4219,
    },
  },
  {
    id: 'pepper-soup-spot-005',
    name: 'Pepper Soup Spot',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    cuisine: ['Nigerian', 'Pepper Soup', 'Hausa'],
    deliveryTime: { min: 25, max: 40 },
    rating: 4.4,
    priceRange: 2,
    dietaryOptions: ['Halal', 'Spicy Options'],
    isOpen: false,
    location: {
      latitude: 6.5167,
      longitude: 3.3667,
    },
  },
  {
    id: 'eko-bistro-006',
    name: 'Eko Bistro',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
    cuisine: ['Continental', 'Nigerian', 'Fast Food'],
    deliveryTime: { min: 40, max: 65 },
    rating: 4.6,
    priceRange: 3,
    dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free Options'],
    isOpen: true,
    location: {
      latitude: 6.4474,
      longitude: 3.3903,
    },
  },
  {
    id: 'lagos-grill-007',
    name: 'Lagos Grill House',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    cuisine: ['Grill', 'Nigerian', 'Continental'],
    deliveryTime: { min: 45, max: 70 },
    rating: 4.9,
    priceRange: 4,
    dietaryOptions: ['Halal', 'Gluten-Free Options'],
    isOpen: true,
    location: {
      latitude: 6.4380,
      longitude: 3.4240,
    },
  },
  {
    id: 'amala-zone-008',
    name: 'Amala Zone',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80',
    cuisine: ['Nigerian', 'Yoruba', 'Swallow'],
    deliveryTime: { min: 20, max: 30 },
    rating: 4.3,
    priceRange: 1,
    dietaryOptions: ['Vegetarian', 'Spicy Options'],
    isOpen: true,
    location: {
      latitude: 6.6054,
      longitude: 3.2842,
    },
  },
  {
    id: 'chicken-republic-009',
    name: 'Chicken Republic',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&q=80',
    cuisine: ['Fast Food', 'Nigerian', 'Continental'],
    deliveryTime: { min: 25, max: 40 },
    rating: 4.1,
    priceRange: 2,
    dietaryOptions: ['Halal'],
    isOpen: true,
    location: {
      latitude: 6.5243,
      longitude: 3.3792,
    },
  },
  {
    id: 'the-place-010',
    name: 'The Place Restaurant',
    image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80',
    cuisine: ['Continental', 'Grill', 'Desserts'],
    deliveryTime: { min: 50, max: 75 },
    rating: 4.7,
    priceRange: 4,
    dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free Options'],
    isOpen: true,
    location: {
      latitude: 6.4297,
      longitude: 3.4106,
    },
  },
  {
    id: 'buka-hut-011',
    name: 'Buka Hut',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80',
    cuisine: ['Nigerian', 'African', 'Swallow'],
    deliveryTime: { min: 30, max: 45 },
    rating: 4.0,
    priceRange: 1,
    dietaryOptions: ['Halal', 'Spicy Options'],
    isOpen: true,
    location: {
      latitude: 6.6018,
      longitude: 3.3515,
    },
  },
  {
    id: 'kilimanjaro-012',
    name: 'Kilimanjaro Fast Food',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    cuisine: ['Fast Food', 'African', 'Nigerian'],
    deliveryTime: { min: 20, max: 35 },
    rating: 4.2,
    priceRange: 2,
    dietaryOptions: ['Halal'],
    isOpen: false,
    location: {
      latitude: 6.5388,
      longitude: 3.3473,
    },
  },
];

export function generateMockRestaurants(count: number): Restaurant[] {
  const restaurants: Restaurant[] = [];
  const names = [
    'Golden Spoon',
    'Tasty Bites',
    'Flavor Town',
    'Spice Hub',
    'The Food Court',
    'Crispy Kitchen',
    'Savory Delights',
    'Urban Eats',
    'Fresh Plate',
    'Gourmet House',
  ];

  const lagosCenterLat = 6.5244;
  const lagosCenterLng = 3.3792;

  for (let i = 0; i < count; i++) {
    const idx = i % names.length;
    const angle = (i / count) * 2 * Math.PI;
    const radius = 0.1 * (1 + (i % 5) / 5);

    restaurants.push({
      id: `restaurant-${i + 100}`,
      name: `${names[idx]} ${Math.floor(i / names.length) + 1}`,
      image: `https://images.unsplash.com/photo-${1555939594 + i}?w=800&q=80`,
      cuisine: [
        NIGERIAN_CUISINES[i % NIGERIAN_CUISINES.length],
        NIGERIAN_CUISINES[(i + 1) % NIGERIAN_CUISINES.length],
      ],
      deliveryTime: {
        min: 20 + (i % 4) * 10,
        max: 40 + (i % 5) * 10,
      },
      rating: 3.5 + (i % 15) * 0.1,
      priceRange: ((i % 4) + 1) as 1 | 2 | 3 | 4,
      dietaryOptions: [
        DIETARY_OPTIONS[i % DIETARY_OPTIONS.length],
        DIETARY_OPTIONS[(i + 2) % DIETARY_OPTIONS.length],
      ],
      isOpen: i % 5 !== 0,
      location: {
        latitude: lagosCenterLat + radius * Math.cos(angle),
        longitude: lagosCenterLng + radius * Math.sin(angle),
      },
    });
  }

  return restaurants;
}

export const allMockRestaurants = [
  ...mockRestaurants,
  ...generateMockRestaurants(100),
];
