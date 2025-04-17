import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "./assets/icons/app/icon",
    extraResource: ["./assembly/", "./settings/"],
    executableName: "ihme-core-simulator"
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl: "https://raw.githubusercontent.com/ProgrammIt/CPU-Simulator/refs/heads/main/assets/icons/app/icon.ico",
      copyright: "Copyright © 2025 University of Hannover for Applied Sciences and Arts",
      noMsi: false,
      setupIcon: "./assets/icons/app/icon.ico"
    }, ["win32"]), 
    // new MakerZIP({}, ["darwin"]),
    new MakerDMG({
      format: 'UDZO',
      icon: "./assets/icons/app/icon@1x.icns",
      overwrite: true
    }, ["darwin"]),
    new MakerRpm({
      options: {
        icon: "./assets/icons/app/icon_256x256.png",
        homepage: "https://programmit.github.io/CPU-Simulator/",
        license: "MIT License",
        categories: ["Education"],
        mimeType: ["text/x-asm"]
      }
    }, ["linux"]), 
    new MakerDeb({
      options: {
        icon: "./assets/icons/app/icon_256x256.png",
        homepage: "https://programmit.github.io/CPU-Simulator/",
        categories: ["Education"],
        mimeType: ["text/x-asm"]
      }
    }, ["linux"])
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/renderer/index.html',
            js: './src/renderer/index.ts',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
