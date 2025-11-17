# Application Architecture

This document provides an overview of the technical architecture of the Shahar's Carpentry Quote Generator application.

## Frontend Framework & Libraries

*   **Framework**: **React 19** is used for building the user interface.
*   **Language**: **TypeScript** provides static typing for improved code quality and maintainability.
*   **Styling**: **Tailwind CSS** (loaded via CDN) is used for all styling, enabling rapid development of a modern, responsive UI.
*   **State Management**: The application uses React's built-in hooks (`useState`, `useCallback`, `useMemo`) for managing component and application state. Given the app's scope, a more complex state management library like Redux is not necessary.

## Project Structure

The project is organized into a clear and logical folder structure:

```
/
├── components/          # Reusable React components
│   ├── icons/           # SVG icon components
│   └── ...              # Form, display, and UI components
├── data/                # Static data like logo information
├── docs/                # Project documentation (you are here)
├── utils/               # Utility functions, e.g., pdfGenerator.ts
├── App.tsx              # Main application component, manages state and steps
├── constants.ts         # Global constants (rates, VAT, etc.)
├── index.html           # The single HTML entry point for the application
├── index.tsx            # Mounts the React app to the DOM
└── types.ts             # TypeScript type definitions and enums
```

### Key Components

*   **`App.tsx`**: The root component that controls the application's flow. It manages the current step (`AppStep`) and holds the state for `clientDetails`, `quoteInput`, and `calculationResult`.
*   **`components/`**: All UI elements are broken down into functional components. This includes forms (`ClientDetailsForm`, `UserInputForm`), display elements (`InternalBreakdown`, `ClientQuote`), and the Gemini AI chat interface.
*   **`utils/pdfGenerator.ts`**: This module contains all logic for generating the PDF quote using the `jspdf` library. It takes the final quote data and constructs a document based on a fixed English-language template.

## Key Libraries & Services

*   **`react` & `react-dom`**: The core for building the user interface.
*   **`jspdf`**: Used for client-side PDF document generation.
*   **`@google/genai`**: The official Google client library for interacting with the Gemini API to power the AI assistant feature.
