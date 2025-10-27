import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FilterChips } from '../FilterChips';
import type { ActiveFilterTag } from '@/types';

const mockTags: ActiveFilterTag[] = [
  { id: 'cuisine-nigerian', label: 'Nigerian', type: 'cuisine', value: 'Nigerian' },
  { id: 'price-2', label: '₦1,500 - ₦4,000', type: 'priceRange', value: 2 },
  { id: 'rating-4.0', label: 'Rating 4.0+', type: 'minRating', value: 4.0 },
];

describe('FilterChips', () => {
  it('should render all filter tags', () => {
    const { getByText } = render(
      <FilterChips tags={mockTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByText('Nigerian')).toBeTruthy();
    expect(getByText('₦1,500 - ₦4,000')).toBeTruthy();
    expect(getByText('Rating 4.0+')).toBeTruthy();
  });

  it('should render Clear All button when tags exist', () => {
    const { getByText } = render(
      <FilterChips tags={mockTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByText('Clear All')).toBeTruthy();
  });

  it('should not render when tags array is empty', () => {
    const { queryByText } = render(
      <FilterChips tags={[]} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(queryByText('Clear All')).toBeFalsy();
  });

  it('should call onRemove with correct tag id when remove button is pressed', () => {
    const onRemove = jest.fn();
    const { getByTestId } = render(
      <FilterChips tags={mockTags} onRemove={onRemove} onClearAll={jest.fn()} />
    );

    fireEvent.press(getByTestId('remove-filter-cuisine-nigerian'));
    expect(onRemove).toHaveBeenCalledWith('cuisine-nigerian');
  });

  it('should call onClearAll when Clear All button is pressed', () => {
    const onClearAll = jest.fn();
    const { getByTestId } = render(
      <FilterChips tags={mockTags} onRemove={jest.fn()} onClearAll={onClearAll} />
    );

    fireEvent.press(getByTestId('clear-all-filters'));
    expect(onClearAll).toHaveBeenCalled();
  });

  it('should render with a single tag', () => {
    const singleTag: ActiveFilterTag[] = [
      { id: 'cuisine-nigerian', label: 'Nigerian', type: 'cuisine', value: 'Nigerian' },
    ];

    const { getByText } = render(
      <FilterChips tags={singleTag} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByText('Nigerian')).toBeTruthy();
    expect(getByText('Clear All')).toBeTruthy();
  });

  it('should render remove button for each tag', () => {
    const { getByTestId } = render(
      <FilterChips tags={mockTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByTestId('remove-filter-cuisine-nigerian')).toBeTruthy();
    expect(getByTestId('remove-filter-price-2')).toBeTruthy();
    expect(getByTestId('remove-filter-rating-4.0')).toBeTruthy();
  });

  it('should have accessibility labels for remove buttons', () => {
    const { getByLabelText } = render(
      <FilterChips tags={mockTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByLabelText('Remove Nigerian filter')).toBeTruthy();
    expect(getByLabelText('Remove ₦1,500 - ₦4,000 filter')).toBeTruthy();
    expect(getByLabelText('Remove Rating 4.0+ filter')).toBeTruthy();
  });

  it('should have accessibility label for clear all button', () => {
    const { getByLabelText } = render(
      <FilterChips tags={mockTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByLabelText('Clear all filters')).toBeTruthy();
  });

  it('should handle multiple remove actions', () => {
    const onRemove = jest.fn();
    const { getByTestId } = render(
      <FilterChips tags={mockTags} onRemove={onRemove} onClearAll={jest.fn()} />
    );

    fireEvent.press(getByTestId('remove-filter-cuisine-nigerian'));
    fireEvent.press(getByTestId('remove-filter-price-2'));

    expect(onRemove).toHaveBeenCalledTimes(2);
    expect(onRemove).toHaveBeenNthCalledWith(1, 'cuisine-nigerian');
    expect(onRemove).toHaveBeenNthCalledWith(2, 'price-2');
  });

  it('should memoize and not re-render unnecessarily', () => {
    const { rerender } = render(
      <FilterChips tags={mockTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    const onRemove = jest.fn();
    const onClearAll = jest.fn();

    rerender(<FilterChips tags={mockTags} onRemove={onRemove} onClearAll={onClearAll} />);

    expect(onRemove).not.toHaveBeenCalled();
    expect(onClearAll).not.toHaveBeenCalled();
  });

  it('should render with many tags', () => {
    const manyTags: ActiveFilterTag[] = Array.from({ length: 10 }, (_, i) => ({
      id: `tag-${i}`,
      label: `Filter ${i}`,
      type: 'cuisine' as const,
      value: `Filter ${i}`,
    }));

    const { getByText } = render(
      <FilterChips tags={manyTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByText('Filter 0')).toBeTruthy();
    expect(getByText('Filter 9')).toBeTruthy();
  });

  it('should handle long tag labels', () => {
    const longTags: ActiveFilterTag[] = [
      {
        id: 'long-1',
        label: 'This is a very long filter label that might overflow',
        type: 'dietaryOptions',
        value: 'long',
      },
    ];

    const { getByText } = render(
      <FilterChips tags={longTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByText('This is a very long filter label that might overflow')).toBeTruthy();
  });

  it('should render horizontally scrollable content', () => {
    const { UNSAFE_getByType } = render(
      <FilterChips tags={mockTags} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
    expect(scrollView.props.horizontal).toBe(true);
    expect(scrollView.props.showsHorizontalScrollIndicator).toBe(false);
  });

  it('should work with all filter types', () => {
    const allTypes: ActiveFilterTag[] = [
      { id: 'cuisine-1', label: 'Nigerian', type: 'cuisine', value: 'Nigerian' },
      { id: 'price-1', label: '₦1,500', type: 'priceRange', value: 2 },
      { id: 'rating-1', label: '4.5+', type: 'minRating', value: 4.5 },
      { id: 'delivery-1', label: '30 min', type: 'maxDeliveryTime', value: 30 },
      { id: 'dietary-1', label: 'Halal', type: 'dietaryOptions', value: 'Halal' },
      { id: 'open-1', label: 'Open Now', type: 'isOpen', value: true },
      { id: 'sort-1', label: 'By Rating', type: 'sortBy', value: 'rating' },
    ];

    const { getByText } = render(
      <FilterChips tags={allTypes} onRemove={jest.fn()} onClearAll={jest.fn()} />
    );

    expect(getByText('Nigerian')).toBeTruthy();
    expect(getByText('₦1,500')).toBeTruthy();
    expect(getByText('4.5+')).toBeTruthy();
    expect(getByText('30 min')).toBeTruthy();
    expect(getByText('Halal')).toBeTruthy();
    expect(getByText('Open Now')).toBeTruthy();
    expect(getByText('By Rating')).toBeTruthy();
  });
});
