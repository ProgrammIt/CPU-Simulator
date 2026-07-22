import { app, BrowserWindow, dialog, shell, Menu } from "electron";
import path from "node:path";
import { SimulationController } from "./simulator/SimulationController";

/**
 * The ApplicationWindow class is responsible for creating and managing the main window of the application.
 * It provides methods to create the window, load the application content, and set up the application menu.
 * The main window is created with the specified width, height, and title.
 * It also provides a method to create the application menu with various options for file operations, settings, and help.
 * @author Erik Burmester <erik.burmester@nextbeam.net>
 * @version 1.0.0
 * @since 2024-06-15
 */
export class ApplicationWindow {
    /**
     * The main window of the application. This is where the simulator will be displayed.
     * It is created when the application starts and is destroyed when the application quits.
     * The main window is created with the specified width, height, and title.
     */
    private _mainWindow: BrowserWindow | undefined;

    /**
     * Constructor for the ApplicationWindow class. 
     * It creates the main window of the application with the specified width, height, and title.
     * @param width 
     * @param height 
     * @param title 
     */
    public constructor(width: number, height: number, title: string) {
        // Create the browser window...
        this._mainWindow = new BrowserWindow({
            width: width,
            height: height,
            title: title,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
            },
        });

        // ... and load the index.html of the app.
        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
            this._mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
        } else {
            this._mainWindow.loadFile(
                path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
            );
        }
    }

    /**
     * Getter for the main window of the application.
     * @returns The main window of the application, or undefined if it has not been created yet.
     */
    public get mainWindow(): BrowserWindow | undefined {
        return this._mainWindow;
    }

    /**
     * Creates the application menu with various options for file operations, settings, and help.
     * It sets up the menu items and their corresponding actions, such as opening files, assembling programs, starting programs, and toggling settings.
     * @param win The main window of the application.
     * @param simulator The simulation controller instance to interact with.
     */
    public createMenu(win: BrowserWindow, simulator: SimulationController): void {
        const menu = Menu.buildFromTemplate([
            {
                label: "App",
                submenu: [
                    {
                        label: "Exit",
                        accelerator: "CmdOrCtrl+Q",
                        click() {
                            app.quit()
                        }
                    }
                ]
            },
            {
                label: "File",
                submenu: [

                    {
                        label: "Open OS Home Folder",
                        accelerator: "CmdOrCtrl+O",
                        click() {
                            shell.openPath(path.join(simulator.pathToOSFilesystem, "home"))
                                .catch((err) => win.webContents.send("on_error", err));
                        }
                    },
                    {
                        label: "Assemble Program",
                        accelerator: "CmdOrCtrl+A",
                        click() {
                            dialog.showOpenDialog({
                                defaultPath: path.join(simulator.pathToOSFilesystem, "home"),
                                properties: ["openFile", "createDirectory"],
                                filters: [{ name: "Select Assembly File", extensions: ['asm'] }]
                            }).then(function (fileObj) {
                                if (!fileObj.canceled) {
                                    simulator.assembleProgram(fileObj.filePaths[0].replaceAll("\\", "/"));
                                    win.webContents.send("assembled_program", fileObj.filePaths);
                                }
                            }).catch((err) => win.webContents.send("on_error", err))
                        }
                    },
                    {
                        label: "Start Program",
                        accelerator: "CmdOrCtrl+S",
                        click() {
                            dialog.showOpenDialog({
                                defaultPath: path.join(simulator.pathToOSFilesystem, "bin"),
                                properties: ["openFile", "createDirectory"],
                                filters: [{ name: "Select Binary", extensions: ['bin'] }]
                            }).then(function (fileObj) {
                                if (!fileObj.canceled) {
                                    simulator.createProcess(fileObj.filePaths[0].replaceAll("\\", "/"));
                                    win.webContents.send("loaded_program", fileObj.filePaths);
                                }
                            }).catch((err) => win.webContents.send("on_error", err))
                        }
                    }
                ],
            },
            {
                label: "Settings",
                submenu: [
                    {
                        label: "Behavior",
                        submenu: [
                            {
                                label: "Physical RAM",
                                submenu: [
                                    {
                                        label: "Disable Auto Scroll",
                                        click() {
                                            if (simulator.autoScrollForPhysicalRAMEnabled) {
                                                win.webContents.send("disable_auto_scroll_physical_ram");
                                            }
                                        }
                                    },
                                    {
                                        label: "Enable Auto Scroll",
                                        click() {
                                            if (!simulator.autoScrollForPhysicalRAMEnabled) {
                                                win.webContents.send("enable_auto_scroll_physical_ram");
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                label: "Virtual RAM",
                                submenu: [
                                    {
                                        label: "Disable Auto Scroll",
                                        click() {
                                            if (simulator.autoScrollForVirtualRAMEnabled) {
                                                win.webContents.send("disable_auto_scroll_virtual_ram");
                                            }
                                        }
                                    },
                                    {
                                        label: "Enable Auto Scroll",
                                        click() {
                                            if (!simulator.autoScrollForVirtualRAMEnabled) {
                                                win.webContents.send("enable_auto_scroll_virtual_ram");
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                label: "Page Table",
                                submenu: [
                                    {
                                        label: "Disable Auto Scroll",
                                        click() {
                                            if (simulator.autoScrollForPageTableEnabled) {
                                                win.webContents.send("disable_auto_scroll_page_table");
                                            }
                                        }
                                    },
                                    {
                                        label: "Enable Auto Scroll",
                                        click() {
                                            if (!simulator.autoScrollForPageTableEnabled) {
                                                win.webContents.send("enable_auto_scroll_page_table");
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                label: "Output",
                                submenu: [
                                    {
                                        label: "Logging",
                                        submenu: [
                                            {
                                                label: "Disable Logging",
                                                click() {
                                                    win.webContents.send("hide_log");
                                                }
                                            },
                                            {
                                                label: "Enable Logging",
                                                click() {
                                                    win.webContents.send("show_log");
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                label: "Window",
                submenu: [
                    {
                        label: "Minimize",
                        accelerator: "CmdOrCtrl+M",
                        click() {
                            if (win.isMinimizable() && !win.isMinimized()) {
                                win.minimize();
                            }
                        }
                    },
                    {
                        label: "Reload",
                        accelerator: "CmdOrCtrl+R",
                        click() {
                            win.webContents.reload()
                        }
                    },
                    {
                        label: "Force Reload",
                        accelerator: "CmdOrCtrl+Shift+R",
                        click() {
                            win.webContents.reloadIgnoringCache()
                        }
                    },
                    {
                        label: "Toggle Developer Tools",
                        accelerator: "CmdOrCtrl+Shift+I",
                        click() {
                            win.webContents.openDevTools();
                        }
                    }
                ]
            },
            {
                label: "Help",
                submenu: [
                    {
                        label: "Documentation",
                        click() {
                            shell.openExternal("https://programmit.github.io/CPU-Simulator/")
                        }
                    },
                    {
                        label: "GitHub Repository",
                        click() {
                            shell.openExternal("https://github.com/ProgrammIt/CPU-Simulator")
                        }
                    }
                ]
            }
        ]);
        Menu.setApplicationMenu(menu);
    }
}