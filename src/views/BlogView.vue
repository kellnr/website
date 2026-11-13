<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import blogData from "../data/blog-posts.json";
import { formatDate, formatShortDate } from "@/utils/date";

type Category = "kellnr" | "rust";

interface BlogPost {
  id: string;
  title: string;
  published: string;
  category: Category;
  summaryHtml: string;
}

const posts = blogData.posts as BlogPost[];

const topics: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All posts" },
  { value: "kellnr", label: "Kellnr" },
  { value: "rust", label: "Rust" },
];

const categoryLabels: Record<Category, string> = {
  kellnr: "Kellnr",
  rust: "Rust",
};

const route = useRoute();
const router = useRouter();

// The topic lives in the URL so a filtered list can be linked and survives back navigation.
const topic = computed(() => {
  const value = route.query.topic;
  return value === "kellnr" || value === "rust" ? value : "all";
});

function selectTopic(value: Category | "all") {
  router.replace({ query: value === "all" ? {} : { topic: value } });
}

function countFor(value: Category | "all"): number {
  return value === "all" ? posts.length : posts.filter((p) => p.category === value).length;
}

const filtered = computed(() =>
  topic.value === "all" ? posts : posts.filter((p) => p.category === topic.value)
);

const featured = computed(() => filtered.value[0]);

// Remaining posts grouped by year, newest first (posts are already sorted).
const byYear = computed(() => {
  const groups: { year: number; posts: BlogPost[] }[] = [];
  for (const post of filtered.value.slice(1)) {
    const year = new Date(post.published).getUTCFullYear();
    const last = groups[groups.length - 1];
    if (last?.year === year) {
      last.posts.push(post);
    } else {
      groups.push({ year, posts: [post] });
    }
  }
  return groups;
});
</script>

<template>
  <div>
    <PageHeader
      title="Blog"
      subtitle="Kellnr releases and behind-the-scenes posts, plus articles about Rust."
      :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Blog' }]"
    />

    <section class="page-content">
      <div class="container">
        <div class="blog">
          <div class="toolbar">
            <div class="topics" role="group" aria-label="Filter posts by topic">
              <button
                v-for="t in topics"
                :key="t.value"
                type="button"
                class="topic"
                :aria-pressed="topic === t.value"
                @click="selectTopic(t.value)"
              >
                {{ t.label }}
                <span class="topic-count">{{ countFor(t.value) }}</span>
              </button>
            </div>
            <a href="/rss.xml" class="rss">
              <i class="mdi mdi-rss" aria-hidden="true"></i>
              RSS feed
            </a>
          </div>

          <router-link v-if="featured" :to="`/blog/${featured.id}`" class="featured">
            <span class="meta">
              <span class="label">Latest</span>
              <span v-if="topic === 'all'" class="category">{{ categoryLabels[featured.category] }}</span>
              <time :datetime="featured.published">{{ formatDate(featured.published) }}</time>
            </span>
            <h2 class="featured-title">{{ featured.title }}</h2>
            <p class="featured-summary">{{ featured.summaryHtml }}</p>
            <span class="read-more">
              Read post
              <i class="mdi mdi-arrow-right" aria-hidden="true"></i>
            </span>
          </router-link>

          <section v-for="group in byYear" :key="group.year" class="year">
            <h2 class="year-title">{{ group.year }}</h2>
            <ul class="post-list">
              <li v-for="post in group.posts" :key="post.id">
                <router-link :to="`/blog/${post.id}`" class="post">
                  <time class="post-date" :datetime="post.published">{{ formatShortDate(post.published) }}</time>
                  <div class="post-body">
                    <h3 class="post-title">{{ post.title }}</h3>
                    <span class="post-summary">{{ post.summaryHtml }}</span>
                    <span v-if="topic === 'all'" class="category">{{ categoryLabels[post.category] }}</span>
                  </div>
                </router-link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog {
  max-width: 820px;
  margin: 0 auto;
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 2rem;
}

.topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topic {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}

.topic:hover {
  color: var(--color-accent);
  border-color: var(--color-accent);
}

.topic[aria-pressed="true"] {
  color: var(--color-accent-contrast);
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.topic-count {
  min-width: 1.5rem;
  padding: 0 0.375rem;
  font-size: 0.8rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-surface-raised);
  border-radius: 999px;
}

.topic[aria-pressed="true"] .topic-count {
  color: var(--color-accent);
  background: var(--color-surface);
}

.rss {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-height: 44px;
  font-weight: 600;
}

.rss i {
  font-size: 1.25rem;
  color: var(--color-warning);
}

/* Shared labels */
.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.label {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-accent);
}

.category {
  align-self: flex-start;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-text-muted);
  background: var(--color-surface-raised);
  border-radius: 4px;
}

/* Featured post */
.featured {
  display: block;
  padding: 2rem;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, var(--color-accent-soft) 0%, var(--color-surface-muted) 100%);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
  border-radius: 16px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.featured:hover {
  border-color: var(--color-accent);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.featured-title {
  margin: 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-text);
}

.featured-summary {
  margin: 0 0 1.25rem;
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--color-text-muted);
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  color: var(--color-accent);
}

.featured:hover .read-more {
  text-decoration: underline;
}

/* Year groups */
.year + .year {
  margin-top: 2.5rem;
}

.year-title {
  margin: 0 0 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
}

.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.post {
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 1rem;
  padding: 1.25rem 0.75rem;
  margin: 0 -0.75rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.post:hover {
  background: var(--color-surface-muted);
}

.post-date {
  padding-top: 0.2rem;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-text-subtle);
}

.post-body {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.post-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-text);
}

.post:hover .post-title {
  color: var(--color-accent);
}

.post-summary {
  line-height: 1.6;
  color: var(--color-text-muted);
}

/* Keyboard focus */
.topic:focus-visible,
.rss:focus-visible,
.featured:focus-visible,
.post:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .topic,
  .featured,
  .post {
    transition: none;
  }
}

@media (max-width: 576px) {
  .featured {
    padding: 1.5rem;
  }

  .featured-title {
    font-size: 1.4rem;
  }

  .post {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
}
</style>
