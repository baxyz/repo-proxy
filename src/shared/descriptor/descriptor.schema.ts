import z from 'zod';
import { ArchitectureSchema } from '../architecture';
import { VersionSchema } from '../schema';

/**
 * Complete package descriptor schema
 * Property names match Debian package descriptor format
 */
export const DescriptorFileSchema = z.object({
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
export const PartialDescriptorFileSchema = DescriptorFileSchema.partial({
  size: true,
  md5: true,
  sha256: true,
  sha512: true,
});

/**
 * Package descriptors source schema
 */
export const DescriptorsSourceSchema = z.object({
  // Info
  package: z.string().min(1), // e.g., proton-mail, proton-pass
  description: z.string(), // e.g., Proton official desktop application for Proton Mail and Proton Calendar
  section: z.string(), // e.g., utils

  // Maintainer
  maintainer: z.string().min(1), // e.g., Proton
  homepage: z.url(), // e.g., https://proton.me
  lastVerified: z.iso.datetime(), // ISO date string when hash was last verified

  // Files
  deb: z.record(ArchitectureSchema, DescriptorFileSchema).optional(),
  rpm: z.record(ArchitectureSchema, DescriptorFileSchema).optional(),
});

/**
 * Partial package descriptors source schema
 */
export const PartialDescriptorsSourceSchema = DescriptorsSourceSchema.partial({
  description: true,
  section: true,
  maintainer: true,
  homepage: true,
  deb: z.record(ArchitectureSchema, PartialDescriptorFileSchema).optional(),
  rpm: z.record(ArchitectureSchema, PartialDescriptorFileSchema).optional(),
});
