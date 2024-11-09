window.onload = async () => {
    const ramCells: Map<string,string> = await window.mainMemory.cells();
    console.log(ramCells);
    renderRAMCells(ramCells);
}

function renderRAMCells(ram: Map<string,string>) {
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
            const labelRamCellHTMLElement: HTMLElement = document.createElement("label");
            const divRamCellHTMLElement: HTMLElement = document.createElement("div");
            const diffCurrentAndLatestAddressDec = parseInt(lastHexAddress, 16) - parseInt(key, 2);

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
            
            labelRamCellHTMLElement.innerHTML = `0x${parseInt(key, 2).toString(16)}`;
            labelRamCellHTMLElement.setAttribute("for", `ram-cell-0x${parseInt(key, 2).toString(16)}`);
            labelRamCellHTMLElement.setAttribute("class", "ram-cell-label");
                
            divRamCellHTMLElement.innerHTML = value;
            divRamCellHTMLElement.setAttribute("id", `ram-cell-0x${parseInt(key, 2).toString(16)}`);
            divRamCellHTMLElement.setAttribute("class", "ram-cell");
            
            ramCellsHTMLElement.appendChild(labelRamCellHTMLElement);
            ramCellsHTMLElement.appendChild(divRamCellHTMLElement);
            lastHexAddress = `0x${parseInt(key, 2).toString(16)}`;
        }
    }
}