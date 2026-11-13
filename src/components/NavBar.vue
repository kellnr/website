<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import ExternalLink from "@/components/ExternalLink.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";

const route = useRoute();
const menuOpen = ref(false);
const docsOpen = ref(false);
const docsButton = ref<HTMLButtonElement>();

// Close the mobile menu and the docs submenu after navigating.
watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
    docsOpen.value = false;
  }
);

function isActive(prefix: string): boolean {
  return route.path === prefix || route.path.startsWith(`${prefix}/`);
}

function closeDocsAndFocusButton() {
  if (!docsOpen.value) return;
  docsOpen.value = false;
  docsButton.value?.focus();
}

function closeDocsOnFocusLeave(event: FocusEvent) {
  const item = event.currentTarget as HTMLElement;
  if (!item.contains(event.relatedTarget as Node | null)) {
    docsOpen.value = false;
  }
}
</script>

<template>
  <header class="site-header">
    <div class="container site-header-inner">
      <router-link class="logo" to="/">&lt;'kellnr&gt;</router-link>

      <button
        class="menu-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-controls="site-nav"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <i class="mdi" :class="menuOpen ? 'mdi-close' : 'mdi-menu'" aria-hidden="true"></i>
      </button>

      <nav id="site-nav" class="site-nav" :class="{ open: menuOpen }" aria-label="Main">
        <ul class="nav-list">
          <li><router-link to="/" :class="{ active: route.path === '/' }">Home</router-link></li>
          <li><router-link to="/features" :class="{ active: isActive('/features') }">Features</router-link></li>
          <li
            class="has-submenu"
            :class="{ open: docsOpen }"
            @keydown.esc="closeDocsAndFocusButton"
            @focusout="closeDocsOnFocusLeave"
          >
            <button
              ref="docsButton"
              type="button"
              :class="{ active: isActive('/documentation') || isActive('/changelog') }"
              aria-controls="docs-submenu"
              :aria-expanded="docsOpen"
              @click="docsOpen = !docsOpen"
            >
              Docs
              <i class="mdi mdi-chevron-down" aria-hidden="true"></i>
            </button>
            <ul id="docs-submenu" class="submenu">
              <li><router-link to="/documentation">Documentation</router-link></li>
              <li><router-link to="/changelog">Changelog</router-link></li>
            </ul>
          </li>
          <li><router-link to="/blog" :class="{ active: isActive('/blog') }">Blog</router-link></li>
          <li><router-link to="/contact" :class="{ active: isActive('/contact') }">Contact</router-link></li>
        </ul>
        <ul class="nav-list nav-list-end">
          <li><ExternalLink href="https://github.com/kellnr/kellnr">GitHub</ExternalLink></li>
          <li>
            <router-link to="/sponsor" class="nav-sponsor" :class="{ active: isActive('/sponsor') }">
              <i class="mdi mdi-heart" aria-hidden="true"></i>
              Sponsor
            </router-link>
          </li>
          <li><ThemeToggle /></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1030;
  height: 64px;
  background: var(--color-header-bg);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}

.site-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
}

/* Internal pages on the left, external links and actions (e.g. a theme toggle) on the right */
.site-nav {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  margin-left: 1.5rem;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-list > li > a,
.nav-list > li > button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-text-muted);
  background: none;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.nav-list > li > a:hover,
.nav-list > li > button:hover,
.nav-list .active {
  color: var(--color-accent);
}

.nav-list > li > .nav-sponsor {
  margin-left: 0.5rem;
  color: var(--color-sponsor);
  border: 1px solid var(--color-sponsor-border);
}

.nav-list > li > .nav-sponsor:hover,
.nav-list > li > .nav-sponsor.active {
  color: var(--color-sponsor);
  background: var(--color-sponsor-soft);
}

.has-submenu {
  position: relative;
}

.has-submenu .mdi-chevron-down {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.submenu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  margin: 0;
  padding: 0.5rem 0;
  list-style: none;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 0 10px 25px var(--color-shadow);
}

.submenu a {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.submenu a:hover {
  color: var(--color-accent);
  background: var(--color-surface-muted);
}

.has-submenu.open .submenu {
  display: block;
}

.has-submenu.open .mdi-chevron-down {
  transform: rotate(180deg);
}

.menu-toggle {
  display: none;
  padding: 0.25rem;
  font-size: 1.75rem;
  line-height: 1;
  color: var(--color-text-muted);
  background: none;
  border: 0;
  cursor: pointer;
}

@media (min-width: 992px) {
  .has-submenu:hover .submenu {
    display: block;
  }

  .has-submenu:hover .mdi-chevron-down {
    transform: rotate(180deg);
  }
}

@media (max-width: 991px) {
  .menu-toggle {
    display: block;
  }

  .site-nav {
    display: none;
    margin-left: 0;
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    padding: 0.5rem 1rem 1rem;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    box-shadow: 0 10px 25px var(--color-shadow);
  }

  .site-nav.open {
    display: block;
  }

  .nav-list {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-list-end {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }

  .nav-list > li > .nav-sponsor {
    margin-left: 0;
  }

  .nav-list > li > a,
  .nav-list > li > button {
    width: 100%;
    padding: 0.75rem 0.5rem;
  }

  .submenu {
    position: static;
    border: 0;
    box-shadow: none;
    padding: 0 0 0 1rem;
  }
}
</style>
