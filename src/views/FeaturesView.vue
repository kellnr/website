<script setup lang="ts">
import CodeText from "@/components/elements/CodeText.vue";
import FeatureCard from "@/components/FeatureCard.vue";
import SectionHeader from "@/components/SectionHeader.vue";
import PageHeader from "@/components/PageHeader.vue";
import { featureSections } from "@/data/features";
import { useScrollSpy } from "@/composables/useScrollSpy";
import { revealInContainer } from "@/utils/scroll";
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const breadcrumbs = [{ label: "Kellnr", to: "/" }, { label: "Features" }];

// Sections jump to 120px below the viewport top (their scroll-margin-top, below header and
// section nav), so a section counts as current a bit before it reaches that line.
const SECTION_OFFSET = 130;
const active = useScrollSpy(
  featureSections.map((section) => section.id),
  SECTION_OFFSET
);

const navList = ref<HTMLUListElement | null>(null);
const fadeStart = ref(false);
const fadeEnd = ref(false);

function updateFades() {
  const list = navList.value;
  if (!list) return;
  fadeStart.value = list.scrollLeft > 1;
  fadeEnd.value = list.scrollLeft + list.clientWidth < list.scrollWidth - 1;
}

// Scrolls only the nav list: scrollIntoView would also move the window and could cancel the
// smooth page scroll that a click on a nav item started.
function revealActiveItem(id: string | null) {
  const list = navList.value;
  const item = id ? list?.querySelector<HTMLElement>(`[data-section="${id}"]`) : null;
  if (!list || !item) return;
  revealInContainer(list, item, "x");
}

watch(active, (id) => nextTick(() => revealActiveItem(id)));

onMounted(() => {
  updateFades();
  window.addEventListener("resize", updateFades, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateFades);
});
</script>

<template>
  <div class="features-page">
    <PageHeader
      title="Features"
      subtitle="Everything you need for a complete private Rust crate registry. From publishing crates to SSO, access control and supply chain security."
      :breadcrumbs="breadcrumbs"
    />

    <nav class="section-nav" aria-label="Feature sections">
      <div class="container">
        <ul
          ref="navList"
          :class="{ 'fade-start': fadeStart, 'fade-end': fadeEnd }"
          @scroll.passive="updateFades"
        >
          <li v-for="section in featureSections" :key="section.id">
            <router-link
              :to="{ hash: `#${section.id}` }"
              :data-section="section.id"
              :class="{ active: active === section.id }"
              :aria-current="active === section.id ? 'location' : undefined"
            >
              {{ section.navLabel }}
            </router-link>
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
              decoding="async"
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
              decoding="async"
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

/* Section navigation */
.section-nav {
  position: sticky;
  top: 64px;
  z-index: 10;
  background: var(--color-header-bg);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}

.section-nav ul {
  display: flex;
  gap: 0.25rem;
  margin: 0;
  padding: 0.625rem 0;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: none;
  scroll-snap-type: x proximity;
  scroll-padding-inline: 2rem;
  --fade: 2rem;
}

/* Fade the side that has more items to scroll to */
.section-nav ul.fade-start {
  mask-image: linear-gradient(to right, transparent, #000 var(--fade));
}

.section-nav ul.fade-end {
  mask-image: linear-gradient(to left, transparent, #000 var(--fade));
}

.section-nav ul.fade-start.fade-end {
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 var(--fade),
    #000 calc(100% - var(--fade)),
    transparent
  );
}

.section-nav li {
  scroll-snap-align: start;
}

.section-nav a {
  display: block;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-text-muted);
  border-radius: 999px;
  transition: all 0.2s ease;
}

.section-nav a:hover,
.section-nav a.active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

/* Sections */
.section {
  scroll-margin-top: 120px;
  padding: 4rem 0;
  background: var(--color-surface);
}

.section-alt {
  background: var(--color-surface-muted);
}

.section-shot {
  display: block;
  width: 100%;
  max-width: 900px;
  height: auto;
  margin: 0 auto 3rem;
  border-radius: 12px;
  border: 1px solid var(--color-border-strong);
  box-shadow: 0 20px 40px var(--color-shadow);
}

.showcase-shot {
  width: 100%;
  height: auto;
  border-radius: 12px;
  border: 1px solid var(--color-border-strong);
  box-shadow: 0 20px 40px var(--color-shadow);
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
  color: var(--color-text);
  margin: 0 0 1rem;
}

.showcase-description {
  font-size: 1.05rem;
  color: var(--color-text-muted);
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
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.feature-list li:last-child {
  margin-bottom: 0;
}

.feature-list i {
  color: var(--color-success);
  font-size: 1.25rem;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-accent);
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
  background: linear-gradient(
    135deg,
    var(--color-accent-soft) 0%,
    color-mix(in srgb, var(--color-accent) 12%, var(--color-accent-soft)) 100%
  );
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.visual-card i {
  font-size: 5rem;
  color: var(--color-accent);
}

.visual-card span {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-accent-hover);
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
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.deployment-card h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
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
  color: var(--color-text-muted);
  padding: 0.5rem 0;
}

.deployment-list i {
  font-size: 1.25rem;
  color: var(--color-accent);
  width: 1.5rem;
  text-align: center;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, var(--color-band-from) 0%, var(--color-band-to) 100%);
}


.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-band-text);
  margin: 0 0 1rem;
}

.cta-content p {
  font-size: 1.1rem;
  color: var(--color-band-text);
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
  background: var(--color-band-button-bg);
  color: var(--color-band-button-text);
  font-weight: 600;
  font-size: 1rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px var(--color-shadow);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px var(--color-shadow);
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
  color: var(--color-band-text);
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid color-mix(in srgb, var(--color-band-text) 60%, transparent);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: color-mix(in srgb, var(--color-band-text) 10%, transparent);
  border-color: var(--color-band-text);
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
