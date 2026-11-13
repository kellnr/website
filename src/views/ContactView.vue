<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";

// Self-help first: most questions are answered in the docs or an existing issue.
const resources = [
  { icon: "mdi-book-open-variant", label: "Documentation", to: "/documentation" },
  { icon: "mdi-format-list-bulleted", label: "Changelog", to: "/changelog" },
];

// Ordered by how often each is the right choice.
const channels = [
  {
    icon: "mdi-forum",
    title: "Ask a question",
    text: "Questions about setup, configuration or usage, and ideas you want to discuss first.",
    action: "Open GitHub Discussions",
    href: "https://github.com/kellnr/kellnr/discussions",
  },
  {
    icon: "mdi-bug",
    title: "Report a bug or request a feature",
    text: "Search the existing issues first. Include your Kellnr version and how you run it.",
    action: "Open GitHub Issues",
    href: "https://github.com/kellnr/kellnr/issues",
  },
  {
    icon: "mdi-shield-alert",
    title: "Report a vulnerability",
    text: "Please do not open a public issue. Report it privately so it can be fixed before disclosure.",
    action: "Report privately on GitHub",
    href: "https://github.com/kellnr/kellnr/security/advisories/new",
  },
];
</script>

<template>
  <div>
    <PageHeader
      title="Contact"
      subtitle="Kellnr is developed in the open on GitHub. Pick the channel that fits your request."
      :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Contact' }]"
    />

    <section class="page-content">
      <div class="container">
        <div class="contact">
          <div class="self-help">
            <h2 class="self-help-title">Before you ask</h2>
            <p class="self-help-text">Most answers are already in the documentation or the changelog.</p>
            <ul class="resource-list">
              <li v-for="resource in resources" :key="resource.to">
                <router-link :to="resource.to" class="resource">
                  <i class="mdi" :class="resource.icon" aria-hidden="true"></i>
                  {{ resource.label }}
                </router-link>
              </li>
            </ul>
          </div>

          <h2 class="section-title">Get in touch</h2>
          <ul class="channel-list">
            <li v-for="channel in channels" :key="channel.href">
              <a :href="channel.href" class="channel" target="_blank" rel="noopener">
                <span class="channel-icon">
                  <i class="mdi" :class="channel.icon" aria-hidden="true"></i>
                </span>
                <span class="channel-body">
                  <span class="channel-title">{{ channel.title }}</span>
                  <span class="channel-text">{{ channel.text }}</span>
                  <span class="channel-action">
                    {{ channel.action }}
                    <i class="mdi mdi-open-in-new" aria-hidden="true"></i>
                    <span class="sr-only">(opens in a new tab)</span>
                  </span>
                </span>
              </a>
            </li>
          </ul>

          <div class="sponsor">
            <i class="mdi mdi-heart sponsor-icon" aria-hidden="true"></i>
            <p>
              Kellnr is free and open source. If it saves your team time, consider
              <router-link to="/sponsor">sponsoring its development</router-link>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact {
  max-width: 820px;
  margin: 0 auto;
}

/* Self-help */
.self-help {
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  background: var(--color-surface-muted);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.self-help-title {
  margin: 0 0 0.25rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.self-help-text {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
}

.resource-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.resource {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.resource i {
  font-size: 1.25rem;
  color: var(--color-accent);
}

.resource:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}
/* Channels */
.section-title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.channel-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 0 2.5rem;
  padding: 0;
  list-style: none;
}

.channel {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.channel:hover {
  border-color: var(--color-accent);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.channel-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  color: var(--color-accent);
  background: var(--color-accent-soft);
  border-radius: 10px;
}

.channel-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.channel-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text);
}

.channel-text {
  color: var(--color-text-muted);
  line-height: 1.6;
}

.channel-action {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  font-weight: 600;
  color: var(--color-accent);
}

.channel:hover .channel-action {
  text-decoration: underline;
}

/* Sponsor */
.sponsor {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.sponsor p {
  margin: 0;
  color: var(--color-text-muted);
}

.sponsor a {
  font-weight: 600;
}

.sponsor-icon {
  font-size: 1.5rem;
  color: var(--color-sponsor);
}

/* Keyboard focus */
.resource:focus-visible,
.channel:focus-visible,
.sponsor a:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .resource,
  .channel {
    transition: none;
  }
}

@media (max-width: 576px) {
  .channel {
    flex-direction: column;
    gap: 1rem;
    padding: 1.25rem;
  }

  .resource-list li {
    flex: 1 1 100%;
  }

  .resource {
    width: 100%;
  }
}
</style>
