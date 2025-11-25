import type { PackageDescriptors } from '../../common';
import { ProtonProduct } from '../../proton';
import { KVCacheKey } from '../cache';
import type { KVConfig } from '../config';
import { getKvValue, setKvValue } from '../transfer/kv-transfer.helper';
import type { KvDescriptorCache } from './cache-descriptor.model';

/**
 * Download package descriptors cache from Cloudflare KV.
 * Returns an empty cache if none found.
 * No error is thrown in case of failure; a warning is logged instead.
 *
 * @param namespaceId KV Namespace ID
 * @param product string Proton product
 * @return KvDescriptorCache The downloaded package descriptors cache
 */
export async function downloadDescriptorsCache(
  namespaceId: KVConfig['namespaceId'],
  product: ProtonProduct
): Promise<KvDescriptorCache> {
  console.log('📥 Downloading package descriptors cache from KV...');

  try {
    const cacheKey = `${KVCacheKey.PACKAGE_DESCRIPTORS}-${product}`;
    const cacheValue = await getKvValue(namespaceId, cacheKey);

    if (cacheValue) {
      const parsed = JSON.parse(cacheValue) as KvDescriptorCache;
      const count = Object.keys(parsed).length;
      console.log(`  ✅ Found ${count} cached package descriptor(s)`);
      return parsed;
    }

    console.log('  ℹ️  No existing cache found');
    return {};
  } catch (error) {
    console.warn('  ⚠️  Could not read package descriptors cache:', error);
    return {};
  }
}

/**
 * Upload package descriptors cache to Cloudflare KV
 */
export async function uploadDescriptorsCache(
  namespaceId: KVConfig['namespaceId'],
  product: ProtonProduct,
  cache: KvDescriptorCache
): Promise<void> {
  console.log('📤 Uploading package descriptors cache to KV...');

  try {
    const cacheKey = `${KVCacheKey.PACKAGE_DESCRIPTORS}-${product}`;
    const cacheValue = JSON.stringify(cache, null, 2);

    await setKvValue(namespaceId, cacheKey, cacheValue);
    const count = Object.keys(cache).length;
    console.log(`  ✅ Uploaded ${count} package descriptor(s) to KV`);
  } catch (error) {
    console.error('  ❌ Failed to upload package descriptors cache:', error);
    throw error;
  }
}
