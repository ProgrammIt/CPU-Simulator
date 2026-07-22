<template>
    <header>
        <div class="top-bar">
            <menu class="controls">
                <li>
                    <button v-if="isProgramLoaded" class="btn-next-cycle" @click="triggerNextCycle">
                        <img :src="cycleSvgUrl" id="next_cycle" title="Triggers execution of the next instruction"
                            alt="Button for triggering the next instruction cycle">
                        <span>Next instruction (F5)</span>
                    </button>
                </li>
            </menu>
            <nav class="tabs">
                <button class="tab-btn" :class="{ active: activeTab === 'simulator' }" @click="activeTab = 'simulator'">
                    Simulator
                </button>
                <button class="tab-btn" :class="{ active: activeTab === 'editor' }" @click="activeTab = 'editor'">
                    Code-Editor
                </button>
            </nav>
        </div>
    </header>

    <main>
        <KeepAlive>
            <div class="tab-wrapper">

                <!-- SIMULATOR TAB CONTENT -->
                <div class="tab-content" v-show="activeTab === 'simulator'">
                    <div class="simulator-widgets">
                        <!-- Registers -->
                        <section class="registers">
                            <h1 class="header sticky-top">Registers</h1>
                            <div class="grid">
                                <RegisterWidget v-for="reg in registers" :key="reg.id" :register-id="reg.id"
                                    :name="reg.name" :subtitle="reg.subtitle" :content="reg.content"
                                    :hidden="reg.hidden" :show-select="reg.showSelect" :loading="registersLoading"
                                    :representation="reg.representation" />
                            </div>
                        </section>

                        <!-- Virtual RAM -->
                        <section class="virtual-ram">
                            <h1 class="header sticky-top">Virtual RAM</h1>
                            <RAMView ref="virtualRAMRef" type="virtual"
                                :auto-scroll-enabled="autoScrollForVirtualRAMEnabled"
                                :program-loaded="isProgramLoaded" />
                        </section>

                        <!-- Physical RAM -->
                        <section class="physical-ram">
                            <h1 class="header sticky-top">Physical RAM</h1>
                            <RAMView ref="physicalRAMRef" type="physical"
                                :auto-scroll-enabled="autoScrollForPhysicalRAMEnabled"
                                :program-loaded="isProgramLoaded" />
                        </section>
                    </div>

                    <!-- Log output & RAM Search -->
                    <div class="output">
                        <LogPanel ref="logPanelRef" :visible="logVisible" />

                        <div class="search-module widget" id="ram-search">
                            <div class="lg-text">RAM-Cell Search</div>
                            <div class="search-form-group">
                                <input type="text" class="ram-searchfield" v-model="searchInput"
                                    placeholder="Address (e.g. 0x0)">
                                <select v-model="searchLocation">
                                    <option :value="RAMSearchLocation.PHYSICAL">Physical RAM</option>
                                    <option :value="RAMSearchLocation.VIRTUAL">Virtual RAM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- EDITOR TAB -->
                <div class="tab-content" v-show="activeTab === 'editor'">
                    <CodeEditor :path="pathToLoadedProgram" :file-name="loadedFileName" :file-content="loadedFileContents"/>
                </div>
            </div>
        </KeepAlive>
    </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import cycleSvgUrl from './../assets/icons/web/cycle.svg';
import RegisterWidget from './components/RegisterWidget.vue';
import RAMView from './components/RAMView.vue';
import LogPanel from './components/LogPanel.vue';
import CodeEditor from './components/CodeEditor.vue';
import { NumberSystems } from './../src/types/enumerations/NumberSystems';

// --- Tab State ---
const activeTab = ref<'simulator' | 'editor'>('simulator');

// --- Search locations ---
enum RAMSearchLocation { PHYSICAL = 'PHYSICAL', VIRTUAL = 'VIRTUAL' }

// --- Register definitions ---
interface RegisterDef {
    id: string; name: string; subtitle: string; content: string;
    hidden: boolean; showSelect: boolean; representation: NumberSystems;
}

enum Register {
    EAX = 'eax',
    EBX = 'ebx',
    ECX = 'ecx',
    EDX = 'edx',
    FLAGS = 'flags',
    EIP = 'eip',
    EIR = 'eir',
    ESP = 'esp',
    PTP = 'ptp',
    GPTP = 'gptp',
    ITP = 'itp',
    NPTP = 'nptp',
    VMPTR = 'vmptr'
}

