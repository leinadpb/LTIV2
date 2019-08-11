const MSICreator = require('electron-wix-msi');

let folderName = process.platform.toLocaleLowerCase() === 'darwin' ? 'labapp-darwin-x64' : 'labapp-win32-x64';
// Only windows is supported >>>>
folderName = 'labapp-win32-x64';

// Step 1: Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: `./out/${folderName}`,
  description: 'App for rules and surveys data for LTI students and teachers.',
  exe: 'labapp',
  name: 'Lab App',
  manufacturer: 'INTEC LTI',
  version: '2.0.0',
  outputDirectory: './installers/windows',
  ui: {
    chooseDirectory: true
  }
});

// Step 2: Create a .wxs template file
await msiCreator.create();

// Step 3: Compile the template to a .msi file
await msiCreator.compile();