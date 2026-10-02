<template>
    <div class="editor-layout">
        <nav class="editor-nav">
            <button class="nav-item" @click="handleOpenFile()">Open</button>
            <button class="nav-item" @click="handleSaveFile()">Save</button>
            <button class="nav-item" @click="currentFilePath = ''; handleSaveFile()">Save As...</button>
            <button v-if="!isProgramLoaded" class="nav-item nav-item-action"
                @click="handleUploadProgram()">
                Upload program
            </button>
        </nav>
        <h2 class="document-title">{{ currentFileName }}<span class="dirty-indicator" v-if="isDirty">*</span></h2>
        <div class="editor-view">
            <div ref="editorContainer" class="cm-editor-wrapper"></div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { EditorView, keymap, lineNumbers, highlightActiveLine, Decoration, DecorationSet } from '@codemirror/view';
import { EditorState, StateField, StateEffect, Compartment } from '@codemirror/state';
import { defaultKeymap, history, historyKeymap, insertTab } from '@codemirror/commands';
import { bracketMatching, StreamLanguage, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { autocompletion, CompletionContext, Completion, snippet, nextSnippetField, prevSnippetField } from '@codemirror/autocomplete';
import { tags as t } from '@lezer/highlight';
import languageDef from '../../settings/language_definition.json';
import { OperandTypeNames } from '../types/enumerations/OperandTypes';

const props = defineProps<{
    path: string;
    fileName: string;
    fileContent: string;
}>();

const isProgramLoaded = ref(false);
const currentFileName = ref(props.path ? props.path.split('/').pop() : "Untitled");
const currentFilePath = ref(props.path ?? "");
const isDirty = ref(false);
const editorContainer = ref<HTMLElement | null>(null);
const setHighlightedLine = StateEffect.define<number | null>();
const lineHighlightMark = Decoration.line({
    class: 'cm-programmatic-highlight'
});
const lineHighlightField = StateField.define<DecorationSet>({
    create() {
        return Decoration.none;
    },
    update(decorations, tr) {
        decorations = decorations.map(tr.changes);

        for (let e of tr.effects) {
            if (e.is(setHighlightedLine)) {
                if (e.value === null) return Decoration.none;
                if (e.value > 0 && e.value <= tr.state.doc.lines) {
                    const line = tr.state.doc.line(e.value);
                    return Decoration.set([lineHighlightMark.range(line.from)]);
                }
            }
        }
        return decorations;
    },
    provide: f => EditorView.decorations.from(f)
});
const currentFontSize = ref(16);
const themeCompartment = new Compartment();
let view: EditorView | null = null;

/**
 * Returns the prefix for an operand based on its type.
 * @param type The name of the operands type.
 * @returns The prefix string for the operand.
 */
function getOperandPrefix(type: OperandTypeNames): string {
    switch (type) {
        case OperandTypeNames.REGISTER_INDIRECT: return "*%";
        case OperandTypeNames.REGISTER_DIRECT: return "%";
        case OperandTypeNames.IMMEDIATE_HEXADECIMAL: return "$0x";
        case OperandTypeNames.IMMEDIATE_BINARY: return "$0b";
        case OperandTypeNames.IMMEDIATE_DECIMAL: return "$";
        case OperandTypeNames.MEMORY_ADDRESS_HEXADECIMAL: return "@0x";
        case OperandTypeNames.MEMORY_ADDRESS_BINARY: return "@0b";
        case OperandTypeNames.MEMORY_ADDRESS_DECIMAL: return "@";
        default: return "";
    }
}

/**
 * Returns the display string for an operand based on its type.
 * @param type The name of the operands type.
 * @returns The display string for the operand.
 */
function getOperandDisplay(type: OperandTypeNames): string {
    switch (type) {
        case OperandTypeNames.REGISTER_INDIRECT: return "*%REG";
        case OperandTypeNames.REGISTER_DIRECT: return "%REG";
        case OperandTypeNames.IMMEDIATE_HEXADECIMAL: return "$0xVAL";
        case OperandTypeNames.IMMEDIATE_BINARY: return "$0bVAL";
        case OperandTypeNames.IMMEDIATE_DECIMAL: return "$VAL";
        case OperandTypeNames.MEMORY_ADDRESS_HEXADECIMAL: return "@0xADDR";
        case OperandTypeNames.MEMORY_ADDRESS_BINARY: return "@0bADDR";
        case OperandTypeNames.MEMORY_ADDRESS_DECIMAL: return "@ADDR";
        case OperandTypeNames.LABEL: return "LABEL";
        default: return "OP";
    }
}

/**
 * Replaces the entire content of the editor with the provided new text.
 * @param newText The new text to set as the content of the editor.
 */
function setEditorContent(newText: string) {
    if (!view) return;
    view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: newText }
    });
}

