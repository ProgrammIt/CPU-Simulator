/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 */

import './index.css';
import next_cycle from "./../../assets/icons/web/cycle.svg";
import { Renderer } from './renderer';

const renderer: Renderer = new Renderer(document, window);

window.onload = async () => {
	document.getElementById("next_cycle")?.setAttribute("src", next_cycle);
	document.getElementById("cycle-btn")?.addEventListener("click", async () => {
		renderer.cycle();
	});
	renderer.registerChangeListener();
	renderer.registerClickListener();
	renderer.registerRAMSearchListener();
	renderer.registerConsoleListener();
	renderer.registerAddressRangeBoxListener();
	renderer.registerDetailedRamViewSelectElement();

	await renderer.readEAX(renderer.dataRepresentationEAX);
	await renderer.readEBX(renderer.dataRepresentationEBX);
	await renderer.readECX(renderer.dataRepresentationECX);
	await renderer.readEDX(renderer.dataRepresentationEDX);
	await renderer.readFLAGS();
	await renderer.readEIP(renderer.dataRepresentationEIP);
	await renderer.readESP(renderer.dataRepresentationESP);
	await renderer.readPTP(renderer.dataRepresentationPTP);
	await renderer.readGPTP(renderer.dataRepresentationGPTP);
	await renderer.readITP(renderer.dataRepresentationITP);
	await renderer.readNPTP(renderer.dataRepresentationNPTP);
	await renderer.readVMPTR(renderer.dataRepresentationVMPTR);
};

window.simulator.onLoadedAssemblyProgram(async (path: string | Error) => {


	if (path instanceof Error) {
		alert("Program rejected. " + path.message);
		return
	}

	renderer.programLoaded = true;
	// TODO: Fix bug!
	// await renderer.createPageTableView();
	await renderer.readEAX(renderer.dataRepresentationEAX);
	await renderer.readEBX(renderer.dataRepresentationEBX);
	await renderer.readECX(renderer.dataRepresentationECX);
	await renderer.readEDX(renderer.dataRepresentationEDX);
	await renderer.readFLAGS();
	await renderer.readEIP(renderer.dataRepresentationEIP);
	// TODO: Hide until a new place for the GUI element, representing the EIR register, is found.
	// await renderer.readEIR();
	await renderer.readESP(renderer.dataRepresentationESP);
	await renderer.readPTP(renderer.dataRepresentationPTP);
	await renderer.readGPTP(renderer.dataRepresentationGPTP);
	await renderer.readITP(renderer.dataRepresentationITP);
	await renderer.readNPTP(renderer.dataRepresentationNPTP);
	await renderer.readVMPTR(renderer.dataRepresentationVMPTR);
	alert("Program accepted. Execution may start on a subsequent timer interrupt.");
});

window.simulator.onAssembledProgram(async () => {
	alert("Program assembled successfully");
});

window.simulator.onError((errorDescription: string) => {
	alert(errorDescription);
});

window.simulator.onDisableAutoScrollForPageTable(() => {
	renderer.autoScrollForPageTableEnabled = false;
	return;
});

window.simulator.onEnableAutoScrollForPageTable(() => {
	renderer.autoScrollForPageTableEnabled = true;
	return;
});

window.windowUpdate.onEnableRamFollowEip(() => {
	renderer.ramViewFollowEip = true;
	return;
})

window.windowUpdate.onDisableRamFollowEip(() => {
	renderer.ramViewFollowEip = false;
	return;
})

window.windowUpdate.onClearLog(() => {
	renderer.clearLog();
});


window.windowUpdate.onUpdateLog((value: string) => {
	renderer.updateLog(value);
});

window.windowUpdate.onHideLog(() => {
	renderer.hideLog();
});

window.windowUpdate.onShowLog(() => {
	renderer.showLog();
});

window.windowUpdate.onHideConsole(() => {
	renderer.hideConsole();
});

window.windowUpdate.onShowConsole(() => {
	renderer.showConsole();
});

window.windowUpdate.onUpdateConsole((value: string) => {
	renderer.updateConsole(value);
})