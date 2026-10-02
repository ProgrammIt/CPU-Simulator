<template>
    <header>
        <div class="top-bar">
            <menu class="controls">
                <li>
                    <button class="btn-next-cycle" @click="triggerNextCycle">
                        <img :src="cycleSvgUrl" id="next_cycle" title="Triggers execution of the next instruction"
                            alt="Button for triggering the next instruction cycle">
                        <span>Next instruction (F5)</span>
                    </button>
                </li>
            </menu>
        </div>
    </header>
    <main>
        <KeepAlive>
            <TabLayout ref="tabLayoutRef">
                <Tab title="Simulator">
                    <Simulator />
                </Tab>
                <Tab title="Editor">
                    <CodeEditorComponent :path="pathToLoadedProgram" :file-name="loadedFileName"
                        :file-content="loadedFileContents" />
                </Tab>
                <Tab v-for="tab in dynamicTabs" :key="tab.id" :title="tab.title">
                    <component :is="tab.component" v-bind="tab.props" />
                </Tab>
            </TabLayout>
        </KeepAlive>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, shallowRef } from 'vue';
import cycleSvgUrl from './../assets/icons/web/cycle.svg';
import CodeEditorComponent from './components/CodeEditorComponent.vue';
import Simulator from './components/Simulator.vue';
import TabLayout from './components/TabLayout.vue';
import Tab from './components/Tab.vue';
import ConsoleComponent from './components/ConsoleComponent.vue';

// --- Refs ---
const dynamicTabs = ref<Array<{
    id: string;
    title: string;
    component: any;
    props?: Record<string, any>;
}>>([]);
const numberTabs = ref(2);
const isProgramLoaded = ref(false);
const pathToLoadedProgram = ref<string>('');
const loadedFileName = ref<string>('Untitled.asm');
const loadedFileContents = ref<string>('; Your code here.\n.DATA\n\n.CODE\n.START:\n');

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

