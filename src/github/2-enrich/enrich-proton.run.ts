// TODO
// Get github proton product
// Get partial descriptor from github cache (SOURCES)
// download KV cache file
// enrich descriptor:
//  1. compute missing hashes
//  2. add missing repository info from packages
// save KV cache file
// save enriched descriptor to github cache (DESCRIPTORS)

import { downloadDescriptorsCache, uploadDescriptorsCache } from "../../shared";



async function run() {
  // Constants
  const { namespaceId } = getKVConfig();


  // GitHub Action logic
  // TODO

  // Download Proton source descriptor from cache
  // TODO

  // Download KV cache file
  const cache = await downloadDescriptorsCache(namespaceId, protonProduct);

  // Enrich descriptor
  // TODO
  // iterate over .deb/.rpm files
  // create a helper for that
  // for each file
  //  - check cache
  //  - if found return cached
  //  - else
  //     - download the file
  //     - compute hashes and size
  //     - enrich file descriptor

  // Save KV cache file
  const newCache = {
    ...cache,
    // TODO add new/updated descriptors
  };
  await uploadDescriptorsCache(namespaceId, protonProduct, newCache);


  // Save Github cache
  // TODO
}

// -- GitHub Action ------------------------------------------------------------
run();