/**
 * Returns the current content of the editor as a string.
 * @returns The current content of the editor.
 */
function getEditorContent(): string {
    if (!view) return '';
    return view.state.doc.toString();
}

/**
 * Builds the list of completions for the assembler language based on the language 
 * definition. This includes instructions, registers, and static directives.
 * @returns An array of Completion objects for the assembler language.
 */
function buildCompletions(): Completion[] {
    const completions: Completion[] = [];

    // Create completions for each instruction in the language definition.
    languageDef.instructions.forEach(inst => {
        // 1. Handle instructions with NO operands (e.g., NOP, RET)
        if (!inst.operands || inst.operands.length === 0) {
            completions.push({
                label: inst.mnemonic,
                type: "keyword",
                info: `Opcode: ${inst.opcode}\nType: ${inst.type}`
            });
            return;
        }

        // 2. Handle instructions WITH operands (recursive combination generator)
        const illegalRules = inst.illegal_combinations_of_operand_types || [];

        // Define a function to check if the current assignment of operand types is illegal.
        const isIllegal = (currentAssignment: Record<string, string>) => {
            return illegalRules.some(rule => {
                // Converts the rule object into an array of [key, value] pairs.
                const entry = Object.entries(rule);
                /*
                 * Check if every key-value pair (one for __SOURCE__ and one for __TARGET__) in the 
                 * rule matches the current assignment.
                 */ 
                return entry.every(([reqName, reqType]) => currentAssignment[reqName] === reqType);
            });
        };

        // Recursive function to generate valid combinations of operand types.
        const generateValidCompletions = (
            operandIndex: number,
            currentAssignment: Record<string, string>,
            currentTypes: string[]
        ) => {
            if (operandIndex === inst.operands!.length) {
                const displayParts = currentTypes.map(t => getOperandDisplay(t as OperandTypeNames));
                const snippetParts = currentTypes.map((t, idx) => `${getOperandPrefix(t as OperandTypeNames)}\${${idx + 1}}`);

                completions.push({
                    label: `${inst.mnemonic} ${displayParts.join(", ")}`,
                    type: "function",
                    detail: currentTypes.map(t => t.replace(/_/g, ' ')).join(" | "),
                    apply: snippet(`${inst.mnemonic} ${snippetParts.join(", ")}`),
                    info: `Opcode: ${inst.opcode}\nType: ${inst.type}`
                });
                return;
            }

            // Get the current operand and its allowed types.
            const currentOperand = inst.operands![operandIndex];

            // Iterate through each allowed type for the current operand.
            for (const type of currentOperand.allowed_types) {
                /*
                 * Create a new assignment object that includes the current operand's 
                 * name and the type being considered.
                 */
                const nextAssignment = { ...currentAssignment, [currentOperand.name]: type };
              
                /*
                 * Check if the current assignment of operand types is illegal and 
                 * skip it if so. 
                 */
                if (isIllegal(nextAssignment)) continue;

                /*
                 * Push current type to the list of currently considered types.
                 * This list is used to determine, whether the current combination
                 * of operand types is valid.
                 */
                currentTypes.push(type);

                // Recursively generate valid completions for the next operand.
                generateValidCompletions(operandIndex + 1, nextAssignment, currentTypes);

                /*
                 * Remove the last operand type from the list in order to consider the 
                 * next type.
                 */
                currentTypes.pop();
            }
        };

        // Start the recursive generation of valid completions for the current instruction.
        generateValidCompletions(0, {}, []);
    });

    // Create completions for each register in the language definition.
    languageDef.addressable_registers.forEach(reg => {
        completions.push({ label: `%${reg.name}`, type: "enum", detail: "Register", info: reg.code });
        completions.push({ label: `*%${reg.name}`, type: "enum", detail: "Indirect Register", info: reg.code });

        if (reg.aliases) {
            reg.aliases.forEach(alias => {
                completions.push({ label: `%${alias}`, type: "enum", detail: `Alias for ${reg.name}` });
                completions.push({ label: `*%${alias}`, type: "enum", detail: `Indirect Alias for ${reg.name}` });
            });
        }
    });

    // Create completions for other assembler directives.
    completions.push({ label: ".CONST", type: "constant", detail: "Directive", apply: snippet(".CONST \${1:NAME} \${2:VALUE}")});
    completions.push({ label: ".CODE", type: "keyword", detail: "Code segment" });
    completions.push({ label: ".DATA", type: "keyword", detail: "Data segment" });
    completions.push({ label: ".INCLUDE", type: "keyword", detail: "Include file", apply: snippet(".INCLUDE \${1:FILE}") });

    return completions;
};

