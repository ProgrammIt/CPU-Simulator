<template>
  <div class="ram-view-container">
    <Transition name="fade">
      <div v-if="isLoading" class="ram-loading" role="status" :aria-label="`Loading ${type} memory cells`">
        <span class="loading-spinner"></span>
        <span>Loading…</span>
      </div>
    </Transition>
    <div class="ram-cells" ref="containerRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { NumberSystems } from '../../src/types/enumerations/NumberSystems';

const HIGH_ADDRESS_PHYSICAL_MEMORY_DEC = 4_294_967_295;

const props = defineProps<{
  type: 'physical' | 'virtual';
  autoScrollEnabled: boolean;
  programLoaded: boolean;
}>();

const containerRef = ref<HTMLElement | null>(null);
const isLoading = ref(true);
const dataAttr = props.type === 'physical' ? 'data-physical-address' : 'data-virtual-address';

let observer: IntersectionObserver | null = null;
let visibleElements: Element[] = [];

// --- Element factory ---------------------------------------------------------
function createRamElement(addressHex: string, binaryContent: string): HTMLElement {
  const outer = document.createElement('div');
  outer.setAttribute('class', 'ram-cell widget');
  outer.setAttribute('id', `${props.type}-ram-cell-${addressHex}`);
  outer.setAttribute(dataAttr, addressHex);

  const label = document.createElement('label');
  label.setAttribute('class', 'lg-text');
  label.innerHTML = addressHex;

  const content = document.createElement('div');
  content.setAttribute('class', 'ram-cell-content');
  content.setAttribute('name', 'ram-cell-content');
  content.innerText = binaryContent;

  outer.appendChild(label);
  outer.appendChild(content);
  return outer;
}

// --- Memory read helpers ------------------------------------------------------
async function readCell(addr: number): Promise<string> {
  if (props.type === 'physical') {
    const raw: number = await (window as any).mainMemory.readFromPhysicalMemory(addr);
    return raw.toString(2).padStart(8, '0');
  } else {
    const raw: number | undefined = await (window as any).mainMemory.readFromVirtualMemory(addr);
    return raw === undefined ? 'Not Mapped' : raw.toString(2).padStart(8, '0');
  }
}

async function readRange(from: number, to: number): Promise<Map<number, number | undefined>> {
  if (props.type === 'physical') {
    return (window as any).mainMemory.readRangeFromPhysicalMemory(from, to);
  } else {
    return (window as any).mainMemory.readRangeFromVirtualMemory(from, to);
  }
}

// --- Observer logic -----------------------------------------------------------
async function observerCallback(entries: IntersectionObserverEntry[]): Promise<void> {
  const container = containerRef.value;
  if (!container) return;

  for (const entry of entries) {
    if (entry.isIntersecting && entry.rootBounds !== null) {
      const fromTop = entry.intersectionRect.top;
      const fromBottom = entry.rootBounds.height - entry.intersectionRect.bottom;

      if (entry.target.isEqualNode(container.firstElementChild) && fromTop < fromBottom) {
        const addrHex = entry.target.getAttribute(dataAttr)!;
        const nextAddr = parseInt(addrHex, 16) + 1;
        if (nextAddr < Math.pow(2, 32)) {
          const content = await readCell(nextAddr);
          const el = createRamElement('0x' + nextAddr.toString(16), content);
          observer!.observe(el);
          container.insertBefore(el, container.firstElementChild);
          visibleElements.unshift(el);
          observer!.unobserve(container.lastElementChild!);
          visibleElements.splice(visibleElements.indexOf(container.lastElementChild!), 1);
          container.removeChild(container.lastElementChild!);
        }
      }

      if (entry.target.isEqualNode(container.lastElementChild) && fromTop > fromBottom) {
        const addrHex = entry.target.getAttribute(dataAttr)!;
        const nextAddr = parseInt(addrHex, 16) - 1;
        if (nextAddr >= 0) {
          const content = await readCell(nextAddr);
          const el = createRamElement('0x' + nextAddr.toString(16), content);
          observer!.observe(el);
          container.appendChild(el);
          visibleElements.push(el);
          observer!.unobserve(container.firstElementChild!);
          visibleElements.splice(visibleElements.indexOf(container.firstElementChild!), 1);
          container.removeChild(container.firstElementChild!);
        }
      }
    }
  }
}

function clearContainer(): void {
  const container = containerRef.value;
  if (!container) return;
  container.innerHTML = '';
  observer?.disconnect();
  visibleElements = [];
}

async function init(firstAddrDec = 0x0, lastAddrDec = 0x1e): Promise<void> {
  const container = containerRef.value;
  if (!container) return;
  isLoading.value = true;
  clearContainer();
  const cells = await readRange(firstAddrDec, lastAddrDec);
  for (const [addr, raw] of Array.from(cells).reverse()) {
    const content = raw === undefined ? 'Not Mapped' : raw.toString(2).padStart(8, '0');
    const el = createRamElement('0x' + addr.toString(16), content);
    container.appendChild(el);
    visibleElements.push(el);
    observer?.observe(el);
  }
  container.querySelector(`[${dataAttr}="${'0x' + firstAddrDec.toString(16)}"]`)?.scrollIntoView();
  isLoading.value = false;
}

async function jumpTo(address: string, radix: NumberSystems): Promise<void> {
  const container = containerRef.value;
  if (!container) return;
  let addrHex = address;
  if (radix === NumberSystems.DEC) addrHex = `0x${parseInt(address, 10).toString(16)}`;
  else if (radix === NumberSystems.BIN) addrHex = `0x${parseInt(address.replace(/\s+/g, ''), 2).toString(16)}`;

  for (const el of document.querySelectorAll('div[data-physical-address], div[data-virtual-address]')) {
    el.classList.remove('highlighted');
  }

  let element: Element | null = container.querySelector(`[${dataAttr}="${addrHex}"]`);
  if (props.autoScrollEnabled && props.programLoaded && element === null) {
    let first = parseInt(addrHex, 16) - 15;
    let last = parseInt(addrHex, 16) + 14;
    await init(Math.max(0, first), Math.min(last, HIGH_ADDRESS_PHYSICAL_MEMORY_DEC));
    element = container.querySelector(`[${dataAttr}="${addrHex}"]`);
  }
  element?.scrollIntoView();
  element?.classList.add('highlighted');
}

defineExpose({ init, jumpTo });

onMounted(async () => {
  observer = new IntersectionObserver(observerCallback, { root: null, rootMargin: '0px', threshold: 0 });
  await init();
});

onUnmounted(() => { observer?.disconnect(); observer = null; });
</script>

<style scoped>
.ram-view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.ram-cells {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ram-cell {
  padding: 0.5rem 1rem;
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 1rem;
}

.ram-cell label {
  margin: 0;
  font-family: "Courier New", Courier, monospace;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.ram-cell-content {
  padding: 0.5rem 1rem;
  font-family: "Courier New", Courier, monospace;
  font-weight: 600;
  color: var(--accent-green);
  background-color: var(--inset-bg);
  border: 1px solid var(--inset-border);
  border-radius: var(--radius-md);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.ram-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: var(--text-muted);
}
</style>