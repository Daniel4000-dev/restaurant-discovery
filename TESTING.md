# Testing Guide - Restaurant Discovery Feature

## Overview

This document outlines the testing strategy, setup instructions, and test coverage for the Restaurant Discovery feature. The tests follow React Native Testing Library best practices and achieve >80% coverage for critical paths.

## Test Setup

### Installation

```bash
# Install testing dependencies
bun add --dev jest@^29.7.0 \
  @testing-library/react-native@^12.8.1 \
  @testing-library/jest-native@^5.4.3 \
  jest-expo@^52.0.0 \
  @types/jest@^29.5.14
```

### Configuration

Create `jest.config.js` in the project root:

```javascript
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
```

Create `jest.setup.js`:

```javascript
import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Search: 'Search',
  SlidersHorizontal: 'SlidersHorizontal',
  Star: 'Star',
  Clock: 'Clock',
  X: 'X',
  Check: 'Check',
  AlertCircle: 'AlertCircle',
}));
```

### Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

## Test Structure

Tests are organized following the project structure:

```
src/
  hooks/
    __tests__/
      useSearchFilters.test.ts
      useRestaurantSearch.test.ts
      useInfiniteRestaurants.test.ts
  components/
    RestaurantCard/
      __tests__/
        RestaurantCard.test.tsx
    FilterChips/
      __tests__/
        FilterChips.test.tsx
    SearchHeader/
      __tests__/
        SearchHeader.test.tsx
    RestaurantGrid/
      __tests__/
        RestaurantGrid.test.tsx
```

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Generate coverage report
bun test:coverage

# Run in CI mode
bun test:ci
```

## Coverage Report

After running `bun test:coverage`, coverage reports are generated in:
- `coverage/lcov-report/index.html` - HTML report
- `coverage/coverage-final.json` - JSON report
- `coverage/lcov.info` - LCOV format

## Test Documentation

### Custom Hooks

#### useSearchFilters
**Coverage Target: >80%**

**Test Cases:**
- Initial state matches defaults
- Toggle cuisine adds/removes items
- Toggle price range adds/removes items
- Toggle dietary options adds/removes items
- Set minimum rating updates state
- Set maximum delivery time updates state
- Set open only updates state
- Change sort by updates state
- Remove filter by tag ID
- Clear all filters resets state
- Active filter tags generation
- Has active filters flag
- Get restaurant filter serialization

**Key Behaviors Tested:**
- Redux integration
- Filter state persistence
- Active tag generation with proper labels
- Filter serialization for API calls

#### useRestaurantSearch
**Coverage Target: >80%**

**Test Cases:**
- Initial state is empty
- Query update triggers debounced search
- Debounce delay is 300ms
- Search query triggers API call
- Recent searches persistence in AsyncStorage
- Add to recent searches on successful search
- Clear recent searches
- Remove individual recent search
- Loading states during search
- Error handling
- Empty query doesn't trigger search

**Key Behaviors Tested:**
- Debounce implementation
- React Query integration
- AsyncStorage persistence
- Error boundaries

#### useInfiniteRestaurants
**Coverage Target: >80%**

**Test Cases:**
- Initial data fetch
- Load more with pagination
- Cursor-based pagination
- Pull to refresh
- Filter application
- Sort application
- Search query integration
- Loading states
- Error handling
- Has next page detection
- Aggregated restaurant list

**Key Behaviors Tested:**
- React Query infinite query
- Cursor pagination
- Filter and sort integration
- Refresh functionality
- Error recovery

### Components

#### RestaurantCard
**Coverage Target: >80%**

**Test Cases:**
- Renders restaurant data correctly
- Shows closed badge when not open
- Displays rating with star icon
- Shows delivery time
- Shows price range
- Displays dietary options tags
- Handles press events
- Image lazy loading
- Accessibility labels present
- TestID for automation

#### FilterChips
**Coverage Target: >80%**

**Test Cases:**
- Renders active filter tags
- Individual tag removal
- Clear all button appears when filters active
- Clear all removes all filters
- Shows count of active filters
- Horizontal scrolling
- Accessibility support

#### SearchHeader
**Coverage Target: >80%**

**Test Cases:**
- Search input updates query
- Filter button opens modal
- Active filter badge on filter button
- Clear search button
- Keyboard handling
- Accessibility labels

#### RestaurantGrid
**Coverage Target: >80%**

**Test Cases:**
- Renders list of restaurants
- Virtualization enabled
- Infinite scroll triggers load more
- Pull to refresh
- Loading state
- Error state
- Empty state variations (no results, no filters, search)
- Restaurant press handling
- Performance optimizations (memo, callbacks)

## Mocking Strategy

### Redux Store Mock

```typescript
import { configureStore } from '@reduxjs/toolkit';
import filterReducer from '@/src/store/filterSlice';

export const createMockStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      filters: filterReducer,
    },
    preloadedState,
  });
};
```

### React Query Mock

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

export const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);
```

## Best Practices

### 1. Test User Behavior, Not Implementation

✅ Good:
```typescript
fireEvent.press(screen.getByText('Nigerian'));
expect(screen.getByText('Nigerian')).toHaveStyle({ backgroundColor: '#0EA5E9' });
```

❌ Bad:
```typescript
expect(mockDispatch).toHaveBeenCalledWith(addCuisine('Nigerian'));
```

### 2. Use Testing Library Queries

Priority order:
1. `getByRole`
2. `getByLabelText`
3. `getByPlaceholderText`
4. `getByText`
5. `getByTestId` (last resort)

### 3. Async Testing

```typescript
await waitFor(() => {
  expect(screen.getByText('Restaurant Name')).toBeOnTheScreen();
});
```

### 4. Mock Network Calls

```typescript
const mockFetch = jest.fn();
jest.mock('@/src/api/mock-restaurants', () => ({
  fetchMockRestaurants: mockFetch,
}));
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: bun install
      - run: bun test:ci
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Performance Testing

For performance testing, measure:
1. Component render time
2. List scroll performance
3. Memory usage with large datasets
4. Search debounce effectiveness

```typescript
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
};

<Profiler id="RestaurantGrid" onRender={onRenderCallback}>
  <RestaurantGrid {...props} />
</Profiler>
```

## Troubleshooting

### Common Issues

**Issue: Tests timeout**
- Increase timeout: `jest.setTimeout(10000)`
- Check for unresolved promises
- Ensure mocks are properly configured

**Issue: AsyncStorage errors**
- Verify mock is loaded in jest.setup.js
- Clear AsyncStorage between tests

**Issue: React Query not updating**
- Use `waitFor` for async updates
- Create fresh QueryClient per test

## Coverage Goals

| Category | Target | Current |
|----------|--------|--------|
| Statements | >80% | - |
| Branches | >80% | - |
| Functions | >80% | - |
| Lines | >80% | - |

### Critical Paths (Must be 100%)

- Search debounce logic
- Filter application
- Pagination cursor handling
- Error boundaries
- Recent searches persistence

## Resources

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
- [React Query Testing](https://tanstack.com/query/latest/docs/react/guides/testing)
