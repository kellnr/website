import type { ChangeLogDocument, ChangeLogEntryType } from "../src/types/changelog";

export declare const ENTRY_TYPES: readonly ChangeLogEntryType[];

export declare function versionId(version: string): string;

export declare function majorOf(version: string): number;

export declare function latestMajor(doc: Pick<ChangeLogDocument, "releases">): number;
