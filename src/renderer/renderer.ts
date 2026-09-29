import { DoubleWord } from "../types/binary/DoubleWord";
import { Byte } from "../types/binary/Byte";
import { InstructionTypes } from "../types/enumerations/InstructionTypes";
import { OperandTypes } from "../types/enumerations/OperandTypes";
import { RegisterNumbers } from "../types/enumerations/RegisterNumbers";
import { AddressingModes } from "../types/enumerations/AdressingModes";
import { InterruptNumbers } from "../types/enumerations/InterruptNumbers";
import { DevOperations } from "../types/enumerations/DevOperations";
import { InstructionSet } from "../types/enumerations/InstructionSet";
import { PhysicalAddress } from "../types/binary/PhysicalAddress";
import { VirtualAddress } from "../types/binary/VirtualAddress";

/**
 * This enumeration is a duplicate of the one, that can be
 * found in src/types/types.ts. This is intended, as imports
 * are problematic to use in frontend. Maybe there is a solution.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export enum NumberSystem {
    HEX = 16,
    DEC = 10,
    BIN = 2,
}

/**
 * This class encapsulates the logic needed to initialize and sync the GUI
 * with the backend process.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
export class Renderer {
    /**
     * This class member stores the highest available physical memory address.
     */
    public static readonly HIGH_ADDRESS_PHYSICAL_MEMORY_DEC: number = 4_294_967_295;

    /**
     * This class member stores the number of bits representing the page frame number.
     * The page frame number can be extracted from a physical memory address by removing the offset bits from the right.
     * @readonly
     */
    public static readonly NUMBER_BITS_PAGE_FRAME_ADDRESS: number = 20;


    /**
     * This field stores a reference to the browser "window".
     */
    private readonly _window: Window & typeof globalThis;

    /**
     * This field stores a reference to the HTML document.
     */
    private readonly _document: Document;

    /**
     * This field indicates, whether an assembly program is currently loaded.
     */
    public programLoaded: boolean;

    /**
     * This field stores a reference to the HTMLElement representing the EAX register.
     * @readonly
     */
    private readonly _eax: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the EAX register.
     */
    public dataRepresentationEAX: NumberSystem; // Replace with actual type or import if available

    /**
     * This field stores a reference to the HTMLElement representing the EBX register.
     * @readonly
     */
    private readonly _ebx: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the EBX register.
     */
    public dataRepresentationEBX: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the ECX register.
     * @readonly
     */
    private readonly _ecx: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the ECX register.
     */
    public dataRepresentationECX: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the EDX register.
     * @readonly
     */
    private readonly _edx: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the EDX register.
     */
    public dataRepresentationEDX: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the EIP register.
     * @readonly
     */
    private readonly _eip: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the EIP register.
     */
    public dataRepresentationEIP: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the FLAGS register.
     * @readonly
     */
    private readonly _flags: HTMLElement | null;

    /**
     * This field stores a reference to the HTMLElement representing the EIR register.
     * @readonly
     */
    private readonly _eir: HTMLElement | null;

    /**
     * TODO: Implement mechanism for retrieving textual instruction from main process of the Simulator!
     * This field is currently unused, as there is no such mechanism.
     * The only available representation for the EIR register is binary.
     * 
     * This field stores the currently selected representation of the data for the EIR register.
     */
    public dataRepresentationEIR: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the NPTP register.
     * @readonly
     */
    private readonly _nptp: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the NPTP register.
     */
    public dataRepresentationNPTP: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the VMPTR register.
     * @readonly
     */
    private readonly _vmptr: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the VMPTR register.
     */
    public dataRepresentationVMPTR: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the ESP register.
     * @readonly
     */
    private readonly _esp: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the ESP register.
     */
    public dataRepresentationESP: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the ITP register.
     * @readonly
     */
    private readonly _itp: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the ITP register.
     */
    public dataRepresentationITP: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the GPTP register.
     * @readonly
     */
    private readonly _gptp: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the GPTP register.
     */
    public dataRepresentationGPTP: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the PTP register.
     * @readonly
     */
    private readonly _ptp: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the PTP register.
     */
    public dataRepresentationPTP: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the RAM search widget.
     * @readonly
     */
    private readonly _ramSearch: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the memory address for the RAM search.
     */
    public dataRepresentationRAMSearch: NumberSystem;

    /**
     * This field is used to observe the visibility of the GUI elements representing Page Table entries.
     */
    private readonly _pageTableObserver: IntersectionObserver;

    /**
     * This field stores a list with all visible GUI elements associated with the widget of the physical main memory.
     */
    private _listOfVisiblePhysicalRAMGuiElements: Array<Element>;

    /**
     * This field stores a list with all visible GUI elements associated with the widget of the virtual main memory.
     */
    private _listOfVisibleVirtualRAMGuiElements: Array<Element>;

    /**
     * This field stores a list with all visible GUI elements associated with the widget of the Page Table.
     */
    private _listOfVisiblePageTableEntries: Array<Element>;

    /**
     * This field stores the currently selected data representation for the detailed RAM view, dictating how the byte data gets interpreted.
     */
    public ramDataRepresentation: string;

    /**
     * This field stores the currently selected block size for the detailed RAM view, dictating how many bytes per row are shown.
     */
    public ramBlockSize: number;

    /**
     * This field stores the memory start address from the input box in the detailed RAM view.
     */
    public ramViewStartAddress: number;

    /**
     * This field stores the memory end address from the input box in the detailed RAM view.
     */
    public ramViewEndAddress: number;

    /**
     * This field stores a callback used to observe the GUI elements representing the entries of the Page Table.
     * @param entries A list of elements, which triggered the intersection observer. 
     * @returns A callback, which is used as the logic to perform whenever elements enter or leave the observed viewspace.
     */
    private readonly _pageTableObserverCallback: IntersectionObserverCallback = async (entries: IntersectionObserverEntry[]) => {
        const pageTableEntriesHTMLElement: HTMLElement | null = this._document.getElementById("page-table-entries");
        if (!pageTableEntriesHTMLElement) {
            return;
        }
        for (const entry of entries) {
            if (!entry.target.hasAttribute("data-page-number")) {
                continue;
            }
            if (entry.isIntersecting && entry.rootBounds !== null) {
                // Element enters viewport. Calculate the direction from which the element is entering the viewport.
                const fromTop: number = entry.intersectionRect.top;
                const fromBottom: number = entry.rootBounds.height - entry.intersectionRect.bottom;
                // Make entered element visible.
                entry.target.classList.remove("invisible");
                // Check if element enters from top of viewport.
                if (entry.target.isEqualNode(pageTableEntriesHTMLElement.firstElementChild) && fromTop < fromBottom) {
                    // Element is scrolling in from top of viewport and is the first child node of the HTMLElement representing the RAM view.
                    // Insert element and a preceding element at the front of the list.
                    const pageNumberDecString: string = entry.target.getAttribute("data-page-number")!;
                    const numberAddressesPerPageDec: number = Math.pow(2, 12);
                    const nextHigherPageNumberDec: number = parseInt(pageNumberDecString, 10) + 1;
                    if (nextHigherPageNumberDec >= (Math.pow(2, 32) / numberAddressesPerPageDec) - 1) {
                        return;
                    }
                    const pageTableEntries: Map<number, number> = await this._window.mainMemory.readPageTableEntries(nextHigherPageNumberDec, nextHigherPageNumberDec);
                    for (const [pageNumber, pageTableEntry] of Array.from(pageTableEntries).reverse()) {
                        const presentFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(0, 1) === "1") ? true : false;
                        const writableFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(1, 2) === "1") ? true : false;
                        const executableFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(2, 3) === "1") ? true : false;
                        const accessableOnlyInKernelModeFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(3, 4) === "1") ? true : false;
                        const pinnedFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(4, 5) === "1") ? true : false;
                        const changedFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(5, 6) === "1") ? true : false;
                        const pageFrameNumberHexString = `0x${parseInt(pageTableEntry.toString(2).padStart(32, "0").slice(-Renderer.NUMBER_BITS_PAGE_FRAME_ADDRESS), 2)}`;
                        const element: HTMLElement = this.createPageTableEntryElement(
                            "0x" + pageNumber.toString(16),
                            presentFlag,
                            writableFlag,
                            executableFlag,
                            accessableOnlyInKernelModeFlag,
                            pinnedFlag,
                            changedFlag,
                            pageFrameNumberHexString
                        );
                        this._pageTableObserver.observe(element);
                        pageTableEntriesHTMLElement.insertBefore(element, pageTableEntriesHTMLElement.firstElementChild);
                        this._listOfVisiblePageTableEntries.unshift(element);
                        this._pageTableObserver.unobserve(pageTableEntriesHTMLElement.lastElementChild!);
                        this._listOfVisiblePageTableEntries.splice(this._listOfVisiblePageTableEntries.indexOf(pageTableEntriesHTMLElement.lastElementChild!), 1);
                        pageTableEntriesHTMLElement.removeChild(pageTableEntriesHTMLElement.lastElementChild!);
                    }
                }
                // Check if element enters from bottom of viewport.
                if (entry.target.isEqualNode(pageTableEntriesHTMLElement.lastElementChild) && fromTop > fromBottom) {
                    // Element is scrolling in from bottom of viewport and is the last child node of the HTMLElement representing the RAM view.
                    // Insert element at the end of the list.
                    const pageNumberDecString: string = entry.target.getAttribute("data-page-number")!;
                    const nextLowerPageNumberDec: number = parseInt(pageNumberDecString, 10) - 1;
                    if (nextLowerPageNumberDec < 0) {
                        return;
                    }
                    const pageTableEntries: Map<number, number> = await this._window.mainMemory.readPageTableEntries(nextLowerPageNumberDec, nextLowerPageNumberDec);
                    for (const [pageNumber, pageTableEntry] of Array.from(pageTableEntries).reverse()) {
                        const presentFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(0, 1) === "1") ? true : false;
                        const writableFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(1, 2) === "1") ? true : false;
                        const executableFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(2, 3) === "1") ? true : false;
                        const accessableOnlyInKernelModeFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(3, 4) === "1") ? true : false;
                        const pinnedFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(4, 5) === "1") ? true : false;
                        const changedFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(5, 6) === "1") ? true : false;
                        const pageFrameNumberHexString = `0x${parseInt(pageTableEntry.toString(2).padStart(32, "0").slice(-Renderer.NUMBER_BITS_PAGE_FRAME_ADDRESS), 2)}`;
                        const element: HTMLElement = this.createPageTableEntryElement(
                            "0x" + pageNumber.toString(16),
                            presentFlag,
                            writableFlag,
                            executableFlag,
                            accessableOnlyInKernelModeFlag,
                            pinnedFlag,
                            changedFlag,
                            pageFrameNumberHexString
                        );
                        this._pageTableObserver.observe(element);
                        pageTableEntriesHTMLElement.appendChild(element);
                        this._listOfVisiblePageTableEntries.push(element);
                        this._listOfVisiblePageTableEntries.splice(this._listOfVisiblePageTableEntries.indexOf(pageTableEntriesHTMLElement.firstElementChild!), 1);
                        pageTableEntriesHTMLElement.removeChild(pageTableEntriesHTMLElement.firstElementChild!);
                    }
                }
            } else {
                // Element not in the viewport.
                entry.target.classList.add("invisible");
            }
        }
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the EAX register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerEAX: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationEAX = NumberSystem.DEC;
                this.readEAX(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationEAX = NumberSystem.HEX;
                this.readEAX(16);
            } else {
                this.dataRepresentationEAX = NumberSystem.BIN;
                this.readEAX(2);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the EBX register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerEBX: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationEBX = NumberSystem.DEC;
                this.readEBX(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationEBX = NumberSystem.HEX;
                this.readEBX(16);
            } else {
                this.dataRepresentationEBX = NumberSystem.BIN;
                this.readEBX(2);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the ECX register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerECX: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationECX = NumberSystem.DEC;
                this.readECX(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationECX = NumberSystem.HEX;
                this.readECX(16);
            } else {
                this.dataRepresentationECX = NumberSystem.BIN;
                this.readECX(2);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the ECX register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerEDX: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationECX = NumberSystem.DEC;
                this.readEDX(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationECX = NumberSystem.HEX;
                this.readEDX(16);
            } else {
                this.dataRepresentationECX = NumberSystem.BIN;
                this.readEDX(2);
            }
        }
        return;
    }


    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the EIP register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerEIP: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationEIP = NumberSystem.DEC;
                this.readEIP(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationEIP = NumberSystem.HEX;
                this.readEIP(16);
            } else {
                this.dataRepresentationEIP = NumberSystem.BIN;
                this.readEIP(2);
            }
        }
        return;
    }

    /**
     * TODO: This callback is currently unused. It will be used to switch between binary and textual representation of the loaded instruction!
     * This callback is used as the change listeners logic for the GUI element, which visualizes the EIR register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerEIR: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "INSTRUCTION") {
                // TODO: Implement mechanism for retrieving textual instruction from main process of the Simulator!
                this.readEIR();
            } else {
                this.readEIR();
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the NPTP register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerNPTP: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationNPTP = NumberSystem.DEC;
                this.readNPTP(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationNPTP = NumberSystem.HEX;
                this.readNPTP(16);
            } else {
                this.dataRepresentationNPTP = NumberSystem.BIN;
                this.readNPTP(2);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the VMPTR register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerVMPTR: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationVMPTR = NumberSystem.DEC;
                this.readVMPTR(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationVMPTR = NumberSystem.HEX;
                this.readVMPTR(16);
            } else {
                this.dataRepresentationVMPTR = NumberSystem.BIN;
                this.readVMPTR(2);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the ESP register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerESP: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationESP = NumberSystem.DEC;
                this.readESP(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationESP = NumberSystem.HEX;
                this.readESP(16);
            } else {
                this.dataRepresentationESP = NumberSystem.BIN;
                this.readESP(2);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the ITP register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerITP: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationITP = NumberSystem.DEC;
                this.readITP(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationITP = NumberSystem.HEX;
                this.readITP(16);
            } else {
                this.dataRepresentationITP = NumberSystem.BIN;
                this.readITP(2);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the GPTP register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerGPTP: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationGPTP = NumberSystem.DEC;
                this.readGPTP(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationGPTP = NumberSystem.HEX;
                this.readGPTP(16);
            } else {
                this.dataRepresentationGPTP = NumberSystem.BIN;
                this.readGPTP(2);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the PTP register.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerPTP: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedRepresentation);
            if (currentRepresentation === demandedRepresentation) {
                return;
            } else if (demandedRepresentation === "DECIMAL") {
                this.dataRepresentationPTP = NumberSystem.DEC;
                this.readPTP(10);
            } else if (demandedRepresentation === "HEXADECIMAL") {
                this.dataRepresentationPTP = NumberSystem.HEX;
                this.readPTP(16);
            } else {
                this.dataRepresentationPTP = NumberSystem.BIN;
                this.readPTP(2);
            }
        }
        return;
    }


    /**
     * This callback is used as the change listener logic for the select element that controls the byte display format for the RAM display element
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerRamByteRepresentation: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        const ramBlockSizeSelector: HTMLSelectElement = this._document.getElementById("ram-select-blocksize") as HTMLSelectElement;
        if (parent !== null) {
            const currentByteRepresentation: string = parent.getAttribute("data-representation")!;
            const demandedByteRepresentation: string = target.value;
            parent.setAttribute("data-representation", demandedByteRepresentation);
            if (currentByteRepresentation === demandedByteRepresentation) {
                return
            }
            this.ramDataRepresentation = demandedByteRepresentation;
            const blockSizeDisable: boolean = (demandedByteRepresentation === "UTF-8" || demandedByteRepresentation === "ASSEMBLY");
            ramBlockSizeSelector.disabled = blockSizeDisable;
            if (demandedByteRepresentation === "ASSEMBLY") {
                this.ramBlockSize = 12;
            } else {
                const previousBlockSize: string = parent.getAttribute("block-size")!;
                this.ramBlockSize = parseInt(previousBlockSize);
            }
            this.checkAddressRangeInput();
            this.createUpdateDetailedRamViewTable(this.ramViewStartAddress, this.ramViewEndAddress);
        }
        return;
    }

    /**
     * This callback is used as the change listener logic for the select element that controls the blocksize in the RAM display element.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerRamBlockSize: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentBlockSize: string = parent.getAttribute("block-size")!;
            const demandedBlockSize: string = target.value;
            parent.setAttribute("block-size", demandedBlockSize);
            if (currentBlockSize === demandedBlockSize) {
                return;
            } else {
                this.ramBlockSize = parseInt(demandedBlockSize);
                this.checkAddressRangeInput();
                this.createUpdateDetailedRamViewTable(this.ramViewStartAddress, this.ramViewEndAddress);
            }
        }
        return;
    }

    /**
     * This callback is used as the change listeners logic for the GUI element, which visualizes the RAM-Cell search module.
     * @param event An object, which represents the event fired, whenever a change occurs on the <select> element contained in the GUI element.
     */
    private readonly onChangeListenerRAMSearch: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLSelectElement = event.target as HTMLSelectElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            const currentLocation: string = parent.getAttribute("search-location")!;
            const demandedLocation: string = target.value;
            const searchValue: string = (this._document.getElementById("ramsearch-input") as HTMLInputElement).value;
            parent.setAttribute("search-location", demandedLocation);
            if (currentLocation === demandedLocation) {
                return;
            } else if (demandedLocation === "PHYSICAL") {
                //this.jumpToPhysicalRamElement(searchValue, this.dataRepresentationRAMSearch);
                this.highlightRamElement(Number(searchValue));
            } else {
                //this.jumpToVirtualRamElement(searchValue, this.dataRepresentationRAMSearch);
                this.highlightRamElement(Number(searchValue), true);
            }
        }
        return;
    }

    /**
     * This callback is used as the keyup listeners logic for the GUI element, which visualizes the RAM-Cell search module.
     * @param event An object, which represents the event fired, whenever a change occurs on the <input> element contained in the GUI element.
     */
    private readonly onKeyUpRAMSearch: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const parent: HTMLElement | null = target.parentElement;
        const keyboardEvent: KeyboardEvent = event as KeyboardEvent;
        const searchValue: string = target.value;
        const regExAllowedChars = /^[0-9a-fA-Fx]+$/;
        const regExEnter = /(0[x])?[a-fA-F0-9]+$/;
        let isHex = regExAllowedChars.test(searchValue);
        if(!isHex) {
            target.value = searchValue.slice(0, -1);
        }
        if (keyboardEvent.key === 'Enter' && parent !== null) {
            isHex = regExEnter.test(searchValue);
            if (!isHex) {
                target.value = "0x0";
                return;
            }
            const currentLocation = parent.getAttribute("search-location")!;
            if (currentLocation === "PHYSICAL") {
                this.highlightRamElement(Number(searchValue));
            } else {
                this.highlightRamElement(Number(searchValue), true);
                //this.jumpToVirtualRamElement(searchValue, this.dataRepresentationRAMSearch);
            }
        }
        return;
    }


    /**
     * This callback is used as the keyup listener logic for the address range GUI element in the detailed ram view.
     * @param event An object, which represents the event fired, whenever a change occurs on the <input> element contained in the GUI element.
     */
    private readonly onKeyUpAddressRangeBox: EventListenerOrEventListenerObject = (event: Event): void => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        
        const keyboardEvent: KeyboardEvent = event as KeyboardEvent;
        const regExAllowedChars = /^[0-9a-fA-Fx]+$/; 
        //const memoryStartAddress: string = inputBoxStart.value;
        //const memoryEndAddress: string = inputBoxEnd.value;
        const isHex = regExAllowedChars.test(target.value);
        if(!isHex) {
            target.value = target.value.slice(0, -1);
        }
        if (keyboardEvent.key === 'Enter') {
            this.checkAddressRangeInput();
            this.createUpdateDetailedRamViewTable(this.ramViewStartAddress, this.ramViewEndAddress);
        }
    }

    /**
     * This method checks if the given values are valid for the address range input box in the detailed memory view window.
     * If the format is valid and the end address is bigger than the start address, but the address range is not a multiple of the current block size,
     * then the end address is rounded up to the next multiple.
     * @param startAddress The address that will be used as the first memory address to display
     * @param endAddress The address that will be used as the last memory address to display
     * @returns Returns true or false depending on if the address range and format is valid
     */
    private checkAddressRangeInput(): void {
        const inputBoxStart: HTMLInputElement = this._document.getElementById("ram-input-box-start") as HTMLInputElement;
        const inputBoxEnd: HTMLInputElement = this._document.getElementById("ram-input-box-end") as HTMLInputElement;
        const startAddress = inputBoxStart.value;
        const endAddress = inputBoxEnd.value;
        const regExEnter = /(0[x])?[a-fA-F0-9]+$/;
        const inputStartValidFormat = regExEnter.test(startAddress);
        const inputEndValidFormat = regExEnter.test(endAddress);
        const startAddressDec = parseInt(startAddress,16);
        const endAddressDec = parseInt(endAddress,16);
        const addressRange = endAddressDec - startAddressDec;
        if (inputStartValidFormat && inputEndValidFormat && startAddressDec <= endAddressDec) {
            this.ramViewStartAddress = startAddressDec;
            this.ramViewEndAddress = endAddressDec;
            const addressRangeRest = (addressRange + 1) % this.ramBlockSize;
            if (addressRangeRest !== 0) {
                this.ramViewEndAddress = endAddressDec + (this.ramBlockSize - addressRangeRest);
                inputBoxEnd.value = "0x" + this.ramViewEndAddress.toString(16);
            }
        } else {
            inputBoxStart.value = "0x0";
            inputBoxEnd.value = "0xb";
            this.ramViewStartAddress = 0x0;
            this.ramViewEndAddress = 0xb;
        }
    }

    /**
     * This callback is used as the click listener logic for the GUI element, which visualizes the EAX register.
     * @param event An object, which represents the event fired, whenever a click on the GUI element occurs.
     */
    private readonly onClickListenerEAX: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("name") === "register-select-representation") return;
            const content: string = await this._window.simulator.readEAX(NumberSystem.HEX);
            if (this._eax !== null) {
                this.highlightRamElement(Number(content));
            }
        } 
        return;
    }

    /**
     * This callback is used as the click listener logic for the GUI element, which visualizes the EBX register.
     * @param event An object, which represents the event fired, whenever a click on the GUI element occurs.
     */
    private readonly onClickListenerEBX: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("name") === "register-select-representation") return;
            const content: string = await this._window.simulator.readEBX(NumberSystem.HEX);
            if (this._ebx !== null) {
                this.highlightRamElement(Number(content));
            }
        } 
        return;
    }

    /**
     * This callback is used as the click listener logic for the GUI element, which visualizes the ECX register.
     * @param event An object, which represents the event fired, whenever a click on the GUI element occurs.
     */
    private readonly onClickListenerECX: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("name") === "register-select-representation") return;
            const content: string = await this._window.simulator.readECX(NumberSystem.HEX);
            if (this._ecx !== null) {
                this.highlightRamElement(Number(content));
            }
        } 
        return;
    }

    /**
     * This callback is used as the click listener logic for the GUI element, which visualizes the ECX register.
     * @param event An object, which represents the event fired, whenever a click on the GUI element occurs.
     */
    private readonly onClickListenerEDX: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("name") === "register-select-representation") return;
            const content: string = await this._window.simulator.readEDX(NumberSystem.HEX);
            if (this._edx !== null) {
                this.highlightRamElement(Number(content));
            }
        } 
        return;
    }

    /**
     * This callback is used as the click listener logic for the GUI element, which visualizes the ESP register.
     * @param event An object, which represents the event fired, whenever a click on the GUI element occurs.
     */
    private readonly onClickListenerESP: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("name") === "register-select-representation") return;
            const content: string = await this._window.simulator.readESP(NumberSystem.HEX);
            if (this._esp !== null) {
                this.highlightRamElement(Number(content));
            }
        } 
        return;
    }

    /**
     * This callback is used as the click listener logic for the GUI element, which visualizes the EIP register.
     * @param event An object, which represents the event fired, whenever a click on the GUI element occurs.
     */
    private readonly onClickListenerEIP: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("name") === "register-select-representation") return;
            const content: string = await this._window.simulator.readEIP(NumberSystem.HEX);
            if (this._eip !== null) {
                this.highlightRamElement(Number(content));
            }
        } 
        return;
    }

    /**
     * This callback is used as the click listener logic for the GUI element, which visualizes the ITP register.
     * @param event An object, which represents the event fired, whenever a click on the GUI element occurs.
     */
    private readonly onClickListenerITP: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("name") === "register-select-representation") return;
            const content: string = await this._window.simulator.readITP(NumberSystem.HEX);
            if (this._itp !== null) {
                this.highlightRamElement(Number(content));
            }
        } 
        return;
    }

    /**
     * This callback is used as the click listener logic for the GUI element, which visualizes the PTP register.
     * @param event An object, which represents the event fired, whenever a click on the GUI element occurs.
     */
    private readonly onClickListenerPTP: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("name") === "register-select-representation") return;
            const content: string = await this._window.simulator.readPTP(NumberSystem.HEX);
            if (this._ptp !== null) {
                this.highlightRamElement(Number(content));
            }
        } 
        return;
    }

    /**
     * This callback is used as the click listener logic for the text field of the console GUI element.
     * @param event An object, which represents the event fired, whenever a click on the text window of the console occurs.
     */
    private readonly onClickListenerConsole: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLElement = event.target as HTMLElement;
        const parent: HTMLElement | null = target.parentElement;
        if (parent !== null) {
            if (target.getAttribute("id") === "console-input") return;
            const consoleInputField: HTMLInputElement = this._document.getElementById("console-input") as HTMLInputElement;
            consoleInputField.focus();
        }
        return;
    }

    /**
     *  This callback is used as listener logic for the input field of the console GUI element. If "Enter" is pressed
     *  a keyboard interrupt is fired and the console input gets disabled.
     * @param event An object, which represents the event fired, whenever a key is pressed while focused on the console input field.
     */
    private readonly onKeyUpConsole: EventListenerOrEventListenerObject = async (event: Event): Promise<void> => {
        const target: HTMLInputElement = event.target as HTMLInputElement;
        const keyboardEvent: KeyboardEvent = event as KeyboardEvent;
        const consoleContent: string = target.value.trim();
        if (keyboardEvent.key === 'Enter' && consoleContent.length !== 0) {
            const lines = consoleContent.split(/\\n/);
            for (const line of lines) {
                this._window.simulator.keyboardInterrupt(line.trim());
            }
            target.value= "";
        }
    }

    /**
     * This field represents a flag, which enables automatic scroll for the GUIs Page Table widget.
     */
    public autoScrollForPageTableEnabled: boolean;

    /**
     * This field represents a flag, which enables the RAM Gui element to track the virtual address of the EIP.
     */
    public ramViewFollowEip: boolean;

    /**
     * Constructs an instance with the given HTML document associated.
     * @param document A reference to an HTML document.
     * @param window A reference to the browser "window".
     */
    public constructor(document: Document, window: Window & typeof globalThis) {
        this._document = document;
        this._eax = document.getElementById("eax");
        this.dataRepresentationEAX = NumberSystem.BIN;
        this._ebx = document.getElementById("ebx");
        this.dataRepresentationEBX = NumberSystem.BIN;
        this._ecx = document.getElementById("ecx");
        this.dataRepresentationECX = NumberSystem.BIN;
        this._edx = document.getElementById("edx");
        this.dataRepresentationEDX = NumberSystem.BIN;
        this._flags = document.getElementById("flags");
        this._eip = document.getElementById("eip");
        this.dataRepresentationEIP = NumberSystem.BIN;
        this._eir = document.getElementById("eir");
        this.dataRepresentationEIR = NumberSystem.BIN;
        this._esp = document.getElementById("esp");
        this.dataRepresentationESP = NumberSystem.BIN;
        this._gptp = document.getElementById("gptp");
        this.dataRepresentationGPTP = NumberSystem.BIN;
        this._itp = document.getElementById("itp");
        this.dataRepresentationITP = NumberSystem.BIN;
        this._nptp = document.getElementById("nptp");
        this.dataRepresentationNPTP = NumberSystem.BIN;
        this._ptp = document.getElementById("ptp");
        this.dataRepresentationPTP = NumberSystem.BIN;
        this._vmptr = document.getElementById("vmptr");
        this.dataRepresentationVMPTR = NumberSystem.BIN;
        this._ramSearch = document.getElementById("ram-search");
        this.dataRepresentationRAMSearch = NumberSystem.HEX;
        this._pageTableObserver = new IntersectionObserver(this._pageTableObserverCallback, {
            root: null,             // Viewport is root element.
            rootMargin: "0px",      // Margin for root element.
            threshold: 0            // The element will be displayed, if it enters the rootMargin.
        })
        this._listOfVisiblePhysicalRAMGuiElements = new Array<Element>();
        this._listOfVisibleVirtualRAMGuiElements = new Array<Element>();
        this._listOfVisiblePageTableEntries = new Array<Element>();
        this.autoScrollForPageTableEnabled = true;
        this.ramViewFollowEip = true;
        this.programLoaded = true;
        this._window = window;
        this.ramDataRepresentation = "BIN";
        this.ramBlockSize = 1;
        this.ramViewStartAddress = 0x0;
        this.ramViewEndAddress = 0xb;
    }

    /**
     * This method registers all the listener for the address range box in the memory view window.
     */
    public registerAddressRangeBoxListener(): void {
        const inputElementStart: HTMLInputElement = this._document.getElementById("ram-input-box-start") as HTMLInputElement;
        const inputElementEnd: HTMLInputElement = this._document.getElementById("ram-input-box-end") as HTMLInputElement;

        inputElementStart.addEventListener("keyup", this.onKeyUpAddressRangeBox);
        inputElementEnd.addEventListener("keyup", this.onKeyUpAddressRangeBox);
    }

    /**
     * This method registers all the listener for the control box that contains the settings for the RAM display element.
     */
    public registerDetailedRamViewSelectElement(): void {
        const byteDataTypeSelect: HTMLSelectElement = this._document.getElementById("ram-select-byte-datatype") as HTMLSelectElement;
        const blockSizeSelect: HTMLSelectElement = this._document.getElementById("ram-select-blocksize") as HTMLSelectElement;
        byteDataTypeSelect.addEventListener("change", this.onChangeListenerRamByteRepresentation);
        blockSizeSelect.addEventListener("change", this.onChangeListenerRamBlockSize);
    }

    /**
     * This method registers all the listener for the console widget.
     */
    public registerConsoleListener(): void {
        const console = this._document.getElementById("console-input-container");
        if (console !== null) {
            console.addEventListener("click", this.onClickListenerConsole);
            console.addEventListener("keyup", this.onKeyUpConsole);
        }
    }

    /**
     * This method registers all the listener for the RAM-Cell search-module
     */
    public registerRAMSearchListener(): void {
        const searchModules: HTMLCollectionOf<Element> = this._document.getElementsByClassName("search-module");
        for (const searchModule of searchModules) {
            const selectElement: Element = searchModule.children.namedItem("select-address-space")!;
            const inputElement: Element = searchModule.children.namedItem("searchbox")!;
            selectElement.addEventListener("change", this.onChangeListenerRAMSearch);
            inputElement.addEventListener("keyup", this.onKeyUpRAMSearch);
        }
        return;
    }

    /**
     * This method registers the change listeners for all <select> elements inside the GUI elements, which represent
     * registers during start of the simulator.
     */
    public registerChangeListener(): void {
        const registerElements: HTMLCollectionOf<Element> = this._document.getElementsByClassName("register");
        for (const register of registerElements) {
            const selectElement: Element = register.children.namedItem("register-select-representation")!;
            let eventListener: EventListenerOrEventListenerObject | undefined = undefined;
            switch (register.getAttribute("id")!.toLowerCase()) {
                case "eax":
                    eventListener = this.onChangeListenerEAX;
                    break;
                case "ebx":
                    eventListener = this.onChangeListenerEBX;
                    break;
                case "ecx":
                    eventListener = this.onChangeListenerECX;
                    break;
                case "edx":
                    eventListener = this.onChangeListenerEDX;
                    break;
                case "vmptr":
                    eventListener = this.onChangeListenerVMPTR;
                    break;
                case "eip":
                    eventListener = this.onChangeListenerEIP;
                    break;
                case "eir":
                    /**
                     * TODO: Create mechanism to retrieve textual representation of the loaded instruction.
                     * As this is currently not implemented, the EIR register can display its content
                     * only in its binary representation.
                     */
                    // eventListener = this.onChangeListenerEIR;
                    break;
                case "esp":
                    eventListener = this.onChangeListenerESP;
                    break;
                case "gptp":
                    eventListener = this.onChangeListenerGPTP;
                    break;
                case "ptp":
                    eventListener = this.onChangeListenerPTP;
                    break;
                case "itp":
                    eventListener = this.onChangeListenerITP;
                    break;
                case "nptp":
                    eventListener = this.onChangeListenerNPTP;
                    break;
                default:
                    break;
            }
            if (eventListener !== undefined) {
                selectElement.addEventListener("change", eventListener);
            }
        }
        return;
    }

    /**
     * This method registers the click listeners during the start of the simulator for all register GUI elements 
     * which represent registers that could hold a memory address.
     */
    public registerClickListener(): void {
        const registerElements: HTMLCollectionOf<Element> = this._document.getElementsByClassName("register");
        for (const register of registerElements) {
            let eventListener: EventListenerOrEventListenerObject | undefined = undefined;
            switch (register.getAttribute("id")!.toLowerCase()) {
                case "eax":
                    eventListener = this.onClickListenerEAX;
                    break;
                case "ebx":
                    eventListener = this.onClickListenerEBX;
                    break;
                case "ecx":
                    eventListener = this.onClickListenerECX;
                    break;
                case "edx":
                    eventListener = this.onClickListenerEDX;
                    break;
                case "esp":
                    eventListener = this.onClickListenerESP;
                    break;
                case "eip":
                    eventListener = this.onClickListenerEIP;
                    break;
                case "itp":
                    eventListener = this.onClickListenerITP;
                    break;
                case "ptp":
                    eventListener = this.onClickListenerPTP;
                    break;
                default:
                    break;
            }
            if (eventListener !== undefined) {
                register.addEventListener("click", eventListener);
            }
        }
        return;
    }

    /**
     * This method creates a GUI element, which represents an entry of the Page Table.
     * @param pageNumberDecString The virtual page address, which is often refered to as the pages number.
     * @param presentFlag This flag indicates whether the page is currently mounted to a page frame.
     * @param writableFlag This flag indicates whether the page is writable or read-only.
     * @param executableFlag This flag indicates whether the page is executable or not.
     * @param accessableOnlyInKernelModeFlag This flag indicates whether the page can only be accessed in kernel mode.
     * @param pinnedFlag This flag indicates whether the page is protected against attempts to write it to a background memory.
     * @param changedFlag This flag indicates whether the page was changed since it was mounted to a page frame.
     * @param pageFrameNumberDecString The physical page frame address, which is often refered to as the page frames number.
     * @returns An GUI element representing a single Page Table entry.
     */
    public createPageTableEntryElement(
        pageNumberDecString: string,
        presentFlag: boolean,
        writableFlag: boolean,
        executableFlag: boolean,
        accessableOnlyInKernelModeFlag: boolean,
        pinnedFlag: boolean,
        changedFlag: boolean,
        pageFrameNumberDecString: string
    ): HTMLElement {
        const trElement: HTMLElement = this._document.createElement("tr");
        trElement.setAttribute("class", "page-table-entry");
        trElement.setAttribute("data-page-number", `${pageNumberDecString}`);
        const tdElementPageNumber: HTMLElement = this._document.createElement("td");
        tdElementPageNumber.innerText = pageFrameNumberDecString;
        const tdElementPresent: HTMLElement = this._document.createElement("td");
        tdElementPresent.innerText = (presentFlag) ? "true" : "false";
        const tdElementWritable: HTMLElement = this._document.createElement("td");
        tdElementWritable.innerText = (writableFlag) ? "true" : "false";
        const tdElementExecutable: HTMLElement = this._document.createElement("td");
        tdElementExecutable.innerText = (executableFlag) ? "true" : "false";
        const tdElementAccessableOnlyInKernelMode: HTMLElement = this._document.createElement("td");
        tdElementAccessableOnlyInKernelMode.innerText = (accessableOnlyInKernelModeFlag) ? "true" : "false";
        const tdElementPinned: HTMLElement = this._document.createElement("td");
        tdElementPinned.innerText = (pinnedFlag) ? "true" : "false";
        const tdElementChanged: HTMLElement = this._document.createElement("td");
        tdElementChanged.innerText = (changedFlag) ? "true" : "false";
        const tdElementPageFrameNumber: HTMLElement = this._document.createElement("td");
        tdElementPageFrameNumber.innerText = pageFrameNumberDecString;
        trElement.appendChild(tdElementPageNumber);
        trElement.appendChild(tdElementPresent);
        trElement.appendChild(tdElementWritable);
        trElement.appendChild(tdElementExecutable);
        trElement.appendChild(tdElementAccessableOnlyInKernelMode);
        trElement.appendChild(tdElementPinned);
        trElement.appendChild(tdElementChanged);
        trElement.appendChild(tdElementPageFrameNumber);
        return trElement;
    }

    /**
     * This method initializes the view of the Page Table reading the first thirty entries of the Page Table
     * and creats GUI elements, which represents the individual entries.
     * @param [firstPageNumberToRead=0] The first page number to read from Page Table.
     * @param [lastPageNumberToRead=30] The last page number to read from Page Table.
     */
    public async createPageTableView(firstPageNumberToRead = 0, lastPageNumberToRead = 30): Promise<void> {
        const pageTableEntiresElement: HTMLElement | null = this._document.getElementById("page-table-entries");
        if (pageTableEntiresElement === null) {
            return;
        }
        if (pageTableEntiresElement.innerText !== "") {
            pageTableEntiresElement.innerHTML = "";
            // Disconnect obersever, which results in no element beeing observed.
            this._pageTableObserver.disconnect();
            this._listOfVisiblePageTableEntries = new Array<Element>();
        }
        const pageTableEntries: Map<number, number> =
            await this._window.mainMemory.readPageTableEntries(firstPageNumberToRead, lastPageNumberToRead);
        for (const [pageNumber, pageTableEntry] of Array.from(pageTableEntries).reverse()) {
            const presentFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(0, 1) === "1") ? true : false;
            const writableFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(1, 2) === "1") ? true : false;
            const executableFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(2, 3) === "1") ? true : false;
            const accessableOnlyInKernelModeFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(3, 4) === "1") ? true : false;
            const pinnedFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(4, 5) === "1") ? true : false;
            const changedFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(5, 6) === "1") ? true : false;
            const pageFrameNumberHexString = `0x${parseInt(pageTableEntry.toString(2).padStart(32, "0").slice(-Renderer.NUMBER_BITS_PAGE_FRAME_ADDRESS), 2)}`;
            const element: HTMLElement = this.createPageTableEntryElement(
                "0x" + pageNumber.toString(16),
                presentFlag,
                writableFlag,
                executableFlag,
                accessableOnlyInKernelModeFlag,
                pinnedFlag,
                changedFlag,
                pageFrameNumberHexString
            );
            pageTableEntiresElement.appendChild(element);
            this._listOfVisiblePageTableEntries.push(element);
            this._pageTableObserver.observe(element);
        }
        // Jump to lowest available address to prevent endless scrolling.
        this._document.querySelector(`[data-page-number="${"0x" + firstPageNumberToRead.toString(16)}"]`)!.scrollIntoView();
        return;
    }

    /**
     * This method reloads the view of the Page Table depending on the visible Page Table entries.
     */
    public async reloadPageTableView(): Promise<void> {
        const pageTableEntiresElement: HTMLElement | null = this._document.getElementById("page-table-entries");
        if (pageTableEntiresElement === null) {
            return;
        }
        if (pageTableEntiresElement.innerText !== "") {
            pageTableEntiresElement.innerHTML = "";
            // Disconnect obersever, which results in no element beeing observed.
            this._pageTableObserver.disconnect();
        }
        // Read physical memory address from the last element, which should have the lowest visible memory address.
        const firstPageNumberToRead: number =
            parseInt(this._listOfVisiblePageTableEntries.at(this._listOfVisiblePageTableEntries.length - 1)!.getAttribute("data-page-number")!);
        // Read physical memory address from the first element, which should have the highest visible memory adress.
        const lastPageNumberToRead: number = parseInt(this._listOfVisiblePageTableEntries.at(0)!.getAttribute("data-page-number")!);
        const ramCells: Map<number, number> =
            await this._window.mainMemory.readPageTableEntries(firstPageNumberToRead, lastPageNumberToRead);
        for (const [pageNumber, pageTableEntry] of Array.from(ramCells).reverse()) {
            const presentFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(0, 1) === "1") ? true : false;
            const writableFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(1, 2) === "1") ? true : false;
            const executableFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(2, 3) === "1") ? true : false;
            const accessableOnlyInKernelModeFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(3, 4) === "1") ? true : false;
            const pinnedFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(4, 5) === "1") ? true : false;
            const changedFlag: boolean = (pageTableEntry.toString(2).padStart(32, "0").slice(5, 6) === "1") ? true : false;
            const pageFrameNumberHexString = `0x${parseInt(pageTableEntry.toString(2).padStart(32, "0").slice(-Renderer.NUMBER_BITS_PAGE_FRAME_ADDRESS), 2)}`;
            const element: HTMLElement = this.createPageTableEntryElement(
                "0x" + pageNumber.toString(16),
                presentFlag,
                writableFlag,
                executableFlag,
                accessableOnlyInKernelModeFlag,
                pinnedFlag,
                changedFlag,
                pageFrameNumberHexString
            );
            pageTableEntiresElement.appendChild(element);
            this._listOfVisiblePageTableEntries.push(element);
            this._pageTableObserver.observe(element);
        }
        // Jump to lowest available address to prevent endless scrolling.
        this._document.querySelector(`[data-page-number="${"0x" + firstPageNumberToRead.toString(16)}"]`)!.scrollIntoView();
        return;
    }

    /**
     * This method reads the content of the EAX register.
     */
    public async readEAX(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readEAX(radix);
        if (this._eax !== null) {
            this._eax.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the EBX register.
     */
    public async readEBX(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readEBX(radix);
        if (this._ebx !== null) {
            this._ebx.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the ECX register.
     */
    public async readECX(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readECX(radix);
        if (this._ecx !== null) {
            this._ecx.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the ECX register.
     */
    public async readEDX(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readEDX(radix);
        if (this._edx !== null) {
            this._edx.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the FLAGS register.
     */
    public async readFLAGS(): Promise<void> {
        const content: string = await this._window.simulator.readFLAGS();
        if (this._flags !== null) {
            this._flags.children.namedItem("register-content")!.textContent = content;
        }
        const bodyElement: HTMLElement = this._document.getElementsByTagName("body")[0];
        // Check if kernel mode is enabled.
        if (content[0] === "1" && content[1] === "1") {
            // Kernel mode is enabled. Display pulse animation.
            bodyElement.classList.add("pulse");
        } else {
            // Kernel mode is not enabled. Remove pulse animation.
            bodyElement.classList.remove("pulse");
        }
        return;
    }

    /**
     * This method reads the content of the EIR register.
     */
    public async readEIR(): Promise<void> {
        const content: string = await this._window.simulator.readEIR();
        if (this._eir !== null) {
            this._eir.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the NPTP register.
     */
    public async readNPTP(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readNPTP(radix);
        if (this._nptp !== null) {
            this._nptp.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the VMPTR register.
     */
    public async readVMPTR(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readVMPTR(radix);
        if (this._vmptr !== null) {
            this._vmptr.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the ESP register.
     */
    public async readESP(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readESP(radix);
        if (this._esp !== null) {
            this._esp.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the ITP register.
     */
    public async readITP(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readITP(radix);
        if (this._itp !== null) {
            this._itp.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the GPTP register.
     */
    public async readGPTP(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readGPTP(radix);
        if (this._gptp !== null) {
            this._gptp.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method reads the content of the PTP register.
     */
    public async readPTP(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readPTP(radix);
        if (this._ptp !== null) {
            this._ptp.children.namedItem("register-content")!.textContent = content;
        }
        return;
    }

    /**
     * This method highlights a row in the RAM display element. If it is a virtual address it gets translated to a physical address first.
     * @param targetAddress The target address to highlight.
     * @param isVirtualAddress Is the target address a virtual address or a physical address.
     */
    public async highlightRamElement(targetAddress: number, isVirtualAddress: boolean = false): Promise<void> {
        const inputBoxStart: HTMLInputElement = this._document.getElementById("ram-input-box-start") as HTMLInputElement;
        const inputBoxEnd: HTMLInputElement = this._document.getElementById("ram-input-box-end") as HTMLInputElement;
        const detailedRAMViewTable = this._document.getElementById("ram-table") as HTMLTableCellElement;
        const tableBody = detailedRAMViewTable.getElementsByTagName('tbody')[0];
        
        let physicalAddress = targetAddress;
        if (isVirtualAddress) {
            physicalAddress = await this._window.mainMemory.translateVirtualAddress(DoubleWord.fromNumber(Number(targetAddress)));
        }

        const blocksBefore: number = this.ramDataRepresentation === "UTF-8" ? 5 : Math.min(5, Math.floor(physicalAddress / this.ramBlockSize));
        const blocksAfter: number = this.ramDataRepresentation === "UTF-8" ? 12 : 6;

        let startAddress = physicalAddress - (blocksBefore * this.ramBlockSize);
        const endAddress = physicalAddress + (blocksAfter * this.ramBlockSize) - 1;
        if (startAddress < 0) {
            startAddress = 0;
        }
        inputBoxStart.value = "0x" + startAddress.toString(16);
        inputBoxEnd.value = "0x" + endAddress.toString(16);
        this.ramViewStartAddress = startAddress;
        this.ramViewEndAddress = endAddress;
        const targetAddressIndex: number = await this.createUpdateDetailedRamViewTable(this.ramViewStartAddress, this.ramViewEndAddress, physicalAddress);
        const rowIndex = this.ramDataRepresentation === "UTF-8" ? targetAddressIndex : blocksBefore;
        const tableRow = tableBody.rows[rowIndex];
        for (const cell of tableRow.cells) {
            cell.classList.add("highlighted");
            cell.scrollIntoView();
        }
    }

    /**
     * This method reads the content of the EIP register.
     */
    public async readEIP(radix: NumberSystem): Promise<void> {
        const content: string = await this._window.simulator.readEIP(radix);
        const hexContent: string = await this._window.simulator.readEIP(NumberSystem.HEX);
        if (this._eip !== null) {
            this._eip.children.namedItem("register-content")!.textContent = content;
            if (this.ramViewFollowEip) {
                await this.highlightRamElement(Number(hexContent), true);
            }
        }
        return;
    }

    /**
     * Performs the next CPU cycle (fetch, decode, execute).
     */
    public async cycle(): Promise<void> {
        if (!this.programLoaded) {
            alert("No programm is currently loaded!");
            return;
        }
        if (!await this._window.simulator.nextCycle()) {
            //alert("Programm finished execution.");
        }
        // TODO: Fix bug!
        // await this.reloadPageTableView();
        await this.readEAX(this.dataRepresentationEAX);
        await this.readEBX(this.dataRepresentationEBX);
        await this.readECX(this.dataRepresentationECX);
        await this.readEDX(this.dataRepresentationEDX);
        await this.readFLAGS();
        await this.readEIP(this.dataRepresentationEIP);
        // TODO: Hide until a new place for the GUI element, representing the EIR register, is found.
        // await renderer.readEIR();
        await this.readESP(this.dataRepresentationESP);
        await this.readPTP(this.dataRepresentationPTP);
        await this.readGPTP(this.dataRepresentationGPTP);
        await this.readITP(this.dataRepresentationITP);
        await this.readNPTP(this.dataRepresentationNPTP);
        await this.readVMPTR(this.dataRepresentationVMPTR);
        if (!this.ramViewFollowEip) {
            await this.createUpdateDetailedRamViewTable(this.ramViewStartAddress, this.ramViewEndAddress);
        }
        return;
    }


    public async clearLog(): Promise<void> {
        const log: HTMLElement | null = document.getElementById("log");
        if (log !== null) {
            log.children.namedItem("log-content")!.textContent = "";
        }
        return;
    }

    /**
     * This method updates the log-widget with a message.
     * @param message The message that gets appended to the log-widget. 
     */
    public async updateLog(message: string): Promise<void> {
        const log: HTMLElement | null = document.getElementById("log");
        if (log !== null) {
            log.children.namedItem("log-content")!.insertAdjacentElement("beforeend", document.createElement("br"));
            log.children.namedItem("log-content")!.insertAdjacentText("beforeend", message);
            log.children.namedItem("log-content")!.scrollTop = log.children.namedItem("log-content")!.scrollHeight;
        }
        return;
    }

    public async hideLog(): Promise<void> {
        const log: HTMLElement | null = document.getElementById("log-section");
        if (log !== null) {
            log.style.display = "none";
        }
        return;
    }

    public async showLog(): Promise<void> {
        const logSection: HTMLElement | null = document.getElementById("log-section");
        const log: HTMLElement | null = document.getElementById("log");
        if (logSection && log !== null) {
            logSection.style.display = "block";
            log.children.namedItem("log-content")!.scrollTop = log.children.namedItem("log-content")!.scrollHeight;
        }
        return;
    }

    public async hideConsole(): Promise<void> {
        const console: HTMLElement | null = document.getElementById("console-section");
        if (console !== null) {
            console.style.display = "none";
        }
        return;
    }

    public async showConsole(): Promise<void> {
        const consoleSection: HTMLElement | null = document.getElementById("console-section");
        const console: HTMLElement | null = document.getElementById("console");
        if (consoleSection && console !== null) {
            consoleSection.style.display = "block";
            console.children.namedItem("console-input-container")!.scrollTop = console.children.namedItem("console-input-container")!.scrollHeight;
        }
        return;
    }

    public async updateConsole(message: string): Promise<void> {
        const consoleOutput: HTMLElement | null = document.getElementById("console-output");
        const consoleInputContainer: HTMLElement | null = document.getElementById("console-input-container");
        if (consoleOutput && consoleInputContainer !== null) {
            consoleOutput.insertAdjacentElement("beforeend", document.createElement("br"));
            consoleOutput.insertAdjacentText("beforeend", message);
            consoleInputContainer.scrollTop = consoleInputContainer.scrollHeight;
        }
        return;
    }
    /**
     * This method builds the table rows for the RAM display element, displaying the content as numerical values.
     * @param physicalAddressStart The start address of the display range.
     * @param physicalAddressEnd The end address of the display range.
     * @param ramTableBody The table body element that is used to display the RAM view.
     */
    public async createRamViewRowsNumeric(physicalAddressStart: number, physicalAddressEnd: number, ramTableBody: HTMLTableSectionElement): Promise<void> {
        let tableRow: HTMLTableRowElement = this._document.createElement("tr");     
        let physicalAddressColumn = tableRow.insertCell();
        let virtualAddressColumn = tableRow.insertCell();

        const ramCells: Map<number, number> = await this._window.mainMemory.readRangeFromPhysicalMemory(physicalAddressStart, physicalAddressEnd);

        for (const [index,[physicalAddress, ramCellContent]] of Array.from(ramCells).entries()) {
            //Create Byte cells in the row and fill with data.
            const byteData = tableRow.insertCell();
            switch (this.ramDataRepresentation) {
                case "BIN":
                    byteData.innerHTML = ramCellContent.toString(2).padStart(8, "0");
                    break;
                case "DEC":
                    byteData.innerHTML = ramCellContent.toString(10);
                    break;
                case "HEX":
                    byteData.innerHTML = `0x${ramCellContent.toString(16)}`;
                    break;
            }
            
            const virtualAddresses: VirtualAddress[] = await this.reverseMemoryMapSearch(physicalAddress);
            for (const virtualAddress of virtualAddresses) {
                virtualAddressColumn.append(`0x${virtualAddress.toString(16)}`);
                const rowBreak: HTMLBRElement = this._document.createElement("br");
                virtualAddressColumn.appendChild(rowBreak);
            }

            //If one row is completed, depending on ram block size, push the row and create a new one.
            if ((index + 1) % this.ramBlockSize === 0) {
                const startAddressString: string = `0x${(physicalAddress - (this.ramBlockSize - 1)).toString(16)}`;
                const endAddressString: string = `0x${physicalAddress.toString(16)}`;
                if (this.ramBlockSize === 1) {
                    physicalAddressColumn.innerHTML = endAddressString;
                } else {
                    physicalAddressColumn.innerHTML = `${startAddressString} - ${endAddressString}`;
                }
                ramTableBody.appendChild(tableRow);
                tableRow = this._document.createElement("tr");
                physicalAddressColumn = tableRow.insertCell();
                virtualAddressColumn = tableRow.insertCell();
            }
        }
    }

    /**
     * This method builds the table rows for the RAM display element, displaying the content as characters.
     * @param physicalAddressStart The start address of the display range.
     * @param physicalAddressEnd The end address of the display range.
     * @param ramTableBody The table body element that is used to display the RAM view.
     * @param targetAddress An address to find the row index for inside the table body.
     * @returns The row index of the target address in the table body.
     */
    public async createRamViewRowsUtf8(physicalAddressStart: number, physicalAddressEnd: number, ramTableBody: HTMLTableSectionElement, targetAddress: number = 0): Promise<number> {
        const masks = [0b1000_0000, 0b1110_0000, 0b1111_0000, 0b1111_1000];
        const templates = [0b0000_0000, 0b1100_0000, 0b1110_0000, 0b1111_0000];
        const ramCells: Map<number, number> = await this._window.mainMemory.readRangeFromPhysicalMemory(physicalAddressStart, physicalAddressEnd);
        const ramContent = Uint8Array.from(ramCells.values());
        const utf8decoder = new TextDecoder("UTF-8");
        let targetAddressIndex:number = 0;
        let characterCounter: number = 0;

        for (let i = 0; i < ramContent.length;) {
            const tableRow: HTMLTableRowElement = this._document.createElement("tr");
            let characterSize = 1;
            //Find out size of utf8 character in byte
            for (let j = 0; j < 4; ++j) {
                const charMasked = (ramContent[i] & masks[j]);
                if (charMasked === templates[j]) {
                    characterSize = (j +1);
                    break;
                }
            }
            const character = ramContent.slice(i, (i + characterSize));
            const characterString = utf8decoder.decode(character);
            const physicalAddressColumn = tableRow.insertCell();
            const virtualAddressColumn = tableRow.insertCell();
            if (characterSize === 1) {
                if ((physicalAddressStart + i) === targetAddress) {
                    targetAddressIndex = characterCounter;
                }
                ++characterCounter;
                physicalAddressColumn.innerHTML = "0x" + (physicalAddressStart + i).toString(16);
                const virtualAddresses: VirtualAddress[] = await this.reverseMemoryMapSearch(physicalAddressStart + i);
                for (const virtualAddress of virtualAddresses) {
                    virtualAddressColumn.append(`0x${virtualAddress.toString(16)}`);
                    const rowBreak: HTMLBRElement = this._document.createElement("br");
                    virtualAddressColumn.appendChild(rowBreak);
                }
            } else {
                const address: number = (physicalAddressStart + i + (characterSize - 1));
                const endAddress: number = address < physicalAddressEnd ? address : physicalAddressEnd;
                const startAddress: number = physicalAddressStart + i;
                physicalAddressColumn.innerHTML = `0x${(physicalAddressStart + i).toString(16)} - 0x${(endAddress).toString(16)}`;

                const virtualAddressesStart: VirtualAddress[] = await this.reverseMemoryMapSearch(physicalAddressStart + i);
                const VirtualAddressesEnd: VirtualAddress[] = await this.reverseMemoryMapSearch(endAddress);
                if (targetAddress >= startAddress && targetAddress <= endAddress) {
                    targetAddressIndex = characterCounter;
                }
                ++characterCounter;
                for (let i = 0; i < virtualAddressesStart.length; i++) {
                    const virtualAddressFrom = "0x" + virtualAddressesStart[i].toString(16);
                    const virtualAddressTo= "0x" + VirtualAddressesEnd[i].toString(16);
                    virtualAddressColumn.append(virtualAddressFrom + " - " + virtualAddressTo);
                    const rowBreak: HTMLBRElement = this._document.createElement("br");
                    virtualAddressColumn.appendChild(rowBreak);
                }
            }            
            const stringCell = tableRow.insertCell();
            stringCell.innerHTML = characterString;
            ramTableBody.appendChild(tableRow);
            i += characterSize;
        }
        return targetAddressIndex;
    }

    /**
     * This method builds the table rows for the RAM display element, displaying the content as assembly instructions
     * @param physicalAddressStart The start address of the display range.
     * @param physicalAddressEnd The end address of the display range.
     * @param ramTableBody The table body element that is used to display the RAM view.
     */
    public async createRamViewRowsAssembly(physicalAddressStart: number, physicalAddressEnd: number, ramTableBody: HTMLTableSectionElement): Promise<void> {
        const ramCells: Map<number, Byte> = await this._window.mainMemory.readRangeFromPhysicalMemory(physicalAddressStart, physicalAddressEnd);
        const ramContent: Array<Byte> = Array.from(ramCells.values());
        for (let i = 0; i < ramContent.length;) {
            const tableRow: HTMLTableRowElement = this._document.createElement("tr");
            const binary = ramContent.slice(i, (i + this.ramBlockSize));
            const instructionString = await this.getInstructionText(binary);

            const physicalAddressColumn = tableRow.insertCell();
            const virtualAddressColumn = tableRow.insertCell();
            const assemblyInstruction = tableRow.insertCell();

            const virtualAddressesStart: VirtualAddress[] = await this.reverseMemoryMapSearch(physicalAddressStart + i);
            const VirtualAddressesEnd: VirtualAddress[] = await this.reverseMemoryMapSearch(physicalAddressStart + i + (this.ramBlockSize - 1));

            for (let i = 0; i < virtualAddressesStart.length; i++) {
                const virtualAddressFrom = "0x" + virtualAddressesStart[i].toString(16);
                const virtualAddressTo= "0x" + VirtualAddressesEnd[i].toString(16);
                virtualAddressColumn.append(virtualAddressFrom + " - " + virtualAddressTo);
                const rowBreak: HTMLBRElement = this._document.createElement("br");
                virtualAddressColumn.appendChild(rowBreak);
            }

            const addressFrom = "0x" + (physicalAddressStart + i).toString(16);
            const addressTo = "0x" + (physicalAddressStart + i + (this.ramBlockSize - 1)).toString(16);
            physicalAddressColumn.innerHTML = addressFrom + " - " + addressTo;
            assemblyInstruction.innerHTML = instructionString;
            ramTableBody.appendChild(tableRow);
            i += this.ramBlockSize;
        }
    }

    /**
     * This method creates the table header for the RAM display.
     * @param dataMode The data representation mode.
     */
    public createTableHeader(dataMode: string): void {
        const detailedRAMViewTable = this._document.getElementById("ram-table") as HTMLTableCellElement;
        const tableHead = detailedRAMViewTable.getElementsByTagName('thead')[0];
        tableHead.innerHTML = "";
        const tableRow = tableHead.insertRow();
        const physicalAddressHead = tableRow.insertCell();
        physicalAddressHead.innerHTML = "Physical Address";
        const virtualAddressHead = tableRow.insertCell();
        virtualAddressHead.innerHTML = "Virtual Address";

        if (dataMode === "HEX" || dataMode === "BIN" || dataMode === "DEC") {
            for (let i = 0; i < this.ramBlockSize; ++i) {
                const byteHead = tableRow.insertCell();
                byteHead.innerHTML = `Byte ${i}`;
            }
        } else if (dataMode === "UTF-8") {
            const characterHead = tableRow.insertCell();
            characterHead.innerHTML = "Char"
        } else if (dataMode === "ASSEMBLY") {
            const instructionHead = tableRow.insertCell();
            instructionHead.innerHTML = "Assembly Instruction";
        }
        
    }

    /**
     * This method creates or updates the RAM view GUI element.
     * @param physicalStartAddress The start address of the display range.
     * @param physicalEndAddress The end address of the display range.
     * @param targetAddress An address to find the row index for inside the table body.
     * @returns The row index of the target address in the table body.
     */
    public async createUpdateDetailedRamViewTable(physicalStartAddress: number, physicalEndAddress: number, targetAddress: number = 0): Promise<number> {
        const dataMode: string = this.ramDataRepresentation;
        this.createTableHeader(dataMode);
        const detailedRAMViewTable = this._document.getElementById("ram-table") as HTMLTableCellElement;
        const tableBody = detailedRAMViewTable.getElementsByTagName('tbody')[0];
        tableBody.innerHTML = "";
        let targetAddressIndex: number = 0;

        if (dataMode === "HEX" || dataMode === "BIN" || dataMode === "DEC") {
            await this.createRamViewRowsNumeric(physicalStartAddress, physicalEndAddress,tableBody);
        } else if (dataMode === "UTF-8") {
            targetAddressIndex = await this.createRamViewRowsUtf8(physicalStartAddress, physicalEndAddress, tableBody, targetAddress);
        } else if (dataMode === "ASSEMBLY") {
            await this.createRamViewRowsAssembly(physicalStartAddress, physicalEndAddress, tableBody);
        }
        return targetAddressIndex;
    }

    /**
     * This method translates assembly instructions back to the human readable format.
     * @param instructions Assembly instructions in form of a byte array.
     * @returns An array of human readable assembly instructions.
     */
    public async getInstructionText(instructions: Array<Byte>): Promise<string> {
        const instruction = DoubleWord.fromBytes(instructions[0], instructions[1], instructions[2], instructions[3]);

        const type: string = InstructionTypes[DoubleWord.getBitRange(instruction, 0, 3)];
        const operation: string =  InstructionSet[DoubleWord.getBitRange(instruction, 5, 12)];

        if (type === undefined || operation === undefined) {
            return "UNKNOWN";
        }
        let assemblyString = operation;
        
        const addrModeFirstOp: number =  DoubleWord.getBitRange(instruction, 14, 16);
        const firstOpType: number =  DoubleWord.getBitRange(instruction, 16, 23);

        if (addrModeFirstOp === undefined || firstOpType === undefined) {
            return "UNKNOWN";
        } else if (firstOpType === OperandTypes.NO) {
            return assemblyString;
        }

        const firstOperand = DoubleWord.fromBytes(instructions[4], instructions[5], instructions[6], instructions[7]);
        
        if (operation === "INT") {
            assemblyString += " " + InterruptNumbers[firstOperand];
        } else if (operation === "DEV") {
            assemblyString += " " + DevOperations[firstOperand];
        } else if (firstOpType === OperandTypes.IMMEDIATE ) {
            assemblyString += " $0x" + firstOperand.toString(16);
        } else if (firstOpType === OperandTypes.MEMORY_ADDRESS) {
            assemblyString += " @0x" + firstOperand.toString(16);
        } else {
            const registerName: string = RegisterNumbers[firstOperand];
            if (registerName === undefined) {
                return "UNKNOWN"
            }
            if (addrModeFirstOp === AddressingModes.INDIRECT) {
                assemblyString += " *%" + registerName;
            } else {
                assemblyString += " %" + registerName;
            }
        }
        
        const addrModeSecondOp: number =  DoubleWord.getBitRange(instruction, 23, 25);
        const secondOpType: number =  DoubleWord.getBitRange(instruction, 25);

        if (addrModeSecondOp === undefined || secondOpType === undefined) {
            return "UNKNOWN";
        } else if (secondOpType === OperandTypes.NO) {
            return assemblyString;
        }

        const secondOperand = DoubleWord.fromBytes(instructions[8], instructions[9], instructions[10], instructions[11]);
        
        if (secondOpType === OperandTypes.IMMEDIATE ) {
            assemblyString += ", $0x" + secondOperand.toString(16);
        } else if (secondOpType === OperandTypes.MEMORY_ADDRESS) {
            assemblyString += ", @0x" + secondOperand.toString(16);
        } else {
            const registerName: string = RegisterNumbers[secondOperand];
            if (registerName === undefined) {
                return "UNKNOWN"
            }
            if (addrModeSecondOp === AddressingModes.INDIRECT) {
                assemblyString += ", *%" + registerName;
            } else {
                assemblyString += ", %" + registerName;
            }
        }
        
        return assemblyString;
    }

    /**
     * This method searches through the reverse memory map inside the MMU and finds all virtual memory addresses that map to a physical memory address.
     * @param physicalAddress The physical memory address to find all virtual memory addresses for that map to that physical memory address.
     * @returns An array of double words representing virtual memory addresses.
     */
    public async reverseMemoryMapSearch(physicalAddress: number): Promise<VirtualAddress[]> {
        const kernelSpaceStart: number = 0xC0000000;
        const kernelSpaceEnd: number = 0xFFFFFFFF;
        const virtualAddresses: VirtualAddress[] = await this._window.mainMemory.findVirtualAddresses(PhysicalAddress.fromNumber(physicalAddress));
        if (physicalAddress <= kernelSpaceEnd && physicalAddress >= kernelSpaceStart) {
            virtualAddresses.push(VirtualAddress.fromNumber(physicalAddress));
        }
        return virtualAddresses;
    }

}