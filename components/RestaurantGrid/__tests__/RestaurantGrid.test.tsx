// import React from 'react';
// import { render, fireEvent } from '@testing-library/react-native';
// import { RestaurantGrid } from '../RestaurantGrid';
// import type { Restaurant } from '@/types';
// import { EmptyState } from '@/components/common/EmptyState';

// const mockRestaurants: Restaurant[] = [
//   { id: '1', name: 'Test1', image: '', cuisine: [], deliveryTime: { min: 20, max: 30 }, rating: 4.5, priceRange: 1, dietaryOptions: [], isOpen: true, location: { latitude: 0, longitude: 0 } },
//   { id: '2', name: 'Test2', image: '', cuisine: [], deliveryTime: { min: 20, max: 30 }, rating: 4.5, priceRange: 1, dietaryOptions: [], isOpen: true, location: { latitude: 0, longitude: 0 } },
// ];

// const mockHandlers = {
//   onLoadMore: jest.fn(),
//   onRefresh: jest.fn(),
//   onRestaurantPress: jest.fn(),
// };

// describe('RestaurantGrid', () => {
//   it('should render restaurants', () => {
//     const { getByTestId } = render(
//       <RestaurantGrid
//         restaurants={mockRestaurants}
//         isLoading={false}
//         isError={false}
//         isFetchingNextPage={false}
//         hasNextPage={false}
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//         testID="grid-test"
//       />
//     );
//     expect(getByTestId('grid-test')).toBeTruthy();
//   });

//   it('should call onLoadMore on end reached', () => {
//     const { _fiber } = render(
//       <RestaurantGrid
//         restaurants={mockRestaurants}
//         isLoading={false}
//         isError={false}
//         isFetchingNextPage={false}
//         hasNextPage={true}
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//       />
//     );
//     // Simulate end reached via ref or act
//     fireEvent(_fiber.instance?.onEndReached?.(), { distanceFromEnd: 0 });
//     expect(mockHandlers.onLoadMore).toHaveBeenCalled();
//   });

//   it('should not call onLoadMore if no next page', () => {
//     const { _fiber } = render(
//       <RestaurantGrid
//         restaurants={mockRestaurants}
//         isLoading={false}
//         isError={false}
//         isFetchingNextPage={false}
//         hasNextPage={false}
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//       />
//     );
//     fireEvent(_fiber.instance?.onEndReached?.(), { distanceFromEnd: 0 });
//     expect(mockHandlers.onLoadMore).not.toHaveBeenCalled();
//   });

//   it('should show footer spinner when fetching next', () => {
//     const { getByTestId } = render(
//       <RestaurantGrid
//         restaurants={mockRestaurants}
//         isLoading={false}
//         isError={false}
//         isFetchingNextPage={true}
//         hasNextPage={true}
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//       />
//     );
//     expect(getByTestId('loading-indicator')).toBeTruthy();
//   });

//   it('should render empty state for error', () => {
//     const { getByText } = render(
//       <RestaurantGrid
//         restaurants={[]}
//         isLoading={false}
//         isError={true}
//         isFetchingNextPage={false}
//         hasNextPage={false}
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//       />
//     );
//     expect(getByText('Something went wrong')).toBeTruthy();
//   });

//   it('should render search empty state', () => {
//     const { getByText } = render(
//       <RestaurantGrid
//         restaurants={[]}
//         isLoading={false}
//         isError={false}
//         isFetchingNextPage={false}
//         hasNextPage={false}
//         query="noresults"
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//       />
//     );
//     expect(getByText('No results found')).toBeTruthy();
//   });

//   // Similar for filter, general empty...
//   it('should call onRefresh on pull', () => {
//     const { _fiber } = render(
//       <RestaurantGrid
//         restaurants={mockRestaurants}
//         isLoading={false}
//         isError={false}
//         isFetchingNextPage={false}
//         hasNextPage={false}
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//       />
//     );
//     fireEvent(_fiber.instance?.onRefreshControl?.onRefresh(), expect.anything());
//     expect(mockHandlers.onRefresh).toHaveBeenCalled();
//   });

//   it('should memoize', () => {
//     const { rerender } = render(
//       <RestaurantGrid
//         restaurants={mockRestaurants}
//         isLoading={false}
//         isError={false}
//         isFetchingNextPage={false}
//         hasNextPage={false}
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//       />
//     );
//     rerender(
//       <RestaurantGrid
//         restaurants={mockRestaurants}
//         isLoading={false}
//         isError={false}
//         isFetchingNextPage={false}
//         hasNextPage={false}
//         onLoadMore={mockHandlers.onLoadMore}
//         onRefresh={mockHandlers.onRefresh}
//       />
//     );
//     // No extra calls
//   });
// });