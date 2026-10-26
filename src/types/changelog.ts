export type ChangeLogLink = {
  label: string;
  url: string;
};

export type ChangeLogEntryType =
  | "Added"
  | "Changed"
  | "Deprecated"
  | "Removed"
  | "Fixed"
  | "Security";

export type ChangeLogEntry = {
  type: ChangeLogEntryType;
  // Area of the code base, e.g. "ui" or "deps"
  scope?: string;
  // HTML
  content: string;
  links?: ChangeLogLink[];
};

export type ChangeLogRelease = {
  version: string;
  date: string;
  isLatest?: boolean;
  entries: ChangeLogEntry[];
};

export type ChangeLogDocument = {
  releases: ChangeLogRelease[];
};