const assemblerCompletionsList = buildCompletions();

// --- 2. Die Autocomplete-Provider-Funktion ---
function assemblerAutocompleteProvider(context: CompletionContext) {
    const line = context.state.doc.lineAt(context.pos);
    const textBeforeCursor = line.text.slice(0, context.pos - line.from);
    if (textBeforeCursor.includes(';')) {
        return null;
    }

    let word = context.matchBefore(/[.*%$@a-zA-Z0-9_]+/);
    if (!word || (word.from === word.to && !context.explicit)) return null;

    if (word.text.startsWith('$')) {
        return null;
    }

    const dynamicCompletions = getDynamicCompletions(context.state);

    return {
        from: word.from,
        options: [...assemblerCompletionsList, ...dynamicCompletions]
    };
}

// --- 3. Tokenizer für das Syntax-Highlighting ---
const instructionSet = new Set(languageDef.instructions.map(i => i.mnemonic.toUpperCase()));

const assemblerTokenizer = StreamLanguage.define({
    token(stream) {
        if (stream.eatSpace()) return null;
        if (stream.match(/^;.*/)) return "comment";
        if (stream.match(/^\.(DATA|CODE|INCLUDE)\b/i)) return "meta";

        // Definitions of constants.
        if (stream.match(/^\.CONST\b/i)) return "meta";

        // Definition of labels (with colon at start and double colon at the end).
        if (stream.match(/^\.[a-zA-Z_][a-zA-Z0-9_-]*:/)) return "labelDef";

        // Definition of variables (without double colon).
        if (stream.match(/^\.[a-zA-Z_][a-zA-Z0-9_-]*/)) return "varDef";

        // Register
        if (stream.match(/^\*?%[a-zA-Z]+/)) return "register";

        if (stream.match(/^[$@]?-?0x[0-9a-fA-F]+/)) return "number";
        if (stream.match(/^[$@]?-?0b[01]+/)) return "number";
        if (stream.match(/^[$@]?-?\d+/)) return "number";
        if (stream.match(/^".*?"/)) return "string";

        if (stream.match(/^\$[a-zA-Z_][a-zA-Z0-9_-]*/)) return "derefUsage";
        if (stream.match(/^@[a-zA-Z_][a-zA-Z0-9_-]*/)) return "addrUsage";

        const match = stream.match(/^[a-zA-Z_][a-zA-Z0-9_-]*/);
        if (match) {
            if (instructionSet.has(match[0].toUpperCase())) return "keyword";
            // Usage of labels (f. e. "JL START")
            return "labelUsage";
        }

        stream.next(); return null;
    },
    tokenTable: {
        labelDef: t.labelName,
        labelUsage: t.labelName,
        varDef: t.definition(t.variableName),
        derefUsage: t.constant(t.variableName),
        addrUsage: t.special(t.variableName),
        register: t.variableName
    }
});

const customThemeHighlighting = HighlightStyle.define([
    { tag: t.comment, color: "var(--syn-comment)", fontStyle: "italic" },
    { tag: t.keyword, color: "var(--syn-keyword)", fontWeight: "bold" },
    { tag: t.variableName, color: "var(--syn-register)" },
    { tag: t.number, color: "var(--syn-number)" },
    { tag: t.string, color: "var(--syn-string)" },
    { tag: t.meta, color: "var(--syn-directive)", fontWeight: "bold" },
    { tag: t.labelName, color: "var(--syn-label)" },
    { tag: t.definition(t.variableName), color: "var(--syn-variable)" },
    { tag: t.special(t.variableName), color: "var(--syn-variable)" },
    { tag: t.constant(t.variableName), color: "var(--syn-constant)" },
    { tag: t.name, color: "var(--syn-text)" }
]);

/**
 * Searches the current document for labels, constants, and variables, and 
 * returns them as a list of completions.
 * @param state The current editor state.
 * @returns An array of Completion objects for the found labels, constants, and variables.
 */
