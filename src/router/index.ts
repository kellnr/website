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

// A slow or blocked font must not delay the jump until the reader already scrolled.
const FONT_WAIT_LIMIT_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
      if (from !== START_LOCATION) {
        return hashPosition(to.hash, preferredScrollBehavior());
      }
      // On a page load the web font still changes line heights above the target, so wait for
      // it and jump instead of a smooth scroll that would stop short of the moving target.
      return Promise.race([document.fonts.ready, delay(FONT_WAIT_LIMIT_MS)]).then(() =>
        hashPosition(to.hash, "instant")
      );
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
