# judgeme-hydrogen-fixed

A fixed version of `@judgeme/shopify-hydrogen` for Shopify Hydrogen/Oxygen that eliminates infinite refresh loops and improper React hook usage.

## Why This Package?

The official `@judgeme/shopify-hydrogen` package has critical bugs that make it unusable in production:

1. **Infinite render loop** - `useEffect` with no dependency array runs on every render
2. **Refresh loop on Oxygen** - `installed.js` causes page refreshes in production deployments

This package fixes both issues while maintaining full compatibility with Judge.me widgets.

## Installation

```bash
npm install judgeme-hydrogen-fixed
```

## Usage

### 1. Add the Hook to Your Root Component

Add `useJudgeme` to your root layout or App component:

```tsx
// app/root.tsx
import { useJudgeme } from 'judgeme-hydrogen-fixed';

export default function App() {
  useJudgeme({
    shopDomain: 'your-store.myshopify.com',
    publicToken: 'your-judge-me-public-token',
    cdnHost: 'https://cdn.judge.me',
    delay: 500, // optional, defaults to 500ms
  });

  return (
    <html>
      {/* ... */}
    </html>
  );
}
```

### 2. Add Widget Components

#### Preview Badge (Star Rating)

Display star ratings on product cards or near product titles:

```tsx
import { JudgemePreviewBadge } from 'judgeme-hydrogen-fixed';

function ProductCard({ product }) {
  return (
    <div>
      <h2>{product.title}</h2>
      <JudgemePreviewBadge
        id={product.id}
        productTitle={product.title}
        productHandle={product.handle}
      />
    </div>
  );
}
```

#### Review Widget (Full Reviews Section)

Display the complete reviews section on product pages:

```tsx
import { JudgemeReviewWidget } from 'judgeme-hydrogen-fixed';

function ProductPage({ product }) {
  return (
    <div>
      {/* Product content */}
      
      <JudgemeReviewWidget
        id={product.id}
        productTitle={product.title}
        productHandle={product.handle}
        productImageUrl={product.featuredImage?.url}
        productDescription={product.description}
      />
    </div>
  );
}
```

### Available Components

| Component | Description |
|-----------|-------------|
| `JudgemePreviewBadge` | Star rating badge for product cards |
| `JudgemeReviewWidget` | Full review widget with reviews list and write review form |
| `JudgemeCarousel` | Review carousel widget |
| `JudgemeReviewsTab` | Reviews tab widget |
| `JudgemeAllReviewsRating` | Overall rating display across all products |
| `JudgemeVerifiedBadge` | Verified badge for social proof |
| `JudgemeAllReviewsCount` | Total reviews count across all products |
| `JudgemeMedals` | Store medals/badges widget |

## How It Works

### The Problem with installed.js

The official Judge.me package loads `installed.js` which performs automatic initialization. On Shopify Oxygen (and other edge deployments), this script causes infinite page refresh loops.

### Our Solution

1. **No installed.js** - We don't load the problematic bootstrap script
2. **Direct preloader call** - Widgets are initialized by calling `jdgm_preloader()` directly
3. **Smart retry mechanism** - Waits for widget elements to appear in DOM before initializing
4. **Proper React hooks** - Correct dependency arrays prevent infinite render loops
5. **Route change handling** - Widgets re-initialize on client-side navigation

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `shopDomain` | `string` | Yes | - | Your Shopify store domain |
| `publicToken` | `string` | Yes | - | Your Judge.me public token |
| `cdnHost` | `string` | Yes | - | Judge.me CDN host (usually `https://cdn.judge.me`) |
| `delay` | `number` | No | `500` | Delay (ms) before re-rendering widgets on route change |

## TypeScript Support

Full TypeScript support is included. All components and the hook are fully typed.

```tsx
import type {
  UseJudgemeConfig,
  JudgemePreviewBadgeProps,
  JudgemeReviewWidgetProps,
} from 'judgeme-hydrogen-fixed';
```

## Finding Your Judge.me Credentials

1. Log in to your [Judge.me dashboard](https://judge.me/dashboard)
2. Go to **Settings** > **Technical**
3. Find your **Public Token** and **Shop Domain**
4. The CDN host is typically `https://cdn.judge.me`

## License

MIT © Ben Goodman

## Links

- [GitHub Repository](https://github.com/ben-goodman-uk/judgeme-hydrogen-fixed)
- [Report Issues](https://github.com/ben-goodman-uk/judgeme-hydrogen-fixed/issues)
- [npm Package](https://www.npmjs.com/package/judgeme-hydrogen-fixed)
