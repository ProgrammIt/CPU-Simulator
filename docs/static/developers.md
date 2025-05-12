---
title: Developers
group: Documents
category: Guides
children:
---

> 🚧! Under construction ! 🚧 This document is subject to changes.

# Documentation for Developers

Welcome to the start page of the developer documentation! 👋

## Setting up a development environment

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

## Managing dependencies

### Adding (dev) dependencies

Whenever you need to add dependencies to the project, please keep both installation scripts `./scripts/install-dependencies.sh` and `./scripts/install-dependencies.ps1` updated and add the dependencies to these scripts too. These scripts will come in handy, if you ever find yourself in the need of reinstalling, updating or upgrading the dependencies.

### Updating or upgrading (dev) dependencies 

Updating or upgrading dependencies can be painful. In order to update or upgrade the (dev) dependencies for this project, it could be easier to remove all the dependencies than trying to update or upgrade packages manually. In this section, we will take a look on how to do so.

First you need to delete the `./node_modules` directory in the root directory `./` of this project. Afterwards, please delete the `package-lock.json` file in the root directory. Then, head over to the `.package.json` file and delete all entries listed in the `"devDependencies"` and `"dependencies"` section.
In the last step, please run `./scripts/install-dependencies.ps1` or `./scripts/install-dependencies.sh`.
