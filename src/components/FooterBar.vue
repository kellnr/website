<script setup lang="ts">
import ExternalLink from "@/components/ExternalLink.vue";

/** A page of this site, an external site opened in a new tab, or a file served by this site. */
type FooterLink =
  | { kind: "route"; label: string; to: string }
  | { kind: "external"; label: string; href: string }
  | { kind: "file"; label: string; href: string };

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { kind: "route", label: "Features", to: "/features" },
      { kind: "route", label: "Documentation", to: "/documentation" },
      { kind: "route", label: "Changelog", to: "/changelog" },
    ],
  },
  {
    title: "Community",
    links: [
      { kind: "external", label: "GitHub", href: "https://github.com/kellnr/kellnr" },
      {
        kind: "external",
        label: "GitHub Discussions",
        href: "https://github.com/kellnr/kellnr/discussions",
      },
      { kind: "route", label: "Blog", to: "/blog" },
      { kind: "file", label: "RSS feed", href: "/rss.xml" },
    ],
  },
  {
    title: "Project",
    links: [
      { kind: "route", label: "Contact", to: "/contact" },
      { kind: "route", label: "Sponsor", to: "/sponsor" },
    ],
  },
];

const year = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-3 footer-brand">
          <router-link to="/" class="brand-name">&lt;'kellnr&gt;</router-link>
          <p class="copyright">© 2021 - {{ year }} Kellnr</p>
        </div>
        <nav
          v-for="column in columns"
          :key="column.title"
          class="col-12 col-sm-4 col-md-3 footer-column"
          :aria-labelledby="`footer-${column.title.toLowerCase()}`"
        >
          <h2 :id="`footer-${column.title.toLowerCase()}`" class="footer-title">{{ column.title }}</h2>
          <ul class="footer-links">
            <li v-for="link in column.links" :key="link.label">
              <router-link v-if="link.kind === 'route'" :to="link.to">{{ link.label }}</router-link>
              <ExternalLink v-else-if="link.kind === 'external'" :href="link.href">{{ link.label }}</ExternalLink>
              <a v-else-if="link.kind === 'file'" :href="link.href">{{ link.label }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 2.5rem 0 2rem;
  background: var(--color-surface-muted);
  border-top: 1px solid var(--color-border);
}

.footer-brand {
  margin-bottom: 1.5rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
}

.copyright {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.footer-column {
  margin-bottom: 1.5rem;
}

.footer-title {
  margin: 0 0 0.75rem;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-text);
}

.footer-links {
  margin: 0;
  padding: 0;
  list-style: none;
}

.footer-links li + li {
  margin-top: 0.5rem;
}

.footer-links a {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.footer-links a:hover {
  color: var(--color-accent);
}
</style>
