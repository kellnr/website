import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import LandingView from "../views/LandingView.vue";
import ChangelogView from "../views/ChangelogView.vue";
import DocumentationV5View from "../views/DocumentationV5View.vue";
import BlogView from "../views/BlogView.vue";
import AsyncClosuresInRust from "../views/posts/AsyncClosuresInRust.vue";
import RustSupplyChainSecurity from "../views/posts/RustSupplyChainSecurity.vue";
import WasmCompiler4 from "../views/posts/WasmCompiler4.vue";
import WasmCompiler3 from "../views/posts/WasmCompiler3.vue";
import WasmCompiler2 from "../views/posts/WasmCompiler2.vue";
import WasmCompiler1 from "../views/posts/WasmCompiler1.vue";
import ImproveRustCompileTimes from "../views/posts/ImproveRustCompileTimes.vue";
import ContactView from "../views/ContactView.vue";
import Release3Vue from '../views/posts/Release3.vue';
import DomainModeling from "../views/posts/DomainModeling.vue";
import OpenSource from "../views/posts/OpenSource.vue";
import CrossPlatNativeLib from "../views/posts/CrossPlatNativeLib.vue";
import Release5 from "../views/posts/Release5.vue";
import RustAssembly from "../views/posts/RustAssembly.vue";
import Review2025 from "../views/posts/Review2025.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            }
        }
    },
    routes: [
        {
            path: '/',
            name: 'landing',
            component: LandingView
        },
        {
            path: '/changelog',
            name: 'changelog',
            component: ChangelogView
        },
        {
            path: '/documentation/v5',
            name: 'documentationV5',
            component: DocumentationV5View
        },
        {
            path: '/documentation',
            name: 'documentation',
            component: DocumentationV5View
        },
        {
            path: '/contact',
            name: 'contact',
            component: ContactView
        },
        // Blog posts
        {
            path: '/blog',
            name: 'blog',
            component: BlogView
        },
        {
            path: '/blog/rust-supply-chain-security',
            name: 'blog-rust-supply-chain-security',
            component: RustSupplyChainSecurity
        },
        {
            path: '/blog/async-closures-in-rust',
            name: 'blog-async-closures-in-rust',
            component: AsyncClosuresInRust
        },
        {
            path: '/blog/wasm-compiler4',
            name: 'blog-wasm-compiler4',
            component: WasmCompiler4
        },
        {
            path: '/blog/wasm-compiler3',
            name: 'blog-wasm-compiler3',
            component: WasmCompiler3
        },
        {
            path: '/blog/wasm-compiler2',
            name: 'blog-wasm-compiler2',
            component: WasmCompiler2
        },
        {
            path: '/blog/wasm-compiler1',
            name: 'blog-wasm-compiler1',
            component: WasmCompiler1
        },
        {
            path: '/blog/compile-times-sccache',
            name: 'compile-times-sccache',
            component: ImproveRustCompileTimes
        },
        {
            path: '/blog/release3',
            name: 'release3',
            component: Release3Vue
        },
        {
            path: '/blog/domain-modeling',
            name: 'domain-modeling',
            component: DomainModeling
        },
        {
            path: '/blog/open-source',
            name: 'open-source',
            component: OpenSource
        },
        {
            path: '/blog/cross-plat-native-lib',
            name: 'cross-plat-native-lib',
            component: CrossPlatNativeLib
        },
        {
            path: '/blog/rust-assembly',
            name: 'rust-assembly',
            component: RustAssembly
        },
        {
            path: '/blog/review-2025',
            name: 'review-2025',
            component: Review2025
        },
        // Default route to redirect all unknown paths to the landing page
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
})

export default router
