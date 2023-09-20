<script setup lang="ts">
const props = defineProps({
    img: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: false,
        default: "Stefan Hausotte"
    },
    part: {
        type: String,
        required: false,
        default: "1/1"
    }
})
</script>

<template>
    <div class="col-lg-4 col-md-6 mb-4 pb-2">
        <div class="card blog rounded border-0 shadow overflow-hidden">
            <div class="position-relative">
                <img v-bind:src="props.img" class="card-img-top thumbnail" alt="...">
                <div class="overlay rounded-top bg-dark"></div>
            </div>
            <div class="card-body content">
                <h5>
                    <router-link v-bind:to="'/blog/' + props.link" class="card-title title text-dark">
                        {{ props.title }}
                    </router-link>
                </h5>
                <div class="post-meta d-flex justify-content-between mt-3">
                    <router-link v-bind:to="'/blog/' + props.link" class="text-muted readmore">Read More <i
                            class="mdi mdi-chevron-right"></i></router-link>
                    <span class="text-muted like">part {{ props.part }}</span>
                </div>
            </div>
            <div class="author">
                <small class="text-light user d-block"><i class="mdi mdi-account"></i> {{ props.author }}</small>
                <small class="text-light date"><i class="mdi mdi-calendar-check"></i>{{ props.date }}</small>
            </div>
        </div>
    </div>
</template>

<style scoped>
.thumbnail {
    max-height: 200px;
    min-height: 200px;
    object-fit: scale-down;
}
</style>