function getDynamicCompletions(state: EditorState): Completion[] {
    const text = state.doc.toString();
    const dynamicCompletions: Completion[] = [];
    const found = new Set<string>(); // Prevents duplicate entries

    // 1. Find labels (e.g., "START:")
    // Searches at the beginning of the line for words ending with a colon
    const labelRegex = /^[ \t]*\.([a-zA-Z_][a-zA-Z0-9_-]*):/gm;
    let match;
    while ((match = labelRegex.exec(text)) !== null) {
        const label = match[1];
        if (!found.has(label)) {
            found.add(label);
            dynamicCompletions.push({ label: label, type: "class", detail: "Label" });
        }
    }

    // 2. Find constants (e.g., ".CONST MY_VAL 10")
    const constRegex = /^[ \t]*\.CONST[ \t]+([a-zA-Z_][a-zA-Z0-9_-]*)/gm;
    while ((match = constRegex.exec(text)) !== null) {
        const constName = match[1];
        if (!found.has(constName)) {
            found.add(constName);
            dynamicCompletions.push({ label: constName, type: "constant", detail: "Constant" });
        }
    }

    // 3. Find variables (e.g., ".my_var 0x00")
    // Searches for words with a dot, followed by a space and a value
    const varRegex = /^[ \t]*(\.[a-zA-Z_][a-zA-Z0-9_-]*)[ \t]+[^;\n]+/gm;
    const directives = [".DATA", ".CODE", ".CONST", ".INCLUDE"];

    while ((match = varRegex.exec(text)) !== null) {
        const varName = match[1];
        // Filter out directives like .DATA
        if (!directives.includes(varName.toUpperCase()) && !found.has(varName)) {
            found.add(varName);
            dynamicCompletions.push({ label: varName, type: "variable", detail: "Variable" });
        }
    }

    return dynamicCompletions;
}

/**
 * Handles the "Open File" action by invoking the file API to open a file, 
 * and then sets the editor content and updates the current file path and name.
 * This function is asynchronous and will wait for the file API to return the 
 * result before proceeding.
 * @param path Path to the file to open.
 */
async function handleOpenFile(path?: string) {
    const result = await window.fileAPI.openFile(path);
    if (result) {
        setEditorContent(result.content);
        currentFilePath.value = result.filePath;
        currentFileName.value = result.fileName;
        isDirty.value = false;
    }
}

/**
 * Handles the "Save File" action by retrieving the current content of the editor,
 * and then invoking the file API to save the content to the current file path.
 * If the save operation is successful, it updates the current file path and name.
 * This function is asynchronous and will wait for the file API to return the
 * result before proceeding.
 */
async function handleSaveFile() {
    const content = getEditorContent();
    const result = await window.fileAPI.saveFile(content, currentFilePath.value);
    if (result && result.success) {
        currentFilePath.value = result.filePath;
        currentFileName.value = result.fileName;
        isDirty.value = false;
    }
}

/**
 * Handles the "Upload Program" action by retrieving the current content of the editor,
 * and then invoking the file API to upload the program content. If the upload is
 * successful, it sets the `isProgramLoaded` flag to true and emits an 'upload-program' 
 * event. This function is asynchronous and will wait for the file API to return the 
 * result before proceeding. 
 */
async function handleUploadProgram() {
    const content = getEditorContent();
    const result = await window.simulator.uploadProgram(content);
    if (result && result.success) {
        isProgramLoaded.value = true;
    }
}

/**
 * Highlights a specific line in the editor.
 * @param lineNumber The line number to highlight, or null to remove the highlight.
 */
function highlightLine(lineNumber: number | null) {
    if (!view) return;
    view.dispatch({
        effects: setHighlightedLine.of(lineNumber)
    });
}

/**
 * Creates a custom theme for the CodeMirror editor with the specified font size.
 * @param fontSize The font size in pixels to be applied to the editor content.
 */
