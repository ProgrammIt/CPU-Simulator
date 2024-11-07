window.onload = () => {
    const ramCells: Map<string,string> = new Map<string, string>([
        ["0x0", "11011001"],
        ["0x1", "00101110"],
        ["0x2", "10100001"],
        ["0x3", "01100000"],
        ["0x4", "00000000"],
        ["0x5", "00000000"],
        ["0x6", "00000000"],
        ["0x7", "01100100"],
        ["0x8", "00000000"],
        ["0x9", "00000000"],
        ["0xA", "00000000"],
        ["0xB", "00000000"],
        ["0xC", "10011000"],
        ["0xD", "00101110"],
        ["0xE", "10100001"],
        ["0xF", "01100000"],
        ["0x10", "00000000"],
        ["0x11", "00000000"],
        ["0x12", "00000000"],
        ["0x13", "00000001"],
        ["0x14", "00000000"],
        ["0x15", "00000000"],
        ["0x16", "00000000"],
        ["0x17", "00000000"],
        ["0x18", "10011000"],
        ["0x19", "01111110"],
        ["0x1A", "10100001"],
        ["0x1B", "01100000"],
        ["0x1C", "00000000"],
        ["0x1D", "00000000"],
        ["0x1E", "00000000"],
        ["0x1F", "00000000"],
        ["0x20", "00000000"],
        ["0x21", "00000000"],
        ["0x22", "00000000"],
        ["0x23", "00000000"],
        ["0x24", "11111000"],
        ["0x25", "11101110"],
        ["0x26", "11100001"],
        ["0x27", "00000000"],
        ["0x28", "00000000"],
        ["0x29", "00000000"],
        ["0x2A", "00000000"],
        ["0x2B", "00000101"],
        ["0x2C", "00000000"],
        ["0x2D", "00000000"],
        ["0x2E", "00000000"],
        ["0x2F", "00000000"]
    ]);

    createRAMCells(ramCells);
}

function createRAMCells(ram: Map<string,string>) {
    if (ram === undefined || ram === null) {
        throw Error("RAM object is null");
    }

    if (ram.size === 0) {
        throw Error("RAM object has no memory cells.")
    }

    const ramCellsHTMLElement: HTMLElement | null = document.getElementById("ram-cells");
    var lastHexAddress: string = "";

    if (ramCellsHTMLElement !== null) {

        for (let [key, value] of Array.from(ram).reverse()) {
            let labelRamCellHTMLElement: HTMLElement = document.createElement("label");
            let divRamCellHTMLElement: HTMLElement = document.createElement("div");

            let diffCurrentAndLatestHexAddress = parseInt(lastHexAddress, 16) - parseInt(key, 16);

            if (lastHexAddress !== "" && diffCurrentAndLatestHexAddress > 1) {
                // Adding placeholders in the view as an indicator for empty and thus skipped memory cells
                labelRamCellHTMLElement.innerHTML = "...";
                labelRamCellHTMLElement.setAttribute("class", "ram-spacer");

                divRamCellHTMLElement.innerHTML = "...";
                divRamCellHTMLElement.setAttribute("class", "ram-spacer");
            } else {
                labelRamCellHTMLElement.innerHTML = key;
                labelRamCellHTMLElement.setAttribute("for", `ram-cell-${key}`);
                labelRamCellHTMLElement.setAttribute("class", "ram-cell-label");
                
                divRamCellHTMLElement.innerHTML = value;
                divRamCellHTMLElement.setAttribute("id", `ram-cell-${key}`);
                divRamCellHTMLElement.setAttribute("class", "ram-cell");                
            }
            
            ramCellsHTMLElement.appendChild(labelRamCellHTMLElement);
            ramCellsHTMLElement.appendChild(divRamCellHTMLElement);
            lastHexAddress = key;
        }
    }
}