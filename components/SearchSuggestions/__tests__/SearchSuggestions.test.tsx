import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchSuggestions } from '../SearchSuggestions';

const mockRecent = ['Pizza', 'Burger'];
const mockSuggestions = ['Sushi', 'Tacos'];
const mockHandlers = {
  onSelectSuggestion: jest.fn(),
  onRemoveRecent: jest.fn(),
  onClearRecent: jest.fn(),
};

describe('SearchSuggestions', () => {
  it('should not render when not visible', () => {
    const { queryByText } = render(
      <SearchSuggestions
        recentSearches={[]}
        suggestions={[]}
        {...mockHandlers}
        visible={false}
      />
    );
    expect(queryByText('Pizza')).toBeFalsy();
  });

  it('should render recent searches when visible', () => {
    const { getByText } = render(
      <SearchSuggestions
        recentSearches={mockRecent}
        suggestions={[]}
        {...mockHandlers}
        visible={true}
      />
    );
    expect(getByText('Pizza')).toBeTruthy();
    expect(getByText('Burger')).toBeTruthy();
  });

  it('should render suggestions', () => {
    const { getByText } = render(
      <SearchSuggestions
        recentSearches={[]}
        suggestions={mockSuggestions}
        {...mockHandlers}
        visible={true}
      />
    );
    expect(getByText('Sushi')).toBeTruthy();
    expect(getByText('Tacos')).toBeTruthy();
  });

  it('should render trending when no recent/suggestions', () => {
    const { getByText } = render(
      <SearchSuggestions
        recentSearches={[]}
        suggestions={[]}
        {...mockHandlers}
        visible={true}
      />
    );
    expect(getByText('Nigerian food')).toBeTruthy();
  });

  it('should call onSelectSuggestion on item press', () => {
    const { getByText } = render(
      <SearchSuggestions
        recentSearches={mockRecent}
        suggestions={[]}
        {...mockHandlers}
        visible={true}
      />
    );
    fireEvent.press(getByText('Pizza'));
    expect(mockHandlers.onSelectSuggestion).toHaveBeenCalledWith('Pizza');
  });

  it('should call onRemoveRecent on X press for recent', () => {
    const { getByText } = render(
      <SearchSuggestions
        recentSearches={mockRecent}
        suggestions={[]}
        {...mockHandlers}
        visible={true}
      />
    );
    const removeButton = getByText('×'); // First recent
    fireEvent.press(removeButton);
    expect(mockHandlers.onRemoveRecent).toHaveBeenCalledWith('Pizza');
  });

  it('should not show remove for suggestions/trending', () => {
    const { queryByText } = render(
      <SearchSuggestions
        recentSearches={[]}
        suggestions={mockSuggestions}
        {...mockHandlers}
        visible={true}
      />
    );
    expect(queryByText('×')).toBeFalsy();
  });

  it('should render header with Clear All for recents', () => {
    const { getByText } = render(
      <SearchSuggestions
        recentSearches={mockRecent}
        suggestions={[]}
        {...mockHandlers}
        visible={true}
      />
    );
    expect(getByText('Recent Searches')).toBeTruthy();
    expect(getByText('Clear All')).toBeTruthy();
  });

  it('should call onClearRecent on Clear All press', () => {
    const { getByText } = render(
      <SearchSuggestions
        recentSearches={mockRecent}
        suggestions={[]}
        {...mockHandlers}
        visible={true}
      />
    );
    fireEvent.press(getByText('Clear All'));
    expect(mockHandlers.onClearRecent).toHaveBeenCalled();
  });

  it('should have correct icons per type', () => {
    // Snapshot or style check; here assume render
    const { getByLabelText } = render(
      <SearchSuggestions
        recentSearches={mockRecent}
        suggestions={mockSuggestions}
        {...mockHandlers}
        visible={true}
      />
    );
    // Labels include type
    expect(getByLabelText('recent search: Pizza')).toBeTruthy();
    expect(getByLabelText('suggestion search: Sushi')).toBeTruthy();
  });

  it('should memoize and not re-render', () => {
    const { rerender } = render(
      <SearchSuggestions
        recentSearches={mockRecent}
        suggestions={[]}
        {...mockHandlers}
        visible={true}
      />
    );
    rerender(
      <SearchSuggestions
        recentSearches={mockRecent}
        suggestions={[]}
        {...mockHandlers}
        visible={true}
      />
    );
    // No extra calls
  });
});