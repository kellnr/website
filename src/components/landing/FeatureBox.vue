<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  checkbox1: {
    type: String,
    required: true,
  },
  checkbox2: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
  orientation: {
    type: String, // 'left' or 'right' for text
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div v-if="props.orientation === 'left'" class="container mt-100 mt-60">
    <div class="row align-items-center">
      <div class="col-lg-5 col-md-6">
        <img
            v-bind:src="image"
            class="img-fluid shadow rounded"
            alt=""
        />
      </div>
      <!--end col-->

      <div class="col-lg-6 col-md-6 mt-4 mt-sm-0 pt-2 pt-sm-0">
        <div class="section-title ml-lg-5">
          <h4 class="title mb-4">
            {{ props.title }}
          </h4>
          <p class="text-muted">
            <slot></slot>
          </p>
          <ul class="list-unstyled text-muted">
            <li class="mb-0">
                  <span class="text-primary h5 mr-2"
                  ><i class="uil uil-check-circle align-middle"></i></span
                  >{{ props.checkbox1 }}
            </li>
            <li class="mb-0">
                  <span class="text-primary h5 mr-2"
                  ><i class="uil uil-check-circle align-middle"></i></span
                  >{{ props.checkbox2 }}
            </li>
          </ul>
          <RouterLink v-if="props.link" class="mt-3 h6 text-primary"
                      v-bind:to="props.link">Find Out More <i class="mdi mdi-chevron-right"></i
          ></RouterLink>
        </div>
      </div>
      <!--end col-->
    </div>
    <!--end row-->
  </div>

  <div v-if="props.orientation === 'right'" class="container mt-100 mt-60">
    <div class="row align-items-center">
      <div
          class="col-lg-7 col-md-6 order-2 order-md-1 mt-4 mt-sm-0 pt-2 pt-sm-0"
      >
        <div class="section-title mr-lg-5">
          <h4 class="title mb-4">{{ props.title }}</h4>
          <p class="text-muted">
            <slot></slot>
          </p>
          <ul class="list-unstyled text-muted">
            <li class="mb-0">
                  <span class="text-primary h5 mr-2"
                  ><i class="uil uil-check-circle align-middle"></i></span
                  >{{ props.checkbox1 }}
            </li>
            <li class="mb-0">
                  <span class="text-primary h5 mr-2"
                  ><i class="uil uil-check-circle align-middle"></i></span
                  >{{ props.checkbox2 }}
            </li>
          </ul>
          <RouterLink v-if="props.link" v-bind:to="props.link" class="mt-3 h6 text-primary"
          >Find Out More <i class="mdi mdi-chevron-right"></i
          ></RouterLink>
        </div>
      </div>
      <!--end col-->

      <div class="col-lg-5 col-md-6 order-1 order-md-2">
        <img
            v-bind:src="props.image"
            class="img-fluid shadow rounded"
            alt=""
        />
      </div>
      <!--end col-->
    </div>
    <!--end row-->
  </div>
</template>

<style scoped>

</style>
