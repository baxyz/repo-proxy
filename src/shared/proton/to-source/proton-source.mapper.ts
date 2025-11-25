import { Architecture, ArchitectureSchema } from '../../common';
import type { SourceDescriptor, SourceDescriptorFile } from '../../descriptor';
import { urlToProxyPath } from '../../proxy';
import type { ProtonApiResponse } from '../api';
import { PROTON_IDENTIFIER_PREFIX } from '../api/proton-api.schema';

/**
 * From the Proton API response, create a Source Descriptor.
 * It is a partial version of the final enriched package descriptor.
 * As much fields as possible should be filled.
 *
 * @param response Proton API response
 * @param packageName Package name, e.g., proton-mail, proton-pass
 * @returns Source Descriptor, a partial version of the final enriched package descriptor
 *
 * @see urlToProxyPath
 */
export function fromProtonToSource(response: ProtonApiResponse, packageName: string): SourceDescriptor {
  // Validate releases
  // - remove releases without files
  // - remove releases where files don't contain version (usually dev releases)
  const releases = response.Releases
    .filter(r => r.File && r.File.length > 0)
    .filter(r => r.File.every(f => f.Url && /\d+\.\d+\.\d+/.test(f.Url)));

  // Get the latest stable release (or first available)
  const latestRelease = releases.find((r) => r.CategoryName === 'Stable') || releases[0];

  if (!latestRelease) {
    throw new Error('No releases found in Proton API response');
  }

  const debFiles: Record<string, SourceDescriptorFile> = {};
  const rpmFiles: Record<string, SourceDescriptorFile> = {};

  // Process each release file
  for (const release of releases) {

    // Process each file in the release
    for (const file of release.File) {

      const sourceDescriptorFile: SourceDescriptorFile = {
        version: release.Version,
        architecture: Architecture.AMD64,
        // priority
        depends: response.Dependencies ? response.Dependencies.join(', ') : "",
        // recommends, // e.g., pulseaudio | libasound2
        // suggests, // e.g., gir1.2-gnomekeyring-1.0, libgnome-keyring0, lsb-release
        // size,
        // md5,
        // sha256,
        sha512: file.Sha512CheckSum,
        url: file.Url,
        path: urlToProxyPath(file.Url),
      };

      if (file.Identifier.startsWith(PROTON_IDENTIFIER_PREFIX.DEB)) {
        debFiles[file.Url] = sourceDescriptorFile;
      } else if (file.Identifier.startsWith(PROTON_IDENTIFIER_PREFIX.RPM)) {
        rpmFiles[file.Url] = sourceDescriptorFile;
      }
    }
  }

  return {
    package: packageName,
    lastVerified: latestRelease.ReleaseDate,
    deb: debFiles,
    rpm: rpmFiles,
  };
}
