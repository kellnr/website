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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.self-help-title {
  margin: 0 0 0.25rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.self-help-text {
  margin: 0 0 1rem;
  color: #475569;
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
  color: #1e293b;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.resource i {
  font-size: 1.25rem;
  color: #2f55d4;
}

.resource:hover {
  color: #2f55d4;
  border-color: #2f55d4;
}

/* Channels */
.section-title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
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
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.channel:hover {
  border-color: #2f55d4;
  box-shadow: 0 8px 20px rgba(47, 85, 212, 0.12);
}

.channel-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  color: #2f55d4;
  background: #eff6ff;
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
  color: #0f172a;
}

.channel-text {
  color: #475569;
  line-height: 1.6;
}

.channel-action {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  font-weight: 600;
  color: #2f55d4;
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
  border-top: 1px solid #e2e8f0;
}

.sponsor p {
  margin: 0;
  color: #475569;
}

.sponsor a {
  font-weight: 600;
}

.sponsor-icon {
  font-size: 1.5rem;
  color: #db2777;
}

/* Keyboard focus */
.resource:focus-visible,
.channel:focus-visible,
.sponsor a:focus-visible {
  outline: 3px solid rgba(47, 85, 212, 0.5);
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