// --- State ---
const isProgramLoaded = ref(false);
const pathToLoadedProgram = ref<string>('');
const loadedFileName = ref<string>('Untitled.asm');
const loadedFileContents = ref<string>('; Your code here.\n.DATA\n\n.CODE\n.START:\n');
const autoScrollForPhysicalRAMEnabled = ref(true);
const autoScrollForVirtualRAMEnabled = ref(true);
const logVisible = ref(true);
const registersLoading = ref(false);
const searchInput = ref('0x0');
const searchLocation = ref<RAMSearchLocation>(RAMSearchLocation.PHYSICAL);

const virtualRAMRef = ref<InstanceType<typeof RAMView> | null>(null);
const physicalRAMRef = ref<InstanceType<typeof RAMView> | null>(null);
const logPanelRef = ref<InstanceType<typeof LogPanel> | null>(null);

const registers = reactive<RegisterDef[]>([
    { id: Register.EAX, name: 'EAX', subtitle: 'General Purpose Register', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.EBX, name: 'EBX', subtitle: 'General Purpose Register', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.ECX, name: 'ECX', subtitle: 'General Purpose Register', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.EDX, name: 'EDX', subtitle: 'General Purpose Register', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.FLAGS, name: 'FLAGS', subtitle: 'State Register', content: '11000000', hidden: false, showSelect: false, representation: NumberSystems.BIN },
    { id: Register.EIP, name: 'EIP', subtitle: 'Instruction Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.EIR, name: 'EIR', subtitle: 'Instruction Register', content: '00000000 00000000 00000000 00000000', hidden: true, showSelect: false, representation: NumberSystems.BIN },
    { id: Register.ESP, name: 'ESP', subtitle: 'STACK Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.PTP, name: 'PTP', subtitle: 'Page Table Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.GPTP, name: 'GPTP', subtitle: 'Guest Page Table Pointer', content: '00000000 00000000 00000000 00000000', hidden: true, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.ITP, name: 'ITP', subtitle: 'Interrupt Table Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.NPTP, name: 'NPTP', subtitle: 'Nested Page Table Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
    { id: Register.VMPTR, name: 'VMPTR', subtitle: 'Virtual Machine Pointer', content: '00000000 00000000 00000000 00000000', hidden: false, showSelect: true, representation: NumberSystems.BIN },
]);

/**
 * Triggers the execution of the next instruction cycle in the simulator.
 */
function triggerNextCycle() {
    console.log('Next cycle triggered!');
}

/**
 * Handles the global keydown event.
 * @param event The keyboard event object.
 */
function handleGlobalKeydown(event: KeyboardEvent) {
    if (event.key === 'F5') {
        event.preventDefault();
        triggerNextCycle();
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<style lang="css" scoped>
header {
    padding: 1rem 2rem 0 2rem;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--glass-border);
    z-index: 10;
}

.top-bar {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

menu.controls {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    align-items: center;
    height: auto;
}

.tabs {
    display: flex;
    gap: 0.25rem;
    align-items: flex-end;
    padding-top: 0.5rem;
}

.tab-btn {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--glass-border);
    border-bottom: none;
    color: var(--text-muted);
    padding: 0.6rem 1.75rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    border-top-left-radius: var(--radius-md);
    border-top-right-radius: var(--radius-md);
    position: relative;
    top: 1px;
}

.tab-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-main);
}

.tab-btn.active {
    background: rgba(15, 23, 42, 0.6);
    color: var(--accent-primary);
    border-color: var(--glass-border);
    font-weight: bold;
    padding-top: 0.7rem;
}

.btn-next-cycle {
    background: linear-gradient(135deg, rgba(234, 115, 23, 0.8), rgba(210, 95, 10, 0.9));
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 4px 15px rgba(234, 115, 23, 0.3);
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    height: 32px;
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    transition: all 0.3s ease;
}

.btn-next-cycle img {
    width: 1rem;
    height: 1rem;
    transition: transform 0.5s ease;
}

main {
    padding: 1rem;
    height: calc(100vh - 120px);
    display: flex;
    flex-direction: column;
}

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