function createEditorTheme(fontSize: number) {
    return EditorView.theme({
        "&": { height: "100%", fontSize: `${fontSize}px` },
        ".cm-content": { fontFamily: 'Courier New, monospace' },
        ".cm-scroller": { overflow: "auto" },
        ".cm-gutters": { backgroundColor: "rgba(0,0,0,0.2)", borderRight: "1px solid var(--glass-border)", color: "#94a3b8" },
        ".cm-activeLine": { backgroundColor: "rgba(255, 255, 255, 0.05)" },
        ".cm-tooltip-autocomplete": { backgroundColor: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", minWidth: "300px" },
        ".cm-completionLabel": { color: "#f8fafc" },
        ".cm-completionDetail": { color: "#ea7317", fontStyle: "italic", marginLeft: "10px", fontSize: "0.85em" },
        ".cm-completionInfo": { padding: "8px", backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" },
        ".cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]": { backgroundColor: "rgba(234, 115, 23, 0.3)", color: "white" },
        ".cm-snippetField": { backgroundColor: "rgba(234, 115, 23, 0.2)", outline: "1px solid #ea7317" }
    }, { dark: true });
}

/**
 * Zooms in the editor by increasing the font size, up to a maximum of 36 pixels.
 */
function zoomIn() {
    if (!view) return;
    if (currentFontSize.value < 36) {
        currentFontSize.value += 2;
        view.dispatch({
            effects: themeCompartment.reconfigure(
                createEditorTheme(currentFontSize.value)
            )
        });
    }
}

/**
 * Zooms out the editor by decreasing the font size, down to a minimum of 10 pixels.
 */
function zoomOut() {
    if (!view) return;
    if (currentFontSize.value > 10) {
        currentFontSize.value -= 2;
        view.dispatch({
            effects: themeCompartment.reconfigure(
                createEditorTheme(currentFontSize.value)
            )
        });
    }
}

// Initialize component and editor.
onMounted(() => {
    const startState = EditorState.create({
        doc: props.fileContent ?? '',
        extensions: [
            lineNumbers(),
            highlightActiveLine(),
            history(),
            bracketMatching(),
            lineHighlightField,
            keymap.of([
                {
                    key: "Mod-s",
                    run: () => {
                        handleSaveFile();
                        return true;
                    }
                },
                {
                    key: "Mod-o",
                    run: () => {
                        handleOpenFile();
                        return true;
                    }
                },
                {
                    key: "Mod-Shift-s", 
                    run: () => { currentFilePath.value = ''; handleSaveFile(); 
                        return true; 
                    }
                },
                {
                    key: "Mod-=",
                    run: () => {
                        zoomIn();
                        return true;
                    }
                },
                {
                    key: "Mod--",
                    run: () => {
                        zoomOut();
                        return true;
                    }
                },
                { key: "Tab", run: nextSnippetField, shift: prevSnippetField },
                { key: "Tab", run: insertTab },
                ...defaultKeymap,
                ...historyKeymap
            ]),
            autocompletion({ override: [assemblerAutocompleteProvider] }),
            assemblerTokenizer,
            syntaxHighlighting(customThemeHighlighting),
            EditorView.updateListener.of((update) => {
                if (update.docChanged) {
                    isDirty.value = true;
                }
            }),
            themeCompartment.of(createEditorTheme(currentFontSize.value)),
        ]
    });

    view = new EditorView({
        state: startState,
        parent: editorContainer.value!
    });

    view.dom.addEventListener('wheel', (event: WheelEvent) => {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (event.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        }
    }, { passive: false });
});

// Cleanup the editor view when the component is unmounted.
onUnmounted(() => {
    view?.destroy();
});
</script>

<style lang="css" scoped>
.editor-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 0.75rem;
}

.editor-nav {
    display: flex;
    gap: 0.5rem;
}

.nav-item {
    background: transparent;
    border: 1px solid var(--glass-border);
    color: var(--text-main);
    padding: 0.4rem 1rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.nav-item:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--accent-primary);
}

.document-title {
    font-family: "Courier New", Courier, monospace;
    font-size: 1.1rem;
    color: var(--text-main);
    margin: 0;
    padding: 0 0.25rem;
    font-weight: bold;
}

.nav-item-action {
    background: rgba(234, 115, 23, 0.15);
    border-color: var(--accent-primary, #ea7317);
    color: var(--accent-primary, #ea7317);
    font-weight: bold;
}

.nav-item-action:hover {
    background: var(--accent-primary, #ea7317);
    color: white;
}

.dirty-indicator {
    margin-left: 4px;
}

.editor-view {
    flex: 1;
    min-height: 0;
    width: 100%;
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.cm-editor-wrapper {
    height: 100%;
}

.editor-view {
    height: 100%;
    width: 100%;
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    --syn-comment: #64748b;
    --syn-keyword: #10b981;
    --syn-register: #ef4444;
    --syn-label: #fb923c;
    --syn-variable: #fcd34d;
    --syn-constant: #2dd4bf;
    --syn-number: #38bdf8;
    --syn-string: #f43f5e;
    --syn-directive: #c084fc;
    --syn-text: #f8fafc;
}

.cm-editor-wrapper {
    height: 100%;
}

:deep(.cm-editor) {
    height: 100%;
    background-color: transparent !important;
}

:deep(.cm-content) {
    color: var(--text-main);
}

:deep(.cm-programmatic-highlight) {
    background-color: rgba(234, 115, 23, 0.3) !important;
}

:deep(.cm-scroller::-webkit-scrollbar-corner) {
    background: transparent;
}
</style>