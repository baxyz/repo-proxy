import { PackageDescriptorFile, SourceDescriptorFile } from "../../descriptor";

export function fromProtonToPackage(file: SourceDescriptorFile, cache: KvDescriptorCache): PackageDescriptorFile {
  // TODO
  // Check cache
  // if found return cached
  // else
  // download the file
  // compute hashes and size
  // enrich file descriptor
  // save to cache
  // return package (the package will be cache in the caller function)

  // Notes
  // helpers can be added in src/shared/proton
}
