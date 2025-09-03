# MyEcom Frontend Project Structure Documentation

## Overview

This document provides a comprehensive overview of the frontend architecture for the MyEcom e-commerce platform. The frontend is built with Next.js (App Router), TypeScript, and Tailwind CSS, communicating with a Frappe backend via Axios.

## Tech Stack

- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **API Communication**: Axios 1.11.0
- **Animation**: Framer Motion 12.23.12
- **Image Carousel**: Swiper 11.2.10
- **Icons**: Custom SVG components + Lucide React

## Project Structure

```
frontend/
├── public/            # Static assets
│   └── images/        # Image assets
├── src/
│   ├── app/          # Next.js App Router pages
│   │   ├── layout.tsx           # Root layout with global components
│   │   ├── page.tsx             # Homepage
│   │   ├── globals.css          # Global CSS
│   │   └── products/            # Product pages
│   │       └── [slug]/          # Dynamic product detail page
│   │           ├── page.tsx           # Product page server component
│   │           ├── ProductContent.tsx # Main product display component
│   │           ├── ProductGallery.tsx # Product image gallery
│   │           ├── ImageModal.tsx     # Zoomable image modal
│   │           └── checkPin.tsx       # Delivery pincode checker
│   ├── lib/          # Reusable UI components and utilities
│   │   ├── icons.tsx           # SVG icon components
│   │   ├── logo.tsx            # Logo components
│   │   ├── checkPinData.tsx    # Pincode API utility
│   │   ├── navItems.tsx        # Navigation components
│   │   ├── searchBox.tsx       # Search component
│   │   ├── sidebar.tsx         # Mobile sidebar component
│   │   ├── starRating.tsx      # Star rating component
│   │   ├── styles.tsx          # Shared style utilities
│   │   └── topBanner.tsx       # Top announcement banner
│   ├── myapi/        # API integration and data interfaces
│   │   ├── bannerMessages.tsx  # Banner API
│   │   ├── categoryList.tsx    # Categories API
│   │   ├── heroDetails.tsx     # Hero section API
│   │   ├── menuList.tsx        # Menu API
│   │   ├── productData.tsx     # Product interfaces
│   │   ├── productList.tsx     # Product listing API
│   │   ├── productSingle.tsx   # Single product API
│   │   ├── settings.tsx        # Site settings API
│   │   ├── siteSettings.tsx    # Site configuration API
│   │   └── visitorsRecord.tsx  # Analytics tracking
│   ├── styles/       # Global styles
│   │   ├── main.css            # Main stylesheet
│   │   └── style.css           # Additional styles
│   └── utils/        # Page-specific components
│       ├── category.tsx        # Category display component
│       ├── featureGrid.tsx     # Featured products grid
│       ├── headTop.tsx         # Header component
│       ├── hero.tsx            # Hero slider component
│       └── productGrid.tsx     # Product grid component
└── package.json      # Dependencies and scripts
```

## Key Components

### Page Structure

- **Root Layout (`layout.tsx`)**: Sets up fonts, global components, and wraps all pages
- **Homepage (`page.tsx`)**: Assembles hero section, categories, and product grids
- **Product Detail Page**: Dynamic route with multiple components for different sections

### Component Organization

1. **`/src/lib`**: Contains reusable UI components that can be used across multiple pages
   - `icons.tsx`: Centralized SVG icon components for consistent UI
   - `checkPinData.tsx`: API utility for checking delivery availability
   - Other UI components like search, sidebar, etc.

2. **`/src/myapi`**: API integration layer
   - Defines TypeScript interfaces for data structures
   - Contains functions to fetch data from the Frappe backend
   - Handles error cases and data transformation

3. **`/src/utils`**: Page-specific larger components
   - Components that are specific to certain pages
   - More complex than lib components, often composing multiple smaller components

## Product Detail Page Architecture

The product detail page is composed of several components working together:

1. **`page.tsx`**: Server component that:
   - Fetches product data and site settings
   - Passes data to client components
   - Handles 404 cases

2. **`ProductContent.tsx`**: Main client component that:
   - Manages product state (quantity, modal)
   - Renders breadcrumbs, product info, pricing
   - Orchestrates other components

3. **`ProductGallery.tsx`**: Handles product images with:
   - Mobile view using Swiper
   - Desktop view with thumbnails
   - "Add to cart" and "Buy Now" buttons for desktop

4. **`ImageModal.tsx`**: Zoomable image modal with:
   - Full-screen product image viewing
   - Image zoom functionality
   - Thumbnail navigation

5. **`checkPin.tsx`**: Delivery availability checker that:
   - Allows users to enter pincode
   - Fetches delivery information
   - Displays delivery date and availability

## API Integration

The application communicates with a Frappe backend using Axios:

- API endpoints are defined in the `/src/myapi` directory
- Environment variables (`DOMAIN`, `NEXT_PUBLIC_DOMAIN`) are used for API URLs
- TypeScript interfaces ensure type safety for API responses
- Error handling is implemented for network issues and API errors

### Example: Pincode API

```typescript
// in /src/lib/checkPinData.tsx
export async function checkPinData(pincode: string | number): Promise<PincodeData> {
  // Validation and API call logic
  const { data } = await axios.post<DeliveryResponse>(
    API_URL,
    { pincode: pin },
    { headers: { 'Content-Type': 'application/json' } }
  );
  // Transform and return data
}
```

## UI Components

### Icons System

The application uses a centralized icon system in `icons.tsx` with SVG components:

```typescript
export const CartIcon = ({ className = "", ...props }) => (
  <svg
    className={className}
    height="24"
    width="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
```

### Animation

The application uses Framer Motion for animations:

```typescript
// in ProductContent.tsx
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

<motion.div 
  initial="hidden"
  animate="visible"
  variants={fadeIn}
  className="main-container max-w-6xl mx-auto p-4">
  {/* Content */}
</motion.div>
```

## State Management

The application uses React's built-in state management:

- `useState` for component-level state
- Server components for data fetching
- Props for passing data between components

## Styling

The application uses Tailwind CSS for styling with:

- Responsive design (mobile-first approach)
- Custom color variables from site settings
- Consistent spacing and typography

## Development Workflow

- **Development**: `npm run dev` (with Turbopack for faster builds)
- **Production Build**: `npm run build`
- **Production Start**: `npm run start`
- **Linting**: `npm run lint`

## Best Practices

1. **Component Organization**:
   - Small, reusable components in `/src/lib`
   - Page-specific components in `/src/utils`
   - Page components in `/src/app`

2. **API Integration**:
   - Centralized API functions in `/src/myapi`
   - TypeScript interfaces for type safety
   - Proper error handling

3. **Responsive Design**:
   - Mobile-first approach with Tailwind breakpoints
   - Different components/layouts for mobile and desktop

4. **Performance**:
   - Server components for data fetching
   - Client components for interactivity
   - Image optimization with Next.js Image component

5. **Maintainability**:
   - Consistent naming conventions
   - Centralized icons and styles
   - TypeScript for type safety