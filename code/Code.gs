
/*
*Hey
*
*You found the source
*Cool.
*I know it sucks
*I know it is redudant
*I know it is messy
*I know it is undocumented
*
*I don't care enough to fix any of it. It works, it's happens basically instantly on chromebooks (the window delay is google's fault)
*
*Also why does Google scripts not have OOP? That would make this task so much easier on so many levels.
*And autocomplete might be nice
*How about an actually competetant formatter?
*And also MAYBE A DEVELOPER CONSOLE
*
*Basically if the API was better this could be much better, but sadly, this is how it has to be.
*-Liav
*/
var ui = SpreadsheetApp.getUi(); 
var currentsheet = SpreadsheetApp.getActiveSheet();
//link to control panel,may vary by grade
var sheet = SpreadsheetApp.openByUrl('https://docs.google.com/a/pisd.edu/spreadsheets/d/1MiMdKA9BW-BVG1UnDOW58kF1Btd2YBVs6fueGOM6TbM/edit?usp=sharing').getSheets()[0];
var settings = sheet.getRange(24,1,37,5).getValues();
  var peoplenames = SpreadsheetApp.openByUrl(settings[1][0]).getActiveSheet().getRange(2,1,135,5).getValues().sort();
  var helpdesk=SpreadsheetApp.openByUrl(settings[3][0]).getActiveSheet().getRange(2,1,135,3).getValues().sort();
  var mods = sheet.getRange(2,1,5,16).getValues();
  var times = sheet.getRange(1,1,1,16).getValues();
//when updating modnames don't forget to change the getModColor() function
var modnames = sheet.getRange(8,1,15,2).getValues();
  var remoteversion = sheet.getRange(19, 10).getValue();
var version =1.1;
  var user = PropertiesService.getUserProperties();


