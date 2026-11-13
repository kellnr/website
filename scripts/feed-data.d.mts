import type { ChangeLogEntry } from "../src/types/changelog";

export { versionId } from "./changelog-format.mjs";

export declare function validateChangelogDocument(doc: unknown, filePath: string): void;

export declare function validateBlogPostsDocument(
  doc: unknown,
  filePath: string,
  postViewsDir: string
): void;

export declare function changelogDateToRfc3339(value: string, valuePath: string): string;

export declare function groupEntriesByType<T extends Pick<ChangeLogEntry, "type">>(
  entries: readonly T[]
): [string, T[]][];
