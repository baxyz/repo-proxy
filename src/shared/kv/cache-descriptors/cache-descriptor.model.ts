import { PackageDescriptorFile } from "../../descriptor";


/**
 * KV Cache for Package Descriptors.
 * The key is the package URL.
 */
export type KvDescriptorCache = Record<string, PackageDescriptorFile>;
