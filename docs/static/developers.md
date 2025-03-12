---
title: Developers
group: Documents
category: Guides
children:
---

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
npm install --save-dev typescript electron jest typedoc @electron-forge/cli @types/jest ts-jest @electron-forge/maker-dmg @electron-forge/maker-deb @electron-forge/maker-rpm @electron-forge/maker-squirrel typedoc-plugin-markdown

npm install typedoc-material-theme

npm exec --package=@electron-forge/cli -c "electron-forge import"
```
