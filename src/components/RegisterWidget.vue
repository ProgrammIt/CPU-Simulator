<template>
  <div class="register widget" :class="{ none: hidden }" :id="registerId" @click="handleClick">
    <div class="lg-text">{{ name }}</div>
    <div class="sm-text subtitle">{{ subtitle }}</div>

    <div class="register-value-group">
      <div name="register-content" class="register-content merged-left"
        :class="{ 'register-content--loading': loading }">
        <Transition name="fade" mode="out-in">
          <span v-if="loading" key="spinner" class="loading-spinner" role="status" aria-label="Loading register value"></span>
          <span v-else key="value">{{ content }}</span>
        </Transition>
      </div>

      <select v-if="showSelect" name="register-select-representation"
        title="Switch for changing representation of content" v-model="currentRepresentation" class="merged-right"
        @change="handleRepresentationChange">
        <option :value="NumberSystems.BIN" selected>BIN</option>
        <option :value="NumberSystems.HEX">HEX</option>
        <option :value="NumberSystems.DEC">DEC</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { NumberSystems } from './../../src/types/enumerations/NumberSystems';
import { RegisterNames } from '../types/enumerations/RegisterNumbers';

const props = withDefaults(defineProps<{
  registerId: string;
  name: RegisterNames;
  subtitle: string;
  content: string;
  hidden?: boolean;
  showSelect?: boolean;
  loading?: boolean;
  radix?: NumberSystems;
}>(), {
  hidden: false,
  showSelect: true,
  loading: false,
  radix: NumberSystems.BIN
});

const emit = defineEmits<{
  representationChange: [registerName: RegisterNames, newRep: NumberSystems];
  click: [];
}>();

const currentRepresentation = ref<NumberSystems>(props.radix ?? NumberSystems.BIN);

watch(() => props.radix, (newVal) => {
  if (newVal !== undefined) currentRepresentation.value = newVal;
});

function handleRepresentationChange() {
  emit('representationChange', props.name, currentRepresentation.value);
}

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.getAttribute('name') === 'register-select-representation') return;
  emit('click');
}
</script>

<style scoped>
.register {
  display: flex;
  flex-direction: column;
  min-width: 200px;
  padding: 1.25rem;
}

.subtitle {
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
}

.register-value-group {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color: var(--inset-bg);
  border: 1px solid var(--inset-border);
  border-radius: var(--radius-md);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.register-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  font-family: "Courier New", Courier, monospace;
  font-weight: 600;
  color: var(--accent-green);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  min-height: 2.5rem;
}

.register-content--loading {
  justify-content: center;
}

.merged-right {
  margin: 0;
  width: auto;
  background-color: rgba(255, 255, 255, 0.04);
  border: none;
  border-left: 1px solid var(--glass-border);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--text-muted);
  font-weight: bold;
  cursor: pointer;
  padding: 0 0.5rem 0 0.75rem;
  transition: all 0.2s ease;
}

.merged-right:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-main);
}

.merged-right option {
  background-color: #1e293b;
  color: #f8fafc;
  font-weight: 500;
}

.none {
  display: none;
}
</style>