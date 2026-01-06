declare global {
  interface Window {
    jdgm?: {
      SHOP_DOMAIN?: string;
      PLATFORM?: string;
      PUBLIC_TOKEN?: string;
      productData?: {
        id: string;
        title: string;
        handle: string;
        description?: string;
        image?: string;
      };
    };
    jdgm_preloader?: () => void;
    jdgmCacheServer?: {
      reloadAll: () => void;
    };
    jdgm_rerender?: ReturnType<typeof setTimeout>;
    JDGM_PRODUCT?: {
      id: string;
      title: string;
      handle: string;
      description?: string;
      url?: string;
    };
  }
}

export interface UseJudgemeConfig {
  /**
   * Your Shopify store domain (e.g., 'your-store.myshopify.com')
   */
  shopDomain: string;
  /**
   * Your Judge.me public token
   */
  publicToken: string;
  /**
   * Judge.me CDN host (usually 'https://cdn.judge.me')
   */
  cdnHost: string;
  /**
   * Delay in milliseconds before re-rendering widgets on route change
   * @default 500
   */
  delay?: number;
}

export interface JudgemePreviewBadgeProps {
  /**
   * Shopify product ID (numeric ID only, not the full GID)
   */
  id: string;
  /**
   * Template type
   * @default 'product'
   */
  template?: 'product' | 'collection';
  /**
   * Product title - needed for the review modal
   */
  productTitle?: string;
  /**
   * Product handle/slug
   */
  productHandle?: string;
  /**
   * Product image URL
   */
  productImageUrl?: string;
}

export interface JudgemeReviewWidgetProps {
  /**
   * Shopify product ID (numeric ID only, not the full GID)
   */
  id: string;
  /**
   * Product title - needed for the review modal
   */
  productTitle?: string;
  /**
   * Product handle/slug
   */
  productHandle?: string;
  /**
   * Product image URL
   */
  productImageUrl?: string;
  /**
   * Product description
   */
  productDescription?: string;
}

export interface JudgemeCarouselProps {
  // Carousel doesn't require props
}

export interface JudgemeReviewsTabProps {
  // ReviewsTab doesn't require props
}

export interface JudgemeAllReviewsRatingProps {
  // AllReviewsRating doesn't require props
}

export interface JudgemeVerifiedBadgeProps {
  // VerifiedBadge doesn't require props
}

export interface JudgemeAllReviewsCountProps {
  // AllReviewsCount doesn't require props
}

export interface JudgemeMedalsProps {
  // Medals doesn't require props
}
