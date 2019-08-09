const ps = require('current-processes');
const _ = require('lodash');

const CHROME = 'CHROME';
const EDGE = 'EDGE';
const IE = 'IE';
const FIREFOX = 'FIREFOX';
const MOZILLA = 'MOZILLA';

const SIGNAL_NAMES = ['SIGTERM', 'SIGINT', 'SIGKILL', 'SIGUSR1', 'SIGPIPE', 'SIGSTOP', 'SIGBUS', 'SIGHUP', 'SIGBREAK', 'SIGWINCH', 'SIGFPE', 'SIGSEGV', 'SIGILL'];

const getBrowserProcesses = (processes) => {
  const browsers = [];
  processes.forEach(process => {
    if (!!process.name 
      && ( (process.name.includes(CHROME.toLocaleLowerCase())  || process.name.includes(CHROME.toUpperCase()))
      || (process.name.includes(EDGE.toLocaleLowerCase())  || process.name.includes(EDGE.toUpperCase()))
      || (process.name.includes(FIREFOX.toLocaleLowerCase())  || process.name.includes(FIREFOX.toUpperCase()))
      || (process.name.includes(MOZILLA.toLocaleLowerCase())  || process.name.includes(MOZILLA.toUpperCase()))
      || (process.name.includes(IE.toLocaleLowerCase() || process.name.includes(IE.toUpperCase()))) )) {
      browsers.push(process);
    }
  });
  return browsers;
}

const killProcess = (pid) => {
  let tryKillCount = SIGNAL_NAMES.length; // Initialize try kill count
  let terminated = false;
  let counter = 0;
  while(tryKillCount > 0 && !terminated) {
    try {
      process.kill(pid, SIGNAL_NAMES[counter]);
      terminated = true;
    } catch (ex) {
      tryKillCount--;
      counter++;
      console.log(`Error trying to kill process with PID: ${pid}. Signal name: ${SIGNAL_NAMES[counter]}`);
    }
  }
}

const init = async () => {
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