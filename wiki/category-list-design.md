# CategoryList Component Design

## Purpose
The `CategoryList` component is responsible for displaying a horizontally scrollable list of product categories. It fetches category data, handles pagination (both local and server-side), and allows users to select an active category. It also includes an "All Menus" tab that displays the total number of products.

## Location
`src/app/modules/pos/components/transactions/RetailSale/category-list.jsx`

## Props

-   `totalProducts` (number): The total count of all products, displayed on the "All Menus" tab. Defaults to `0`.
-   `activeId` (string): The ID of the currently active (selected) category.
-   `onChange` (Function): A callback function triggered when a category tab is clicked. It receives the selected category's ID as an argument.

## State

-   `categories` (Array): An array of normalized category objects, including the "All Menus" tab.
-   `loading` (boolean): Indicates if the initial category data is being loaded.
-   `loadingMore` (boolean): Indicates if more categories are being loaded due to scrolling.

## Constants

-   `TEAL`: Primary color for active states (`#0b9e7f`).
-   `LIMIT`: Number of categories to fetch per page (`8`).
-   `CAT_COLORS`: An array of predefined colors used for category icons.

## Helper Functions

-   `getCatColor(id)`: Deterministically returns a color from `CAT_COLORS` based on the category ID.
-   `getCatInitials(name)`: Generates two-letter initials from a category name (e.g., "All Menus" -> "AM", "Phones" -> "PH").
-   `normalizeCategory(cat)`: Transforms raw API category data into a consistent internal format.

## Styled Components

The component uses `styled-components` for its styling:

-   `Wrapper`: Main container for the category tabs, enabling horizontal scrolling.
-   `Tab`: Individual category button, styled based on its active state.
-   `TabIcon`: Circular icon area for category initials or images.
-   `TabText`: Container for category name and item count.
-   `TabName`: Displays the category name.
-   `TabCount`: Displays the number of items in the category.
-   `LoadMore`: Spinner displayed when loading more categories.

## Core Logic

1.  **Initial Data Fetching:**
    -   `useEffect` hook triggers `fetchCategories(0, true)` on component mount to load the first page of categories.
    -   `ALL_TAB` is memoized and prepended to the fetched categories.

2.  **"All Menus" Tab:**
    -   A special "All Menus" tab is always present at the beginning of the list.
    -   Its `itemCount` is kept in sync with the `totalProducts` prop.

3.  **Scroll-based Pagination:**
    -   `handleScroll` function (memoized with `useCallback`) detects when the user scrolls near the end of the `Wrapper`.
    -   It uses `offsetRef`, `hasMoreRef`, and `loadingRef` to manage the pagination state and prevent duplicate fetches.
    -   An `useEffect` hook attaches and detaches the `handleScroll` event listener to the `Wrapper` element.
    -   When `nearEnd` is true and `hasMoreRef.current` is true, `fetchCategories` is called with the next `offset`.

4.  **Loading States:**
    -   During initial loading (`loading` is true), a skeleton UI is rendered.
    -   When loading more categories (`loadingMore` is true), a `Spin` component is displayed at the end of the list.

## Usage Example

```jsx
<CategoryList
  totalProducts={150}
  activeId={selectedCategoryId}
  onChange={handleCategoryChange}
/>
```
