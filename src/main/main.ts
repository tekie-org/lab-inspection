/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { promises as fs } from 'fs';
import log from 'electron-log';
import si from 'systeminformation';
import axios from 'axios';
import checkDiskSpace from 'check-disk-space';
import MenuBuilder from './menu';

import { resolveHtmlPath } from './util';
import getSystemUUID from './getSystemUUID';

const os = require('os');

const homedir = os?.homedir();
const username = os?.userInfo()?.username;

const { getAllInstalledSoftware } = require('fetch-installed-software');

const firewallChecklinks = [
  'https://github.com/',
  'https://www.tekie.in',
  'https://kahoot.it',
  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@1,900&display=swap',
  'https://figma.com',
  // 'https://www.canva.com/create/logos/',
  'https://docs.google.com',
  'https://code.org/',
  'https://developers.google.com/blockly',
  // 'https://replit.com/site/terms',
  'https://playcode.io/empty_html',
  'https://filmora.wondershare.com',
  'https://google.com',
  'https://mail.google.com',
  'https://app.diagrams.net/',
];

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('system-uuid', async (event, args) => {
  try {
    const all = await si.getAllData();
    const systemUUID = await getSystemUUID(all);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const cpu_s = os.cpus();
    let processor = '';
    if (cpu_s && cpu_s.length) {
      cpu_s.forEach((cpu: any) => {
        if (cpu?.model) {
          processor = cpu.model;
        }
      });
    }
    event.reply('system-uuid', {
      customUUID: systemUUID,
      allSystemInfo: { ...all, customUUID: systemUUID, processor },
      schoolList: args[0],
    });
  } catch (e) {
    event.reply('system-uuid', {
      e,
      schoolList: args[0],
    });
  }
});

ipcMain.on('lab-inspection', async (event) => {
  const installedApps = {
    chrome: false,
    filmora: false,
    paint: true,
    notepad: true,
    msAccess: false,
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const cpu_s = os.cpus();
  let processor = '';
  if (cpu_s && cpu_s.length) {
    cpu_s.forEach((cpu: any) => {
      if (cpu?.model) {
        processor = cpu.model;
      }
    });
  }
  let windowsApps: any[] = [];
  let filmoraDir: any[] = [];
  let space = {};
  const firewallChecklinksStatus: any[] = [];
  try {
    const all = await si.getAllData();
    const systemUUID = await getSystemUUID(all);
    const systemDistro = all?.os?.distro || `${all?.os?.platform} 7` || '';
    const isWin7 = systemDistro ? systemDistro.indexOf('7') !== -1 : false;
    try {
      space = await checkDiskSpace('C:/');
    } catch (e) {
      console.log(e);
    }
    try {
      windowsApps = await fs.readdir('C://Program Files/WindowsApps');
    } catch (e) {
      console.log(e);
    }
    try {
      let filmoraPath = '';
      if (username) {
        filmoraPath = path.join(
          'C://Users',
          username,
          '/AppData/Local/Wondershare'
        );
      }
      if (homedir) {
        filmoraPath = path.join(homedir, '/AppData/Local/Wondershare');
      }
      console.log(filmoraPath);
      filmoraDir = await fs.readdir(filmoraPath);
    } catch (e) {
      console.log(e);
    }
    if (windowsApps.length) {
      windowsApps.forEach((e) => {
        if (e) {
          if (e.includes('Paint')) installedApps.paint = true;
          if (e.includes('Notepad')) installedApps.notepad = true;
        }
      });
    }
    if (isWin7) {
      installedApps.paint = true;
      installedApps.notepad = true;
    }
    if (
      filmoraDir &&
      filmoraDir.length &&
      filmoraDir.some((dir) => dir && dir.includes('Wondershare'))
    )
      installedApps.filmora = true;
    try {
      const programFiles = await getAllInstalledSoftware();
      if (programFiles && programFiles.length) {
        if (programFiles.find((e: any) => e?.DisplayName?.includes('Chrome')))
          installedApps.chrome = programFiles.find((e: any) =>
            e?.DisplayName?.includes('Chrome')
          );
      }
    } catch {
      console.log('error');
    }
    for (const link of firewallChecklinks) {
      try {
        const res = await axios(link);
        if (res.status === 200)
          firewallChecklinksStatus.push({ key: link, status: true });
        else firewallChecklinksStatus.push({ key: link, status: false });
      } catch {
        firewallChecklinksStatus.push({ key: link, status: false });
      }
    }
    event.reply('lab-inspection', {
      systemInfo: { ...(all || {}), customUUID: systemUUID, processor },
      uuid: systemUUID,
      space,
      installedApps,
      firewallChecklinksStatus,
    });
  } catch {
    event.reply('lab-inspection', {
      systemInfo: {},
      uuid: null,
      space,
      installedApps,
      firewallChecklinksStatus,
    });
  }
});

ipcMain.on('browser_window', async (_event, arg) => {
  if (mainWindow) {
    if (arg === 'close') mainWindow.close();
    else if (arg === 'minimize') mainWindow.minimize();
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = true;
// process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    title: 'Tekie',
    show: false,
    width: 880,
    height: 663,
    icon: getAssetPath('icon.png'),
    frame: false,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.setTitle('Tekie');

  mainWindow.maximize();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
