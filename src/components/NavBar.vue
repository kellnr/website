<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const menuOpen = ref(false);
const docsOpen = ref(false);

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
</script>

<template>
  <header class="site-header">
    <div class="container site-header-inner">
      <router-link class="logo" to="/">&lt;'kellnr&gt;</router-link>

      <button
        class="menu-toggle"
        type="button"
        aria-label="Toggle navigation"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <i class="mdi" :class="menuOpen ? 'mdi-close' : 'mdi-menu'"></i>
      </button>

      <nav class="site-nav" :class="{ open: menuOpen }">
        <ul class="nav-list">
          <li><router-link to="/" :class="{ active: route.path === '/' }">Home</router-link></li>
          <li><router-link to="/features" :class="{ active: isActive('/features') }">Features</router-link></li>
          <li class="has-submenu" :class="{ open: docsOpen }">
            <button
              type="button"
              :class="{ active: isActive('/documentation') || isActive('/changelog') }"
              :aria-expanded="docsOpen"
              @click="docsOpen = !docsOpen"
            >
              Docs
              <i class="mdi mdi-chevron-down"></i>
            </button>
            <ul class="submenu">
              <li><router-link to="/documentation">Documentation</router-link></li>
              <li><router-link to="/changelog">Changelog</router-link></li>
            </ul>
          </li>
          <li><a href="https://github.com/kellnr/kellnr" target="_blank" rel="noopener">GitHub</a></li>
          <li><router-link to="/blog" :class="{ active: isActive('/blog') }">Blog</router-link></li>
          <li><router-link to="/contact" :class="{ active: isActive('/contact') }">Contact</router-link></li>
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
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e2e8f0;
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
  color: #2f55d4;
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
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #3c4858;
  background: none;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.nav-list > li > a:hover,
.nav-list > li > button:hover,
.nav-list .active {
  color: #2f55d4;
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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.submenu a {
  display: block;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #3c4858;
}

.submenu a:hover {
  color: #2f55d4;
  background: #f8fafc;
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
  color: #3c4858;
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
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    padding: 0.5rem 1rem 1rem;
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  }

  .site-nav.open {
    display: block;
  }

  .nav-list {
    flex-direction: column;
    align-items: stretch;
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
