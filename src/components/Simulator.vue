<template>
    <div class="simulator-widgets">
        <!-- Registers -->
        <section class="registers">
            <h1 class="header sticky-top">Registers</h1>
            <div class="grid">
                <RegisterComponent v-for="reg in registers" :key="reg.name" :register-id="reg.id"
                    :name="reg.name as RegisterNames" :subtitle="reg.subtitle" :content="reg.content"
                    :hidden="reg.hidden" :show-select="reg.showSelect" :loading="registersLoading"
                    :radix="reg.representation" @representation-change="handleRegisterRepresentationChange" />
            </div>
        </section>

        <!-- Virtual RAM -->
        <section class="virtual-ram">
            <h1 class="header sticky-top">Virtual RAM</h1>
            <RAMComponent ref="virtualRAMRef" type="virtual" :auto-scroll-enabled="autoScrollForVirtualRAMEnabled"
                :program-loaded="isProgramLoaded" />
        </section>

        <!-- Physical RAM -->
        <section class="physical-ram">
            <h1 class="header sticky-top">Physical RAM</h1>
            <RAMComponent ref="physicalRAMRef" type="physical" :auto-scroll-enabled="autoScrollForPhysicalRAMEnabled"
                :program-loaded="isProgramLoaded" />
        </section>
    </div>

    <!-- Log output & RAM Search -->
    <div class="output">
        <LogPanelComponent ref="logPanelRef" :visible="logVisible" />

        <div class="search-module widget" id="ram-search">
            <div class="lg-text">RAM-Cell Search</div>
            <div class="search-form-group">
                <input type="text" class="ram-searchfield" v-model="searchInput" placeholder="Address (e.g. 0x0)">
                <select v-model="searchLocation">
                    <option :value="RAMSearchLocation.PHYSICAL">Physical RAM</option>
                    <option :value="RAMSearchLocation.VIRTUAL">Virtual RAM</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import RegisterComponent from './RegisterComponent.vue';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { NumberSystems } from '../types/enumerations/NumberSystems';
import { RegisterNames } from '../types/enumerations/RegisterNumbers';
import RAMComponent from './RAMComponent.vue';
import LogPanelComponent from './LogPanelComponent.vue';

// --- Search locations ---
enum RAMSearchLocation { PHYSICAL = 'PHYSICAL', VIRTUAL = 'VIRTUAL' }

// --- Register definitions ---
interface RegisterDef {
    id: string; name: string; subtitle: string; content: string;
    hidden: boolean; showSelect: boolean; representation: NumberSystems;
}

const isProgramLoaded = ref(false);
const virtualRAMRef = ref<InstanceType<typeof RAMComponent> | null>(null);
const physicalRAMRef = ref<InstanceType<typeof RAMComponent> | null>(null);
const logPanelRef = ref<InstanceType<typeof LogPanelComponent> | null>(null);
const autoScrollForPhysicalRAMEnabled = ref(true);
const autoScrollForVirtualRAMEnabled = ref(true);
const logVisible = ref(true);
const registersLoading = ref(false);
const searchInput = ref('0x0');
const searchLocation = ref<RAMSearchLocation>(RAMSearchLocation.PHYSICAL);
const registers = reactive<RegisterDef[]>([
    { id: RegisterNames.EAX, name: 'EAX', subtitle: 'General Purpose Register', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.EBX, name: 'EBX', subtitle: 'General Purpose Register', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.ECX, name: 'ECX', subtitle: 'General Purpose Register', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.EDX, name: 'EDX', subtitle: 'General Purpose Register', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.FLAGS, name: 'FLAGS', subtitle: 'State Register', content: '11000000', hidden: false, showSelect: false, representation: NumberSystems.BIN },
    { id: RegisterNames.EIP, name: 'EIP', subtitle: 'Instruction Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.EIR, name: 'EIR', subtitle: 'Instruction Register', content: '00000000 00000000 00000000 00000000', hidden: true, showSelect: false, representation: NumberSystems.BIN },
    { id: RegisterNames.ESP, name: 'ESP', subtitle: 'STACK Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.PTP, name: 'PTP', subtitle: 'Page Table Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.ITP, name: 'ITP', subtitle: 'Interrupt Table Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.NPTP, name: 'NPTP', subtitle: 'Nested Page Table Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: RegisterNames.VMPTR, name: 'VMPTR', subtitle: 'Virtual Machine Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
]);

/**
 * Handles the change of the value representation in a register.
 * @param registerName The name of the register.
 * @param newRadix The new representation's radix.
 */
function handleRegisterRepresentationChange(registerName: RegisterNames, newRadix: NumberSystems) {
    console.log(`Register ${registerName} representation changed to:`, newRadix);
    const register = registers.find(r => r.id === registerName);
    if (register) {
        register.representation = newRadix;
    }
}

onMounted(() => {
    
});

onUnmounted(() => {
    
});
</script>

<style scoped lang="css">
.simulator-widgets {
    display: flex;
    flex-direction: row;
    height: calc(100% - 200px);
    gap: 1.5rem;
}

.registers {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    flex: 2;
    min-width: 0;
    overflow: hidden;
}

.virtual-ram,
.physical-ram {
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    flex: 1;
    min-width: 0;
    overflow: hidden;
}

.header.sticky-top {
    width: 100%;
    padding: 1rem 1.5rem;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--glass-border);
    position: sticky;
    top: 0;
    z-index: 10;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    display: block;
    margin: 0;
}

.grid {
    padding: 1.5rem;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    align-content: start;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
}

.output {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    align-items: stretch;
    height: 200px;
    min-height: 150px;
}

.search-module {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 1.25rem;
}

.search-form-group {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
</style>