function start() {
    ScheduleApp.start();
}

function firstRun() {
    ScheduleApp.firstRun();
}

function init() {
    ScheduleApp.init();
}

function updateSpreadsheet() {
    ScheduleApp.updateSpreadsheet();
}

function versionInfo() {
    ScheduleApp.versionInfo();
}

//run functions from remote HTML
function runRemote(funcName, varargs) {
    return ScheduleApp[funcName].apply(this, Array.prototype.slice.call(arguments, 1));
}
