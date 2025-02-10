const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    extraResource: ["log","src"]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        portable: true, 
        artifactName: 'Origin/Origin.exe'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github', // 发布到 GitHub Releases
      config: {
        repository: {
          owner: 'LittleAlen', // 替换为你的 GitHub 用户名
          name: 'OriginWebScan', // 替换为你的仓库名
        },
        draft: false, // 发布为草稿
        prerelease: false, // 是否作为预发布版本
      },
    },
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
  //MAC 签名
 
  osxSign: {
    identity: process.env.APPLE_IDENTITY || "MySelfSignedCert", // 证书名称
    "hardened-runtime": false, // 自签名证书不支持强化运行时
    entitlements: "entitlements.plist",
    "entitlements-inherit": "entitlements.plist",
  },
  // osxNotarize: {
  //   appleId: process.env.APPLE_ID, // Apple ID
  //   appleIdPassword: process.env.APPLE_ID_PASSWORD, // App 专用密码
  // },
  //windows 签名
  // packagerConfig: {
  //   win32metadata: {
  //     'requested-execution-level': 'requireAdministrator', // 请求管理员权限
  //   },
  // },
};
