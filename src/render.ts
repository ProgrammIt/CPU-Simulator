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
    renderRAMCells(await window.mainMemory.readCells());
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
    renderRAMCells(await window.mainMemory.readCells());
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

function renderRAMCells(ram: Map<string, string>) {
    if (ram.size === 0) {
        throw Error("RAM object has no memory cells.")
    }

    const ramCellsHTMLElement: HTMLElement | null = document.getElementById("ram-cells");
    ramCellsHTMLElement!.textContent = "";
    var lastHexAddress: string = "";

    if (ramCellsHTMLElement !== null) {
        for (const [key, value] of Array.from(ram).reverse()) {
            const labelRamCellHTMLElement: HTMLElement = document.createElement("label");
            const divRamCellHTMLElement: HTMLElement = document.createElement("div");
            const diffCurrentAndLatestAddressDec = parseInt(lastHexAddress, 16) - parseInt(key, 16);
            if (lastHexAddress.length !== 0 && diffCurrentAndLatestAddressDec > 1) {
                // Adding placeholders in the view as an indicator for empty and thus skipped memory cells
                const labelSpacerHTMLElement: HTMLElement = document.createElement("label");
                labelSpacerHTMLElement.innerHTML = "...";
                labelSpacerHTMLElement.setAttribute("class", "ram-spacer");

                const divSpacerHTMLElement: HTMLElement = document.createElement("div");
                divSpacerHTMLElement.innerHTML = "...";
                divSpacerHTMLElement.setAttribute("class", "ram-spacer");

                ramCellsHTMLElement.appendChild(labelSpacerHTMLElement);
                ramCellsHTMLElement.appendChild(divSpacerHTMLElement);
            }
            labelRamCellHTMLElement.innerHTML = key;
            labelRamCellHTMLElement.setAttribute("for", `ram-cell-${key}`);
            labelRamCellHTMLElement.setAttribute("class", "ram-cell-label");
                
            divRamCellHTMLElement.innerHTML = value;
            divRamCellHTMLElement.setAttribute("id", `ram-cell-${key}`);
            divRamCellHTMLElement.setAttribute("class", "ram-cell");
            
            ramCellsHTMLElement.appendChild(labelRamCellHTMLElement);
            ramCellsHTMLElement.appendChild(divRamCellHTMLElement);
            lastHexAddress = `${key}`;
        }
    }
}