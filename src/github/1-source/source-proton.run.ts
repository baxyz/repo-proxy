import { writeFileSync } from 'node:fs';
import * as cache from '@actions/cache';
import * as core from '@actions/core';
import {
  fetchProtonProductAPI,
  fromProtonToSource,
  GITHUB_CACHE_FILE,
  GITHUB_CACHE_KEY,
  PROTON_PRODUCTS,
  type ProtonApiResponse,
  type ProtonProduct,
} from '../../shared';

async function run() {
  // GitHub Action logic
  const protonProduct: ProtonProduct | undefined = PROTON_PRODUCTS.filter(
    (product) =>
      product === core.getInput('proton-product', { required: true, trimWhitespace: true })
  ).at(0);
  if (!protonProduct) {
    core.setFailed('Missing or invalid proton-product input');
    return;
  }
  const cacheKey = GITHUB_CACHE_KEY.SOURCES;
  const cacheFile = GITHUB_CACHE_FILE.PROTON[protonProduct];
  core.debug(`Using Proton product: ${protonProduct}`);
  core.debug(`Using cache key: ${cacheKey}`);
  core.debug(`Using cache file: ${cacheFile}`);

  // Download Proton data
  let apiResult: ProtonApiResponse;
  try {
    apiResult = await fetchProtonProductAPI(protonProduct);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    core.setFailed(errorMsg);
    return;
  }

  // Clean and convert data to Source
  const sourceProduct = fromProtonToSource(apiResult);
  const debFilesCount = sourceProduct.deb ? Object.keys(sourceProduct.deb).length : 0;
  const rpmFilesCount = sourceProduct.rpm ? Object.keys(sourceProduct.rpm).length : 0;
  if (debFilesCount === 0 && rpmFilesCount === 0) {
    core.setFailed('No valid files found in Proton API response');
    return;
  }

  // Save file
  writeFileSync(cacheFile, JSON.stringify(sourceProduct, null, 2), 'utf8');
  core.debug(`Saved Proton source data to ${cacheFile}`);

  // Save source
  cache.saveCache([cacheFile], cacheKey);
}

// -- GitHub Action ------------------------------------------------------------
run();
