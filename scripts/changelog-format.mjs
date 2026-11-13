/**
 * Changelog conventions shared by the build scripts and the site (`src/utils/changelog.ts`).
 * Plain JavaScript, so the build scripts run with Node without a TypeScript step.
 */

/** The entry types of Keep a Changelog, in their display order. */
export const ENTRY_TYPES = Object.freeze([
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
]);

/**
 * "7.2.0" -> "v7-2-0", usable as an element id and URL fragment.
 * @param {string} version
 * @returns {string}
 */
export function versionId(version) {
  return `v${version.replaceAll(".", "-")}`;
}

/**
 * Major version of a release version, e.g. 6 for "6.13.0".
 * @param {string} version
 * @returns {number}
 */
export function majorOf(version) {
  const match = /^(\d+)\./.exec(version);
  if (!match) {
    throw new Error(`Invalid version: "${version}"`);
  }
  return Number(match[1]);
}

/**
 * Major version of the newest release in changelog.json, e.g. 7 for "7.2.0".
 * @param {{ releases: { version: string }[] }} doc
 * @returns {number}
 */
export function latestMajor(doc) {
  const newest = doc.releases[0];
  if (!newest) {
    throw new Error("changelog.json lists no releases, cannot derive the Kellnr major version");
  }
  return majorOf(newest.version);
}
