<script setup lang="ts">
</script>

<template>
  <div class="features-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Features</h1>
          <p class="hero-subtitle">
            Everything you need for a complete private Rust crate registry.
            From core registry functionality to enterprise-grade features.
          </p>
        </div>
      </div>
    </section>

    <!-- Shape Divider -->
    <div class="shape-divider">
      <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
      </svg>
    </div>

    <!-- Core Registry Features -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Private Crate Registry</h2>
          <p>The essential features you expect from a Rust crate registry.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-package-variant-closed"></i>
            </div>
            <h3>Private Crate Hosting</h3>
            <p>Host your proprietary Rust crates on your own infrastructure. Keep your code private with full control over access and distribution.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-upload"></i>
            </div>
            <h3>Cargo-Compatible Publishing</h3>
            <p>Publish crates using standard Cargo commands. Full support for all Cargo.toml features, metadata, and dependencies.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-download"></i>
            </div>
            <h3>Fast Downloads</h3>
            <p>Pull crates quickly with in-memory caching for frequently accessed packages. Configurable cache sizes for optimal performance.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-tag-multiple"></i>
            </div>
            <h3>Version Management</h3>
            <p>Full semantic versioning support with dependency resolution. View version history, changelogs, and dependency trees.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-magnify"></i>
            </div>
            <h3>Search &amp; Browse</h3>
            <p>Find crates instantly with real-time search by name. Browse crate details, dependencies, and versions through a clean web interface.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-trash-can-outline"></i>
            </div>
            <h3>Crate Management</h3>
            <p>Delete crate versions when needed. Manage crate metadata, ownership, and access permissions through the web UI.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Authentication & Access -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2>Authentication &amp; Access Control</h2>
          <p>Fine-grained control over who can access and publish crates.</p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-account-group"></i>
            </div>
            <h3>User Management</h3>
            <p>Create and manage users with different roles: admin, regular, and read-only. Assign permissions based on responsibilities.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-account-multiple"></i>
            </div>
            <h3>Groups &amp; Teams</h3>
            <p>Organize users into groups for collective permission management. Assign crate ownership to teams instead of individuals.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-key-variant"></i>
            </div>
            <h3>API Tokens</h3>
            <p>Generate API tokens for CI/CD pipelines and programmatic access. Token caching with configurable TTL for performance.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-shield-account"></i>
            </div>
            <h3>Crate Ownership</h3>
            <p>Assign owners to crates to control who can publish updates. Support for individual and group-based ownership.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-lock"></i>
            </div>
            <h3>Download Authentication</h3>
            <p>Optionally require authentication for downloading crates. Restrict access to specific users on a per-crate basis.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-shield-lock"></i>
            </div>
            <h3>Admin-Only Publishing</h3>
            <p>Restrict new crate creation to administrators only. Existing crate owners can still publish updates to their crates.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- OAuth2/OIDC -->
    <section class="section">
      <div class="container">
        <div class="feature-showcase">
          <div class="showcase-content">
            <h2>OAuth2 / OpenID Connect</h2>
            <p class="showcase-description">
              Integrate with your existing identity provider for seamless single sign-on.
              Support for Authentik, Keycloak, Okta, Azure AD, and any OIDC-compliant provider.
            </p>
            <ul class="feature-list">
              <li>
                <i class="mdi mdi-check-circle"></i>
                PKCE flow for secure authentication
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Automatic user provisioning on first login
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Group-based role assignment (admin, read-only)
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Customizable SSO button text
              </li>
            </ul>
            <router-link to="/documentation#oauth2" class="feature-link">
              Learn more about OAuth2 setup
              <i class="mdi mdi-arrow-right"></i>
            </router-link>
          </div>
          <div class="showcase-visual">
            <div class="visual-card">
              <i class="mdi mdi-shield-key"></i>
              <span>Single Sign-On</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Documentation -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2>Rustdoc Hosting</h2>
          <p>Automatically generate and serve documentation for your crates.</p>
        </div>

        <div class="features-grid features-grid-3">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-file-document-multiple"></i>
            </div>
            <h3>Auto-Generated Docs</h3>
            <p>Rustdocs are automatically generated for every uploaded crate. Docs are built with all features enabled for comprehensive coverage.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-cloud-upload"></i>
            </div>
            <h3>Custom Doc Upload</h3>
            <p>Upload pre-built rustdocs from your CI/CD pipeline. Perfect for crates with complex build requirements or external dependencies.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-format-list-bulleted"></i>
            </div>
            <h3>Build Queue Management</h3>
            <p>Monitor and manage the documentation build queue through the web UI. Configure maximum doc sizes to control resource usage.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Crates.io Proxy -->
    <section class="section">
      <div class="container">
        <div class="feature-showcase feature-showcase-reversed">
          <div class="showcase-content">
            <h2>Crates.io Proxy &amp; Cache</h2>
            <p class="showcase-description">
              Transparently proxy and cache crates from crates.io. Keep your builds fast
              and your infrastructure independent from external services.
            </p>
            <ul class="feature-list">
              <li>
                <i class="mdi mdi-check-circle"></i>
                Automatic caching on first download
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Pre-fetch frequently updated crates
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Configurable sync threads for updates
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Works offline once crates are cached
              </li>
            </ul>
            <router-link to="/documentation#cratesio-proxy" class="feature-link">
              Configure the proxy
              <i class="mdi mdi-arrow-right"></i>
            </router-link>
          </div>
          <div class="showcase-visual">
            <div class="visual-card">
              <i class="mdi mdi-server-network"></i>
              <span>Proxy and Cache</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Toolchain Distribution -->
    <section class="section section-alt">
      <div class="container">
        <div class="feature-showcase">
          <div class="showcase-content">
            <h2>Toolchain Distribution Server</h2>
            <p class="showcase-description">
              Host private Rust toolchains internally. Distribute custom or patched toolchains
              to your team through a rustup-compatible distribution server.
            </p>
            <ul class="feature-list">
              <li>
                <i class="mdi mdi-check-circle"></i>
                Rustup-compatible (<code>RUSTUP_DIST_SERVER</code> support)
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Channel management (stable, beta, nightly, custom)
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Multi-target support (x86_64, aarch64, etc.)
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Admin-only uploads, public downloads
              </li>
            </ul>
            <router-link to="/documentation#toolchain" class="feature-link">
              Set up toolchain distribution
              <i class="mdi mdi-arrow-right"></i>
            </router-link>
          </div>
          <div class="showcase-visual">
            <div class="visual-card">
              <i class="mdi mdi-tools"></i>
              <span>Toolchain Server</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- API & Integration -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>API &amp; Automation</h2>
          <p>Comprehensive APIs for integration with your development workflow.</p>
        </div>

        <div class="features-grid features-grid-3">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-api"></i>
            </div>
            <h3>REST API</h3>
            <p>Complete REST API for programmatic access to all Kellnr features. Manage crates, users, and settings through API calls.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-file-code"></i>
            </div>
            <h3>Interactive API Docs</h3>
            <p>Swagger UI-powered documentation with try-it-out functionality. Explore and test API endpoints directly in your browser.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-webhook"></i>
            </div>
            <h3>Webhooks</h3>
            <p>Receive notifications about Kellnr events. Integrate with CI/CD pipelines, chat systems, or custom automation.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Deployment & Storage -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header">
          <h2>Deployment &amp; Storage</h2>
          <p>Flexible deployment options to fit your infrastructure.</p>
        </div>

        <div class="deployment-grid">
          <div class="deployment-card">
            <h4>Deployment Options</h4>
            <ul class="deployment-list">
              <li><i class="mdi mdi-docker"></i> Docker (full &amp; minimal)</li>
              <li><i class="mdi mdi-kubernetes"></i> Kubernetes via Helm Chart</li>
              <li><i class="mdi mdi-server"></i> Bare Metal Installation</li>
              <li><i class="mdi mdi-console"></i> Cargo install from crates.io</li>
              <li><i class="mdi mdi-arch"></i> Arch User Repository (AUR)</li>
            </ul>
          </div>

          <div class="deployment-card">
            <h4>Architecture Support</h4>
            <ul class="deployment-list">
              <li><i class="mdi mdi-chip"></i> AMD64 (x86_64)</li>
              <li><i class="mdi mdi-chip"></i> ARM64 (aarch64)</li>
              <li><i class="mdi mdi-linux"></i> Static musl builds</li>
              <li><i class="mdi mdi-layers-triple"></i> Multiarch Docker images</li>
            </ul>
          </div>

          <div class="deployment-card">
            <h4>Storage Backends</h4>
            <ul class="deployment-list">
              <li><i class="mdi mdi-folder"></i> Local filesystem (default)</li>
              <li><i class="mdi mdi-aws"></i> AWS S3</li>
              <li><i class="mdi mdi-database"></i> MinIO</li>
              <li><i class="mdi mdi-cloud"></i> S3-compatible services</li>
            </ul>
          </div>

          <div class="deployment-card">
            <h4>Database Support</h4>
            <ul class="deployment-list">
              <li><i class="mdi mdi-database"></i> SQLite (default)</li>
              <li><i class="mdi mdi-elephant"></i> PostgreSQL</li>
              <li><i class="mdi mdi-sync"></i> Auto-migrations on startup</li>
              <li><i class="mdi mdi-connection"></i> Connection pooling</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Web UI -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Modern Web Interface</h2>
          <p>A clean, responsive web UI for managing your registry.</p>
        </div>

        <div class="features-grid features-grid-3">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-theme-light-dark"></i>
            </div>
            <h3>Light &amp; Dark Mode</h3>
            <p>Switch between light and dark themes. Work in the environment that suits you best.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-tablet-cellphone"></i>
            </div>
            <h3>Responsive Design</h3>
            <p>Access Kellnr from any device. The interface adapts to desktop, tablet, and mobile screens.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-chart-bar"></i>
            </div>
            <h3>Statistics Dashboard</h3>
            <p>View download counts, unique crates, version statistics, and top downloaded crates at a glance.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Supply Chain Security -->
    <section class="section section-alt">
      <div class="container">
        <div class="feature-showcase feature-showcase-reversed">
          <div class="showcase-content">
            <h2>Supply Chain Security</h2>
            <p class="showcase-description">
              Kellnr includes a Software Bill of Materials (SBOM) with every release,
              helping you meet compliance requirements and audit your dependencies.
            </p>
            <ul class="feature-list">
              <li>
                <i class="mdi mdi-check-circle"></i>
                CycloneDX format SBOM
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                License information for all dependencies
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Cryptographic checksums
              </li>
              <li>
                <i class="mdi mdi-check-circle"></i>
                Package URLs (purl) for identification
              </li>
            </ul>
            <a href="https://github.com/kellnr/kellnr/releases" target="_blank" rel="noopener" class="feature-link">
              View releases on GitHub
              <i class="mdi mdi-arrow-right"></i>
            </a>
          </div>
          <div class="showcase-visual">
            <div class="visual-card">
              <i class="mdi mdi-shield-check"></i>
              <span>SBOM Included</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CLI -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Redesigned CLI</h2>
          <p>A modern command-line interface for configuration and management.</p>
        </div>

        <div class="features-grid features-grid-3">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-console"></i>
            </div>
            <h3>Explicit Commands</h3>
            <p>Clear command structure with <code>kellnr start</code> to run the server and <code>kellnr config</code> for configuration management.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-cog"></i>
            </div>
            <h3>Config Management</h3>
            <p>Initialize, view, and manage configuration with <code>config init</code> and <code>config show</code> subcommands.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-layers"></i>
            </div>
            <h3>Flexible Configuration</h3>
            <p>Configuration priority: CLI args &gt; environment variables &gt; config file &gt; defaults. TOML config with env var support.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to get started?</h2>
          <p>Set up your private Rust crate registry in minutes.</p>
          <div class="cta-actions">
            <router-link to="/documentation#installation" class="btn-primary btn-large">
              View Documentation
              <i class="mdi mdi-arrow-right"></i>
            </router-link>
            <a href="https://github.com/kellnr/kellnr" class="btn-secondary" target="_blank" rel="noopener">
              <i class="mdi mdi-github"></i>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.features-page {
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  padding: 6rem 0 4rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.hero-content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #475569;
  margin: 0;
  line-height: 1.7;
}

