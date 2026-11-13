<script setup lang="ts">
import CodeBlock from "@/components/elements/CodeBlock.vue";
import FeatureCard from "@/components/FeatureCard.vue";
import SectionHeader from "@/components/SectionHeader.vue";
import { useResolvedTheme } from "@/composables/useTheme";
import { KELLNR_IMAGE } from "@/data/release";

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

// Variants of public/images/kellnr/landing-{light,dark}.png, generated once with ImageMagick,
// avifenc and cwebp.
const heroWidths = [800, 1600, 2400];
const mobileWidths = [800, 1600];
// The hero column is at most 800px wide, minus the container padding on small screens.
const heroSizes = "(min-width: 830px) 800px, calc(100vw - 30px)";
const mobileSizes = "calc(100vw - 30px)";

const theme = useResolvedTheme();

function srcset(name: string, widths: number[], format: "avif" | "webp"): string {
  return widths.map((w) => `/images/kellnr/${name}-${theme.value}-${w}.${format} ${w}w`).join(", ");
}
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
            <router-link to="/documentation#installation" class="btn-primary">
              Get started
              <i class="mdi mdi-arrow-right"></i>
            </router-link>
            <a href="https://github.com/kellnr/kellnr" class="btn-secondary" target="_blank" rel="noopener">
              <i class="mdi mdi-github"></i>
              View on GitHub
            </a>
          </div>
          <div class="hero-image">
            <!-- Phones get a crop of the crate header and install box, the full page is unreadable there. -->
            <picture>
              <source
                media="(max-width: 575.98px)"
                type="image/avif"
                :srcset="srcset('landing-mobile', mobileWidths, 'avif')"
                :sizes="mobileSizes"
                width="2400"
                height="1500"
              />
              <source
                media="(max-width: 575.98px)"
                type="image/webp"
                :srcset="srcset('landing-mobile', mobileWidths, 'webp')"
                :sizes="mobileSizes"
                width="2400"
                height="1500"
              />
              <source type="image/avif" :srcset="srcset('landing', heroWidths, 'avif')" :sizes="heroSizes" />
              <source type="image/webp" :srcset="srcset('landing', heroWidths, 'webp')" :sizes="heroSizes" />
              <img
                :src="`/images/kellnr/landing-${theme}.png`"
                width="3534"
                height="2314"
                fetchpriority="high"
                alt="A crate page in the Kellnr web UI"
              />
            </picture>
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
                {{ KELLNR_IMAGE }}
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
          <router-link to="/documentation#installation" class="btn-primary btn-large">
            Get started
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
  background: var(--gradient-page-header);
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1.5rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--color-text-muted);
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
  background: var(--color-accent);
  color: var(--color-accent-contrast);
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px color-mix(in srgb, var(--color-accent) 40%, transparent);
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
  background: var(--color-surface);
  color: var(--color-text);
  font-weight: 600;
  font-size: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-surface-muted);
  border-color: var(--color-border-strong);
}

.hero-image {
  max-width: 900px;
  margin: 0 auto;
}

.hero-image picture {
  display: block;
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 25px 50px -12px var(--color-shadow);
  border: 1px solid var(--color-border-strong);
}

/* Deployment Section */
.deployment-section {
  padding: 3rem 0;
  background: var(--color-surface);
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
  color: var(--color-text-subtle);
  font-size: 1rem;
  font-weight: 500;
}

.badge-item i {
  font-size: 1.5rem;
  color: var(--color-accent);
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: var(--color-surface-muted);
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
  color: var(--color-accent);
  transition: gap 0.2s ease;
}

.link-arrow:hover {
  gap: 0.75rem;
}

/* Quickstart Section */
.quickstart-section {
  padding: 5rem 0;
  background: var(--color-surface);
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
  color: var(--color-text);
}

.quickstart-steps h3 code {
  font-size: 0.95rem;
  color: var(--color-text);
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-accent-contrast);
  background: var(--color-accent);
  border-radius: 50%;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: var(--color-surface-muted);
  border-top: 1px solid var(--color-border);
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 1rem;
}

.cta-content p {
  font-size: 1.1rem;
  color: var(--color-text-subtle);
  margin: 0 0 2rem;
}

.cta-content .cta-sponsor {
  margin: 2rem 0 0;
  font-size: 1rem;
}

.cta-sponsor i {
  color: var(--color-sponsor);
}

.cta-sponsor a {
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 0.15em;
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
