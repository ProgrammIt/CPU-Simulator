<template>
  <div v-show="isActive" class="tab-panel">
    <slot />
  </div>
</template>

<script setup>
import { inject, computed, onMounted } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});

const selectedTitle = inject('selectedTitle');
const registerTab = inject('registerTab');

const isActive = computed(() => selectedTitle.value === props.title);

onMounted(() => {
  registerTab(props.title);
});
</script>