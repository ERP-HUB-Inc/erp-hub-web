# Project Design System Guidelines for AI Code Assistant

## Purpose
This document outlines the key aspects of the project's design system, derived from the CSS and Less files in `src/themes/`. Its purpose is to guide an AI Code Assistant in maintaining visual consistency, adhering to established styling conventions, and effectively implementing new UI elements or modifying existing ones to match the project's aesthetic.

## Core Principles
-   **Ant Design Integration:** The project heavily utilizes Ant Design components, with significant customization to align with brand identity.
-   **Custom Branding:** Specific colors, typography, and component behaviors are defined through CSS overrides and custom classes.
-   **Responsiveness:** The UI is designed to adapt across various screen sizes, with explicit media queries for mobile, tablet, and desktop.
-   **Modularity:** Styles are organized into distinct files for clarity and maintainability.

## Color Palette

The primary color definitions are found in `src/themes/global.css` and `src/themes/theme.less`. Note that `global.css` overrides some Ant Design defaults set in `theme.less`.

-   **Primary Color:** `--primary-color: #14b8a6;` (Teal) - Used for active states, primary buttons, links, and highlights.
-   **Secondary Colors:**
    -   `--secondary-light-teal: #7dd3fc;`
    -   `--secondary-cyan: #06b6d4;`
-   **Text Colors:**
    -   `#4D4F5C` (from `element.css` for general text, input text)
    -   `#9A9A9A` (from `element.css` for muted text, placeholder, labels)
    -   `@text-color: fade(@black, 65%);` (Ant Design default text color in `theme.less`)
    -   `@text-color-secondary: fade(@black, 45%);` (Ant Design secondary text color in `theme.less`)
-   **Background Colors:**
    -   `#F7F7F7` (body background in `style.css`)
    -   `@body-background: #fff;` (Ant Design default in `theme.less`, likely overridden by `style.css`)
    -   `@component-background: #fff;` (Ant Design default for components)
    -   `@background-color-light: hsv(0, 0, 98%);` (Ant Design light background)
    -   `@background-color-base: hsv(0, 0, 96%);` (Ant Design grey background)
-   **Border Color:** `#ECECEC` (from `element.css` for inputs, `ca-box`), `@border-color-base: hsv(0, 0, 85%);` (Ant Design default in `theme.less`).

## Typography

The project uses a mix of system and custom fonts.

-   **Default Font (Ant Design components):** `'Segoe UI', sans-serif;` (from `style.css`)
-   **Custom Fonts (defined in `font.css`):**
    -   `ca` (for custom icons)
    -   `khfont` (Kantumruy-Regular.ttf, Nokora-Regular.ttf - commented out)
    -   `KhmerOS_Muol` (KhmerOS_muol.ttf)
    -   `KhmerOS_content` (KhmerOS_content.ttf)
    -   `enfont` (OpenSans-Regular.ttf, OpenSans-Medium.ttf, OpenSans-Bold.ttf)
    -   `Khmer OS Muol Light`
-   **Font Sizes:**
    -   `font-size-base: 14px;` (Ant Design default in `theme.less`)
    -   `font-size-lg: @font-size-base + 2px;` (Ant Design large font size)
    -   `font-size-sm: 12px;` (Ant Design small font size)
    -   Specific overrides in `element.css` and `responsive.css` (e.g., `17px` for `.main-input input`, `8pt !important` for mobile).
-   **Font Weights:** Normal, 500, Bold (from `font.css` and Ant Design defaults).

## Spacing
While not explicitly defined as a system, padding and margins are used consistently. Refer to existing components for typical spacing values (e.g., `padding-lg: 24px;`, `padding-md: 16px;` in `theme.less`).

## Component Styling (Ant Design Overrides)

Many Ant Design components have been customized. When implementing or modifying, prioritize using existing custom classes or adhering to the patterns seen in `global.css` and `element.css`.

-   **General:**
    -   **Border Radius:** `0` for `.ant-btn`, `.ant-input`, `.ant-input-number`, `.ant-select-selection` (from `global.css`), overriding Ant Design's default `4px`.
    -   **Hover/Focus States:** Generally use `--primary-color` or `--secondary-cyan` for borders and backgrounds.
