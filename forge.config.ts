import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerDMG } from '@electron-forge/maker-dmg';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "./assets/icons/app/icon",
    extraResource: ["./os_filesystem/", "./settings/"],
    executableName: "ihme-core-simulator",
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      iconUrl: "https://raw.githubusercontent.com/ProgrammIt/CPU-Simulator/refs/heads/main/assets/icons/app/icon.ico",
      copyright: "Copyright © 2026 University of Hannover for Applied Sciences and Arts",
      noMsi: false,
      setupIcon: "./assets/icons/app/icon.ico"
    }, ["win32"]),
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
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.mts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.mts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.mts',
        },
      ],
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
