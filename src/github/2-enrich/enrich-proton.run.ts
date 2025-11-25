// TODO
// Get github proton product
// Get partial descriptor from github cache (SOURCES)
// download KV cache file
// enrich descriptor:
//  1. compute missing hashes
//  2. add missing repository info from packages
// save KV cache file
// save enriched descriptor to github cache (DESCRIPTORS)



async function run() {
  // GitHub Action logic
  // TODO

  // Download Proton source descriptor from cache
  // TODO

  // Download KV cache file
  // TODO

  // Clean and convert data to Source
  const sourceProduct = fromProtonToSource(apiResult);
  if (sourceProduct.debFiles.length === 0 && sourceProduct.rpmFiles.length === 0) {
    core.setFailed('No valid files found in Proton API response');
    return;
  }

  // Save file
  writeFile(cacheFile, JSON.stringify(sourceProduct, null, 2), 'utf8');
  core.debug(`Saved Proton source data to ${cacheFile}`);

  // Save source
  cache.saveCache([cacheFile], cacheKey);
}

// -- GitHub Action ------------------------------------------------------------
run();
