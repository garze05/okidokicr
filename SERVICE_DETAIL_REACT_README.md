# Service Detail React Component

This document explains how to use the converted React components for the service detail page.

## Components Overview

### 1. `ServiceDetailComplete.jsx`

The main React component that replaces the original Astro page functionality.

### 2. `ServiceDetailTS.tsx`

TypeScript version with full type safety.

### 3. `useService.js`

Custom hook for fetching service data.

## Usage in Astro Project

### Option 1: Using with Astro (Recommended)

```astro
---
// src/pages/catalogo/[id]-react.astro
export const prerender = false;

import MainLayout from "@layouts/MainLayout.astro";
import ServiceDetailComplete from "@components/catalog/ServiceDetailComplete.jsx";

const { id } = Astro.params;
const initialImageIndex = parseInt(Astro.url.searchParams.get("image") || "0");
---

<MainLayout title="Catálogo - Servicio">
  <ServiceDetailComplete
    serviceId={id}
    initialImageIndex={initialImageIndex}
    client:load
  />
</MainLayout>
```

### Option 2: Pure React with Router

```jsx
// src/pages/react/ServicePage.jsx
import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ServiceDetailComplete from "../components/catalog/ServiceDetailComplete.jsx";

const ServicePage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialImageIndex = parseInt(searchParams.get("image") || "0");

  return (
    <ServiceDetailComplete
      serviceId={id}
      initialImageIndex={initialImageIndex}
    />
  );
};

export default ServicePage;
```

## Features

### ✅ Converted Features

- ✅ Dynamic service data fetching
- ✅ Image gallery with navigation
- ✅ Lightbox modal
- ✅ Keyboard navigation (Arrow keys, Escape)
- ✅ URL state management (image index)
- ✅ Responsive design
- ✅ Loading and error states
- ✅ Video embeds (YouTube, Vimeo, Cloudinary)
- ✅ Accessibility features
- ✅ Service information display
- ✅ Features list
- ✅ Download brochure functionality
- ✅ Contact form integration

### 🆕 Improvements

- ✅ Modular component structure
- ✅ Custom hooks for data fetching
- ✅ Better error handling
- ✅ TypeScript support (optional)
- ✅ Improved accessibility
- ✅ Better separation of concerns

## Component Structure

```
ServiceDetailComplete/
├── useService (hook)          # Data fetching logic
├── ImageGallery              # Gallery component
├── ServiceInfo               # Service details
├── RelatedVideos            # Video section
└── Lightbox                 # Modal component
```

## Props

### ServiceDetailComplete

| Prop                | Type     | Default  | Description              |
| ------------------- | -------- | -------- | ------------------------ |
| `serviceId`         | `string` | required | The service ID to fetch  |
| `initialImageIndex` | `number` | `0`      | Initial image to display |

## Styling

The component uses Tailwind CSS classes and includes custom CSS for:

- Gallery thumbnails scrolling
- Smooth transitions
- Lightbox animations
- Responsive behavior
- Accessibility features

### Custom CSS File

```css
/* src/styles/service-detail.css */
```

## API Integration

The component expects the API to return service data in this format:

```typescript
interface Service {
  id: string;
  title: string;
  description: string;
  available: boolean;
  features?: string[];
  brochureUrl?: string;
  videos?: Array<{
    url: string;
    title?: string;
  }>;
  gallery: Array<{
    url: string;
  }>;
}
```

## Environment Variables

Ensure you have the API URL configured:

```env
PUBLIC_API_URL=https://your-api-url.com
```

## Migration from Astro

1. **Replace the Astro page** with the React version
2. **Update routing** if needed
3. **Test all functionality** (navigation, lightbox, videos)
4. **Verify API integration** works correctly
5. **Check responsive behavior** on different devices

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers
- ✅ Keyboard navigation
- ✅ Screen readers
- ✅ High contrast mode
- ✅ Reduced motion preferences

## Performance Considerations

- Images are loaded on demand
- Videos use proper lazy loading
- Component splits into logical sub-components
- Uses React's built-in optimization (useMemo, useCallback)
- Minimal re-renders

## Accessibility Features

- ✅ ARIA labels for all interactive elements
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader support
- ✅ High contrast mode support
- ✅ Reduced motion respect

## Troubleshooting

### Common Issues

1. **Images not loading**: Check API response format
2. **Navigation not working**: Verify `client:load` directive in Astro
3. **Styles not applied**: Ensure CSS file is properly imported
4. **TypeScript errors**: Use the `.tsx` version for type safety

### Development Tips

1. Use React DevTools for debugging
2. Check browser console for API errors
3. Test keyboard navigation thoroughly
4. Verify mobile responsiveness
5. Test with screen readers if possible

## Future Enhancements

Possible improvements:

- Image lazy loading optimization
- Progressive web app features
- Better caching strategies
- Animation improvements
- Social sharing features
- Print optimization
