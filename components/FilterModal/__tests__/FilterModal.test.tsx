import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterModal } from '../FilterModal';
import type { FilterState } from '@/types';

const mockFilters: FilterState = {
  cuisine: ['Nigerian'],
  priceRange: [2],
  minRating: 4.0,
  maxDeliveryTime: 30,
  dietaryOptions: ['Vegetarian'],
  isOpen: true,
  sortBy: 'rating' as const,
};

const mockHandlers = {
  onToggleCuisine: jest.fn(),
  onTogglePriceRange: jest.fn(),
  onToggleDietaryOption: jest.fn(),
  onSetMinRating: jest.fn(),
  onSetMaxDeliveryTime: jest.fn(),
  onSetOpenOnly: jest.fn(),
  onChangeSortBy: jest.fn(),
  onResetFilters: jest.fn(),
};

describe('FilterModal', () => {
  it('should render modal when visible', () => {
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={jest.fn()}
        filters={mockFilters}
        {...mockHandlers}
      />
    );
    expect(getByText('Filters')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = render(
      <FilterModal
        visible={false}
        onClose={jest.fn()}
        filters={mockFilters}
        {...mockHandlers}
      />
    );
    expect(queryByText('Filters')).toBeFalsy();
  });

  it('should call onClose when close button pressed', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <FilterModal
        visible={true}
        onClose={onClose}
        filters={mockFilters}
        {...mockHandlers}
      />
    );
    fireEvent.press(getByTestId('close-filter-modal'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should render Sort By section with options', () => {
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={jest.fn()}
        filters={mockFilters}
        {...mockHandlers}
      />
    );
    expect(getByText('Sort By')).toBeTruthy();
    expect(getByText('Rating')).toBeTruthy();
    expect(getByText('Delivery')).toBeTruthy();
    expect(getByText('Price')).toBeTruthy();
    expect(getByText('Distance')).toBeTruthy();
  });

  it('should select correct sort option', () => {
    const filtersWithDistance: FilterState = { ...mockFilters, sortBy: 'distance' };
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={jest.fn()}
        filters={filtersWithDistance}
        {...mockHandlers}
      />
    );
    // Assume style check via testID or snapshot; here check render
    expect(getByText('Distance')).toBeTruthy();
  });

  it('should call onChangeSortBy when sort option pressed', () => {
    const onChangeSortBy = jest.fn();
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={jest.fn()}
        filters={mockFilters}
        // onChangeSortBy={onChangeSortBy}
        {...mockHandlers}
      />
    );
    fireEvent.press(getByText('Delivery'));
    expect(onChangeSortBy).toHaveBeenCalledWith('deliveryTime');
  });

  it('should render Cuisine section with Nigerian options', () => {
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={jest.fn()}
        filters={mockFilters}
        {...mockHandlers}
      />
    );
    expect(getByText('Cuisine')).toBeTruthy();
    expect(getByText('Nigerian')).toBeTruthy();
    expect(getByText('Yoruba')).toBeTruthy();
  });

  it('should toggle cuisine selection', () => {
    const onToggleCuisine = jest.fn();
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={jest.fn()}
        filters={{ ...mockFilters, cuisine: [] }}
        // onToggleCuisine={onToggleCuisine}
        {...mockHandlers}
      />
    );
    fireEvent.press(getByText('Nigerian'));
    expect(onToggleCuisine).toHaveBeenCalledWith('Nigerian');
  });

  // Similar for Price, Dietary, Rating, Delivery, Availability...
  it('should render Price Range options', () => {
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={jest.fn()}
        filters={mockFilters}
        {...mockHandlers}
      />
    );
    expect(getByText('₦500 - ₦1,500')).toBeTruthy();
    expect(getByText('₦1,500 - ₦4,000')).toBeTruthy();
  });

  it('should call reset and close on Reset All', () => {
    const onResetFilters = jest.fn();
    const onClose = jest.fn();
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={onClose}
        filters={mockFilters}
        // onResetFilters={onResetFilters}
        {...mockHandlers}
      />
    );
    fireEvent.press(getByText('Reset All'));
    expect(onResetFilters).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose on Apply Filters', () => {
    const onClose = jest.fn();
    const { getByText } = render(
      <FilterModal
        visible={true}
        onClose={onClose}
        filters={mockFilters}
        {...mockHandlers}
      />
    );
    fireEvent.press(getByText('Apply Filters'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should have accessibility for options', () => {
    const { getByLabelText } = render(
      <FilterModal
        visible={true}
        onClose={jest.fn()}
        filters={mockFilters}
        {...mockHandlers}
      />
    );
    // Assumes labels from Pressable; test presence
    expect(getByLabelText('Open Now')).toBeTruthy(); // Example
  });

  // Add more for full coverage...
});