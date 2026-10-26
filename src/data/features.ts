// Content of the features page. Text in backticks is rendered as inline code.

export interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Feature {
  icon: string;
  title: string;
  text: string;
}

interface SectionBase {
  id: string;
  navLabel: string;
  title: string;
  subtitle: string;
}

export interface CardsSection extends SectionBase {
  kind: "cards";
  image?: Screenshot;
  cards: Feature[];
}

export interface ShowcaseSection extends SectionBase {
  kind: "showcase";
  reversed?: boolean;
  points: string[];
  link: { label: string; to?: string; href?: string };
  visual: { icon: string; label: string } | Screenshot;
}

export interface DeploymentSection extends SectionBase {
  kind: "deployment";
  groups: { title: string; items: { icon: string; text: string }[] }[];
}

export type FeatureSection = CardsSection | ShowcaseSection | DeploymentSection;

const screenshot = (name: string, alt: string): Screenshot => ({
  src: `/images/kellnr/${name}.png`,
  alt,
  width: 3534,
  height: 2314,
});

export const featureSections: FeatureSection[] = [
  {
    kind: "cards",
    id: "registry",
    navLabel: "Registry",
    title: "Private Crate Registry",
    subtitle: "The essential features you expect from a Rust crate registry.",
    image: screenshot("search-light", "Searching crates in the Kellnr web UI"),
    cards: [
      {
        icon: "mdi-package-variant-closed",
        title: "Private Crate Hosting",
        text: "Host your proprietary Rust crates on your own infrastructure. Keep your code private with full control over access and distribution.",
      },
      {
        icon: "mdi-upload",
        title: "Cargo-Compatible Publishing",
        text: "Publish crates using standard Cargo commands. Full support for all Cargo.toml features, metadata, and dependencies.",
      },
      {
        icon: "mdi-download",
        title: "Fast Downloads",
        text: "Pull crates quickly with in-memory caching for frequently accessed packages. Configurable cache sizes for optimal performance.",
      },
      {
        icon: "mdi-tag-multiple",
        title: "Version Management",
        text: "Full semantic versioning support with dependency resolution. View version history, changelogs, and dependency trees.",
      },
      {
        icon: "mdi-magnify",
        title: "Search & Browse",
        text: "Find crates instantly with real-time search by name. Browse crate details, dependencies, and versions through a clean web interface.",
      },
      {
        icon: "mdi-trash-can-outline",
        title: "Crate Management",
        text: "Delete crate versions when needed. Manage crate metadata, ownership, and access permissions through the web UI.",
      },
    ],
  },
  {
    kind: "cards",
    id: "access",
    navLabel: "Access Control",
    title: "Authentication & Access Control",
    subtitle: "Fine-grained control over who can access and publish crates.",
    image: screenshot("users-light", "User management in Kellnr"),
    cards: [
      {
        icon: "mdi-account-group",
        title: "User Management",
        text: "Create and manage users with different roles: admin, regular, and read-only. Assign permissions based on responsibilities.",
      },
      {
        icon: "mdi-account-multiple",
        title: "Groups & Teams",
        text: "Organize users into groups for collective permission management. Assign crate ownership to teams instead of individuals.",
      },
      {
        icon: "mdi-key-variant",
        title: "API Tokens",
        text: "Generate API tokens for CI/CD pipelines and programmatic access. Token caching with configurable TTL for performance.",
      },
      {
        icon: "mdi-shield-account",
        title: "Crate Ownership",
        text: "Assign owners to crates to control who can publish updates. Support for individual and group-based ownership.",
      },
      {
        icon: "mdi-lock",
        title: "Download Authentication",
        text: "Optionally require authentication for downloading crates. Restrict access to specific users on a per-crate basis.",
      },
      {
        icon: "mdi-shield-lock",
        title: "Admin-Only Publishing",
        text: "Restrict new crate creation to administrators only. Existing crate owners can still publish updates to their crates.",
      },
    ],
  },
  {
    kind: "showcase",
    id: "sso",
    navLabel: "SSO",
    title: "OAuth2 / OpenID Connect",
    subtitle:
      "Integrate with your existing identity provider for seamless single sign-on. Support for Authentik, Keycloak, Okta, Azure AD, and any OIDC-compliant provider.",
    points: [
      "PKCE flow for secure authentication",
      "Automatic user provisioning on first login",
      "Group-based role assignment (admin, read-only)",
      "Customizable SSO button text",
    ],
    link: { label: "Learn more about OAuth2 setup", to: "/documentation#oauth2" },
    visual: { icon: "mdi-shield-key", label: "Single Sign-On" },
  },
  {
    kind: "cards",
    id: "rustdoc",
    navLabel: "Rustdoc",
    title: "Rustdoc Hosting",
    subtitle: "Automatically generate and serve documentation for your crates.",
    image: screenshot("rustdoc-light", "Rustdocs served by Kellnr"),
    cards: [
      {
        icon: "mdi-file-document-multiple",
        title: "Auto-Generated Docs",
        text: "Rustdocs are automatically generated for every uploaded crate. Docs are built with all features enabled for comprehensive coverage.",
      },
      {
        icon: "mdi-cloud-upload",
        title: "Custom Doc Upload",
        text: "Upload pre-built rustdocs from your CI/CD pipeline. Perfect for crates with complex build requirements or external dependencies.",
      },
      {
        icon: "mdi-format-list-bulleted",
        title: "Build Queue Management",
        text: "Monitor and manage the documentation build queue through the web UI. Configure maximum doc sizes to control resource usage.",
      },
    ],
  },
  {
    kind: "showcase",
    id: "proxy",
    navLabel: "Crates.io Proxy",
    title: "Crates.io Proxy & Cache",
    subtitle:
      "Transparently proxy and cache crates from crates.io. Keep your builds fast and your infrastructure independent from external services.",
    reversed: true,
    points: [
      "Automatic caching on first download",
      "Pre-fetch frequently updated crates",
      "Configurable sync threads for updates",
      "Works offline once crates are cached",
    ],
    link: { label: "Configure the proxy", to: "/documentation#cratesio-proxy" },
    visual: screenshot("cratesio-proxy-light", "Cached crates.io crates in Kellnr"),
  },
  {
    kind: "showcase",
    id: "toolchain",
    navLabel: "Toolchains",
    title: "Toolchain Distribution Server",
    subtitle:
      "Host private Rust toolchains internally. Distribute custom or patched toolchains to your team through a rustup-compatible distribution server.",
    points: [
      "Rustup-compatible (`RUSTUP_DIST_SERVER` support)",
      "Channel management (stable, beta, nightly, custom)",
      "Multi-target support (x86_64, aarch64, etc.)",
      "Admin-only uploads, public downloads",
    ],
    link: { label: "Set up toolchain distribution", to: "/documentation#toolchain" },
    visual: { icon: "mdi-tools", label: "Toolchain Server" },
  },
  {
    kind: "cards",
    id: "api",
    navLabel: "API",
    title: "API & Automation",
    subtitle: "Comprehensive APIs for integration with your development workflow.",
    cards: [
      {
        icon: "mdi-api",
        title: "REST API",
        text: "Complete REST API for programmatic access to all Kellnr features. Manage crates, users, and settings through API calls.",
      },
      {
        icon: "mdi-file-code",
        title: "Interactive API Docs",
        text: "Swagger UI-powered documentation with try-it-out functionality. Explore and test API endpoints directly in your browser.",
      },
      {
        icon: "mdi-webhook",
        title: "Webhooks",
        text: "Receive notifications about Kellnr events. Integrate with CI/CD pipelines, chat systems, or custom automation.",
      },
    ],
  },
  {
    kind: "deployment",
    id: "deployment",
    navLabel: "Deployment",
    title: "Deployment & Storage",
    subtitle: "Flexible deployment options to fit your infrastructure.",
    groups: [
      {
        title: "Deployment Options",
        items: [
          { icon: "mdi-docker", text: "Docker (full & minimal)" },
          { icon: "mdi-kubernetes", text: "Kubernetes via Helm Chart" },
          { icon: "mdi-server", text: "Bare Metal Installation" },
          { icon: "mdi-console", text: "Cargo install from crates.io" },
          { icon: "mdi-arch", text: "Arch User Repository (AUR)" },
        ],
      },
      {
        title: "Architecture Support",
        items: [
          { icon: "mdi-chip", text: "AMD64 (x86_64)" },
          { icon: "mdi-chip", text: "ARM64 (aarch64)" },
          { icon: "mdi-linux", text: "Static musl builds" },
          { icon: "mdi-layers-triple", text: "Multiarch Docker images" },
        ],
      },
      {
        title: "Storage Backends",
        items: [
          { icon: "mdi-folder", text: "Local filesystem (default)" },
          { icon: "mdi-aws", text: "AWS S3" },
          { icon: "mdi-google-cloud", text: "Google Cloud Storage" },
          { icon: "mdi-database", text: "MinIO" },
          { icon: "mdi-cloud", text: "S3-compatible services" },
        ],
      },
      {
        title: "Database Support",
        items: [
          { icon: "mdi-database", text: "SQLite (default)" },
          { icon: "mdi-elephant", text: "PostgreSQL" },
          { icon: "mdi-sync", text: "Auto-migrations on startup" },
          { icon: "mdi-connection", text: "Connection pooling" },
        ],
      },
    ],
  },
  {
    kind: "cards",
    id: "web-ui",
    navLabel: "Web UI",
    title: "Modern Web Interface",
    subtitle: "A clean, responsive web UI for managing your registry.",
    image: screenshot("dependencies-dark", "Crate dependencies in the Kellnr web UI in dark mode"),
    cards: [
      {
        icon: "mdi-theme-light-dark",
        title: "Light & Dark Mode",
        text: "Switch between light and dark themes. Work in the environment that suits you best.",
      },
      {
        icon: "mdi-tablet-cellphone",
        title: "Responsive Design",
        text: "Access Kellnr from any device. The interface adapts to desktop, tablet, and mobile screens.",
      },
      {
        icon: "mdi-chart-bar",
        title: "Statistics Dashboard",
        text: "View download counts, unique crates, version statistics, and top downloaded crates at a glance.",
      },
    ],
  },
  {
    kind: "showcase",
    id: "security",
    navLabel: "Supply Chain",
    title: "Supply Chain Security",
    subtitle:
      "Kellnr includes a Software Bill of Materials (SBOM) with every release, helping you meet compliance requirements and audit your dependencies.",
    reversed: true,
    points: [
      "CycloneDX format SBOM",
      "License information for all dependencies",
      "Cryptographic checksums",
      "Package URLs (purl) for identification",
    ],
    link: { label: "View releases on GitHub", href: "https://github.com/kellnr/kellnr/releases" },
    visual: { icon: "mdi-shield-check", label: "SBOM Included" },
  },
  {
    kind: "cards",
    id: "cli",
    navLabel: "CLI",
    title: "Redesigned CLI",
    subtitle: "A modern command-line interface for configuration and management.",
    cards: [
      {
        icon: "mdi-console",
        title: "Explicit Commands",
        text: "Clear command structure with `kellnr start` to run the server and `kellnr config` for configuration management.",
      },
      {
        icon: "mdi-cog",
        title: "Config Management",
        text: "Initialize, view, and manage configuration with `config init` and `config show` subcommands.",
      },
      {
        icon: "mdi-layers",
        title: "Flexible Configuration",
        text: "Configuration priority: CLI args > environment variables > config file > defaults. TOML config with env var support.",
      },
    ],
  },
];
