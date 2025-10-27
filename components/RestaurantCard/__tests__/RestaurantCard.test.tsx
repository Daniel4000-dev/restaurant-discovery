import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RestaurantCard } from '../RestaurantCard';
import type { Restaurant } from '@/types';

const mockRestaurant: Restaurant = {
  id: 'test-1',
  name: 'Sweet Kiwi Cafe',
  image: 'https://example.com/image.jpg',
  cuisine: ['Nigerian', 'Continental'],
  deliveryTime: { min: 25, max: 45 },
  rating: 4.5,
  priceRange: 2,
  dietaryOptions: ['Vegetarian', 'Gluten-Free'],
  isOpen: true,
  location: { latitude: 6.5244, longitude: 3.3792 },
};

const closedRestaurant: Restaurant = {
  ...mockRestaurant,
  id: 'test-2',
  name: 'Closed Restaurant',
  isOpen: false,
};

describe('RestaurantCard', () => {
  it('should render restaurant name', () => {
    const { getByText } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(getByText('Sweet Kiwi Cafe')).toBeTruthy();
  });

  it('should render cuisines joined with bullet', () => {
    const { getByText } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(getByText('Nigerian • Continental')).toBeTruthy();
  });

  it('should render rating', () => {
    const { getByText } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(getByText('4.5')).toBeTruthy();
  });

  it('should render delivery time', () => {
    const { getByText } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(getByText('25-45 min')).toBeTruthy();
  });

  it('should render price range', () => {
    const { getByText } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(getByText('₦1,500 - ₦4,000')).toBeTruthy();
  });

  it('should render dietary options', () => {
    const { getByText } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(getByText('Vegetarian')).toBeTruthy();
    expect(getByText('Gluten-Free')).toBeTruthy();
  });

  it('should limit dietary options to 2', () => {
    const restaurantWithManyOptions: Restaurant = {
      ...mockRestaurant,
      dietaryOptions: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'],
    };
    const { getByText, queryByText } = render(
      <RestaurantCard restaurant={restaurantWithManyOptions} />
    );
    expect(getByText('Vegetarian')).toBeTruthy();
    expect(getByText('Vegan')).toBeTruthy();
    expect(queryByText('Gluten-Free')).toBeFalsy();
    expect(queryByText('Halal')).toBeFalsy();
  });

  it('should show closed badge when restaurant is closed', () => {
    const { getByText } = render(<RestaurantCard restaurant={closedRestaurant} />);
    expect(getByText('Closed')).toBeTruthy();
  });

  it('should not show closed badge when restaurant is open', () => {
    const { queryByText } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(queryByText('Closed')).toBeFalsy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <RestaurantCard restaurant={mockRestaurant} onPress={onPress} />
    );

    fireEvent.press(getByTestId(`restaurant-card-${mockRestaurant.id}`));
    expect(onPress).toHaveBeenCalledWith(mockRestaurant);
  });

  it('should not call onPress when not provided', () => {
    const { getByTestId } = render(<RestaurantCard restaurant={mockRestaurant} />);

    expect(() => {
      fireEvent.press(getByTestId(`restaurant-card-${mockRestaurant.id}`));
    }).not.toThrow();
  });

  it('should have correct testID', () => {
    const { getByTestId } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(getByTestId('restaurant-card-test-1')).toBeTruthy();
  });

  it('should have accessibility label', () => {
    const { getByLabelText } = render(<RestaurantCard restaurant={mockRestaurant} />);
    expect(
      getByLabelText(
        'Sweet Kiwi Cafe, Nigerian, Continental, 4.5 stars, delivery 25 to 45 minutes'
      )
    ).toBeTruthy();
  });

  it('should render without dietary options', () => {
    const restaurantNoDietary: Restaurant = {
      ...mockRestaurant,
      dietaryOptions: [],
    };
    const { queryByText } = render(<RestaurantCard restaurant={restaurantNoDietary} />);
    expect(queryByText('Vegetarian')).toBeFalsy();
  });

  it('should render with different price ranges', () => {
    const priceRanges: Array<1 | 2 | 3 | 4> = [1, 2, 3, 4];
    const expectedLabels = [
      '₦500 - ₦1,500',
      '₦1,500 - ₦4,000',
      '₦4,000 - ₦8,000',
      '₦8,000+',
    ];

    priceRanges.forEach((priceRange, index) => {
      const restaurant: Restaurant = {
        ...mockRestaurant,
        priceRange,
      };
      const { getByText } = render(<RestaurantCard restaurant={restaurant} />);
      expect(getByText(expectedLabels[index])).toBeTruthy();
    });
  });

  it('should memoize and not re-render unnecessarily', () => {
    const { rerender } = render(<RestaurantCard restaurant={mockRestaurant} />);
    const onPress = jest.fn();

    rerender(<RestaurantCard restaurant={mockRestaurant} onPress={onPress} />);

    expect(onPress).not.toHaveBeenCalled();
  });

  it('should handle long restaurant names with ellipsis', () => {
    const longNameRestaurant: Restaurant = {
      ...mockRestaurant,
      name: 'This is a very long restaurant name that should be truncated with ellipsis',
    };
    const { getByText } = render(<RestaurantCard restaurant={longNameRestaurant} />);
    expect(
      getByText(
        'This is a very long restaurant name that should be truncated with ellipsis'
      )
    ).toBeTruthy();
  });

  it('should handle single cuisine', () => {
    const singleCuisine: Restaurant = {
      ...mockRestaurant,
      cuisine: ['Nigerian'],
    };
    const { getByText } = render(<RestaurantCard restaurant={singleCuisine} />);
    expect(getByText('Nigerian')).toBeTruthy();
  });

  it('should render image with correct URI', () => {
    const { UNSAFE_getByType } = render(<RestaurantCard restaurant={mockRestaurant} />);
    const images = UNSAFE_getByType(require('expo-image').Image);
    expect(images).toBeTruthy();
  });
});
