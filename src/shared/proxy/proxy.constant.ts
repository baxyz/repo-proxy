/**
 * Proxy constants
 */

/**
 * Provider configurations
 */
export const PROXY_PROVIDERS = {
  proton: {
    baseUrl: 'https://proton.me/download',
    // URLs that start with this domain will be mapped to this provider
    domains: ['proton.me'],
  },
} as const;

/**
 * Provider type
 */
export type ProxyProvider = keyof typeof PROXY_PROVIDERS;
