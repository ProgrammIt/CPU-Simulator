<template>
    <div class="tabs-container">
        <!-- Tab navigation -->
        <ul class="tabs-nav">
            <li
                v-for="title in tabTitles"
                :key="title"
                :class="{ active: title === selectedTitle }"
                @click="selectedTitle = title"
                class="tab-btn"
            >
                {{ title }}
            </li>
        </ul>
        
        <!-- Tab contents -->
        <div class="tab-wrapper">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';

const tabTitles = ref(Array<string>());
const selectedTitle = ref('');

const registerTab = (title: string) => {
  if (!tabTitles.value.includes(title)) {
    tabTitles.value.push(title);
  }
  if (!selectedTitle.value) {
    selectedTitle.value = title;
  }
};

provide('selectedTitle', selectedTitle);
provide('registerTab', registerTab);
</script>

<style scoped lang="css">
.tabs-nav {
    display: flex;
    gap: 2px;
    padding: 4px 4px 0 4px;
    border-bottom: 1px solid #333;
    list-style: none;
}

.tab-btn {
    padding: 6px 16px;
    background-color: var(--background-200);
    color: #888;
    border: none;
    border-radius: var(--br-small) var(--br-small) 0 0;
    cursor: pointer;
    font-family: inherit;
}

.tab-btn:hover {
    background-color: var(--background-100);
    color: var(--text-950);
}

.tab-btn.active {
    background-color: var(--background-100);
    color: var(--text-950);
    border-top: 2px solid rgba(234, 115, 23, 0.8);
}

.tab-wrapper {
    height: 100%;
}
</style>