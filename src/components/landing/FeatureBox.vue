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
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="feature-box" :class="{ 'feature-box--reversed': orientation === 'right' }">
    <div class="feature-box__image">
      <img :src="image" :alt="title" />
    </div>
    <div class="feature-box__content">
      <h3 class="feature-box__title">{{ title }}</h3>
      <p class="feature-box__description">
        <slot></slot>
      </p>
      <ul class="feature-box__list">
        <li>
          <i class="mdi mdi-check-circle"></i>
          {{ checkbox1 }}
        </li>
        <li>
          <i class="mdi mdi-check-circle"></i>
          {{ checkbox2 }}
        </li>
      </ul>
      <RouterLink v-if="link" :to="link" class="feature-box__link">
        Learn more
        <i class="mdi mdi-arrow-right"></i>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.feature-box {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.feature-box--reversed {
  direction: rtl;
}

.feature-box--reversed > * {
  direction: ltr;
}

.feature-box__image {
  position: relative;
}

.feature-box__image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.feature-box__content {
  padding: 1rem 0;
}

.feature-box__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
  line-height: 1.3;
}

.feature-box__description {
  font-size: 1.05rem;
  color: #475569;
  line-height: 1.7;
  margin: 0 0 1.5rem;
}

.feature-box__list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
}

.feature-box__list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #334155;
  margin-bottom: 0.75rem;
}

.feature-box__list li:last-child {
  margin-bottom: 0;
}

.feature-box__list i {
  color: #22c55e;
  font-size: 1.25rem;
}

.feature-box__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #2f55d4;
  text-decoration: none;
  transition: gap 0.2s ease;
}

.feature-box__link:hover {
  gap: 0.75rem;
}

.feature-box__link i {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .feature-box {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1.5rem;
  }

  .feature-box--reversed {
    direction: ltr;
  }

  .feature-box__title {
    font-size: 1.5rem;
  }

  .feature-box__image {
    order: -1;
  }
}
</style>
