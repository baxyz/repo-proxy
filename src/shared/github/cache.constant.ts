import { ProtonProduct } from "../proton"

/**
 * Cache key where to store files.
 */
export const GITHUB_CACHE_KEY = {
  /**
   * Cache for origin files.
   */
  SOURCES: "SOURCES",

  /**
   * Cache for enriched descriptor files.
   */
  DESCRIPTORS: "DESCRIPTORS",
}

export const GITHUB_CACHE_FILE = {
  PROTON: <Record<ProtonProduct, string>>{
    [ProtonProduct.MAIL]: "proton-mail.json",
    [ProtonProduct.PASS]: "proton-pass.json",
    [ProtonProduct.AUTH]: "proton-authenticator.json",
  }
}
