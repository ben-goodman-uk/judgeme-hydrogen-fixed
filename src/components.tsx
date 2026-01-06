import React, { useEffect } from "react";
import type {
  JudgemePreviewBadgeProps,
  JudgemeReviewWidgetProps,
} from "./types";

/**
 * Preview badge showing star rating for a product
 * Place this near the product title on product pages
 */
export function JudgemePreviewBadge({
  id,
  template = "product",
  productTitle,
  productHandle,
  productImageUrl,
}: JudgemePreviewBadgeProps): React.ReactElement {
  const shopifyId = id ? id.replace("gid://shopify/Product/", "") : "";
  return (
    <div
      className="jdgm-widget jdgm-preview-badge"
      data-id={shopifyId}
      data-template={template}
      data-auto-install="false"
      {...(productTitle && { "data-product-title": productTitle })}
      {...(productHandle && { "data-product-handle": productHandle })}
      {...(productImageUrl && { "data-product-url": productImageUrl })}
    />
  );
}

/**
 * Full review widget with reviews list and write review form
 * Place this at the bottom of product pages
 */
export function JudgemeReviewWidget({
  id,
  productTitle,
  productHandle,
  productImageUrl,
  productDescription,
}: JudgemeReviewWidgetProps): React.ReactElement {
  const shopifyId = id ? id.replace("gid://shopify/Product/", "") : "";

  // Set product data on the global jdgm object for Judge.me to find
  useEffect(() => {
    if (typeof window !== "undefined" && productTitle) {
      // Initialize jdgm if it doesn't exist
      if (!window.jdgm) {
        window.jdgm = {};
      }

      // Set product data that Judge.me needs for modals
      window.jdgm.productData = {
        id: shopifyId,
        title: productTitle,
        handle: productHandle || "",
        description: productDescription || "",
        image: productImageUrl || "",
      };

      // Also set on window for backwards compatibility
      (window as any).JDGM_PRODUCT = {
        id: shopifyId,
        title: productTitle,
        handle: productHandle || "",
        description: productDescription || "",
        url: productImageUrl || "",
      };
    }
  }, [
    shopifyId,
    productTitle,
    productHandle,
    productImageUrl,
    productDescription,
  ]);

  return (
    <div
      className="jdgm-widget jdgm-review-widget"
      data-id={shopifyId}
      {...(productTitle && { "data-product-title": productTitle })}
      {...(productHandle && { "data-product-handle": productHandle })}
      {...(productImageUrl && { "data-product-url": productImageUrl })}
      {...(productDescription && {
        "data-product-description": productDescription,
      })}
    />
  );
}

/**
 * Carousel showing recent reviews across all products
 */
export function JudgemeCarousel(): React.ReactElement {
  return <div className="jdgm-widget jdgm-carousel-widget" />;
}

/**
 * Tab showing all reviews (typically used in a tabbed layout)
 */
export function JudgemeReviewsTab(): React.ReactElement {
  return <div className="jdgm-widget jdgm-reviews-tab" />;
}

/**
 * Shows the overall rating across all products
 */
export function JudgemeAllReviewsRating(): React.ReactElement {
  return <div className="jdgm-widget jdgm-all-reviews-rating" />;
}

/**
 * Verified badge for social proof
 */
export function JudgemeVerifiedBadge(): React.ReactElement {
  return <div className="jdgm-widget jdgm-verified-badge" />;
}

/**
 * Shows the total review count across all products
 */
export function JudgemeAllReviewsCount(): React.ReactElement {
  return <div className="jdgm-widget jdgm-all-reviews-count" />;
}

/**
 * Displays Judge.me medals/badges earned by the store
 */
export function JudgemeMedals(): React.ReactElement {
  return <div className="jdgm-widget jdgm-medals-wrapper" />;
}
