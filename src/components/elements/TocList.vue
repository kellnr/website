<script setup lang="ts">
export interface TocItem {
  label: string;
  hash: string;
  children?: TocItem[];
}

defineProps<{
  items: TocItem[];
}>();

const emit = defineEmits<{
  navigate: [];
}>();
</script>

<template>
  <ul class="toc-list">
    <li v-for="item in items" :key="item.hash">
      <router-link :to="item.hash" @click="emit('navigate')">{{ item.label }}</router-link>
      <ul v-if="item.children">
        <li v-for="child in item.children" :key="child.hash">
          <router-link :to="child.hash" @click="emit('navigate')">{{ child.label }}</router-link>
        </li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 0.25rem;
}

.toc-list a {
  color: #495057;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

.toc-list a:hover {
  color: #2f55d4;
}

.toc-list ul {
  list-style: none;
  padding-left: 1rem;
  margin: 0;
}

.toc-list ul a {
  font-size: 0.85rem;
  color: #6c757d;
}

.toc-list ul a:hover {
  color: #2f55d4;
}
</style>
