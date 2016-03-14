//dont touch version unless you want to avoid updates (EXTREMELY unrecommended)
var version = 1.5;

//ohohoho you wanted source code didn't you? well, you won't find it here. But you will find it at https://github.com/liavt/Scheduler
//if you didn't want source code and just stumbled here by accident, then you can close this tab. nothing should happen as long as you don't type anything
function start(){
  checkVersion();
  ScheduleApp.start();
}

function firstRun(){
  checkVersion();
  ScheduleApp.firstRun();
}

function updateSpreadsheet(){
  checkVersion();
  ScheduleApp.updateSpreadsheet();
}

function versionInfo(){
  checkVersion();
  ScheduleApp.versionInfo(version);
}

function checkVersion(){
  ScheduleApp.checkVersion(version);
}

//run functions from remote HTML
function runRemote(funcName, varargs) {
  try{
  return ScheduleApp[funcName].apply(this,
    Array.prototype.slice.call(arguments, 1));
  }catch(err){
    SpreadsheetApp.getUi().alert(err.message);
  }
}