-   **Inputs (`.ant-input`, `.main-input`):**
    -   Height: `30px !important` for `.main-input input` and `.main-antselect .ant-select-selection--single` (from `element.css`).
    -   Border: `1.5px solid #ECECEC;` with `border-radius: 3px;` for `.ca-input-v1` (from `style.css`).
    -   Placeholder: `#9A9A9A`, `font-size: 12pt !important` (from `element.css`).
-   **Buttons (`.ant-btn`):**
    -   Primary buttons (`.ant-btn-primary`): `background-color: var(--primary-color); border-color: var(--primary-color);`. Hover/focus uses `--secondary-cyan`.
    -   Default buttons (`.ant-btn-default`): `border-color: var(--primary-color); color: var(--primary-color);`. Hover/focus uses `--secondary-cyan`.
-   **Selects (`.ant-select`, `.main-antselect`):**
    -   Height: `30px !important` for `.main-antselect .ant-select-selection--single` (from `element.css`).
    -   Hover: `border-color: var(--primary-color);` (from `global.css`).
-   **Tables (`.ant-table`):**
    -   Odd/Even row backgrounds (`#ffffff`, `#f9f9f9`).
    -   Row hover background: `#e6f7ff !important` (from `style.css`).
-   **Tabs (`.ant-tabs`):**
    -   Ink bar color: `--primary-color`.
    -   Active/hover text color: `--primary-color`.
-   **Modals (`.ant-modal`):**
    -   `border-radius: 3px;`
    -   `box-shadow: 0 0 4px 0 rgba(0,0,0,0.5);` (from `style.css`).

## Custom Components/Patterns

-   **`.main-input`:** Custom input styling with absolute positioned labels and placeholders.
-   **`.mix-none-border`:** Applies `border: none; border-radius: 0px;` and a specific box shadow.
-   **`.ca-box`:** General purpose box with hover/active states using `--primary-color` and a box shadow.
-   **`.ca-penel-v1`:** Panel styling with a box shadow.
-   **`.main-radio-acc`:** Custom radio button group styling.
-   **`.main-searchs`:** Custom search input styling with icons.
-   **`.ca-link`:** Custom link style using `#008AE8`.

## Iconography
The project uses a custom icon font named `ca` (defined in `font.css`). Icons are applied via classes like `icon-add`, `icon-delete`, etc., using the `[class^="icon-"], [class*=" icon-"]` selector.

## Responsiveness
The `responsive.css` file contains media queries that adjust the layout and styles for different devices:
-   **Desktops, Laptops, Tablets (landscape):** `min-width: 768px`
-   **iPad Pro:** Specific rules for `min-device-width: 1024px` and `max-device-width: 1366px`.
-   **All iPad devices (portrait and landscape):** `max-device-width: 1024px` (with some commented out ranges).
-   **Smartphones (landscape):** `min-width: 481px` and `max-width: 767px`.
-   **Smartphones (portrait):** `min-width: 320px` and `max-width: 480px`.

When developing responsive layouts, ensure new components or modifications respect these existing media query patterns.

## How to Apply (for AI Code Assistant)

1.  **Prioritize Existing Styles:** Before introducing new CSS, check if existing classes (e.g., `.ca-box`, `.main-input`) or Ant Design component props can achieve the desired look.
2.  **Ant Design Customization:** For Ant Design components, prefer using Ant Design's theming capabilities (if applicable via `theme.less`) or overriding styles in `global.css` or `element.css` using the established class names (e.g., `.ant-btn-primary`).
3.  **Color Usage:** Utilize the CSS variables (`--primary-color`, `--secondary-cyan`, etc.) defined in `global.css` for consistent color application.
4.  **Typography:** Adhere to the defined font families and sizes. For custom text, consider using `font-family: 'Segoe UI', sans-serif;` as a base.
5.  **Responsiveness:** Always consider how changes will render on different screen sizes. Add or modify media queries in `responsive.css` if necessary, following existing patterns.
6.  **New CSS:** If new custom CSS is required, add it to the most semantically appropriate CSS file within `src/themes/` (e.g., `element.css` for general elements, `style.css` for global/layout, `responsive.css` for media queries). Avoid inline styles for complex styling.
7.  **Review:** After making styling changes, ensure they integrate seamlessly with the existing design system and do not introduce regressions.
