import { describe, expect, it } from "vitest";
import { formatDate, formatMonthYear, formatShortDate } from "@/utils/date";

describe("formatDate", () => {
  it("formats an ISO date as a long US date", () => {
    expect(formatDate("2026-11-13")).toBe("November 13, 2026");
  });

  it("does not shift the day for the local time zone", () => {
    expect(formatDate("2026-01-01")).toBe("January 1, 2026");
  });

  it("accepts RFC3339 timestamps", () => {
    expect(formatDate("2026-11-01T12:00:00+00:00")).toBe("November 1, 2026");
  });

  it("rejects an invalid date with the offending value", () => {
    expect(() => formatDate("not a date")).toThrow('Invalid date: "not a date"');
  });
});

describe("formatShortDate", () => {
  it("formats an ISO date as month and day", () => {
    expect(formatShortDate("2026-11-13")).toBe("Nov 13");
  });

  it("rejects an invalid date with the offending value", () => {
    expect(() => formatShortDate("")).toThrow('Invalid date: ""');
  });
});

describe("formatMonthYear", () => {
  it("shows the abbreviated month and the year", () => {
    expect(formatMonthYear("2026-11-13")).toBe("Nov 2026");
  });

  it("uses UTC, so the first of a month stays in that month", () => {
    expect(formatMonthYear("2021-04-01")).toBe("Apr 2021");
  });
});
