# Frontend Refactoring and Restructuring Plan

## 1. Objective

This document outlines a plan to refactor the `frontend/src` directory. The goal is to establish a professional, scalable, and maintainable architecture using a **feature-based** folder structure. This is a best practice for large applications like an e-commerce platform.

## 2. Current Architecture: Problems

The current structure groups files by their technical type (e.g., `myapi`, `components`, `actions`, `lib`). This leads to several issues:
- **Scattered Logic:** Code for a single feature (e.g., "Wishlist") is spread across many folders.
- **Poor Scalability:** Adding new features clutters the global folders, making them hard to navigate.
- **Unclear Ownership:** It's difficult to see which parts of the code belong to which feature.
- **High Coupling:** Generic folders encourage creating dependencies that make features hard to isolate or modify.

## 3. Proposed Architecture: Feature-Based Structure

I propose restructuring the code around business domains or "features".

```
src/
├── app/              # Next.js App Router (Pages and Layouts)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── favicon.ico
│   ├── providers.tsx
│   ├── auth/
│   ├── cart/
│   ├── dashboard/
│   ├── products/
│   └── wishlist/
│
├── components/       # SHARED: Truly generic, reusable UI components (Button, Input, etc.)
│   └── ui/
│
├── features/         # NEW: All business logic lives here, grouped by feature.
│   ├── auth/         # Feature: Authentication
│   │   ├── api/      # API calls (e.g., login, logout, getCurrentUser)
│   │   ├── components/ # React components (e.g., LoginForm, AuthButton)
│   │   └── lib.ts    # Business logic and hooks
│   │
│   ├── products/     # Feature: Products
│   │   ├── api/      # API calls (e.g., getProductList, getProductBySlug)
│   │   ├── components/ # React components (e.g., ProductCard, ProductGrid, Price)
│   │   └── types.ts  # TypeScript types for products
│   │
│   ├── cart/         # Feature: Shopping Cart
│   │   ├── api/
│   │   ├── components/
│   │   ├── lib.ts    # Business logic, hooks, and state management
│   │   └── types.ts
│   │
│   ├── wishlist/     # Feature: Wishlist
│   │   ├── api/
│   │   ├── components/
│   │   └── lib.ts
│   │
│   └── settings/     # Feature: Site-wide settings
│       ├── api/      # API calls for all site settings
│       └── lib.ts    # Hooks and logic to access settings
│
├── lib/              # Core, app-wide libraries (e.g., API clients, utils)
│   ├── client-api.ts # Client-side axios instance
│   ├── server-api.ts # Server-side axios instance
│   └── ...
│
├── styles/           # Global styles and theme configuration
└── utils/            # Truly generic, app-wide utility functions
```

## 4. Migration Steps

1.  **Create New Folders:** I will create the new `features` directory and the sub-directories for each feature (`auth`, `products`, `cart`, etc.).
2.  **Move and Refactor:** I will systematically move files from the old folders (`myapi`, `actions`, `lib`) into their new feature-based homes.
    -   For example, `myapi/productList.tsx` and `myapi/productSingle.tsx` will move to `features/products/api/`.
    -   `actions/auth.actions.ts` and `lib/auth.ts` will be consolidated under `features/auth/`.
3.  **Update Imports:** I will update all `import` statements across the application to point to the new file locations.
4.  **Cleanup:** Once the migration is complete and verified, I will remove the old, now-empty directories like `myapi` and `actions`.

## 5. Progress

- [x] Site Settings
- [x] Products
- [x] Wishlist
- [x] Cart
- [x] Auth

All features migrated and refactoring complete.

## 6. Benefits

-   **Improved Scalability:** Adding a new feature (e.g., "Reviews") is as simple as adding a new folder under `features` without touching anything else.
-   **Easier Navigation:** All code related to a specific feature is co-located.
-   **Clear Separation of Concerns:** The distinction between shared code, feature-specific code, and page routing becomes explicit.
-   **Enhanced Maintainability:** Changes to one feature are less likely to break another.