/**
 * Adds a new tab to the tab layout.
 * @param tabTitle The title of the new tab.
 * @param tabComponent The Vue component to be rendered inside the new tab.
 * @param tabProps Optional props to be passed to the tab component.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
function addTab(tabTitle: string, tabComponent: any, tabProps: Record<string, any> = {}) {
    const newTabId = numberTabs.value++;
    dynamicTabs.value.push({
        id: `${newTabId}`,
        title: tabTitle,
        component: shallowRef(tabComponent), 
        props: tabProps
    });
}

/**
 * Removes a tab from the tab layout.
 * @param tabName The name of the tab to be removed.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
function removeTab(tabId: string) {
    const tabIndex = dynamicTabs.value.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {
        dynamicTabs.value.splice(tabIndex, 1);
    }
}

/**
 * Handles the creation of a new console.
 * @param consoleId The ID of the newly created console.
 * @param consoleName The name of the newly created console.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
function handleCreateConsole(consoleId: number, consoleName: string) {
    addTab(`${consoleName}`, ConsoleComponent);
    window.simulator.createdConsole(consoleId);
}

/**
 * Handles the closure of an existing console.
 * @param consoleId The ID of the console that was closed.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
function handleCloseConsole(consoleId: number, consoleName: string) {
    removeTab(`${consoleName}`);
    window.simulator.closedConsole(consoleId);
}

onMounted(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.addEventListener('keydown', handleGlobalKeydown);
    window.simulator.onCreateConsole(handleCreateConsole);
    window.simulator.onCloseConsole(handleCloseConsole);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<style lang="css">
:root {
    --br-small: 5px;
    --br-large: 15px;
    --br-medium: 10px;
}

:root[data-theme="light"] {
  --text-50: #ecf1f8;
  --text-100: #d9e3f2;
  --text-200: #b3c8e5;
  --text-300: #8dacd8;
  --text-400: #6791cb;
  --text-500: #4175be;
  --text-600: #345e98;
  --text-700: #274672;
  --text-800: #1a2f4c;
  --text-900: #0d1726;
  --text-950: #070c13;

  --background-50: #eef1f6;
  --background-100: #dde4ee;
  --background-200: #bbc8dd;
  --background-300: #99adcc;
  --background-400: #7791bb;
  --background-500: #5576aa;
  --background-600: #445e88;
  --background-700: #334766;
  --background-800: #222f44;
  --background-900: #111822;
  --background-950: #090c11;

  --primary-50: #e6f0ff;
  --primary-100: #cce1ff;
  --primary-200: #9ac4fe;
  --primary-300: #67a6fe;
  --primary-400: #3488fe;
  --primary-500: #016afe;
  --primary-600: #0155cb;
  --primary-700: #014098;
  --primary-800: #012b65;
  --primary-900: #001533;
  --primary-950: #000b19;

  --secondary-50: #eeecf8;
  --secondary-100: #ddd9f2;
  --secondary-200: #bbb3e5;
  --secondary-300: #9a8dd8;
  --secondary-400: #7867cb;
  --secondary-500: #5641be;
  --secondary-600: #453498;
  --secondary-700: #342772;
  --secondary-800: #221a4c;
  --secondary-900: #110d26;
  --secondary-950: #090713;

  --accent-50: #ffede6;
  --accent-100: #fedbcd;
  --accent-200: #feb69a;
  --accent-300: #fd9268;
  --accent-400: #fd6e35;
  --accent-500: #fc4903;
  --accent-600: #ca3b02;
  --accent-700: #972c02;
  --accent-800: #651d01;
  --accent-900: #320f01;
  --accent-950: #190700;

}
:root[data-theme="dark"] {
  --text-50: #060c13;
  --text-100: #0d1826;
  --text-200: #19304d;
  --text-300: #264973;
  --text-400: #336199;
  --text-500: #4079bf;
  --text-600: #6694cc;
  --text-700: #8cafd9;
  --text-800: #b3c9e6;
  --text-900: #d9e4f2;
  --text-950: #ecf2f9;

  --background-50: #090c11;
  --background-100: #111822;
  --background-200: #222f44;
  --background-300: #334766;
  --background-400: #445e88;
  --background-500: #5576aa;
  --background-600: #7791bb;
  --background-700: #99adcc;
  --background-800: #bbc8dd;
  --background-900: #dde4ee;
  --background-950: #eef1f6;

  --primary-50: #000b19;
  --primary-100: #001533;
  --primary-200: #012b65;
  --primary-300: #014098;
  --primary-400: #0155cb;
  --primary-500: #016afe;
  --primary-600: #3488fe;
  --primary-700: #67a6fe;
  --primary-800: #9ac4fe;
  --primary-900: #cce1ff;
  --primary-950: #e6f0ff;

  --secondary-50: #090713;
  --secondary-100: #110d26;
  --secondary-200: #221a4c;
  --secondary-300: #342772;
  --secondary-400: #453498;
  --secondary-500: #5641be;
  --secondary-600: #7867cb;
  --secondary-700: #9a8dd8;
  --secondary-800: #bbb3e5;
  --secondary-900: #ddd9f2;
  --secondary-950: #eeecf8;

  --accent-50: #190700;
  --accent-100: #320f01;
  --accent-200: #651d01;
  --accent-300: #972c02;
  --accent-400: #ca3b02;
  --accent-500: #fc4903;
  --accent-600: #fd6e35;
  --accent-700: #fd9268;
  --accent-800: #feb69a;
  --accent-900: #fedbcd;
  --accent-950: #ffede6;

}

@font-face {
    font-family: "BDO Grotesk";
    src: url("./../../assets/fonts/BDOGrotesk-VF.woff2") format("woff2");
}

* {
    font-family: "BDO Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--text-950);
}

html,
body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}

body {
    display: flex;
    flex-direction: column;
    background-color: var(--background-300);
}

header {
    padding: 1rem;
    background: var(--background-200);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--glass-border);
    z-index: 1;
}

input[type="text"],
select {
    padding: 0.5rem 0.75rem;
    border-radius: var(--radius-sm);
    background-color: var(--inset-bg);
    border: 1px solid var(--glass-border);
    color: var(--text-main);
    font-family: inherit;
    transition: all 0.2s ease;
    outline: none;
}

input[type="text"]:focus,
select:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 2px var(--accent-glow);
}

select option {
    background-color: var(--bg-gradient-end);
    color: var(--text-main);
    font-weight: normal;
}

/* Scrollbars */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: var(--radius-md);
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}

/* Custom classes. */
.widget {
    position: relative;
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--glass-shadow);
}

/* Animations and highlights */
.highlighted {
    border: 1px solid var(--accent-primary);
    box-shadow: 0 0 15px var(--accent-glow), inset 0 0 10px var(--accent-glow);
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-spinner {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

<style lang="css" scoped>
menu.controls {
    margin: 0;
    padding: 0;
    list-style-type: none;
    display: flex;
    align-items: center;
    height: auto;
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
</style>