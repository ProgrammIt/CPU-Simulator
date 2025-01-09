var eax: HTMLElement | null;
var ebx: HTMLElement | null;
var eip: HTMLElement | null;
var eflags: HTMLElement | null;
var eir: HTMLElement | null;
var nptp: HTMLElement | null;
var vmptr: HTMLElement | null;
var esp: HTMLElement | null;
var itp: HTMLElement | null;
var gptp: HTMLElement | null;
var ptp: HTMLElement | null;
var ramObserver: IntersectionObserver;
const listOfVisibleRAMGuiElements: Array<Element> = new Array<Element>();

const ramObserverCallback: IntersectionObserverCallback = async (entries) => {
    const ramCellsHTMLElement: HTMLElement | null = document.getElementById("ram-cells");
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
                const binaryStringContent: string = await window.mainMemory.readFromMainMemory(`0x${nextHigherPhysicalAddressHexString}`);
                const element: Element = createRAMGuiElement(`0x${nextHigherPhysicalAddressHexString}`, binaryStringContent);
                ramObserver.observe(element);
                ramCellsHTMLElement.insertBefore(element, ramCellsHTMLElement.firstElementChild);
                listOfVisibleRAMGuiElements.unshift(element);
                ramObserver.unobserve(ramCellsHTMLElement.lastElementChild!);
                listOfVisibleRAMGuiElements.splice(listOfVisibleRAMGuiElements.indexOf(ramCellsHTMLElement.lastElementChild!), 1);
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
                const binaryStringContent: string = await window.mainMemory.readFromMainMemory(`0x${nextLowerPhysicalAddressHexString}`);
                const element: Element = createRAMGuiElement(`0x${nextLowerPhysicalAddressHexString}`, binaryStringContent);
                ramObserver.observe(element);
                ramCellsHTMLElement.appendChild(element);
                listOfVisibleRAMGuiElements.push(element);
                ramObserver.unobserve(ramCellsHTMLElement.firstElementChild!);
                listOfVisibleRAMGuiElements.splice(listOfVisibleRAMGuiElements.indexOf(ramCellsHTMLElement.firstElementChild!), 1);
                ramCellsHTMLElement.removeChild(ramCellsHTMLElement.firstElementChild!);
            }
        } else {
            // Element not in the viewport.
            entry.target.classList.add("invisible");
        }
    }
}

/**
 * This method initializes the view of the physical RAM by reading the first twenty
 * entries of the main memory and creating HTMLElements, which represents the individual 
 * RAM cells.
 */
async function initializeRAMView(observer: IntersectionObserver): Promise<void> {
    const ramCellsHTMLElement: HTMLElement | null = document.getElementById("ram-cells");
    if (!ramCellsHTMLElement) {
        return;
    }
    const firstPhysicalAddressToReadHex: string = "0x0";
    const lastPhysicalAddressToReadHex: string = `0x${(30).toString(16)}`;
    const ramCells: Map<string, string> = await window.mainMemory.readRangeFromMainMemory(firstPhysicalAddressToReadHex, lastPhysicalAddressToReadHex);
    for (const [physicalAddressHexString, binaryStringContent] of Array.from(ramCells).reverse()) {
        const element: HTMLElement = createRAMGuiElement(physicalAddressHexString, binaryStringContent);
        ramCellsHTMLElement.appendChild(element);
        listOfVisibleRAMGuiElements.push(element);
        observer.observe(element);
    }
    // Jump to lowest available address to prevent endless scrolling.
    document.querySelector(`[data-physical-address="${firstPhysicalAddressToReadHex}"]`)!.scrollIntoView();
    // document.querySelector(`[data-physical-address="${firstPhysicalAddressToReadHex}"]`)!.scrollIntoView({ behavior: 'smooth' });
}

/**
 * This method creates an HTMLElement representing a RAM cell. This element consist out of a label with the 
 * pyhsical memory address and the binary content of the main memory at this address.
 * @param physicalAddressHexString The physical memory address of the RAM cell.
 * @param binaryStringContent The binary content of this RAM cell.
 * @returns A HTMLElement representing a RAM cell.
 */
