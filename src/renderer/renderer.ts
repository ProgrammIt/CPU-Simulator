/**
 * This enumeration is a duplicate of the one, that can be
 * found in src/types/types.ts. This is intended, as imports
 * are problematic to use in frontend. Maybe there is a solution.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 */
enum NumberSystem {
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
     * This field stores a reference to the HTMLElement representing the EIP register.
     * @readonly
     */
    private readonly _eip: HTMLElement | null;

    /**
     * This field stores the currently selected representation of the data for the EIP register.
     */
    public dataRepresentationEIP: NumberSystem;

    /**
     * This field stores a reference to the HTMLElement representing the EFLAGS register.
     * @readonly
     */
    private readonly _eflags: HTMLElement | null;

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
     * This field is used to observe the visibility of the GUI elements representing cells of the physical RAM.
     * @readonly
     */
    private readonly _physicalRAMObserver: IntersectionObserver;

    /**
     * This field is used to observe the visibility of the GUI elements representing cells of the virtual RAM.
     * @readonly
     */
    private readonly _virtualRAMObserver: IntersectionObserver;

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
     * This field stores a callback used to observe the HTMLElements representing the cells of the pyhsical RAM.
     * @param entries A list of elements, which triggered the intersection observer. 
     * @returns A callback, which is used as the logic to perform whenever elements enter or leave the observed viewspace.
     */
    private readonly _physicalRAMObserverCallback: IntersectionObserverCallback = async (entries: IntersectionObserverEntry[]) => {
        const ramCellsHTMLElement: HTMLElement | null = this._document.getElementById("physical-ram-cells");
        if (!ramCellsHTMLElement) {
            return;
        }
        for (const entry of entries) {
            if (entry.isIntersecting && entry.rootBounds !== null) {
                // Element enters viewport. Calculate the direction from which the element is entering the viewport.
                const fromTop: number = entry.intersectionRect.top;
                const fromBottom: number = entry.rootBounds.height - entry.intersectionRect.bottom;
                // Make entered element visible.
                entry.target.classList.remove("invisible");
                // Check if element enters from top of viewport.
                if (entry.target.isEqualNode(ramCellsHTMLElement.firstElementChild) && fromTop < fromBottom) {
                    // Element is scrolling in from top of viewport and is the first child node of the HTMLElement representing the RAM view.
                    // Insert element and a preceding element at the front of the list.
                    const physicalAddressHexString: string = entry.target.getAttribute("data-physical-address")!;
                    const nextHigherPhysicalAddressDec: number = parseInt(physicalAddressHexString, 16) + 1;
                    if (nextHigherPhysicalAddressDec >= Math.pow(2, 32)) {
                        return;
                    }
                    const nextHigherPhysicalAddressHexString: string = nextHigherPhysicalAddressDec.toString(16);
                    const binaryStringContent: string = await this._window.mainMemory.readFromPhysicalMemory(`0x${nextHigherPhysicalAddressHexString}`);
                    const element: Element = this.createPhysicalRAMGuiElement(`0x${nextHigherPhysicalAddressHexString}`, binaryStringContent);
                    this._physicalRAMObserver.observe(element);
                    ramCellsHTMLElement.insertBefore(element, ramCellsHTMLElement.firstElementChild);
                    this._listOfVisiblePhysicalRAMGuiElements.unshift(element);
                    this._physicalRAMObserver.unobserve(ramCellsHTMLElement.lastElementChild!);
                    this._listOfVisiblePhysicalRAMGuiElements.splice(this._listOfVisiblePhysicalRAMGuiElements.indexOf(ramCellsHTMLElement.lastElementChild!), 1);
                    ramCellsHTMLElement.removeChild(ramCellsHTMLElement.lastElementChild!);
                }
                // Check if element enters from bottom of viewport.
                if (entry.target.isEqualNode(ramCellsHTMLElement.lastElementChild) && fromTop > fromBottom) {
                    // Element is scrolling in from bottom of viewport and is the last child node of the HTMLElement representing the RAM view.
                    // Insert element at the end of the list.
                    const physicalAddressHexString: string = entry.target.getAttribute("data-physical-address")!;
                    const nextLowerPhysicalAddressDec: number = parseInt(physicalAddressHexString, 16) - 1;
                    if (nextLowerPhysicalAddressDec < 0) {
                        return;
                    }
                    const nextLowerPhysicalAddressHexString: string = nextLowerPhysicalAddressDec.toString(16);
                    const binaryStringContent: string = await this._window.mainMemory.readFromPhysicalMemory(`0x${nextLowerPhysicalAddressHexString}`);
                    const element: Element = this.createPhysicalRAMGuiElement(`0x${nextLowerPhysicalAddressHexString}`, binaryStringContent);
                    this._physicalRAMObserver.observe(element);
                    ramCellsHTMLElement.appendChild(element);
                    this._listOfVisiblePhysicalRAMGuiElements.push(element);
                    this._physicalRAMObserver.unobserve(ramCellsHTMLElement.firstElementChild!);
                    this._listOfVisiblePhysicalRAMGuiElements.splice(this._listOfVisiblePhysicalRAMGuiElements.indexOf(ramCellsHTMLElement.firstElementChild!), 1);
                    ramCellsHTMLElement.removeChild(ramCellsHTMLElement.firstElementChild!);
                }
            } else {
                // Element not in the viewport.
                entry.target.classList.add("invisible");
            }
        }
    }

