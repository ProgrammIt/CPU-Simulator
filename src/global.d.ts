/**
 * See https://stackoverflow.com/questions/66152989/contextbridge-exposeinmainworld-and-ipc-with-typescript-in-electron-app-cannot.
 */

import { mainMemory } from "./preload";

declare global {
	interface Window {mainMemory: typeof mainMemory}
}