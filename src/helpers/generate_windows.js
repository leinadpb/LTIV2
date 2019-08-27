const electronInstaller = require('electron-winstaller');
const path = require('path');
const log = require('electron-log');

let folderName = process.platform.toLocaleLowerCase() === 'darwin' ? 'labapp-darwin-x64' : 'labapp-win32-x64';

// Only windows is supported >>>>
folderName = 'labapp-win32-x64';

(async () => {
    try {
      await electronInstaller.createWindowsInstaller({
        appDirectory: path.resolve(__dirname, '..', '..', 'installers', 'windows', folderName),
        outputDirectory: path.resolve(__dirname, '..', '..', 'installers', 'windows'),
        authors: 'Daniel Pena y Angelo Paredes',
        owners: 'INTEC',
        exe: 'labapp.exe',
        version: '1.0.0',
        title: 'LAB APP',
        description: 'Lab app for rules and surveys from students and teachers.',
        noMsi: true,
        setupIcon: path.join(__dirname, '..', 'images', 'labti-logo.ico'),
        iconUrl: path.join(__dirname, '..', 'images', 'labti-logo.ico'),
        setupExe: 'LabAppStudents.exe',
      });
      log.info('Lab app installer has been generated succesfully!');
      log.info(`\\o/`);
    } catch (e) {
      log.error(`Error when generating installer: ${e.message}`);
    }
})();