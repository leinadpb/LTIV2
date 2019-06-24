const ps = require('current-processes');
const _ = require('lodash');

const getBrowserProcesses = (processes) => {
  const browsers = [];
  processes.forEach(process => {
    if (!!process.name 
      && (process.name.includes('Chrome') 
      || process.name.includes('Edge') 
      || process.name.includes('IE'))) {
      browsers.push(process);
    }
  });
  return browsers;
}

const killProcess = (pid) => {
  process.kill(pid, 'SIGINT');
}

const init = () => {
    ps.get((err, processes) => {
 
    const sorted = _.sortBy(processes, 'cpu');
    const result = getBrowserProcesses(sorted);
    console.log(result);
    if (result.length > 0) {
      result.forEach(r => {
        killProcess(r.pid);
        console.log('Killed process: ', r.name, ' \nPID: ', r.pid);
      });
    }
  });
}

module.exports = {
  execute: () => init(),
}