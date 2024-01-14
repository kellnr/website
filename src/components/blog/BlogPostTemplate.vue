<script setup lang="ts">
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: false,
        default: "Stefan Hausotte",
    },
})
</script>

<template>
    <div>
        <section class="bg-half bg-light d-table w-100">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-12 text-center">
                        <div class="page-next-level">
                            <h4 class="title"> {{ props.title }} </h4>
                            <span>{{ props.date }} by {{ props.author }}</span>
                            <div class="page-next">
                                <nav aria-label="breadcrumb" class="d-inline-block">
                                    <ul class="breadcrumb bg-white rounded shadow mb-0">
                                        <li class="breadcrumb-item">
                                            <router-link to="/">Kellnr</router-link>
                                        </li>
                                        <li class="breadcrumb-item"><router-link to="/blog">Blog</router-link></li>
                                        <li class="breadcrumb-item active" aria-current="page">{{ props.title }}</li>
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
                <div class="row">
                    <slot></slot>
                </div>
            </div>
        </section>
    </div>
</template>