function createRAMGuiElement(physicalAddressHexString: string, binaryStringContent: string): HTMLElement {
    const divRamCellHTMLElement: HTMLElement = document.createElement("div");
    const labelRamCellAddressHTMLElement: HTMLElement = document.createElement("label");
    const divRamCellContentHTMLElement: HTMLElement = document.createElement("div");

    divRamCellHTMLElement.setAttribute("class", "ram-cell");
    divRamCellHTMLElement.setAttribute("data-physical-address", `${physicalAddressHexString}`);

    labelRamCellAddressHTMLElement.innerHTML = physicalAddressHexString;
    labelRamCellAddressHTMLElement.setAttribute("for", `ram-${physicalAddressHexString}`);
    labelRamCellAddressHTMLElement.setAttribute("class", "ram-cell-address");
                
    divRamCellContentHTMLElement.innerHTML = binaryStringContent;
    divRamCellContentHTMLElement.setAttribute("id", `ram-${physicalAddressHexString}`);
    divRamCellContentHTMLElement.setAttribute("class", "ram-cell-content");
            
    divRamCellHTMLElement.appendChild(labelRamCellAddressHTMLElement);
    divRamCellHTMLElement.appendChild(divRamCellContentHTMLElement);
    return divRamCellHTMLElement;
}

window.onload = async () => {
    eax = document.getElementById("eax");
    ebx = document.getElementById("ebx");
    eip = document.getElementById("eip");
    eflags = document.getElementById("eflags");
    eir = document.getElementById("eir");
    nptp = document.getElementById("nptp");
    vmptr = document.getElementById("vmptr");
    esp = document.getElementById("esp");
    itp = document.getElementById("itp");
    gptp = document.getElementById("gptp");
    ptp = document.getElementById("ptp");
    ramObserver = new IntersectionObserver(ramObserverCallback, {
        root: null,             // Viewport is root element.
        rootMargin: "0px",      // Margin for root element.
        threshold: 0            // The element will be displayed, if it enters the rootMargin.
    });

    readEAX();
    readEBX();
    readEFLAGS();
    readEIP();
    readEIR();
    readESP();
    readGPTP();
    readITP();
    readNPTP();
    readVMPTR();
    initializeRAMView(ramObserver);
}

async function cycle() {    
    if (!await window.simulator.nextCycle()) {
        alert("Programm finished execution.")
    }
    readEAX();
    readEBX();
    readEFLAGS();
    readEIP();
    readEIR();
    readESP();
    readGPTP();
    readITP();
    readNPTP();
    readVMPTR();
}

async function readEAX() {
    const content: string = await window.simulator.readEAX();
    if (eax !== null) {
        eax.innerText = content;
    }
}

async function readEBX() {
    const content: string = await window.simulator.readEBX();
    if (ebx !== null) {
        ebx.innerText = content;
    }
}

async function readEIP() {
    const content: string = await window.simulator.readEIP();
    if (eip !== null) {
        eip.innerText = content;
    }
}

async function readEFLAGS() {
    const content: string = await window.simulator.readEFLAGS();
    if (eflags !== null) {
        eflags.innerText = content;
    }
}

async function readEIR() {
    const content: string = await window.simulator.readEIR();
    if (eir !== null) {
        eir.innerText = content;
    }
}

async function readNPTP() {
    const content: string = await window.simulator.readNPTP();
    if (nptp !== null) {
        nptp.innerText = content;
    }
}

async function readVMPTR() {
    const content: string = await window.simulator.readVMPTR();
    if (vmptr !== null) {
        vmptr.innerText = content;
    }
}

async function readESP() {
    const content: string = await window.simulator.readESP();
    if (esp !== null) {
        esp.innerText = content;
    }
}

async function readITP() {
    const content: string = await window.simulator.readITP();
    if (itp !== null) {
        itp.innerText = content;
    }
}

async function readGPTP() {
    const content: string = await window.simulator.readGPTP();
    if (gptp !== null) {
        gptp.innerText = content;
    }
}

async function readPTP() {
    const content: string = await window.simulator.readPTP();
    if (ptp !== null) {
        ptp.innerText = content;
    }
}