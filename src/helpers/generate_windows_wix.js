const MSI = require('electron-wix-msi');
const path = require('path');
const log = require('electron-log');

let folderName = process.platform.toLocaleLowerCase() === 'darwin' ? 'labapp-darwin-x64' : 'labapp-win32-x64';
// Only windows is supported >>>>
folderName = 'labapp-win32-x64';

// Step 1: Instantiate the MSICreator
const msiCreator = new MSI.MSICreator({
  appDirectory: path.resolve(__dirname, '..', '..', 'out', folderName),
	outputDirectory: path.resolve(__dirname, '..', '..', 'installers', 'windows'),
  description: 'App for rules and surveys data for LTI students and teachers.',
  exe: 'labapp',
  name: 'Lab App',
  manufacturer: 'INTEC LTI',
  version: '2.0.0',
  ui: {
    chooseDirectory: true
  }
});

(async () => {
  // Step 2: Create a .wxs template file
  try {
    await msiCreator.create();

    try {
      // Step 3: Compile the template to a .msi file
      await msiCreator.compile();
    } catch(err) {
      log.error('Error compiling .wxs file >>>', err);
    }
  } catch(err) {
    log.error('Error creating .wxs file >>>>', err);
  }
  
})();
