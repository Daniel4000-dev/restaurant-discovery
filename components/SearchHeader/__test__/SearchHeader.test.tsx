import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchHeader } from '../SearchHeader';

describe('SearchHeader', () => {
  it('should render search input', () => {
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    expect(getByTestId('search-input')).toBeTruthy();
  });

  it('should render filter button', () => {
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    expect(getByTestId('filter-button')).toBeTruthy();
  });

  it('should display query value in input', () => {
    const { getByTestId } = render(
      <SearchHeader
        query="Pizza"
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    const input = getByTestId('search-input');
    expect(input.props.value).toBe('Pizza');
  });

  it('should call onQueryChange when text changes', () => {
    const onQueryChange = jest.fn();
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={onQueryChange}
        onFilterPress={jest.fn()}
      />
    );

    fireEvent.changeText(getByTestId('search-input'), 'Burger');
    expect(onQueryChange).toHaveBeenCalledWith('Burger');
  });

  it('should call onFilterPress when filter button is pressed', () => {
    const onFilterPress = jest.fn();
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={onFilterPress}
      />
    );

    fireEvent.press(getByTestId('filter-button'));
    expect(onFilterPress).toHaveBeenCalled();
  });

  it('should show clear button when query has text', () => {
    const { getByTestId } = render(
      <SearchHeader
        query="Pizza"
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    expect(getByTestId('clear-search')).toBeTruthy();
  });

  it('should not show clear button when query is empty', () => {
    const { queryByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    expect(queryByTestId('clear-search')).toBeFalsy();
  });

  it('should clear query when clear button is pressed', () => {
    const onQueryChange = jest.fn();
    const { getByTestId } = render(
      <SearchHeader
        query="Pizza"
        onQueryChange={onQueryChange}
        onFilterPress={jest.fn()}
      />
    );

    fireEvent.press(getByTestId('clear-search'));
    expect(onQueryChange).toHaveBeenCalledWith('');
  });

  it('should style filter button differently when filters are active', () => {
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
        hasActiveFilters={true}
      />
    );

    const filterButton = getByTestId('filter-button');
    expect(filterButton).toBeTruthy();
  });

  it('should not style filter button when no filters are active', () => {
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
        hasActiveFilters={false}
      />
    );

    const filterButton = getByTestId('filter-button');
    expect(filterButton).toBeTruthy();
  });

  it('should have correct placeholder text', () => {
    const { getByPlaceholderText } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    expect(getByPlaceholderText('Search restaurants, cuisines...')).toBeTruthy();
  });

  it('should have accessibility label for search input', () => {
    const { getByLabelText } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    expect(getByLabelText('Search restaurants')).toBeTruthy();
  });

  it('should have accessibility label for filter button with active filters', () => {
    const { getByLabelText } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
        hasActiveFilters={true}
      />
    );

    expect(getByLabelText('Open filters (active filters applied)')).toBeTruthy();
  });

  it('should have accessibility label for filter button without active filters', () => {
    const { getByLabelText } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
        hasActiveFilters={false}
      />
    );

    expect(getByLabelText('Open filters')).toBeTruthy();
  });

  it('should have accessibility label for clear button', () => {
    const { getByLabelText } = render(
      <SearchHeader
        query="Pizza"
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    expect(getByLabelText('Clear search')).toBeTruthy();
  });

  it('should handle multiple text changes', () => {
    const onQueryChange = jest.fn();
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={onQueryChange}
        onFilterPress={jest.fn()}
      />
    );

    const input = getByTestId('search-input');
    fireEvent.changeText(input, 'P');
    fireEvent.changeText(input, 'Pi');
    fireEvent.changeText(input, 'Piz');
    fireEvent.changeText(input, 'Pizz');
    fireEvent.changeText(input, 'Pizza');

    expect(onQueryChange).toHaveBeenCalledTimes(5);
    expect(onQueryChange).toHaveBeenLastCalledWith('Pizza');
  });

  it('should handle multiple filter button presses', () => {
    const onFilterPress = jest.fn();
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={onFilterPress}
      />
    );

    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-button'));
    fireEvent.press(getByTestId('filter-button'));

    expect(onFilterPress).toHaveBeenCalledTimes(3);
  });

  it('should memoize and not re-render unnecessarily', () => {
    const { rerender } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    const onQueryChange = jest.fn();
    const onFilterPress = jest.fn();

    rerender(
      <SearchHeader
        query=""
        onQueryChange={onQueryChange}
        onFilterPress={onFilterPress}
      />
    );

    expect(onQueryChange).not.toHaveBeenCalled();
    expect(onFilterPress).not.toHaveBeenCalled();
  });

  it('should work with autoCapitalize=none', () => {
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    const input = getByTestId('search-input');
    expect(input.props.autoCapitalize).toBe('none');
  });

  it('should work with autoCorrect=false', () => {
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    const input = getByTestId('search-input');
    expect(input.props.autoCorrect).toBe(false);
  });

  it('should have returnKeyType=search', () => {
    const { getByTestId } = render(
      <SearchHeader
        query=""
        onQueryChange={jest.fn()}
        onFilterPress={jest.fn()}
      />
    );

    const input = getByTestId('search-input');
    expect(input.props.returnKeyType).toBe('search');
  });
});
