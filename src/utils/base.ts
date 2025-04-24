/**
 * Extracts the package name from a package URL by removing known registry prefixes.
 * @param packageUrl The URL of the package
 * @returns The extracted package name
 */
export const getPackageName = (packageUrl: string): string => {
  if (!packageUrl) return '';

  const knownPrefixes = ['https://registry.npmjs.org/'];

  for (const prefix of knownPrefixes) {
    if (packageUrl.startsWith(prefix)) {
      return packageUrl.substring(prefix.length);
    }
  }

  return packageUrl;
};
