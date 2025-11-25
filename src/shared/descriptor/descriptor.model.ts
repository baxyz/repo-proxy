import type z from 'zod';
import type {
  PackageDescriptorFileSchema,
  PackageDescriptorSchema,
  SourceDescriptorFileSchema,
  SourceDescriptorSchema,
} from './descriptor.schema';

/**
 * Package descriptor with all required fields, for all architectures and formats.
 */
export type PackageDescriptor = z.infer<typeof PackageDescriptorSchema>;

/**
 * Source Descriptors, it's a partial version of the final enriched package descriptor.
 *
 * Typical missing fields:
 *  - file hashes and size
 *  - repository info (section, maintainer, homepage)
 */
export type SourceDescriptor = z.infer<typeof SourceDescriptorSchema>;


/**
 * Package Descriptor File
 */
export type PackageDescriptorFile = z.infer<typeof PackageDescriptorFileSchema>;

/**
 * Source Descriptor File, it's a partial version of the final enriched package descriptor file.
 * Typical missing fields: hashes and size
 */
export type SourceDescriptorFile = z.infer<typeof SourceDescriptorFileSchema>;
