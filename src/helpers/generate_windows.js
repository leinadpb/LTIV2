const electronInstaller = require('electron-winstaller');

let folderName = process.platform.toLocaleLowerCase() === 'darwin' ? 'labapp-darwin-x64' : 'labapp-win32-x64';

// Only windows is supported >>>>
folderName = 'labapp-win32-x64';
const init = async () => {
    try {
        await electronInstaller.createWindowsInstaller({
          appDirectory: `./out/${folderName}`,
          outputDirectory: './installers/windows',
          authors: 'Daniel Pena y Angelo Paredes',
          exe: 'labapp.exe',
          version: '1.0.0',
          title: 'LAB APP',
          description: 'Lab app for rules and surveys from students and teachers.'
        });
        console.log('Lab app installer has been generated succesfully!');
        console.log(`\\o/`);
      } catch (e) {
        console.log(`Error when generating installer: ${e.message}`);
      }
}

init();