<script setup lang="ts">
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
    <section class="bg-half bg-light d-table w-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-12 text-center">
            <div class="page-next-level">
              <h4 class="title">Blog</h4>
              <div class="page-next">
                <nav aria-label="breadcrumb" class="d-inline-block">
                  <ul class="breadcrumb bg-white rounded shadow mb-0">
                    <li class="breadcrumb-item">
                      <router-link to="/">Kellnr</router-link>
                    </li>
                    <li class="breadcrumb-item">
                      <router-link to="blog">Blog</router-link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="position-relative">
      <div class="shape overflow-hidden text-white">
        <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>

    <section class="section">
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
