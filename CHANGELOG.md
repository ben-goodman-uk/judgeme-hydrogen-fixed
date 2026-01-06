# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-01-06

### Changed

- Updated documentation and GitHub repository links

## [1.0.0] - 2026-01-06

### Added

- Initial release
- `useJudgeme` hook with proper dependency arrays (fixing the infinite render loop bug from the original package)
- All Judge.me widget components:
  - `JudgemePreviewBadge` - Star rating badge for product cards
  - `JudgemeReviewWidget` - Full review widget for product pages
  - `JudgemeCarousel` - Review carousel widget
  - `JudgemeReviewsTab` - Reviews tab widget
  - `JudgemeAllReviewsRating` - Overall rating display
  - `JudgemeVerifiedBadge` - Verified badge widget
  - `JudgemeAllReviewsCount` - Total reviews count
  - `JudgemeMedals` - Medals/badges widget
- Full TypeScript support
- Proper cleanup of timeouts to prevent memory leaks

### Fixed

- Fixed infinite render loop caused by `useEffect` with no dependency array in original `@judgeme/shopify-hydrogen` package
- Fixed infinite refresh loops caused by `installed.js` when deployed to Shopify Oxygen
- Widgets now initialize by calling `jdgm_preloader()` directly instead of relying on problematic bootstrap script