/* Shape Divider */
.shape-divider {
  position: relative;
  color: #ffffff;
}

.shape-divider svg {
  display: block;
  width: 100%;
  height: 48px;
}

/* Sections */
.section {
  padding: 5rem 0;
  background: #ffffff;
}

.section-alt {
  background: #f8fafc;
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
}

.section-header p {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.features-grid-3 {
  max-width: 1000px;
}

.feature-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  position: relative;
}

.section-alt .feature-card {
  background: #ffffff;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eff6ff;
  border-radius: 12px;
  margin-bottom: 1.25rem;
}

.feature-icon i {
  font-size: 1.75rem;
  color: #2f55d4;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.75rem;
}

.feature-card p {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

.feature-card code {
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #0f172a;
}

/* Feature Showcase */
.feature-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
}

.feature-showcase-reversed {
  direction: rtl;
}

.feature-showcase-reversed > * {
  direction: ltr;
}

.showcase-content {
  padding: 1rem 0;
}

.showcase-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
}

.showcase-description {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.7;
  margin: 0 0 1.5rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #334155;
  margin-bottom: 0.75rem;
}

.feature-list li:last-child {
  margin-bottom: 0;
}

.feature-list i {
  color: #22c55e;
  font-size: 1.25rem;
}

.feature-list code {
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #0f172a;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #2f55d4;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.feature-link:hover {
  gap: 0.75rem;
}

.showcase-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 4rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 16px;
  border: 1px solid #bfdbfe;
}

.visual-card i {
  font-size: 5rem;
  color: #2f55d4;
}

.visual-card span {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e40af;
}

/* Deployment Grid */
.deployment-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.deployment-card {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.deployment-card h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.deployment-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.deployment-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #475569;
  padding: 0.5rem 0;
}

.deployment-list i {
  font-size: 1.25rem;
  color: #2f55d4;
  width: 1.5rem;
  text-align: center;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #1e3a8a 0%, #2f55d4 100%);
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1rem;
}

.cta-content p {
  font-size: 1.1rem;
  color: #bfdbfe;
  margin: 0 0 2rem;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: #ffffff;
  color: #2f55d4;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-primary.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: transparent;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .deployment-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }

  .feature-showcase {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .feature-showcase-reversed {
    direction: ltr;
  }

  .showcase-visual {
    order: -1;
  }

  .visual-card {
    padding: 2.5rem;
  }

  .visual-card i {
    font-size: 3.5rem;
  }

  .deployment-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }

  .section-header h2,
  .showcase-content h2,
  .cta-content h2 {
    font-size: 1.5rem;
  }

  .section {
    padding: 3rem 0;
  }
}
</style>
