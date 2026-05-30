# Standard Listing Module Design

## Purpose
A "Standard Listing Module" is a reusable UI pattern designed to display collections of data (e.g., users, products, orders) in an organized and interactive manner. Its primary goal is to provide users with an efficient way to view, search, filter, sort, and interact with lists of items.

## Key Features

1.  **Data Display:**
    *   **Table View:** Most common for structured data with multiple columns.
    *   **List View:** Suitable for less structured data or when more visual emphasis is needed per item.
    *   **Card View:** Ideal for displaying items with images or rich content, often in a grid layout.
2.  **Pagination:**
    *   Supports breaking down large datasets into manageable pages.
    *   Includes controls for navigating between pages (next, previous, specific page numbers).
    *   Displays total item count and current page range.
3.  **Filtering/Searching:**
    *   **Search Bar:** For free-text search across relevant fields.
    *   **Filter Controls:** Dropdowns, date pickers, checkboxes, or range sliders for specific criteria.
    *   Ability to combine multiple filters.
4.  **Sorting:**
    *   Allows users to sort data by one or more columns/fields (ascending/descending).
    *   Clear indication of the currently active sort.
5.  **Loading States:**
    *   Visual feedback (e.g., spinners, skeleton loaders) while data is being fetched or updated.
6.  **Empty States:**
    *   Clear message and/or illustration when no data matches the current criteria.
7.  **Actions:**
    *   **Row/Item-level Actions:** Buttons or menus for actions like "Edit," "Delete," "View Details," "Duplicate" for individual items.
    *   **Bulk Actions:** Checkboxes for selecting multiple items and performing actions on the selection.
8.  **Selection:**
    *   Single or multiple item selection capability, often via checkboxes.

## Component Structure (Conceptual)

A standard listing module can often be broken down into several conceptual components:

-   **`[ModuleName]ListContainer` (e.g., `UserListContainer`):**
    *   Manages state for data, loading, pagination, filters, and sorting.
    *   Handles data fetching logic (e.g., calling services, dispatching Redux actions).
    *   Renders the `[ModuleName]ListView` and passes necessary props.
-   **`[ModuleName]ListView` (e.g., `UserListView`):**
    *   Purely presentational component.
    *   Receives data, loading state, pagination props, filter props, etc., and renders the UI.
    *   Composes sub-components like `FilterBar`, `DataTable`, `Pagination`.
-   **`FilterBar`:** Contains search input and various filter controls.
-   **`DataTable` / `ItemList` / `CardGrid`:** The primary component for displaying the actual items.
-   **`Pagination`:** Handles page navigation.
-   **`LoadingState` / `EmptyState`:** Components to display when data is loading or absent.

## Data Flow

1.  **Initialization:**
    *   `[ModuleName]ListContainer` mounts, fetches initial data based on default pagination, filters, and sort.
2.  **User Interaction:**
    *   User changes a filter, search term, sort order, or page number.
    *   The respective UI component (e.g., `FilterBar`, `Pagination`) triggers a callback prop (e.g., `onFilterChange`, `onPageChange`).
    *   `[ModuleName]ListContainer` updates its internal state and re-fetches data with the new parameters.
3.  **Data Fetching:**
    *   Typically involves calling a service layer (e.g., `UserService.getUsers(params)`).
    *   Loading state is set to `true` before the fetch and `false` after.
    *   Fetched data is stored in the component's state or a global state management system (e.g., Redux).

## Props (Common)

-   `data` (Array): The array of items to be displayed.
-   `loading` (boolean): Indicates if data is currently being fetched.
-   `pagination` (Object):
    *   `currentPage` (number)
    *   `pageSize` (number)
    *   `totalItems` (number)
    *   `onPageChange` (Function): `(page: number, pageSize: number) => void`
-   `filters` (Object): Current filter values.
-   `onFilterChange` (Function): `(newFilters: Object) => void`
-   `sort` (Object):
    *   `sortBy` (string)
    *   `sortOrder` ('asc' | 'desc')
    *   `onSortChange` (Function): `(sortBy: string, sortOrder: 'asc' | 'desc') => void`
-   `onAction` (Function): `(actionType: string, itemId: string | string[], ...args: any[]) => void` (for item-specific or bulk actions).
-   `selectedItems` (Array): Array of IDs of currently selected items.
-   `onSelectionChange` (Function): `(selectedItemIds: string[]) => void`

## Styling Considerations

-   **Responsiveness:** The module should adapt gracefully to different screen sizes (desktop, tablet, mobile).
-   **Consistency:** Adhere to the project's design system (e.g., Ant Design components, Styled Components theming) for a consistent look and feel.
-   **Accessibility:** Ensure keyboard navigation, proper ARIA attributes, and sufficient color contrast.

## Usage Example (Conceptual React Component)

```jsx
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd'; // Example Ant Design component
import UserService from '@services/UserService'; // Example service

const UserListingModule = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    status: 'active',
  });
  const [sort, setSort] = useState({
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getUsers({
        page: pagination.currentPage,
        limit: pagination.pageSize,
        ...filters,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
      });
      setUsers(response.data.users);
      setPagination((prev) => ({ ...prev, totalItems: response.data.total }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage, pagination.pageSize, filters, sort]);

  const handlePageChange = (page, pageSize) => {
    setPagination((prev) => ({ ...prev, currentPage: page, pageSize }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setSort({ sortBy, sortOrder });
  };

  return (
    <div>
      <h2>User Management</h2>
      <FilterBar onFilterChange={handleFilterChange} currentFilters={filters} />
      {loading ? (
        <Spin size="large" />
      ) : users.length > 0 ? (
        <DataTable
          data={users}
          onSortChange={handleSortChange}
          currentSort={sort}
          // ... other props for rendering table rows and actions
        />
      ) : (
        <EmptyState message="No users found." />
      )}
      <Pagination
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserListingModule;
```
