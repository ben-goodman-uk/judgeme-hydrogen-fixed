import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from '@remix-run/react';
import type { UseJudgemeConfig } from './types';

// Global flag to prevent multiple instances from loading scripts
let globalScriptsLoaded = false;

/**
 * Fixed version of useJudgeme for Shopify Hydrogen/Oxygen.
 * 
 * ## Problems with the official @judgeme/shopify-hydrogen package:
 * 
 * 1. **Infinite render loop**: useEffect with no dependency array runs on every render
 * 2. **Refresh loop on Oxygen**: installed.js causes page refreshes in production
 * 
 * ## How this version fixes it:
 * 
 * 1. **No installed.js** - Does not load installed.js which causes refresh loops on Oxygen
 * 2. **Direct preloader call** - Calls jdgm_preloader() directly to initialize widgets
 * 3. **Proper dependencies** - Re-renders widgets only on actual route changes
 * 4. **Global deduplication** - Prevents double-loading across component remounts
 * 5. **Proper cleanup** - Cleans up timeouts to prevent memory leaks
 * 
 * @example
 * ```tsx
 * // In your root.tsx or App component
 * import { useJudgeme } from 'judgeme-hydrogen-fixed';
 * 
 * function App() {
 *   useJudgeme({
 *     shopDomain: 'your-store.myshopify.com',
 *     publicToken: 'your-public-token',
 *     cdnHost: 'https://cdn.judge.me',
 *     delay: 500, // optional, defaults to 500ms
 *   });
 * 
 *   return <Outlet />;
 * }
 * ```
 * 
 * @param config - Configuration options
 * @param config.shopDomain - Your Shopify store domain (e.g., 'your-store.myshopify.com')
 * @param config.publicToken - Your Judge.me public token
 * @param config.cdnHost - Judge.me CDN host (usually 'https://cdn.judge.me')
 * @param config.delay - Delay before re-rendering widgets on route change (default: 500ms)
 */
export function useJudgeme({
  shopDomain,
  publicToken,
  cdnHost,
  delay = 500,
}: UseJudgemeConfig): void {
  const location = useLocation();
  const lastPathnameRef = useRef<string>('');
  const rerenderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitializedRef = useRef(false);

  // Memoize the refresh function to prevent recreation
  // This function will retry until widget elements are found in the DOM, then initialize them
  const refreshWidgets = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const attemptRefresh = (retriesLeft: number) => {
      // Check if there are any Judge.me widget elements in the DOM
      const widgets = document.querySelectorAll('.jdgm-widget');
      
      // If no widgets found and retries left, keep waiting
      if (widgets.length === 0 && retriesLeft > 0) {
        setTimeout(() => attemptRefresh(retriesLeft - 1), 200);
        return;
      }
      
      // If widgets found OR retries exhausted, call the preloader
      // (Call it anyway in case widgets appear later)
      try {
        if (typeof window.jdgm_preloader === 'function' && !window.jdgmCacheServer) {
          window.jdgm_preloader();
        } else if (window.jdgmCacheServer) {
          window.jdgmCacheServer.reloadAll();
        }
      } catch (e) {
        console.warn('Judge.me: Error refreshing widgets', e);
      }
    };
    
    // Start with 10 retries (total ~2 seconds of waiting for widgets to appear)
    attemptRefresh(10);
  }, []);

  // Load Judge.me scripts only once - globally across all component instances
  useEffect(() => {
    // Skip on server-side
    if (typeof window === 'undefined') return;
    
    // Check both local and global flags
    if (globalScriptsLoaded || isInitializedRef.current) return;
    
    if (!shopDomain || !publicToken || !cdnHost) {
      console.warn(
        'Judge.me: Missing config values for store domain, store public token, or cdn host'
      );
      return;
    }

    // Mark as loaded immediately to prevent double-loading (both local and global)
    globalScriptsLoaded = true;
    isInitializedRef.current = true;

    // Set credentials on window BEFORE loading any scripts
    window.jdgm = window.jdgm || {};
    window.jdgm.SHOP_DOMAIN = shopDomain;
    window.jdgm.PLATFORM = 'shopify';
    window.jdgm.PUBLIC_TOKEN = publicToken;

    fetch(`${cdnHost}/widget_preloader.js`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        // Create preloader function
        const preloaderScript = document.createElement('script');
        preloaderScript.innerText = `function jdgm_preloader(){${text}}`;
        document.head.appendChild(preloaderScript);

        // DO NOT load installed.js - it causes refresh loops in Hydrogen/Oxygen
        // Instead, call the preloader directly using the retry mechanism
        console.log('Judge.me preloader script loaded, initializing widgets...');
        refreshWidgets();
      })
      .catch((error) => {
        console.error('Judge.me: Failed to load scripts', error);
        // Reset flags so it can retry
        globalScriptsLoaded = false;
        isInitializedRef.current = false;
      });

    // Cleanup function
    return () => {
      if (rerenderTimeoutRef.current) {
        clearTimeout(rerenderTimeoutRef.current);
      }
    };
  }, [shopDomain, publicToken, cdnHost, refreshWidgets]);

  // Re-render widgets on route change - only when pathname ACTUALLY changes
  useEffect(() => {
    // Skip on server-side
    if (typeof window === 'undefined') return;
    
    // Normalize pathname (remove trailing slash for comparison)
    const normalizedPathname = location.pathname.replace(/\/$/, '') || '/';
    
    // Skip if pathname hasn't actually changed
    if (lastPathnameRef.current === normalizedPathname) {
      return;
    }
    
    // Update the last pathname
    lastPathnameRef.current = normalizedPathname;
    
    // Clear any existing timeout
    if (rerenderTimeoutRef.current) {
      clearTimeout(rerenderTimeoutRef.current);
    }

    // Debounce the re-render
    rerenderTimeoutRef.current = setTimeout(refreshWidgets, delay);

    return () => {
      if (rerenderTimeoutRef.current) {
        clearTimeout(rerenderTimeoutRef.current);
      }
    };
  }, [location.pathname, delay, refreshWidgets]);
}