    /**
     * This field stores a callback used to observe the HTMLElements representing the cells of the pyhsical RAM.
     * @param entries A list of elements, which triggered the intersection observer. 
     * @returns A callback, which is used as the logic to perform whenever elements enter or leave the observed viewspace.
     */
    private readonly _virtualRAMObserverCallback: IntersectionObserverCallback = async (entries: IntersectionObserverEntry[]) => {
        const ramCellsHTMLElement: HTMLElement | null = this._document.getElementById("virtual-ram-cells");
        if (!ramCellsHTMLElement) {
            return;
        }
        for (const entry of entries) {
            if (entry.isIntersecting && entry.rootBounds !== null) {
                // Element enters viewport. Calculate the direction from which the element is entering the viewport.
                const fromTop: number = entry.intersectionRect.top;
                const fromBottom: number = entry.rootBounds.height - entry.intersectionRect.bottom;
                // Make entered element visible.
                entry.target.classList.remove("invisible");
                // Check if element enters from top of viewport.
                if (entry.target.isEqualNode(ramCellsHTMLElement.firstElementChild) && fromTop < fromBottom) {
                    // Element is scrolling in from top of viewport and is the first child node of the HTMLElement representing the RAM view.
                    // Insert element and a preceding element at the front of the list.
                    const virtualAddressHexString: string = entry.target.getAttribute("data-virtual-address")!;
                    const nextHigherVirtualAddressDec: number = parseInt(virtualAddressHexString, 16) + 1;
                    if (nextHigherVirtualAddressDec >= Math.pow(2, 32)) {
                        return;
                    }
                    const nextHigherVirtualAddressHexString: string = nextHigherVirtualAddressDec.toString(16);
                    const binaryStringContent: string = await this._window.mainMemory.readFromVirtualMemory(`0x${nextHigherVirtualAddressHexString}`);
                    const element: Element = this.createVirtualRAMGuiElement(`0x${nextHigherVirtualAddressHexString}`, binaryStringContent);
                    this._virtualRAMObserver.observe(element);
                    ramCellsHTMLElement.insertBefore(element, ramCellsHTMLElement.firstElementChild);
                    this._listOfVisibleVirtualRAMGuiElements.unshift(element);
                    this._virtualRAMObserver.unobserve(ramCellsHTMLElement.lastElementChild!);
                    this._listOfVisibleVirtualRAMGuiElements.splice(this._listOfVisibleVirtualRAMGuiElements.indexOf(ramCellsHTMLElement.lastElementChild!), 1);
                    ramCellsHTMLElement.removeChild(ramCellsHTMLElement.lastElementChild!);
                }
                // Check if element enters from bottom of viewport.
                if (entry.target.isEqualNode(ramCellsHTMLElement.lastElementChild) && fromTop > fromBottom) {
                    // Element is scrolling in from bottom of viewport and is the last child node of the HTMLElement representing the RAM view.
                    // Insert element at the end of the list.
                    const virtualAddressHexString: string = entry.target.getAttribute("data-virtual-address")!;
                    const nextLowerVirtualAddressDec: number = parseInt(virtualAddressHexString, 16) - 1;
                    if (nextLowerVirtualAddressDec < 0) {
                        return;
                    }
                    const nextLowerVirtualAddressHexString: string = nextLowerVirtualAddressDec.toString(16);
                    const binaryStringContent: string = await this._window.mainMemory.readFromVirtualMemory(`0x${nextLowerVirtualAddressHexString}`);
                    const element: Element = this.createVirtualRAMGuiElement(`0x${nextLowerVirtualAddressHexString}`, binaryStringContent);
                    this._virtualRAMObserver.observe(element);
                    ramCellsHTMLElement.appendChild(element);
                    this._listOfVisibleVirtualRAMGuiElements.push(element);
                    this._virtualRAMObserver.unobserve(ramCellsHTMLElement.firstElementChild!);
                    this._listOfVisibleVirtualRAMGuiElements.splice(this._listOfVisibleVirtualRAMGuiElements.indexOf(ramCellsHTMLElement.firstElementChild!), 1);
                    ramCellsHTMLElement.removeChild(ramCellsHTMLElement.firstElementChild!);
                }
            } else {
                // Element not in the viewport.
                entry.target.classList.add("invisible");
            }
        }
    }

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
                    const pageTableEntries: Map<string, string> = await this._window.mainMemory.readPageTableEntries(nextHigherPageNumberDec, nextHigherPageNumberDec);
                    for (const [pageNumberHexString, pageTableEntry] of Array.from(pageTableEntries).reverse()) {
                        const presentFlag: boolean = (pageTableEntry[0].slice(0, 1) === "1") ? true : false;
                        const writableFlag: boolean = (pageTableEntry[0].slice(1, 2) === "1") ? true : false;
                        const executableFlag: boolean = (pageTableEntry[0].slice(2, 3) === "1") ? true : false;
                        const accessableOnlyInKernelModeFlag: boolean = (pageTableEntry[0].slice(3, 4) === "1") ? true : false;
                        const pinnedFlag: boolean = (pageTableEntry[0].slice(4, 5) === "1") ? true : false;
                        const changedFlag: boolean = (pageTableEntry[0].slice(5, 6) === "1") ? true : false;
                        const pageFrameNumberHexString = `0x${parseInt(pageTableEntry.slice(-Renderer.NUMBER_BITS_PAGE_FRAME_ADDRESS), 2)}`;
                        const element: HTMLElement = this.createPageTableEntryElement(
                            pageNumberHexString,
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
                    const pageTableEntries: Map<string, string> = await this._window.mainMemory.readPageTableEntries(nextLowerPageNumberDec, nextLowerPageNumberDec);
                    for (const [pageNumberHexString, pageTableEntry] of Array.from(pageTableEntries).reverse()) {
                        const presentFlag: boolean = (pageTableEntry[0].slice(0, 1) === "1") ? true : false;
                        const writableFlag: boolean = (pageTableEntry[0].slice(1, 2) === "1") ? true : false;
                        const executableFlag: boolean = (pageTableEntry[0].slice(2, 3) === "1") ? true : false;
                        const accessableOnlyInKernelModeFlag: boolean = (pageTableEntry[0].slice(3, 4) === "1") ? true : false;
                        const pinnedFlag: boolean = (pageTableEntry[0].slice(4, 5) === "1") ? true : false;
                        const changedFlag: boolean = (pageTableEntry[0].slice(5, 6) === "1") ? true : false;
                        const pageFrameNumberHexString = `0x${parseInt(pageTableEntry.slice(-Renderer.NUMBER_BITS_PAGE_FRAME_ADDRESS), 2)}`;
                        const element: HTMLElement = this.createPageTableEntryElement(
                            pageNumberHexString,
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
                        this._virtualRAMObserver.unobserve(pageTableEntriesHTMLElement.firstElementChild!);
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
                this.readEIR(true);
            } else {
                this.readEIR(false);
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
     * This field represents a flag, which enables automatic scroll for the GUIs virtual RAM widget.
     */
    public autoScrollForVirtualRAMEnabled: boolean;

    /**
     * This field represents a flag, which enables automatic scroll for the GUIs physical RAM widget.
     */
    public autoScrollForPhysicalRAMEnabled: boolean;

    /**
     * This field represents a flag, which enables automatic scroll for the GUIs Page Table widget.
     */
    public autoScrollForPageTableEnabled: boolean;

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
        this._ecx = document.getElementById("edx");
        this.dataRepresentationECX = NumberSystem.BIN;
        this._eflags = document.getElementById("eflags");
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
        this._physicalRAMObserver = new IntersectionObserver(this._physicalRAMObserverCallback, {
            root: null,             // Viewport is root element.
            rootMargin: "0px",      // Margin for root element.
            threshold: 0            // The element will be displayed, if it enters the rootMargin.
        });
        this._virtualRAMObserver = new IntersectionObserver(this._virtualRAMObserverCallback, {
            root: null,             // Viewport is root element.
            rootMargin: "0px",      // Margin for root element.
            threshold: 0            // The element will be displayed, if it enters the rootMargin.
        });
        this._pageTableObserver = new IntersectionObserver(this._pageTableObserverCallback, {
            root: null,             // Viewport is root element.
            rootMargin: "0px",      // Margin for root element.
            threshold: 0            // The element will be displayed, if it enters the rootMargin.
        })
        this._listOfVisiblePhysicalRAMGuiElements = new Array<Element>();
        this._listOfVisibleVirtualRAMGuiElements = new Array<Element>();
        this._listOfVisiblePageTableEntries = new Array<Element>();
        this.autoScrollForPhysicalRAMEnabled = true;
        this.autoScrollForVirtualRAMEnabled = true;
        this.autoScrollForPageTableEnabled = true;
        this.programLoaded = false;
        this._window = window;
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
                case "edx":
                    eventListener = this.onChangeListenerECX;
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
     * This function reloads the RAM view, by taking the visible elements into account. This is done in order to avoid
     * weird jumps in the widget, representing the physical main memory.
     */
    public async reloadPhysicalRAMView(): Promise<void> {
        const ramCellsHTMLElement: HTMLElement | null = this._document.getElementById("physical-ram-cells");
        if (!ramCellsHTMLElement) {
            return;
        }
        if (ramCellsHTMLElement.innerText !== "") {
            ramCellsHTMLElement.innerText = "";
            // Disconnect obersever, which results in no element beeing observed. 
            this._physicalRAMObserver.disconnect();
        }
        // Read physical memory address from the last element, which should have the lowest visible memory address.
        const firstPhysicalAddressToReadHex: string =
            this._listOfVisiblePhysicalRAMGuiElements.at(this._listOfVisiblePhysicalRAMGuiElements.length - 1)!.getAttribute("data-physical-address")!;
        // Read physical memory address from the first element, which should have the highest visible memory adress.
        const lastPhysicalAddressToReadHex: string = this._listOfVisiblePhysicalRAMGuiElements.at(0)!.getAttribute("data-physical-address")!;
        const ramCells: Map<string, string> =
            await this._window.mainMemory.readRangeFromPhysicalMemory(firstPhysicalAddressToReadHex, lastPhysicalAddressToReadHex);
        for (const [physicalAddressHexString, binaryStringContent] of Array.from(ramCells).reverse()) {
            const element: HTMLElement = this.createPhysicalRAMGuiElement(physicalAddressHexString, binaryStringContent);
            ramCellsHTMLElement.appendChild(element);
            this._listOfVisiblePhysicalRAMGuiElements.push(element);
            this._physicalRAMObserver.observe(element);
        }
        // Jump to lowest available address to prevent endless scrolling.
        this._document.querySelector(`[data-physical-address="${firstPhysicalAddressToReadHex}"]`)!.scrollIntoView();
        return;
    }

    /**
     * This function reloads the RAM view, by taking the visible elements into account. This is done in order to avoid
     * weird jumps in the widget, representing the virtual main memory.
     */
    public async reloadVirtualRAMView(): Promise<void> {
        const ramCellsHTMLElement: HTMLElement | null = this._document.getElementById("virtual-ram-cells");
        if (!ramCellsHTMLElement) {
            return;
        }
        if (ramCellsHTMLElement.innerText !== "") {
            ramCellsHTMLElement.innerText = "";
            // Disconnect obersever, which results in no element beeing observed. 
            this._virtualRAMObserver.disconnect();
        }
        // Read physical memory address from the last element, which should have the lowest visible memory address.
        const firstVirtualAddressToReadHex: string =
            this._listOfVisibleVirtualRAMGuiElements.at(this._listOfVisibleVirtualRAMGuiElements.length - 1)!.getAttribute("data-virtual-address")!;
        // Read physical memory address from the first element, which should have the highest visible memory adress.
        const lastVirtualAddressToReadHex: string = this._listOfVisibleVirtualRAMGuiElements.at(0)!.getAttribute("data-virtual-address")!;
        const ramCells: Map<string, string> =
            await this._window.mainMemory.readRangeFromVirtualMemory(firstVirtualAddressToReadHex, lastVirtualAddressToReadHex);
        for (const [virtualAddressHexString, binaryStringContent] of Array.from(ramCells).reverse()) {
            const element: HTMLElement = this.createVirtualRAMGuiElement(virtualAddressHexString, binaryStringContent);
            ramCellsHTMLElement.appendChild(element);
            this._listOfVisibleVirtualRAMGuiElements.push(element);
            this._virtualRAMObserver.observe(element);
        }
        // Jump to lowest available address to prevent endless scrolling.
        this._document.querySelector(`[data-virtual-address="${firstVirtualAddressToReadHex}"]`)!.scrollIntoView();
        return;
    }

    /**
     * This method initializes the view of the physical RAM by reading the first twenty
     * entries of the main memory and creating HTMLElements, which represents the individual 
     * RAM cells.
     * @param [firstPhysicalAddressToReadHex="0x0"] The first physical memory address to read from main memory in hexadecimal representation.
     * @param [lastPhysicalAddressToReadHex="0x1e"] The last physical memory address to read from main memory in hexadecimal representation.
     */
    public async createPhysicalRAMView(firstPhysicalAddressToReadHex = "0x0", lastPhysicalAddressToReadHex = "0x1e"): Promise<void> {
        const ramCellsHTMLElement: HTMLElement | null = this._document.getElementById("physical-ram-cells");
        if (!ramCellsHTMLElement) {
            return;
        }
        if (ramCellsHTMLElement.innerText !== "") {
            ramCellsHTMLElement.innerText = "";
            // Disconnect obersever, which results in no element beeing observed. 
            this._physicalRAMObserver.disconnect();
            this._listOfVisiblePhysicalRAMGuiElements = new Array<Element>();
        }
        const ramCells: Map<string, string> = await this._window.mainMemory.readRangeFromPhysicalMemory(firstPhysicalAddressToReadHex, lastPhysicalAddressToReadHex);
        for (const [physicalAddressHexString, binaryStringContent] of Array.from(ramCells).reverse()) {
            const element: HTMLElement = this.createPhysicalRAMGuiElement(physicalAddressHexString, binaryStringContent);
            ramCellsHTMLElement.appendChild(element);
            this._listOfVisiblePhysicalRAMGuiElements.push(element);
            this._physicalRAMObserver.observe(element);
        }
        // Jump to lowest available address to prevent endless scrolling.
        this._document.querySelector(`[data-physical-address="${firstPhysicalAddressToReadHex}"]`)!.scrollIntoView();
        return;
    }

    /**
     * This method initializes the view of the virtual RAM by reading the first twenty entries of the main memory 
     * and creating HTMLElements, which represents the individual RAM cells.
     * @param [firstVirtualAddressToReadHex="0x0"] The first virtual memory address to read from main memory in hexadecimal representation.
     * @param [lastVirtualAddressToReadHex="0x1e"] The last virtual memory address to read from main memory in hexadecimal representation.
     */
    public async createVirtualRAMView(firstVirtualAddressToReadHex = "0x0", lastVirtualAddressToReadHex = "0x1e"): Promise<void> {
        const ramCellsHTMLElement: HTMLElement | null = this._document.getElementById("virtual-ram-cells");
        if (!ramCellsHTMLElement) {
            return;
        }
        if (ramCellsHTMLElement.innerText !== "") {
            ramCellsHTMLElement.innerText = "";
            // Disconnect obersever, which results in no element beeing observed. 
            this._virtualRAMObserver.disconnect();
            this._listOfVisibleVirtualRAMGuiElements = new Array<Element>();
        }
        const ramCells: Map<string, string> = await this._window.mainMemory.readRangeFromVirtualMemory(firstVirtualAddressToReadHex, lastVirtualAddressToReadHex);
        for (const [virtualAddressHexString, binaryStringContent] of Array.from(ramCells).reverse()) {
            const element: HTMLElement = this.createVirtualRAMGuiElement(virtualAddressHexString, binaryStringContent);
            ramCellsHTMLElement.appendChild(element);
            this._listOfVisibleVirtualRAMGuiElements.push(element);
            this._virtualRAMObserver.observe(element);
        }
        // Jump to lowest available address to prevent endless scrolling.
        this._document.querySelector(`[data-virtual-address="${firstVirtualAddressToReadHex}"]`)!.scrollIntoView();
        return;
    }

    /**
     * This method creates an HTMLElement representing a physical RAM cell. This element consist out of a label with the 
     * pyhsical memory address and the binary content of the main memory at this address.
     * @param physicalAddressHexString The physical memory address of the RAM cell.
     * @param binaryStringContent The binary content of this RAM cell.
     * @returns A HTMLElement representing a RAM cell.
     */
    public createPhysicalRAMGuiElement(physicalAddressHexString: string, binaryStringContent: string): HTMLElement {
        const outerDivElement: HTMLElement = this._document.createElement("div");
        outerDivElement.setAttribute("class", "ram-cell widget");
        outerDivElement.setAttribute("id", `physical-ram-cell-${physicalAddressHexString}`);
        outerDivElement.setAttribute("data-physical-address", physicalAddressHexString);
        const labelDivElement: HTMLElement = this._document.createElement("label");
        labelDivElement.setAttribute("class", "lg-text");
        labelDivElement.innerHTML = physicalAddressHexString;
        const contendivivElement: HTMLElement = this._document.createElement("div");
        contendivivElement.setAttribute("class", "ram-cell-content");
        contendivivElement.setAttribute("name", "ram-cell-content");
        contendivivElement.innerText = binaryStringContent;
        outerDivElement.appendChild(labelDivElement);
        outerDivElement.appendChild(contendivivElement);
        return outerDivElement;
    }

    /**
     * This method creates an HTMLElement representing a virtual RAM cell. This element consist out of a label with the 
     * pyhsical memory address and the binary content of the main memory at this address.
     * @param virtualAddressHexString The virtual memory address of the RAM cell.
     * @param binaryStringContent The binary content of this RAM cell.
     * @returns A HTMLElement representing a RAM cell.
     */
    public createVirtualRAMGuiElement(virtualAddressHexString: string, binaryStringContent: string): HTMLElement {
        const outerDivElement: HTMLElement = this._document.createElement("div");
        outerDivElement.setAttribute("class", "ram-cell widget");
        outerDivElement.setAttribute("id", `virtual-ram-cell-${virtualAddressHexString}`);
        outerDivElement.setAttribute("data-virtual-address", virtualAddressHexString);
        const labelDivElement: HTMLElement = this._document.createElement("label");
        labelDivElement.setAttribute("class", "lg-text");
        labelDivElement.innerHTML = virtualAddressHexString;
        const contendivivElement: HTMLElement = this._document.createElement("div");
        contendivivElement.setAttribute("class", "ram-cell-content");
        contendivivElement.setAttribute("name", "ram-cell-content");
        contendivivElement.innerText = binaryStringContent;
        outerDivElement.appendChild(labelDivElement);
        outerDivElement.appendChild(contendivivElement);
        return outerDivElement;
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
     * @param [firstPageNumberToReadDec="0"] The first page number to read from Page Table.
     * @param [lastPageNumberToReadDec="30"] The last page number to read from Page Table.
     */
    public async createPageTableView(firstPageNumberToReadDec = 0, lastPageNumberToReadDec = 30): Promise<void> {
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
        const pageTableEntries: Map<string, string> =
            await this._window.mainMemory.readPageTableEntries(firstPageNumberToReadDec, lastPageNumberToReadDec);
        for (const [pageNumberHexString, pageTableEntry] of Array.from(pageTableEntries).reverse()) {
            const presentFlag: boolean = (pageTableEntry.slice(0, 1) === "1") ? true : false;
            const writableFlag: boolean = (pageTableEntry.slice(1, 2) === "1") ? true : false;
            const executableFlag: boolean = (pageTableEntry.slice(2, 3) === "1") ? true : false;
            const accessableOnlyInKernelModeFlag: boolean = (pageTableEntry.slice(3, 4) === "1") ? true : false;
            const pinnedFlag: boolean = (pageTableEntry.slice(4, 5) === "1") ? true : false;
            const changedFlag: boolean = (pageTableEntry.slice(5, 6) === "1") ? true : false;
            const pageFrameNumberHexString = `0x${parseInt(pageTableEntry.slice(-Renderer.NUMBER_BITS_PAGE_FRAME_ADDRESS), 2)}`;
            const element: HTMLElement = this.createPageTableEntryElement(
                pageNumberHexString,
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
        this._document.querySelector(`[data-page-number="${firstPageNumberToReadDec}"]`)!.scrollIntoView();
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
        const firstPageNumberToReadDec: string =
            this._listOfVisiblePageTableEntries.at(this._listOfVisiblePageTableEntries.length - 1)!.getAttribute("data-page-number")!;
        // Read physical memory address from the first element, which should have the highest visible memory adress.
        const lastPageNumberToReadDec: string = this._listOfVisiblePageTableEntries.at(0)!.getAttribute("data-page-number")!;
        const ramCells: Map<string, string> =
            await this._window.mainMemory.readPageTableEntries(firstPageNumberToReadDec, lastPageNumberToReadDec);
        for (const [pageNumberHexString, pageTableEntry] of Array.from(ramCells).reverse()) {
            const presentFlag: boolean = (pageTableEntry.slice(0, 1) === "1") ? true : false;
            const writableFlag: boolean = (pageTableEntry.slice(1, 2) === "1") ? true : false;
            const executableFlag: boolean = (pageTableEntry.slice(2, 3) === "1") ? true : false;
            const accessableOnlyInKernelModeFlag: boolean = (pageTableEntry.slice(3, 4) === "1") ? true : false;
            const pinnedFlag: boolean = (pageTableEntry.slice(4, 5) === "1") ? true : false;
            const changedFlag: boolean = (pageTableEntry.slice(5, 6) === "1") ? true : false;
            const pageFrameNumberHexString = `0x${parseInt(pageTableEntry.slice(-Renderer.NUMBER_BITS_PAGE_FRAME_ADDRESS), 2)}`;
            const element: HTMLElement = this.createPageTableEntryElement(
                pageNumberHexString,
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
        this._document.querySelector(`[data-page-number="${firstPageNumberToReadDec}"]`)!.scrollIntoView();
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
     * This method reads the content of the EIP register.
     */
    public async readEIP(radix: NumberSystem): Promise<void> {
        let content: string = await this._window.simulator.readEIP(radix);
        if (this._eip !== null) {
            this._eip.children.namedItem("register-content")!.textContent = content;
            let virtualAddressHexString = "";
            if (this.dataRepresentationEIP === NumberSystem.HEX) {
                virtualAddressHexString = content;
            } else if (this.dataRepresentationEIP === NumberSystem.DEC) {
                virtualAddressHexString = `0x${parseInt(content, 10).toString(16)}`;
            } else {
                content = content.replace(/[\s]+/g, "");
                virtualAddressHexString = `0x${parseInt(content, 2).toString(16)}`;
            }
            // Remove CSS class "highlighted" from any other HTML element(s).
            for (const element of this._document.querySelectorAll(`div[data-virtual-address="${virtualAddressHexString}"]`)) {
                if (element.classList.contains("highlighted")) {
                    element.classList.remove("highlighted");
                }
            }
            // Find HTML element representing the loaded virtual memory address.
            let element: Element | null = this._document.querySelector<Element>(`[data-virtual-address="${virtualAddressHexString}"]`);
            /**
             *  Check if automatic scroll for the virtual memory widget is enabled.
             */
            if (this.autoScrollForVirtualRAMEnabled && this.programLoaded) {
                // Check if a GUI element, representing a virtual memory address, is currently present in the document
                if (element === null) {
                    // Element is not present in document. Load it (alongside 30 addresses above and beneath) into the document.
                    let firstVirtualAddressToReadDec: number = parseInt(virtualAddressHexString, 16) - 15;
                    let lastVirtualAddressToReadDec: number = parseInt(virtualAddressHexString, 16) + 14;
                    if (firstVirtualAddressToReadDec <= 0) {
                        firstVirtualAddressToReadDec = 0;
                    }
                    if (lastVirtualAddressToReadDec >= Renderer.HIGH_ADDRESS_PHYSICAL_MEMORY_DEC) {
                        lastVirtualAddressToReadDec = Renderer.HIGH_ADDRESS_PHYSICAL_MEMORY_DEC;
                    }
                    const firstVirtualAddressToReadHex = `0x${(firstVirtualAddressToReadDec).toString(16)}`;
                    const lastVirtualAddressToReadHex = `0x${(lastVirtualAddressToReadDec).toString(16)}`;
                    await this.createVirtualRAMView(firstVirtualAddressToReadHex, lastVirtualAddressToReadHex);
                    element = this._document.querySelector<Element>(`[data-virtual-address="${virtualAddressHexString}"]`);
                }
                if (element !== null) {
                    // Scroll this element into view.
                    element.scrollIntoView();
                }
            }
            if (element !== null) {
                // Emphesize this element.
                element.classList.add("highlighted");
            }
        }
        return;
    }

    /**
     * This method reads the content of the EFLAGS register.
     */
    public async readEFLAGS(): Promise<void> {
        const content: string = await this._window.simulator.readEFLAGS();
        if (this._eflags !== null) {
            this._eflags.children.namedItem("register-content")!.textContent = content;
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
     * @param asInstruction Indicates, wethert to display the instruction in its textual representation or not.
     */
    public async readEIR(asInstruction = false): Promise<void> {
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
     * Performs the next CPU cycle (fetch, decode, execute).
     */
    public async cycle(): Promise<void> {
        if (!await this._window.simulator.nextCycle()) {
            alert("Programm finished execution.")
        }
        if (!this.programLoaded) {
            alert("No program is currently loaded!");
        }
        await this.reloadPhysicalRAMView();
        await this.reloadVirtualRAMView();
        // TODO: Fix bug!
        // await this.reloadPageTableView();
        await this.readEAX(this.dataRepresentationEAX);
        await this.readEBX(this.dataRepresentationEBX);
        await this.readECX(this.dataRepresentationECX);
        await this.readEFLAGS();
        await this.readEIP(this.dataRepresentationEIP);
        // TODO: Hide until a new place for the GUI element, representing the EIR register, is found.
        // await renderer.readEIR();
        await this.readESP(this.dataRepresentationESP);
        await this.readGPTP(this.dataRepresentationGPTP);
        await this.readITP(this.dataRepresentationITP);
        await this.readNPTP(this.dataRepresentationNPTP);
        await this.readVMPTR(this.dataRepresentationVMPTR);
        return;
    }
}