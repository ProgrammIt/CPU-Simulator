---
title: Developers
group: Documents
category: Guides
children:
---

> 🚧! Under construction ! 🚧 This document is subject to changes. 

# Set up a development environment

In this section, we will focus on setting up a development environment for the simulator. To be able to develop the application further, you need a current version of Node.js and npm. To check whether Node.js and npm are already installed, you can execute the commands `node --version` and `npm --version` in the console. If both applications are installed correctly, a version number should be displayed on the console.

```bash
user@computer:~$ node --version
v22.14.0
user@computer:~$ npm --version
11.2.0
```

At least version 22.14.0 of Node.js and 11.2.0 of npm should be used. If you do not have Node.js with npm or no appropriate version installed, please head over to the official [website](https://nodejs.org/en/download) and install an appropriate version for your operating system. Please make sure to pick an installer that installs Node.js with npm as its dependency manager. After the download is complete, please follow the instructions of the installation program and try both the commands `node --version` and `npm --version` in a new console. Now, you should see the output similar to the one shown above.

In order to contribute to the project, you will need the version control system Git. You can check whether Git is already installed, by executing `git --version` in a console. You should see an output similar to the ones, we saw before. If Git is not installed, you can download an installer [here](https://git-scm.com/downloads). There you will also find an introduction to the version control system if you have never worked with it before.

Next, the source code of the application should be downloaded. The source code can be found [here](https://github.com/ProgrammIt/CPU-Simulator). Alternatively, you can download an `.zip` or an `.tar.gz` archive from the release section of the repository if you prefer. Releases can be found [here](https://github.com/ProgrammIt/CPU-Simulator/releases).

After you have downloaded the source code, you must decide which code editor you want to choose. You can choose the editor that you like best. This section describes the final steps for setting up the development environment with Visual Studio Code (VS Code). VS Code is an open source code editor from Microsoft and can be downloaded [here](https://code.visualstudio.com/).

First unzip the source code of the simulator into a directory of your choice and open it in VS Code. You can do this via the *File* menu in VS Code. After you have opened the directory in the editor, please open the integrated console if the console was not opened automatically. You can open the console by clicking on the *View* menu item and the *Terminal* button in the context menu that appears.

Afterwards, you need to execute the following command `npm install`. Before executing the command, please make sure that you are inside the directory containing the projects source code. That is it! Now you are free to go to start coding and build something amazing!

# Dependencies

Here is a list of the dependencies of the CPU simulator.

* TypeScript
* Electron
* Jest
* TypeDoc
    * typedoc-plugin-markdown
* Electron Forge
    * 

It could be necessary to remove all the (dev-)dependencies, listed in the file *package.json*. If you want to install all the required dependencies at once, you can use the following commands. Navigate to the root directory of the project and run the commands.

```
npm install --save-dev typescript electron jest typedoc @electron-forge/cli @types/jest ts-jest @electron-forge/maker-dmg @electron-forge/maker-deb @electron-forge/maker-rpm @electron-forge/maker-squirrel typedoc-plugin-markdown ts-node typedoc-material-theme

npm exec --package=@electron-forge/cli -c "electron-forge import"
```
