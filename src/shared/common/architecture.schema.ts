import z from 'zod';
import { Architecture } from './architecture/architecture.model';
/**
 * Supported architectures
 */
export enum Architecture {
  AMD64 = 'amd64',
  ARM64 = 'arm64',
}

/**
 * Architecture schema
 */
export const ArchitectureSchema = z.enum(Architecture);
