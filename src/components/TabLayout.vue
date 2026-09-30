<template>
    <div class="tab-wrapper">
        <slot v-for="(tab, index) in $slots.default" :key="index" class="tab-content"></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'TabLayout',
});
</script>

<style scoped>
.tab-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.tab-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 1rem;
    overflow: hidden;
}
</style>