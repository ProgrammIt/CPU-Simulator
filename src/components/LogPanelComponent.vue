<template>
  <section class="logging" id="log-section" v-show="visible">
    <!-- Klasse 'register' durch 'log-widget' ersetzt zur Vermeidung von Konflikten -->
    <div class="widget log-widget" id="log">
      <div class="lg-text">Log</div>
      <div name="log-content" class="log-content" ref="logContentRef"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  visible: boolean;
}>();

const logContentRef = ref<HTMLElement | null>(null);

function addMessage(message: string): void {
  const el = logContentRef.value;
  if (!el) return;
  el.insertAdjacentElement('beforeend', document.createElement('br'));
  el.insertAdjacentText('beforeend', message);
  el.scrollTop = el.scrollHeight;
}

function clear(): void {
  const el = logContentRef.value;
  if (el) el.textContent = '';
}

defineExpose({ addMessage, clear });
</script>

<style scoped>
/* Der Hauptcontainer für die Logging-Sektion */
.logging {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Die äußere Glassmorphism-Box des Logs */
.log-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
}

/* Der innere scrollbare Textbereich */
.log-content {
  flex: 1;
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;

  /* Modernes Inset-Feld-Design */
  background-color: var(--inset-bg);
  border: 1px solid var(--inset-border);
  border-radius: var(--radius-md);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);

  overflow-y: auto;
  color: var(--text-main);
  font-family: "Courier New", Courier, monospace;
  /* Einheitlicher Terminal-Look */
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: normal;
  word-break: break-all;
}

/* Custom Scrollbar nur für den Log-Inhalt, um ihn noch cleaner zu machen */
.log-content::-webkit-scrollbar {
  width: 6px;
}

.log-content::-webkit-scrollbar-track {
  background: transparent;
}

.log-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
}

.log-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>