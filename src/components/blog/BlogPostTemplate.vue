<script setup lang="ts">
import PageHeader from "@/components/PageHeader.vue";
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
        <PageHeader :title="props.title" :subtitle="`${props.date} by ${props.author}`" :breadcrumbs="[{ label: 'Kellnr', to: '/' }, { label: 'Blog', to: '/blog' }]" />

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
