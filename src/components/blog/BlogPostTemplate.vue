<script setup lang="ts">
import { useRoute } from "vue-router";
import PageHeader from "@/components/PageHeader.vue";
import blogData from "@/data/blog-posts.json";
import type { BlogPost, BlogPostsDocument } from "@/types/blog-posts";
import { formatDate } from "@/utils/date";

const props = withDefaults(defineProps<{ title: string; author?: string }>(), {
  author: "Stefan Hausotte",
});

const breadcrumbs = [
  { label: "Kellnr", to: "/" },
  { label: "Blog", to: "/blog" },
];

// Routes are named after the post (see src/router/index.ts), so the name finds its metadata.
function currentPost(): BlogPost | undefined {
  const name = useRoute().name;
  const post = (blogData as BlogPostsDocument).posts.find((p) => (p.routeName ?? p.id) === name);
  if (!post) {
    const message = `No entry in blog-posts.json for the blog post route "${String(name)}"`;
    if (import.meta.env.DEV) {
      throw new Error(message);
    }
    console.error(message);
  }
  return post;
}

const post = currentPost();
</script>

<template>
  <div>
    <PageHeader :title="props.title" :breadcrumbs="breadcrumbs">
      <template #subtitle>
        <time v-if="post" :datetime="post.published">{{ formatDate(post.published) }}</time>
        by {{ props.author }}
      </template>
    </PageHeader>

    <section class="page-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-10 col-md-12 mx-auto">
            <slot></slot>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
