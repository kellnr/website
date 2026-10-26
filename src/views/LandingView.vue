<script setup lang="ts">
import CodeBlock from "@/components/elements/CodeBlock.vue";
import FeatureCard from "@/components/FeatureCard.vue";
import SectionHeader from "@/components/SectionHeader.vue";

// Each highlight links to its section on the features page.
const highlights = [
  {
    anchor: "registry",
    icon: "mdi-package-variant-closed",
    title: "Private Registry",
    text: "Publish and pull crates with plain Cargo. Your code stays on your infrastructure.",
  },
  {
    anchor: "rustdoc",
    icon: "mdi-file-document",
    title: "Rustdocs Built In",
    text: "Docs are generated for every crate you publish and served right next to it.",
  },
  {
    anchor: "proxy",
    icon: "mdi-cached",
    title: "Crates.io Proxy",
    text: "Cache crates.io for faster builds that keep working when the internet does not.",
  },
  {
    anchor: "sso",
    icon: "mdi-shield-key",
    title: "Single Sign-On",
    text: "Log in with Keycloak, Okta, Azure AD or any other OpenID Connect provider.",
  },
  {
    anchor: "toolchain",
    icon: "mdi-tools",
    title: "Toolchain Server",
    text: "Distribute custom or pinned Rust toolchains to your team through rustup.",
  },
  {
    anchor: "deployment",
    icon: "mdi-database",
    title: "Your Storage, Your Database",
    text: "Store crates locally, on S3, GCS or MinIO, with SQLite or PostgreSQL.",
  },
];
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
            <img src="/images/kellnr/landing.png" width="3534" height="2314" alt="A crate page in the Kellnr web UI" />
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
          <div class="badge-item">
            <i class="mdi mdi-open-source-initiative"></i>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Highlights -->
    <section class="features-section">
      <div class="container">
        <SectionHeader
          title="Everything you need for private crate hosting"
          subtitle="Kellnr provides a complete solution for managing your organization's Rust dependencies."
        />
        <div class="features-grid">
          <FeatureCard
            v-for="highlight in highlights"
            :key="highlight.anchor"
            :to="`/features#${highlight.anchor}`"
            :icon="highlight.icon"
            :title="highlight.title"
            :text="highlight.text"
          />
        </div>
        <div class="features-more">
          <router-link to="/features" class="link-arrow">
            See all features
            <i class="mdi mdi-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Quickstart -->
    <section class="quickstart-section">
      <div class="container">
        <SectionHeader
          title="Up and running in three steps"
          subtitle="Try Kellnr locally with Docker. No account, no external services."
        />
        <ol class="quickstart-steps">
          <li>
            <h3><span class="step-number">1</span> Start Kellnr</h3>
            <CodeBlock lang="bash">
              docker run --rm -it -p 8000:8000 \
                -e "KELLNR_SETUP__ADMIN_TOKEN=my-admin-token" \
                ghcr.io/kellnr/kellnr:6
            </CodeBlock>
          </li>
          <li>
            <h3><span class="step-number">2</span> Add it to <code>~/.cargo/config.toml</code></h3>
            <CodeBlock lang="toml">
              [registries.kellnr]
              index = "sparse+http://127.0.0.1:8000/api/v1/crates/"
              credential-provider = ["cargo:token"]
              token = "my-admin-token"
            </CodeBlock>
          </li>
          <li>
            <h3><span class="step-number">3</span> Publish your crate</h3>
            <CodeBlock lang="bash">
              cargo publish --registry kellnr
            </CodeBlock>
          </li>
        </ol>
        <div class="features-more">
          <router-link to="/documentation#installation" class="link-arrow">
            Production setups: Helm, binaries, S3, PostgreSQL
            <i class="mdi mdi-arrow-right"></i>
          </router-link>
        </div>
      </div>
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
          <p class="cta-sponsor">
            <i class="mdi mdi-heart" aria-hidden="true"></i>
            Kellnr is built by a single developer in their spare time.
            <router-link to="/sponsor">Sponsor its development</router-link>
          </p>
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
  padding: 3.5rem 0 4rem;
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
  height: auto;
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

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

.features-more {
  margin-top: 2.5rem;
  text-align: center;
}

.link-arrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #2f55d4;
  transition: gap 0.2s ease;
}

.link-arrow:hover {
  gap: 0.75rem;
}

/* Quickstart Section */
.quickstart-section {
  padding: 5rem 0;
  background: #ffffff;
}

.quickstart-steps {
  max-width: 760px;
  margin: 0 auto;
  padding: 0;
  list-style: none;
}

.quickstart-steps li + li {
  margin-top: 2rem;
}

.quickstart-steps h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: #0f172a;
}

.quickstart-steps h3 code {
  font-size: 0.95rem;
  color: #0f172a;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  background: #2f55d4;
  border-radius: 50%;
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

.cta-content .cta-sponsor {
  margin: 2rem 0 0;
  font-size: 1rem;
}

.cta-sponsor i {
  color: #db2777;
}

.cta-sponsor a {
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1024px) {
  .features-grid {
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

  .quickstart-section {
    padding: 3rem 0;
  }

  .deployment-badges {
    gap: 1.5rem;
  }

  .cta-content h2 {
    font-size: 1.5rem;
  }
}
</style>
