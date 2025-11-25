
import { PROXY_PROVIDERS, type ProxyProvider } from './proxy.constant';

// Helper functions to convert between URLs and proxy paths
//
// Example for Proton:
// URL: https://proton.me/download/mail/linux/1.9.1/ProtonMail-desktop-beta.deb
// Path: proxy/proton/mail/linux/1.9.1/ProtonMail-desktop-beta.deb

/**
 * Detect provider from URL
 */
function detectProviderFromUrl(url: string): ProxyProvider {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    for (const [provider, config] of Object.entries(PROXY_PROVIDERS)) {
      if (config.domains.some(domain => hostname.includes(domain))) {
        return provider as ProxyProvider;
      }
    }

    throw new Error(`No provider found for URL: ${url}`);
  } catch {
    throw new Error(`Invalid URL or unknown provider: ${url}`);
  }
}

/**
 * Convert a source URL to a proxy path
 * @param url Source URL (e.g., https://proton.me/download/mail/linux/1.9.1/ProtonMail-desktop-beta.deb)
 * @returns Proxy path (e.g., proxy/proton/mail/linux/1.9.1/ProtonMail-desktop-beta.deb)
 */
export function urlToProxyPath(url: string): string {
  try {
    const provider = detectProviderFromUrl(url);
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.startsWith('/') ? parsedUrl.pathname.slice(1) : parsedUrl.pathname;
    return `proxy/${provider}/${pathname}`;
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
}

/**
 * Convert a proxy path back to the original source URL
 * @param path Proxy path (e.g., proxy/proton/mail/linux/1.9.1/ProtonMail-desktop-beta.deb)
 * @returns Original source URL
 */
export function proxyPathToUrl(path: string): string {
  try {
    // Extract provider and source path from proxy path
    const pathMatch = path.match(/^proxy\/([^/]+)\/(.+)$/);
    if (!pathMatch?.[1] || !pathMatch?.[2]) {
      throw new Error(`Invalid proxy path format: ${path}`);
    }

    const provider = pathMatch[1] as ProxyProvider;
    const sourcePath = pathMatch[2];

    // Get base URL for provider
    const providerConfig = PROXY_PROVIDERS[provider];
    if (!providerConfig) {
      throw new Error(`Unknown provider: ${provider}`);
    }

    const baseUrl = providerConfig.baseUrl;
    const url = new URL(sourcePath, baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
    return url.toString();
  } catch {
    throw new Error(`Invalid proxy path: ${path}`);
  }
}
