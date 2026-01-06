# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-01-06

### Fixed
- Fixed widgets not displaying on first client-side navigation to product pages
- Added retry mechanism that waits for widget elements to appear in DOM before calling preloader
- Widget refresh now retries up to 5 times (200ms apart) if no `.jdgm-widget` elements are found

## [1.3.0] - 2026-01-06

### Fixed
- **BREAKING FIX**: Removed `installed.js` loading which was causing infinite refresh loops when deployed to Shopify Oxygen
- Widgets are now initialized by calling `jdgm_preloader()` directly instead of relying on `installed.js`

### Changed
- Script loading now uses a direct preloader call instead of the bootstrap script
- Improved console logging to indicate when `installed.js` is not being used

## [1.2.3] - 2026-01-06

### Fixed
- Added global script loading flag to prevent multiple instances from loading scripts
- Normalized pathname comparison to prevent loops from trailing slash redirects
- Removed `location.search` from dependencies to prevent loops from query param changes
- Added memoized refresh function to prevent unnecessary re-renders
- Added small delay before `installed.js` loading to ensure preloader is ready

## [1.2.2] - 2026-01-06

### Fixed
- Added `typeof window === 'undefined'` checks for SSR safety
- Set `isLoadedRef.current = true` before async operations to prevent race conditions
- Set credentials directly on `window.jdgm` instead of via inline script
- Reset `isLoadedRef` on error to allow retry

## [1.2.1] - 2026-01-06

### Fixed
- Always set `window.jdgm.SHOP_DOMAIN`, `window.jdgm.PLATFORM`, and `window.jdgm.PUBLIC_TOKEN` regardless of whether `window.jdgm` exists
- Fixed "Cannot load Judge.me widget contents due to missing jdgm key" error

## [1.2.0] - 2026-01-06

### Added
- `JudgemeReviewWidget` now sets `window.jdgm.productData` and `window.JDGM_PRODUCT` for modal compatibility
- Added `productTitle`, `productHandle`, `productImageUrl`, and `productDescription` props to components

### Fixed
- Fixed "Cannot read properties of null (reading 'title')" error in write review modal

## [1.1.0] - 2026-01-06

### Added
- Added `data-product-title`, `data-product-handle`, `data-product-url`, and `data-product-description` attributes to widget components
- TypeScript types for new component props

## [1.0.0] - 2026-01-06

### Added
- Initial release
- `useJudgeme` hook with proper dependency arrays (fixing the infinite render loop bug)
- All Judge.me widget components:
  - `JudgemePreviewBadge`
  - `JudgemeReviewWidget`
  - `JudgemeCarousel`
  - `JudgemeReviewsTab`
  - `JudgemeAllReviewsRating`
  - `JudgemeVerifiedBadge`
  - `JudgemeAllReviewsCount`
  - `JudgemeMedals`
- Full TypeScript support
- Proper cleanup of timeouts to prevent memory leaks

### Fixed
- Fixed infinite render loop caused by `useEffect` with no dependency array in original package
