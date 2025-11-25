import z from 'zod';
import { ArchitectureSchema } from '../architecture';
import { VersionSchema } from '../schema';

/**
 * Complete package descriptor schema
 * Property names match Debian package descriptor format
 */
export const PackageDescriptorFileSchema = z.object({
  // Info
  version: VersionSchema,

  // Package
  architecture: ArchitectureSchema, // e.g., amd64
  priority: z.string().optional(), // e.g., optional
  depends: z.string().optional(), // e.g., libgtk-3-0, libnotify4
  recommends: z.string().optional(), // e.g., pulseaudio | libasound2
  suggests: z.string().optional(), // e.g., gir1.2-gnomekeyring-1.0, libgnome-keyring0, lsb-release

  // File
  size: z.number().int().positive(),
  md5: z.hash('md5'),
  sha256: z.hash('sha256'),
  sha512: z.hash('sha512'),

  // Proxy
  url: z.url(),
  path: z.string().min(1), // e.g., proxy/download/mail/linux/1.9.1/ProtonMail-desktop-beta.deb
});

/**
 * Partial package descriptor schema
 */
export const SourceDescriptorFileSchema = PackageDescriptorFileSchema.partial({
  size: true,
  md5: true,
  sha256: true,
  sha512: true,
});

/**
 * Package descriptor schema with all required fields, for all architectures and formats.
 */
export const PackageDescriptorSchema = z.object({
  // Info
  package: z.string().min(1), // e.g., proton-mail, proton-pass
  description: z.string(), // e.g., Proton official desktop application for Proton Mail and Proton Calendar
  section: z.string(), // e.g., utils

  // Maintainer
  maintainer: z.string().min(1), // e.g., Proton
  homepage: z.url(), // e.g., https://proton.me
  lastVerified: z.iso.datetime(), // ISO date string when hash was last verified

  // Files
  deb: z.record(VersionSchema, PackageDescriptorFileSchema).optional(),
  rpm: z.record(VersionSchema, PackageDescriptorFileSchema).optional(),
});

/**
 * Source Descriptors schema, it's a partial version of the final enriched
 * package descriptor schema.
 *
 * Typical missing fields:
 *  - file hashes and size
 *  - repository info (section, maintainer, homepage)
 */
export const SourceDescriptorSchema = PackageDescriptorSchema.partial({
  description: true,
  section: true,
  maintainer: true,
  homepage: true,
  deb: z.record(VersionSchema, SourceDescriptorFileSchema).optional(),
  rpm: z.record(VersionSchema, SourceDescriptorFileSchema).optional(),
});
