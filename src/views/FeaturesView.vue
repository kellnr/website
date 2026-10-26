<script setup lang="ts">
import CodeText from "@/components/elements/CodeText.vue";
import FeatureCard from "@/components/FeatureCard.vue";
import SectionHeader from "@/components/SectionHeader.vue";
import { featureSections } from "@/data/features";
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

    <nav class="section-nav" aria-label="Feature sections">
      <div class="container">
        <ul>
          <li v-for="section in featureSections" :key="section.id">
            <router-link :to="{ hash: `#${section.id}` }">{{ section.navLabel }}</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <section
      v-for="(section, index) in featureSections"
      :id="section.id"
      :key="section.id"
      class="section"
      :class="{ 'section-alt': index % 2 === 1 }"
    >
      <div class="container">
        <div
          v-if="section.kind === 'showcase'"
          class="feature-showcase"
          :class="{ 'feature-showcase-reversed': section.reversed }"
        >
          <div class="showcase-content">
            <h2>{{ section.title }}</h2>
            <p class="showcase-description">{{ section.subtitle }}</p>
            <ul class="feature-list">
              <li v-for="point in section.points" :key="point">
                <i class="mdi mdi-check-circle"></i>
                <CodeText :text="point" />
              </li>
            </ul>
            <router-link v-if="section.link.to" :to="section.link.to" class="feature-link">
              {{ section.link.label }}
              <i class="mdi mdi-arrow-right"></i>
            </router-link>
            <a v-else :href="section.link.href" target="_blank" rel="noopener" class="feature-link">
              {{ section.link.label }}
              <i class="mdi mdi-arrow-right"></i>
            </a>
          </div>
          <div class="showcase-visual">
            <img
              v-if="'src' in section.visual"
              class="showcase-shot"
              :width="section.visual.width"
              :height="section.visual.height"
              loading="lazy"
              :src="section.visual.src"
              :alt="section.visual.alt"
            />
            <div v-else class="visual-card">
              <i class="mdi" :class="section.visual.icon"></i>
              <span>{{ section.visual.label }}</span>
            </div>
          </div>
        </div>

        <template v-else>
          <SectionHeader :title="section.title" :subtitle="section.subtitle" />

          <div v-if="section.kind === 'deployment'" class="deployment-grid">
            <div v-for="group in section.groups" :key="group.title" class="deployment-card">
              <h4>{{ group.title }}</h4>
              <ul class="deployment-list">
                <li v-for="item in group.items" :key="item.text"><i class="mdi" :class="item.icon"></i> {{ item.text }}</li>
              </ul>
            </div>
          </div>

          <template v-else>
            <img
              v-if="section.image"
              class="section-shot"
              :width="section.image.width"
              :height="section.image.height"
              loading="lazy"
              :src="section.image.src"
              :alt="section.image.alt"
            />

            <div class="features-grid" :class="{ 'features-grid-3': section.cards.length === 3 }">
              <FeatureCard v-for="card in section.cards" :key="card.title" v-bind="card" />
            </div>
          </template>
        </template>
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
  /* clip instead of hidden, which would break the sticky section navigation */
  overflow-x: clip;
}

/* Hero Section */
.hero-section {
  padding: 3rem 0 2.5rem;
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


/* Section navigation */
.section-nav {
  position: sticky;
  top: 64px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e2e8f0;
}

.section-nav ul {
  display: flex;
  gap: 0.25rem;
  margin: 0;
  padding: 0.625rem 0;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
}

.section-nav a {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  color: #475569;
  border-radius: 999px;
  transition: all 0.2s ease;
}

.section-nav a:hover {
  color: #2f55d4;
  background: #eff6ff;
}

/* Sections */
.section {
  scroll-margin-top: 120px;
  padding: 4rem 0;
  background: #ffffff;
}

.section-alt {
  background: #f8fafc;
}

.section-shot {
  display: block;
  width: 100%;
  max-width: 900px;
  height: auto;
  margin: 0 auto 3rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.showcase-shot {
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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

  .showcase-content h2,
  .cta-content h2 {
    font-size: 1.5rem;
  }

  .section {
    padding: 3rem 0;
  }
}
</style>
