<template>
    <div>
        <!-- Navbar Start -->
        <header id="topnav" class="defaultscroll sticky" :class="{ 'bg-white': isWhiteNavbar !== true }">
            <div class="container">
                <!-- Logo container-->
                <div>
                    <router-link class="logo" to="/">
                        <span class="h3 font-weight-bold text-blue">&lt;'kellnr&gt;</span>
                    </router-link>
                </div>
                <!-- End Logo container-->
                <div class="menu-extras">
                    <div class="menu-item">
                        <!-- Mobile menu toggle-->
                        <a class="navbar-toggle" @click="toggleMenu()" :class="{ open: isCondensed === true }">
                            <div class="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </a>
                        <!-- End mobile menu toggle-->
                    </div>
                </div>

                <div id="navigation">
                    <!-- Navigation Menu-->
                    <ul class="navigation-menu" :class="{ 'nav-light': navLight !== true }">
                        <li>
                            <router-link to="/" class="side-nav-link-ref">Home</router-link>
                        </li>

                        <li class="has-submenu">
                            <a href="javascript:void(0)" @click="onMenuClick">Docs</a><span class="menu-arrow"></span>
                            <ul class="submenu">
                                <li>
                                    <router-link to="documentation" class="side-nav-link-ref">Documentation
                                    </router-link>
                                </li>
                                <li>
                                    <router-link to="changelog" class="side-nav-link-ref">Changelog
                                    </router-link>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <a href="https://github.com/kellnr/kellnr" target="_blank" class="side-nav-link-ref">Github</a>
                        </li>

                        <li>
                            <router-link to="blog" class="side-nav-link-ref">Blog</router-link>
                        </li>

                        <li>
                            <router-link to="contact" class="side-nav-link-ref">Contact</router-link>
                        </li>

                    </ul>
                    <!--end navigation menu-->
                    <div class="buy-menu-btn d-none">
                        <a href="https://1.envato.market/4n73n" target="_blank" class="btn btn-primary">Buy Now</a>
                    </div>
                    <!--end login button-->
                </div>
                <!--end navigation-->
            </div>
            <!--end container-->
        </header>
        <!--end header-->
        <!-- Navbar End -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const isCondensed = ref<boolean>(false);

const props = defineProps<{
    isWhiteNavbar: boolean
    navLight: boolean
    isIcons: boolean
}>();

onMounted(() => {
    window.onscroll = function () {
        onwindowScroll();
    };

    function onwindowScroll() {
        if (
            document.body.scrollTop > 50 ||
            document.documentElement.scrollTop > 50
        ) {
            document.getElementById("topnav").classList.add("nav-sticky");
        } else {
            document.getElementById("topnav").classList.remove("nav-sticky");
        }

        if (
            document.body.scrollTop > 100 ||
            document.documentElement.scrollTop > 100
        ) {
            document.getElementById("back-to-top").style.display = "inline";
        } else {
            document.getElementById("back-to-top").style.display = "none";
        }
    }

    var links = document.getElementsByClassName("side-nav-link-ref");
    for (var i = 0; i < links.length; i++) {
        if (window.location.pathname === (links[i] as HTMLAnchorElement).pathname) {
            links[i].classList.add("active");
            break;
        }
    }
});

/**
 * Toggle menu
 */
function toggleMenu() {
    isCondensed.value = !isCondensed.value;
    if (isCondensed.value) {
        document.getElementById("navigation").style.display = "block";
    } else document.getElementById("navigation").style.display = "none";
}

/**
 * Menu clicked show the submenu
 */
function onMenuClick(event: any) {
    event.preventDefault();
    const nextEl = event.target.nextSibling.nextSibling;

    if (nextEl && !nextEl.classList.contains("open")) {
        const parentEl = event.target.parentNode;
        if (parentEl) {
            parentEl.classList.remove("open");
        }
        nextEl.classList.add("open");
    } else if (nextEl) {
        nextEl.classList.remove("open");
    }
    return false;
}
</script>
