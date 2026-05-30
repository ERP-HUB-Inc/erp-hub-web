# Project Overview for Code Assistant

## Project Name
ERP-Hub Inc / storeVein / pos

## Purpose
This project is a React-based web application serving as a Point of Sale (POS) system, likely integrated within a larger ERP (Enterprise Resource Planning) ecosystem. Its primary goal is to manage retail sales, inventory, purchasing, and financial operations, with indications of advanced features like AI-powered tools.

## Key Technologies
-   **Frontend Framework:** React.js
-   **Language:** JavaScript (with JSX)
-   **State Management:** Redux
-   **Styling:** Styled Components, Ant Design (inferred from `element.css` and common component names)
-   **Bundler:** Webpack
-   **Package Manager:** Yarn (based on `yarn.lock`)
-   **Code Quality:** ESLint, Prettier
-   **Version Control:** Git
-   **CI/CD:** GitLab CI

## Project Requirements
-   **React.js Version:** ^16.14.0
-   **Ant Design Version:** ^3.26.16
-   **Styled Components Version:** ^6.1.13
-   **Node.js Version:** Not explicitly specified; recommend Node.js LTS (e.g., 18.x or 20.x)
-   **Package Manager:** Yarn (preferred, based on `yarn.lock`)
-   **Webpack Version:** ^5.97.1
-   **Testing Framework:** Jest (^29.7.0)
-   **Browser Support:**
    -   **Production:** `>0.2%`, `not dead`, `not op_mini all`
    -   **Development:** `last 1 chrome version`, `last 1 firefox version`, `last 1 safari version`
-   **Code Quality Tools:** ESLint (v8.57.1) and Prettier (configuration files `.eslintrc.js`, `.prettierrc` are present).

## Project Structure

-   `public/`: Static assets, `index.html`.
-   `src/`: Core application source code.
    -   `src/app/`: Application-specific modules (e.g., `localization`, `modules`, `reducers`, `store`).
    -   `src/components/`: Reusable UI components (e.g., `Button`, `Table`, `InputText`).
    -   `src/context/`: React Context API implementations.
    -   `src/enums/`: Enumerations for various business domains (HR, HTTP status, inventory, sales).
    -   `src/helper/`: Utility and helper functions.
    -   `src/layout/`: Application layout components (e.g., `main-app`, `login`, `payment-screen`).
    -   `src/model/`: Data models or schemas.
    -   `src/pages/`: Top-level page components (e.g., `Dashboard`, `Finance`, `Inventory`, `Sales`).
    -   `src/redux/`: Redux store configuration, reducers, actions.
    -   `src/router/`: Application routing configuration.
    -   `src/services/`: API interaction services (e.g., `RetailSaleService`, `ItemService`).
    -   `src/themes/`: Styling themes and global styles.
-   `config/`: Webpack, Jest, and environment configurations.
-   `mock-server/`: Local mock API for development.
-   `scripts/`: Build, start, and test scripts.
-   `wiki/`: Project documentation (like this file).

## Frontend Architecture

-   **Component-Based:** The UI is composed of modular and reusable React components.
-   **State Management:** Redux is used for centralized state management across the application.
-   **Styling:** A combination of `styled-components` for component-level styling and potentially Ant Design for a UI component library.
-   **Routing:** Client-side routing is handled within `src/router`.

## Backend Interaction
The `src/services` directory contains JavaScript modules responsible for making API calls to the backend. Each service typically corresponds to a specific domain (e.g., `ItemService` for item-related operations).

## Development Workflow

-   **Build:** `npm run build` (or `yarn build`) using Webpack.
-   **Start:** `npm start` (or `yarn start`) for local development server.
-   **Testing:** Jest (inferred from `config/jest`).
-   **Mock Server:** The `mock-server` can be used to simulate API responses during development.

## Conventions and Best Practices

-   **Code Style:** Enforced by ESLint and Prettier (configuration files `.eslintrc.js`, `.prettierrc` are present).
-   **Naming:**
    -   JavaScript variables and functions: `camelCase`.
    -   React components: `PascalCase`.
    -   Files: `kebab-case` or `camelCase` depending on context (e.g., `category-list.jsx`, `RetailSaleService.js`).
-   **File Organization:** Components, services, pages, etc., are logically grouped into their respective directories.

## Key Modules/Features

-   **Sales:** Retail sales, transactions, POS monitoring.
-   **Inventory:** Item management, stock adjustments, movement logs.
-   **Purchasing:** Purchase orders, vendor management.
-   **Finance:** Dashboards, exchange rates.
-   **Reporting:** Sales and inventory reports.
-   **AI Tools:** Indicated by `item-ai-tool.jsx`, `item-management-ai.jsx`, and documentation in the `wiki`.

## How to Interact (for a Code Assistant)

-   **Locating Files:** Use `glob` and `search_file_content` to find relevant files based on component names, service names, or keywords.
-   **Understanding Context:** Always read surrounding code, imports, and related files (e.g., services for data fetching, Redux reducers for state updates) to understand the full context of a change.
-   **Proposing Changes:** Adhere to existing code style, naming conventions, and architectural patterns. Mimic the style of the surrounding code.
-   **Verification:** After making changes, suggest running relevant build commands (`npm run build`), linting (`npm run lint` or `eslint`), and tests (`npm test` or `jest`) to ensure correctness and adherence to standards.
-   **Documentation:** Refer to the `wiki` directory for high-level design documents and feature descriptions.
