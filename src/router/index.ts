import {
  START_LOCATION,
  createRouter,
  createWebHistory,
  type RouteComponent,
  type RouteRecordRaw,
} from "vue-router";
import LandingView from "../views/LandingView.vue";
import { NOT_FOUND_ROUTE, syncCanonicalLink } from "./canonical";
import { hashPosition } from "./hashPosition";
import { preferredScrollBehavior } from "../composables/useHashNavigation";
import blogData from "../data/blog-posts.json";
import type { BlogPostsDocument } from "../types/blog-posts";

const postComponents = import.meta.glob<RouteComponent>("../views/posts/*.vue", {
  import: "default",
});

function blogPostRoutes(): RouteRecordRaw[] {
  // A broken entry must not take down the whole site; the build validates the components.
  return (blogData as BlogPostsDocument).posts.flatMap((post) => {
    const component = postComponents[`../views/posts/${post.component}.vue`];
    if (!component) {
      console.error(`Blog post "${post.id}" references missing component "${post.component}.vue"`);
      return [];
    }
    return [
      {
        path: new URL(post.url).pathname,
        name: post.routeName ?? post.id,
        component,
      },
    ];
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
      // On a page load the layout still shifts while a long smooth scroll runs, so it stops
      // short of the target: jump there instead.
      return hashPosition(to.hash, from === START_LOCATION ? "instant" : preferredScrollBehavior());
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
      component: () => import("../views/FeaturesView.vue"),
    },
    {
      path: "/changelog",
      name: "changelog",
      component: () => import("../views/ChangelogView.vue"),
    },
    { path: "/documentation/v6", redirect: "/documentation" },
    {
      path: "/documentation",
      name: "documentation",
      component: () => import("../views/DocumentationView.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/ContactView.vue"),
    },
    {
      path: "/sponsor",
      name: "sponsor",
      component: () => import("../views/SponsorView.vue"),
    },
    // Blog posts
    {
      path: "/blog",
      name: "blog",
      component: () => import("../views/BlogView.vue"),
    },
    ...blogPostRoutes(),
    {
      path: "/:pathMatch(.*)*",
      name: NOT_FOUND_ROUTE,
      component: () => import("../views/NotFoundView.vue"),
    },
  ],
});

router.afterEach((to) => syncCanonicalLink(to));

export default router;
