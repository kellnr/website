<script setup lang="ts">
import FeatureBox from "@/components/landing/FeatureBox.vue";
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">The Private Crate Registry</h1>
          <p class="hero-subtitle">
            Host your private Rust crates on your own infrastructure.
            Full control. Complete privacy. Zero dependencies on external services.
          </p>
          <div class="hero-actions">
            <router-link to="documentation#installation" class="btn-primary">
              Get Started
              <i class="mdi mdi-arrow-right"></i>
            </router-link>
            <a href="https://github.com/kellnr/kellnr" class="btn-secondary" target="_blank" rel="noopener">
              <i class="mdi mdi-github"></i>
              View on GitHub
            </a>
          </div>
          <div class="hero-image">
            <img src="/images/kellnr/landing.png" alt="Kellnr Dashboard" />
          </div>
        </div>
      </div>
    </section>

    <!-- Deployment Options -->
    <section class="deployment-section">
      <div class="container">
        <div class="deployment-badges">
          <div class="badge-item">
            <i class="mdi mdi-server"></i>
            <span>Bare Metal</span>
          </div>
          <div class="badge-item">
            <i class="mdi mdi-docker"></i>
            <span>Docker + Helm</span>
          </div>
          <div class="badge-item">
            <i class="mdi mdi-chip"></i>
            <span>AMD64 + ARM64</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2>Everything you need for private crate hosting</h2>
          <p>Kellnr provides a complete solution for managing your organization's Rust dependencies.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-package-variant-closed"></i>
            </div>
            <h3>Private Registry</h3>
            <p>Host your proprietary crates securely. Keep your code private and under your control.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-file-document"></i>
            </div>
            <h3>Auto-Generated Docs</h3>
            <p>Automatically generate and serve rustdocs for every crate you publish.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <i class="mdi mdi-cached"></i>
            </div>
            <h3>Crates.io Proxy</h3>
            <p>Cache and proxy crates.io for faster builds and offline availability.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Showcases -->
    <section class="showcases-section">
      <FeatureBox
        orientation="left"
        title="List and search your private crates"
        checkbox1="Simple to use UI"
        checkbox2="Easy access to crate information"
        link="documentation"
        image="images/kellnr/search-light.png"
      >
        Find the crates you need instantly. One click gives you all the information needed to use a crate in your code.
      </FeatureBox>

      <FeatureBox
        orientation="right"
        title="Rustdocs beside your crates"
        checkbox1="Auto-generate rustdocs for each crate"
        checkbox2="Upload of custom rustdocs possible"
        link="documentation#rustdoc"
        image="images/kellnr/rustdoc-light.png"
      >
        Automatically generate rustdocs for each uploaded crate or upload custom docs from your build process.
      </FeatureBox>

      <FeatureBox
        orientation="left"
        title="Users and Groups"
        checkbox1="Fine grained user management"
        checkbox2="Group policies for users and crates"
        image="images/kellnr/users-light.png"
      >
        Add and remove users and authentication tokens with ease. Control who has access to your crates.
      </FeatureBox>

      <FeatureBox
        orientation="right"
        title="Crates.io proxy and cache"
        checkbox1="Transparently proxy crates.io"
        checkbox2="Cache crates.io to keep your deployments fast"
        link="documentation#cratesio-proxy"
        image="images/kellnr/cratesio-proxy-light.png"
      >
        Transparently proxy and cache crates.io to keep your builds fast and your infrastructure independent.
      </FeatureBox>

      <FeatureBox
        orientation="left"
        title="Dark Mode"
        checkbox1="Switch between light and dark mode"
        checkbox2="Easy on the eyes"
        image="images/kellnr/dependencies-dark.png"
      >
        Work in the environment you prefer with full light and dark mode support.
      </FeatureBox>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to host your private crates?</h2>
          <p>Get started with Kellnr in minutes. Free and open source.</p>
          <router-link to="documentation#installation" class="btn-primary btn-large">
            Get Started Now
            <i class="mdi mdi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

/* Hero Section */
.hero-section {
  padding: 6rem 0 4rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.hero-content {
  text-align: center;
  max-width: 800px;
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
  margin: 0 0 2rem;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: #2f55d4;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(47, 85, 212, 0.3);
}

.btn-primary:hover {
  background: #2348c0;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(47, 85, 212, 0.4);
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
  background: #ffffff;
  color: #1e293b;
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.hero-image {
  max-width: 900px;
  margin: 0 auto;
}

.hero-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}

/* Deployment Section */
.deployment-section {
  padding: 3rem 0;
  background: #ffffff;
}

.deployment-badges {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
}

.badge-item i {
  font-size: 1.5rem;
  color: #2f55d4;
}

/* Features Section */
.features-section {
  padding: 5rem 0;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
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

/* Showcases Section */
.showcases-section {
  padding: 2rem 0 4rem;
  background: #ffffff;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
}

.cta-content p {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0 0 2rem;
}

/* Responsive */
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

  .deployment-badges {
    gap: 1.5rem;
  }

  .section-header h2,
  .cta-content h2 {
    font-size: 1.5rem;
  }
}
</style>
