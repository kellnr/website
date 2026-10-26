// Content of the sponsor page. Update the costs once a year and the sponsors
// whenever someone new shows up on GitHub Sponsors.

export const SPONSOR_URL = "https://github.com/sponsors/secana";

export interface Cost {
  icon: string;
  item: string;
  note: string;
  // Euros per year
  amount: number;
}

export const costs: Cost[] = [
  { icon: "mdi-server", item: "Hosting", note: "kellnr.io and the release infrastructure", amount: 108 },
  { icon: "mdi-web", item: "Domains", note: "kellnr.io and related domains", amount: 91 },
  { icon: "mdi-apple", item: "Apple Developer Program", note: "Signing the macOS builds", amount: 99 },
];

export interface Sponsor {
  // GitHub user or organization name, also used for the avatar
  login: string;
}

// Only public sponsors from https://github.com/sponsors/secana. Move sponsors
// to the past ones when their sponsorship ends, to keep thanking them.
export const sponsors: Sponsor[] = [{ login: "kujeger" }, { login: "nihirash" }, { login: "sukhmel" }];

// Ended monthly and one-time sponsorships
export const pastSponsors: Sponsor[] = [
  { login: "caesay" },
  { login: "Avroke" },
  { login: "vezel-dev" },
  { login: "buoyant-data" },
  { login: "alexrp" },
  { login: "asynchronics" },
  { login: "gw3583" },
];
