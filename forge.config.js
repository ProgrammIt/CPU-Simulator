const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/img/icons/app/icon'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        asar: true,
        dir: 'dist',
        setupIcon: './assets/img/icons/app/icon.ico',
        // certificateFile: './cert.pfx',
        // certificatePassword: process.env.CERTIFICATE_PASSWORD,
        appDirectory: '/tmp/build/Ihme-Core X1 Simulator-win32-x64',
        setupExe: 'Ihme-Core X1 Simulator-Setup.exe',
        setupMsi: 'Ihme-Core X1 Simulator-Setup.msi',
        noMsi: false,
        overwrite: true,
        prune: true,
        platforms: ['win32'],
        iconURL: 'https://raw.githubusercontent.com/ProgrammIt/CPU-Simulator/refs/heads/main/assets/img/icons/app/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          icon: './assets/img/icons/app/icon.png',
          maintainer: 'Erik Burmester',
          homepage: 'https://programmit.github.io/CPU-Simulator/',
          genericName: 'CPU Simulator',
          categories: ['Education', 'Computer Science', 'Simulation'],
        }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          icon: './assets/img/icons/app/icon.png',
          maintainer: 'Erik Burmester',
          homepage: 'https://programmit.github.io/CPU-Simulator/',
          genericName: 'CPU Simulator',
          categories: ['Education', 'Computer Science', 'Simulation'],
          license: 'MIT',
        }
      },
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        options: {
          icon: './assets/img/icons/app/icon@2x.icns',
          iconSize: 1024,

        }
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
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