function checkVersion(){
  if(remoteversion>version){
    //var newsheet = SpreadsheetApp.create("Schedule");
    //<a href='http://www.google.com' target='_blank'>Open in new window</a>
      var htmlOutput = HtmlService
     .createHtmlOutput(getHTMLPrepend()+ '<p>A new version is available (version '+remoteversion+'.) It is HIGHLY recommended that you copy the newest spreadsheet</p><br><a href="https://docs.google.com/a/pisd.edu/spreadsheets/d/1s0HqXOHvvjrl1Rchg-e7i_TBYpVeOCDbXw2U5SmuB78/edit?usp=sharing" target="_blank">Open</a>'+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(130);
  ui.showModalDialog(htmlOutput, 'New Version');
  }
  checkProperties();
  showSidebar();
}

function onEdit(e){
//  var old = e.oldValue;
//  //  ui.alert(old);
// // if(old){
//  if(old){
//    e.range.setValue(old);
//  }else{
//    e.range.setValue('');
//  }
// // ui.alert('hi');
//  //}
}

function showSidebar(){
  var personid = parseInt(user.getProperty('USER_DATABASE_ID'));
  if(personid>0){
  var schedule = getSchedule(personid);
   var htmlOutput = HtmlService
 .createHtmlOutput(getHTMLPrepend()+'<p>'+parseLearnerSchedule(schedule,personid)+'</p><br><input type="submit"value="Cohort: '+peoplenames[personid][4]+'"onclick="google.script.run.viewCohort(\''+peoplenames[personid][4]+'\')"><br><input type="submit"value="LOTE: '+peoplenames[personid][2]+'"onclick="google.script.run.viewLOTE(\''+peoplenames[personid][2]+'\');"><br><input type="submit"value="Group '+peoplenames[personid][3]+'"onclick="google.script.run.showGroup('+personid+');">'+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500).setTitle(peoplenames[personid][0]+' '+peoplenames[personid][1]+'\'s schedule');
 ui.showSidebar(htmlOutput);
  }
}

function checkProperties(){
  if(!user.getProperty('USER_DATABASE_ID')||user.getProperty('USER_DATABASE_ID')==null||user.getProperty('USER_DATABASE_ID')<0){
    user.setProperty('USER_DATABASE_ID', -1);
    while(user.getProperty('USER_DATABASE_ID')<0){
    var response = ui.prompt('Please enter your full first and last name. If you don\'t want a personalized calender (only want to look at other people\'s) then leave it blank.',ui.ButtonSet.OK);
    var text = response.getResponseText();
     var spaceindex = text.indexOf(' ');
       //the +1 is because i dont want to include the actual space in the final string
        var second = text.substring(spaceindex+1).toLowerCase();
       var first = replaceAll(text.substring(0,spaceindex).toLowerCase(),'_',' ');
    user.setProperty('USER_DATABASE_ID', findPersonByName(first,second));
    }
  }
}

function clearSettings(){
  user.deleteProperty('USER_DATABASE_ID');
  ui.alert('Reset settings.',ui.ButtonSet.OK);
  checkVersion();
}

function versionInfo(){
    var htmlOutput = HtmlService
    .createHtmlOutput(getHTMLPrepend()+ '<p>Version: '+version+'<br>Required version: '+remoteversion+'<br>Person: '+user.getProperty('USER_DATABASE_ID')+'<br><br>Created by Liav Turkia</p><br><input type="submit"value="Check for new updates"onclick="google.script.run.checkVersion();"><br><input class="create"type="submit"value="RESET"onclick="google.script.run.clearSettings();">'+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(200)
     .setHeight(200);
  ui.showModalDialog(htmlOutput, 'Version info');
}

function onOpen(){
  var menu= SpreadsheetApp.getUi().createMenu('Schedule');
   menu.addItem('Open menu', 'start');
  menu.addItem('Update spreadsheet','updateSpreadsheet');
  menu.addItem('View your schedule','checkVersion');
  menu.addItem('Settings', 'versionInfo').addToUi();
  //updateSpreadsheet();
  checkVersion();
}

function start() {
  var html = HtmlService.createHtmlOutputFromFile('entry')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME).setWidth(250).setHeight(250);
  ui.showModalDialog(html,'What do you want to do?');
  checkVersion();
}

function updateModNames(){
  for(var i=7;i<23;i++){
    var newrange = currentsheet.getRange(i,1,1,4);
    var remoterange = sheet.getRange(i,1,1,4);
    
    var remotevalues = remoterange.getValues();
    remotevalues[0][1] = remotevalues[0][1].replace('%HD','');
    //you can't copy from a remote spreadsheet so you must do it manually
    newrange.setValues(remotevalues);
    newrange.setFontColors(remoterange.getFontColors());
    newrange.setFontFamilies(remoterange.getFontFamilies());
    newrange.setFontLines(remoterange.getFontLines());
    newrange.setBackgrounds(remoterange.getBackgrounds());
  }
}

function updateSchedule(){
  var timerange = currentsheet.getRange(1,1,1,16);
  var modrange = currentsheet.getRange(2,1,5,16);
  var timevalues = timerange.getValues();
  var modvalues = modrange.getValues();
  
  //reset the values
  for(var x=0;x<16;x++){
    for(var y=0;y<5;y++){
      modvalues[y][x]='';
      timevalues[0][x]='';
    }
  }
  
  for(var x =0;x<16;x++){
    if(times[0][x]){
      if(times[0][x]=='KEY'){
        timevalues[0][x]='';
        for(var y = 0;y<mods.length;y++){
          if(mods[y][x]){
            modvalues[y][x]=mods[y][x].substring(1);
          }
        }
      }else{
        timevalues[0][x]=times[0][x];
        for(var y = 0;y<mods.length;y++){
          if(mods[y][x]){
            modvalues[y][x]=mods[y][x];
          }
        }
      }
    }
  }

  modrange.setValues(modvalues);
  timerange.setValues(timevalues);
}

function getModColor(mod){
  for(var i=0;i<modnames.length;i++){
      if(modnames[i][0]==mod){
        return sheet.getRange(i+8,1).getBackground();
      }
  }
 // return 'F5F5F5';
}

function updateModColors(){
    var timerange = currentsheet.getRange(1,1,1,16);
  var modrange = currentsheet.getRange(2,1,5,16);
  var modtext = modrange.getValues();
  var timetext = timerange.getValues();
  var timevalues = timerange.getBackgrounds();
  var modvalues = modrange.getBackgrounds();
  var defaultcolor = '#F5F5F5'
  
  
  for(var x =0;x<16;x++){
    //the comparisons are against the remote mods because timevalues and modvalues are color values, while times and mods are text. color values should never be null
    if(timetext[0][x]){
        timevalues[0][x]=defaultcolor;
        for(var y = 0;y<modtext.length;y++){
          if(modtext[y][x]){
            modvalues[y][x]=getModColor(modtext[y][x]);
           // ui.alert(modvalues[y][x]);
          }else{
            modvalues[y][x]='#000000';
          }
        }
    }else{
      timevalues[0][x]='#000000';
        for(var y = 0;y<modtext.length;y++){
          if(modtext[y][x]){
            modvalues[y][x]=defaultcolor;
          }else{
            modvalues[y][x]='#000000';
          }
        }
    }
   }
   // ui.alert('hi');


  modrange.setBackgrounds(modvalues);
  timerange.setBackgrounds(timevalues);
}

function updateSpreadsheet(){
  SpreadsheetApp.getActive().toast('Refreshing schedule...');
    checkVersion();
  updateModNames();
  updateSchedule();
  updateModColors();
  var protection =currentsheet.protect().setDomainEdit(false).setDescription('Cannot edit the schedule');;
  var users = protection.getEditors();
  for(var i =0;i<users.length;i++){
    protection.removeEditor(users[i]);
  }
  
  SpreadsheetApp.getActive().toast('Schedule updated');
}

function getHTMLPrepend(){
  return '<!DOCTYPE html><link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><html><head><base target="_top"></head><body>';
}
function getHTMLAppend(){
  return ' </body></html>';
}

function getFullModName(name){
  for(var i=0;i<modnames.length;i++){
      if(modnames[i][0]==name){
    return modnames[i][1];
  }
   }
}


//had a purpose at one point but was removed
function getFullLOTEName(lote){
  return 'LOTE';
}

function parseLearnerSchedule(sched, person){
  var newsched = sched.split('<br>');
  var out='';
  if(newsched){
  for(var i= 0;i<newsched.length;i++){
    if(newsched[i]){
    var split = newsched[i].split('-');
    var hdindex = split[1].indexOf('%HD');
    if(hdindex>=0){
      if(isInHelpDesk(person)){
      split[1]='  <i>'+settings[11][0]+'</i>';
      }else{
              split[1] = split[1].substring(0,hdindex);
      }
    }
    out+=split[0]+'-'+split[1]+'<br>';
    }
  }  
  }
      return out;
}

function replaceAll(string, search, replacement) {
    return string.replace(new RegExp(search, 'g'), replacement);
};

function parseGroupSchedule(sched, person){
      return replaceAll(sched,'%HD','<i> or '+settings[11][0]+'</i>');
}

function helpDeskNameToSplitName(name){
  var split = name.split(',');
  if(name){
    //the substring is because there is a space in front of it
    return [split[1].replace(' ','').toLowerCase(),split[0].toLowerCase()];
  }
  return '';
}

function getHelpDeskID(person){
   for(var i=1;i<helpdesk.length;i++){
    var newname = helpDeskNameToSplitName(helpdesk[i][2]);
    if((newname[0]===peoplenames[person][0].toLowerCase())&&(newname[1]===peoplenames[person][1].toLowerCase())){
      return i;
    }
  }
  return 0;
}

function isInHelpDesk(person){
  return Number(helpdesk[getHelpDeskID(person)][1])>0;
}

function getMainMenuButton(){
  return '<input type="submit"value="Back to main menu"onclick="google.script.run.start();">';
}

function filterOutDuplicates(a,xindex){
    var result = [];
    for (var i = 0; i < a.length; i++) {
        if (result.indexOf(a[i][xindex]) == -1) {
            result.push(a[i][xindex]);
        }
    }
    return result;
}

//doesn't work
function showGroupByNumber(number){
  for(var i=1;i<peoplenames.length;i++){
    if(peoplenames[i][3]===number){
      showGroup(i);
      break;
    }
  }
}

function listAllCohort(){
   var out = '<div>';
  var newarray = filterOutDuplicates(peoplenames,4);
  for(var i=0;i<newarray.length;i++){
    if(newarray[i]){
     out+='<input type="submit"value="'+newarray[i]+'"onclick="google.script.run.viewCohort(\''+newarray[i]+'\');"><br>';
    }
  }
 out+='</div><br>';
  out+='<input type="submit"value="Can\'t find what you are looking for? Search it!"onclick="google.script.run.askForCohort();">';
  out+=getMainMenuButton();
  
  var htmlOutput = HtmlService
     .createHtmlOutput(getHTMLPrepend()+ out+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500);
  ui.showModalDialog(htmlOutput, 'Cohort');
}

function listAllLOTE(){
   var out = '<div>';
  var newarray = filterOutDuplicates(peoplenames,2);
  for(var i=0;i<newarray.length;i++){
    if(newarray[i]){
     out+='<input type="submit"value="'+newarray[i]+'"onclick="google.script.run.viewLOTE(\''+newarray[i]+'\');"><br>';
    }
  }
 out+='</div><br>';
  out+='<input type="submit"value="Can\'t find what you are looking for? Search it!"onclick="google.script.run.askForLOTE();">';
  out+=getMainMenuButton();
  
  var htmlOutput = HtmlService
     .createHtmlOutput(getHTMLPrepend()+ out+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500);
  ui.showModalDialog(htmlOutput, 'LOTE');
}

function findPersonByName(first,last){
  for(var i=0;i<peoplenames.length;i++){
    if(peoplenames[i][0].toLowerCase()===first&&peoplenames[i][1].toLowerCase()===last){
      return i;
    }
  }
  return -1;
}

function searchAndViewStudent(){
  showPerson(askForStudent());
}

function listAllPeople(){
   var out = '<div>';
  for(var i=0;i<peoplenames.length;i++){
    if(peoplenames[i][0]&&peoplenames[i][1]){
     out+='<input type="submit"value="'+peoplenames[i][0]+' '+peoplenames[i][1]+'"onclick="google.script.run.showPerson('+i+');"><br>';
    }
  }
 out+='</div><br>';
  out+='<input type="submit"value="Can\'t find what you are looking for? Search it!"onclick="google.script.run.searchAndViewStudent()">';
  out+=getMainMenuButton();
  
  var htmlOutput = HtmlService
     .createHtmlOutput(getHTMLPrepend()+ out+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500);
  ui.showModalDialog(htmlOutput, 'Learners');
}

function viewCohort(cohort){
  //ui.alert('test',ui.ButtonSet.OK);
   var out = '';
  for(var i=0;i<peoplenames.length;i++){
    if(peoplenames[i][4].toLowerCase()==cohort.toLowerCase()){
      //onclick="google.script.run.showPerson('+i+');"
     out+='<input type="submit"value="'+peoplenames[i][0]+' '+peoplenames[i][1]+'"onclick="google.script.run.showPerson('+i+');"><br>';
      //out+=helpdesk[id][2]+' for '+helpdesk[id][1]+' subject(s)<br>';
    }
  }
 out+='<br>';
  out+=getMainMenuButton();
  
  var htmlOutput = HtmlService
     .createHtmlOutput(getHTMLPrepend()+ out+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500);
  ui.showModalDialog(htmlOutput, 'Cohort: '+cohort);
}

function viewLOTE(lote){
   var out = '<div>';
  for(var i=0;i<peoplenames.length;i++){
    if(peoplenames[i][2]===lote){
     out+='<input type="submit"value="'+peoplenames[i][0]+' '+peoplenames[i][1]+'"onclick="google.script.run.showPerson('+i+');"><br>';
    }
  }
 out+='</div><br>';
  out+=getMainMenuButton();
  
  var htmlOutput = HtmlService
     .createHtmlOutput(getHTMLPrepend()+ out+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500);
  ui.showModalDialog(htmlOutput, 'LOTE: '+lote);
}

function askForCohort(){
  var result = ui.prompt(
      'Cohort Lookup',
    'Please enter the desired cohort to search foor',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var response = result.getResponseText();
  var out = '';
  if (button == ui.Button.OK) {
    var found = false;
    if(!response){
      ui.alert('Please make a selection',ui.ButtonSet.OK);
    found=true;
    askForCohort();}
     else {
       found=true;
       viewCohort(response.toLowerCase());
        }
      
    if(!found){ui.alert('Cohort not found',ui.ButtonSet.OK);askForCohort();}
  } else if (button == ui.Button.CANCEL) {
    start();
  } 
}

function askForLOTE(){
  var result = ui.prompt(
      'LOTE Lookup',
    'Please enter the acronym used for a LOTE.',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var response = result.getResponseText();
  var out = '';
  if (button == ui.Button.OK) {
    var found = false;
    if(!response){
      ui.alert('Please make a selection',ui.ButtonSet.OK);
    found=true;
    askForLOTE();}
     else {
       found=true;
       viewLOTE(response.toUpperCase());
        }
      
    if(!found){ui.alert('LOTE not found',ui.ButtonSet.OK);askForLOTE();}
  } else if (button == ui.Button.CANCEL) {
    start();
  } 
}

function viewHelpDesk(){
  var out = '<p>';
  for(var i=0;i<peoplenames.length;i++){
    var id = getHelpDeskID(i);
    if(helpdesk[id][1]>0){
     out+='<input type="submit"value="'+helpdesk[id][2]+' for '+helpdesk[id][1]+' subject(s)"onclick="google.script.run.showPerson('+i+');"><br>';
    }
  }
  out+='</p><br>';
  out+=getMainMenuButton();
  
  var htmlOutput = HtmlService
     .createHtmlOutput(getHTMLPrepend()+out+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500);
 ui.showModalDialog(htmlOutput, 'Help Desk');
}

function getGroupMembers(group){
  var groupnum = peoplenames[group][3];
  var out='Group Members:<br>';
  for(var i =0;i<peoplenames.length;i++){
    if(peoplenames[i][3]==groupnum){
      out+='<input type="submit"onclick="google.script.run.showPerson('+i+');"value="'+peoplenames[i][0]+' '+peoplenames[i][1]+' - '+peoplenames[i][2]+'"><br>';
    }
  }
  return out;
}

function getTime(date){
  //we don't want to check the dates and weeks and stuff like that, we assume that the schedule is for the same day
  return (date.getHours()*60)+date.getMinutes();
}

function getSchedule(person){
    var row =0;
    var rows='';
    var out='';
    //current represents where the person is currently
  var current= '<b>Currently at - Before school</b>';;
    //<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css">
    //cehck every time
    for(var i =0;i<16;i++){
      if(times[0][i]){
      //if it is a criteria key
      if(times[0][i]=='KEY'){
        //check all the mod names
        for(var y=0;y<5;y++){
          if(mods[y][i]!='NULL'||mods[y][i]){
            //check key type
            if(mods[y][i].substring(0,1)=='c'){
              if(mods[y][i].substring(1)==peoplenames[(person)][4]){
                row=y;
                break;
              }
            }else if(mods[y][i].substring(0,1)=='g'){
              var range = mods[y][i].substring(1).split('-');
              if(peoplenames[person][3]>=range[0]&&peoplenames[person][3]<=range[1]){
              row=y;
               break;
              }
            }
          }
        }
      }else{
        //check actual times
       var d = new Date(times[0][i]);
        var hours = parseInt(d.getHours());
        if(hours>12){
          hours-=12;
        }
        rows+=hours +':'+addZero(d.getMinutes())+'&'+mods[row][i]+';';
        var currenttime = new Date();
     // ui.alert(getTime(currenttime),getTime(d),ui.ButtonSet.OK);
        if(getTime(currenttime)>getTime(d)){
         current = '<b>Currently at - '+getFullModName(mods[row][i])+'</b>';
        }
      }
      }
    }
  
    rows=rows.split(';');
    for(var i =0;i<rows.length;i++){
            if(rows[i]){
      var currentrow = rows[i].split('&');
      out+=currentrow[0]+' - '+getFullModName(currentrow[1])+'<br>';
      }
    }
  
  out+='<br>'+current;
    return out;
  }

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

  function showGroup(row){
 var htmlOutput = HtmlService
     .createHtmlOutput(getHTMLPrepend()+'<p>'+parseGroupSchedule(getSchedule(row))+'</p><br><input type="submit"value="Cohort: '+peoplenames[row][4]+'"onclick="google.script.run.viewCohort(\''+peoplenames[row][4]+'\')"><br>'+getGroupMembers(row)+'<br><br>'+getMainMenuButton()+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500);
 ui.showModalDialog(htmlOutput, 'Group '+peoplenames[row][3]);
  }
  
  function showPerson(person){
 var htmlOutput = HtmlService
 .createHtmlOutput(getHTMLPrepend()+'<p>'+parseLearnerSchedule(getSchedule(person),person)+'</p><br><input type="submit"value="Cohort: '+peoplenames[person][4]+'"onclick="google.script.run.viewCohort(\''+peoplenames[person][4]+'\')"><br><input type="submit"value="LOTE: '+peoplenames[person][2]+'"onclick="google.script.run.viewLOTE(\''+peoplenames[person][2]+'\');"><br><input type="submit"value="Group '+peoplenames[person][3]+'"onclick="google.script.run.showGroup('+person+');"><br><br>'+getMainMenuButton()+getHTMLAppend())
     .setSandboxMode(HtmlService.SandboxMode.IFRAME)
     .setWidth(300)
     .setHeight(500);
 ui.showModalDialog(htmlOutput, peoplenames[person][0]+' '+peoplenames[person][1]);
  }

function askForGroup(){
  var result = ui.prompt(
      'Group Lookup',
      'Please enter a valid group number',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var first = result.getResponseText();
  if (button == ui.Button.OK) {
    var found = false;
    if(!first){
      ui.alert('Please make a selection',ui.ButtonSet.OK);
    found=true;
    askForSGroup();}
     else if(isNaN(first)){
        ui.alert('Please enter a valid number');
       found=true;
       askForGroup();
        }else{
                  for(var i =0;i<peoplenames.length;i++){
          if(peoplenames[i][3]==first){
            showGroup(i);
            found=true;
            break;
          } 
                  }
                  }
      
    if(!found){ui.alert('Group not found',ui.ButtonSet.OK);askForGroup();}
  } else if (button == ui.Button.CANCEL) {
    start();
  } 
}

function askForStudent() {
  var result = ui.prompt(
      'Learner Lookup',
      'Please enter a learner\'s full first and last name:',
      ui.ButtonSet.OK_CANCEL);

  // Process the user's response.
  var button = result.getSelectedButton();
  var response = result.getResponseText();
  if (button == ui.Button.OK) {
    var found = false;
    if(!response){
      ui.alert('Please make a selection',ui.ButtonSet.OK);
    found=true;
    askForStudent();}
     else {
       var spaceindex = response.indexOf(' ');
       //the +1 is because i dont want to include the actual space in the final string
        var second = response.substring(spaceindex+1).toLowerCase();
       var first = replaceAll(response.substring(0,spaceindex).toLowerCase(),'_',' ');
       if(second){
         for(var i =0;i<peoplenames.length;i++){
      if(peoplenames[i][0].toLowerCase()===first&&peoplenames[i][1].toLowerCase()===second){
        found=true;
        return i;
      }
        }
       }
        }
      
    if(!found){ui.alert('Person not found',ui.ButtonSet.OK);askForStudent();}
  } else if (button == ui.Button.CANCEL) {
    start();
  } 
}
