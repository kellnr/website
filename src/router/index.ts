import {
  createRouter,
  createWebHistory,
  type RouteComponent,
  type RouteRecordRaw,
} from "vue-router";
import LandingView from "../views/LandingView.vue";
import FeaturesView from "../views/FeaturesView.vue";
import ChangelogView from "../views/ChangelogView.vue";
import DocumentationV6View from "../views/DocumentationV6View.vue";
import ContactView from "../views/ContactView.vue";
import BlogView from "../views/BlogView.vue";
import blogData from "../data/blog-posts.json";
import type { BlogPostsDocument } from "../types/blog-posts";

const postComponents = import.meta.glob<RouteComponent>("../views/posts/*.vue", {
  import: "default",
});

function blogPostRoutes(): RouteRecordRaw[] {
  return (blogData as BlogPostsDocument).posts.map((post) => {
    const component = postComponents[`../views/posts/${post.component}.vue`];
    if (!component) {
      throw new Error(
        `Blog post "${post.id}" references missing component "${post.component}.vue"`
      );
    }
    return {
      path: new URL(post.url).pathname,
      name: post.routeName ?? post.id,
      component,
    };
  });
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    // Only the query changed, e.g. a filter on the same page: keep the position.
    if (to.path === from.path && !to.hash) {
      return false;
    }
    if (to.hash) {
      // The router ignores CSS scroll-margin-top, which keeps targets clear of the sticky header.
      const el = document.querySelector(to.hash);
      const top = el ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0;
      return {
        el: to.hash,
        top,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingView,
    },
    {
      path: "/features",
      name: "features",
      component: FeaturesView,
    },
    {
      path: "/changelog",
      name: "changelog",
      component: ChangelogView,
    },
    {
      path: "/documentation/v6",
      name: "documentationV6",
      component: DocumentationV6View,
    },
    {
      path: "/documentation",
      name: "documentation",
      component: DocumentationV6View,
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactView,
    },
    // Blog posts
    {
      path: "/blog",
      name: "blog",
      component: BlogView,
    },
    ...blogPostRoutes(),
    // Default route to redirect all unknown paths to the landing page
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
