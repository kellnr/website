<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
import blogData from "../data/blog-posts.json";

interface BlogPost {
  id: string;
  title: string;
  published: string;
  summaryHtml: string;
}

const posts: BlogPost[] = blogData.posts;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
</script>

<template>
  <div>
    <PageHeader title="Blog" :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Blog' }]" />

    <section class="page-content">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 col-md-10">
            <div class="blog-list">
              <router-link
                v-for="post in posts"
                :key="post.id"
                :to="`/blog/${post.id}`"
                class="blog-item"
              >
                <article>
                  <h2 class="blog-title">{{ post.title }}</h2>
                  <time class="blog-date">{{ formatDate(post.published) }}</time>
                  <p class="blog-summary">{{ post.summaryHtml }}</p>
                </article>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.blog-item {
  display: block;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.blog-item:hover {
  border-color: #2f55d4;
  box-shadow: 0 4px 12px rgba(47, 85, 212, 0.15);
  transform: translateY(-2px);
}

.blog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.blog-item:hover .blog-title {
  color: #2f55d4;
}

.blog-date {
  display: inline-block;
  font-size: 0.8rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.blog-summary {
  font-size: 1rem;
  color: #475569;
  margin: 0;
  line-height: 1.6;
}
</style>
