//tinyurl.com/ahsscheduler
//https://github.com/liavt/Scheduler

/*
 * Hey
 * Congrats on finding the source
 *
 * I know it is bad
 * I know it is redudant
 * I know it is messy
 * I know it is undocumented
 *
 * I don't care enough to fix any of it. It works, it's happens basically instantly on chromebooks (the window delay is google's fault)
 *
 * Also why does Google scripts not have OOP? That would make this task so much easier on so many levels.
 * And autocomplete might be nice
 * How about an actually competetant formatter?
 * And also MAYBE A DEVELOPER CONSOLE
 *
 * Basically if the API was better this could be much better, but sadly, this is how it has to be.
 *
 * Also if you want to edit or view the code, go to https://github.com/liavt/Scheduler
 * It's there, I promise. If you want to add a feature that will make it into the final version, just make a pull request. I will review it, and if it's
 * good enough, I will add it to the master branch
 * -Liav
 *
 * PS: If you find this message, come up to me and say the word 'cucumber' to my face.
 */

 /*** Variables ***/
 // Control Panel. Loaded based on grade
 var sheet;
 // Variable initialization
 var settings;
 var peoplenames;
 var mods;
 var times;
 // When updating modnames don't forget to change the getModColor() function
 var modnames;
 // Get remote version
 var remoteversion;
 // Current version
 var version = 1.6;
 // Variable for tracking whether grade is set or not
 var invalidGrade = false;
 var grade = '9';
var url;
var view;

 function createVariables(currentgrade){
   Logger.log("Created variables");
	sheet = SpreadsheetApp.openByUrl(getGradeSpreadsheet(currentgrade)).getSheets()[0];
	// Variable initialization
	settings = sheet.getRange(34,1,37,5).getValues();
	peoplenames = SpreadsheetApp.openByUrl(settings[1][0]).getActiveSheet().getRange(2,1,135,10).getValues().sort();
	mods = sheet.getRange(2,1,15,16).getValues();
	times = sheet.getRange(1,1,1,16).getValues();
	// When updating modnames don't forget to change the getModColor() function
	modnames = sheet.getRange(18,1,15,2).getValues();
	// Get remote version
	remoteversion = sheet.getRange(19, 10).getValue();
   grade=currentgrade;
   url = ScriptApp.getService().getUrl();
   
   if(grade=='9'||grade=='8'){
     SEARCH_TYPE.LOTE=2;
     SEARCH_TYPE.COHORT=3;
     SEARCH_TYPE.GROUP=4;
   }
 }

function filterOutDuplicates(a,xindex) {
	var result = [];
	for (var i = 0; i < a.length; i++) {
		if (result.indexOf(a[i][xindex]) == -1) {
			result.push(a[i][xindex]);
		}
	}
	return result;
}

function getGradeClassName(){
  if(grade=='10'){
    return 'Path'
  }else{
    return 'Cohort'
  }
}

function getParametersForPerson(id){
  var string = '';
  string = addParameter('first',peoplenames[id][0],string);
    string = addParameter('last',peoplenames[id][1],string);
    string = addParameter('grade',grade,string);
  return string;
}

function getParameterByName(name, url) {
    // Standardize strange capitalization
    url = url.toLowerCase();
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function addParameter(name, value, string){
  if(!string.startsWith('?'))string = string.concat('&');
  return  string.concat(name,'=',value);
}

function capitalizeFirstLetter(target) {
    // Return a string with the first letter capitalized.
    return target.substring(0,1).toUpperCase()+target.substring(1);
}

function getGreeting(){
  var d= new Date();
  if(d.getHours()<12){
     return 'Good morning';
  } else if(d.getHours()<17){
     return 'Good afternoon';
  }else if(d.getHours()<20){
    return 'Good evening'; 
}else {
     return 'Good night';
  }
  //april fools
//  if(d.getHours()<12){
//     return 'Top of da morning';
//  } else if(d.getHours()<17){
//     return 'Nooning after';
//  } else {
//     return 'Good odding';
//  }
}

function viewLearnerSchedule(querystring){
   // Get the first name
    var firstName = getParameterByName('first', querystring);
    // Get the last name
    var lastName = getParameterByName('last', querystring);
    // Resolve the name into an ID that we can use
    var id = findPersonByName(firstName, lastName);
    if (id != -1) {
        // Return the normal data
      //pullBackground();
      return '<div id="name"><p>'+capitalizeFirstLetter(firstName)+' ' + capitalizeFirstLetter(lastName) + '</p></div><br><div><p>' + getSchedule(id) + '</p></div><br>' + embedSchedule()+'<br>'+getInfoButtons(id);
    } else {
        // Invalid user
        // Return an error message
        return '<div id="name">'+capitalizeFirstLetter(firstName) + ' ' + capitalizeFirstLetter(lastName) + ' was not found. </div><br><div>Please enter a valid name.<br>If this continues to happen, try clicking on the \'Learners\' tab above.</div>';
    }
}

function viewPersonalizedSchedule(querystring){
   // Get the first name
    var firstName = getParameterByName('first', querystring);
    // Get the last name
    var lastName = getParameterByName('last', querystring);
    // Resolve the name into an ID that we can use
    var id = findPersonByName(firstName, lastName);
    if (id != -1) {
        // Return the normal data
      return pullBackground()+'<div id="name"class="personalized"><p>'+getGreeting()+', ' + capitalizeFirstLetter(firstName) + '</p></div><br><div class="personalized"><p><h1>Here\'s your schedule for today:</h1><p id="personalized-schedule">' + getSchedule(id) + '</p></p></div>'+getUpdateScript(id)+getQuoteOfTheDay()+'<br>' + embedSchedule()+'<br>'+getInfoButtons(id);
    } else {
        // Invalid user
        // Return an error message
        return '<div id="name">'+capitalizeFirstLetter(firstName) + ' ' + capitalizeFirstLetter(lastName) + ' was not found.</div><br><div>You shouldn\'t have gotten here anyways. Unless you\'re a hacker.</div>';
    }
}

function listAllPeople(){
  var html = '<div id="name"><p>'+grade+'th grade</p></div><br><div class="noanimation">';
  for(var i =0;i<peoplenames.length;i++){
    if(peoplenames[i][0]&&peoplenames[i][1]){
    html+=getHTMLButtonForPerson(i)+'<br>';
    }
  }
  html+='</div>';
  return html;
}


function findGroup(groupnum){
    // Get the ID of a person in the group
    for (var i = 0;i < peoplenames.length; i++) {
        if (peoplenames[i][SEARCH_TYPE.GROUP].toString().toLowerCase()==groupnum.toString().toLowerCase()) {
            return i;
        }
    }
    // Didn't find it. Return -1
    return -1;
}

function viewGroupSchedule(querystring){
    var group = getParameterByName('group',querystring);
    // Resolve the name into an ID that we can use
    var id = findGroup(group);
    if (id != -1) {
        // Return the normal data
        return '<div id="name"><p>Group ' + group + '</p></div><br><div>' + getSchedule(id) + '</div><br>' + embedSchedule()+'<br>'+getInfoButtonsForGroup(group);
    } else {
        // Invalid user
        // Return an error message
        return 'Group '+group+ ' was not found. Please enter a valid number.';
    }
}

/**
*What to show, based on GET query
*@readonly
*@enum {number}
*/
var VIEW_TYPE = {
  /**
  *When view=0, shows the learner schedule. Needs parameters first, last, and grade.
  */
  LEARNER_SCHEDULE: 0,
    /**
  *When view=1, shows the group schedule. Needs parameters group and grade.
  */
  GROUP_SCHEDULE: 1,
    /**
  *When view=2, lists all of a a SEARCH_TYPE. Needs parameters type and grade.
  */
  LIST_ALL: 2,
  /**
  *When view=3, lists all people in a SEARCH_TYPE. Needs parameters type, term,  and grade.
  */
  LIST_ALL_IN: 3,
  /**
  *When view=4, lists everyone in the grade. Needs parameter grade.
  */
  LIST_PEOPLE: 4,
  /**
  *When view=5, views a learner's schedule, personalized for them. Needs parameter group, first, and last.
  */
  PERSONALIZED_SCHEDULE: 5,
  /**
  *When view=6, views the schedule as a spreadsheet
  */
  SCHEDULE:6,
  /**
  *When view=7, views everything that you can search
  */
  VIEW_SEARCH_TYPES: 7,
    /**
  *When view=8, brings up a homepage
  */
  HOMEPAGE:8,
    /**
  *When view=9, shows the about page
  */
  ABOUT:9,
};

/**
*What to sort by when view=2, view=3, LIST_ALL_IN or LIST_ALL is chosen
*@enum {number}
*/
var SEARCH_TYPE = {
  COHORT: 4,
  LOTE: 2,
  GROUP: 3,
  
}

function viewAboutPage(){
  return '<?!= include("About"); ?>';
}

function processQuery(querystring) {
    // Needed so the querystring parse won't choke
    // It needs it in the format ?field1=data&field2=data&field3=data etc.
    querystring = '?' + querystring;
    var type = getParameterByName('view',querystring);
  view=type;
  if(type==VIEW_TYPE.LEARNER_SCHEDULE.toString()){
     return viewLearnerSchedule(querystring);
  }else if(type==VIEW_TYPE.GROUP_SCHEDULE.toString()){
    return viewGroupSchedule(querystring);
  }else if(type==VIEW_TYPE.LIST_ALL.toString()){
    return searchAll(querystring);
  }else if(type==VIEW_TYPE.LIST_ALL_IN.toString()){
    return searchAllIn(querystring);
  }else if (type==VIEW_TYPE.LIST_PEOPLE.toString()){
    return listAllPeople();
  }else if(type==VIEW_TYPE.PERSONALIZED_SCHEDULE.toString()){
    return viewPersonalizedSchedule(querystring);
  }else if(type==VIEW_TYPE.SCHEDULE.toString()){
    return viewFullSchedule();
  }else if(type==VIEW_TYPE.VIEW_SEARCH_TYPES.toString()){
    return viewSearchTypes(querystring);
  }else if(type==VIEW_TYPE.HOMEPAGE.toString()){
    return viewHomepage();
  }else if(type==VIEW_TYPE.ABOUT.toString()){
    return viewAboutPage();
  }else {
    return getErrorPage(404, type+' is not a view');
  }
}

function viewSearchTypes(string){
  return '<?!= include("ViewSearchTypes"); ?>';
}

function doGet(e) {
    // Function that runs when the page opens
  var html = '';
	var tempGrade = getParameterByName('grade', '?' + e.queryString);
  if(!tempGrade){
    html = getErrorPage(422,'Parameter \'grade\' not found. <br>This happens when the URL is wrong.');
  }else{
	createVariables(tempGrade);
    html = processQuery(e.queryString);
  }
     var style = getParameterByName('style',e.queryString);
  if(style){
    html+='<?!= include("'+style+'"); ?>';
  }
    var htmlOutput = constructHTML( html , 1000, 1000, 'Schedule');
 // return HtmlService.createHtmlOutput('You must be signed in as a mypisd.net account to access the schedule.');
   return htmlOutput;
}

function getSearchTypeName(num){
  if(num==SEARCH_TYPE.COHORT){
    return getGradeClassName();
  }else if(num==SEARCH_TYPE.LOTE){
    return 'LOTE';
  }else if(num==SEARCH_TYPE.GROUP){
    return 'Group';
  }
}

function searchAllIn(string){
  var searchtype = getParameterByName('type',string);
  var searchterm = getParameterByName('term',string);
  if(searchtype&&searchterm){
    searchtype = Number(searchtype);
    var out = '<div id="name">'+getSearchTypeName(searchtype)+':'+capitalizeFirstLetter(searchterm)+'</div><br><div class="noanimation">';
    for(var i =0;i<peoplenames.length;i++){
      if(peoplenames[i]&&peoplenames[i][searchtype].toString().toLowerCase()==searchterm.toString().toLowerCase()){
      out+=getHTMLButtonForPerson(i)+'<br>';
      }
    }
    out = out.concat('</div>');
    return out;
  }else{
    return getErrorPage(422,'\'type\' or \'term\' not found. This usually happens when the URL is wrong.');
  }
}

function viewHomepage(){
  return '<?!= include("Homepage") ?>';
}

function getCohortID(){
  return SEARCH_TYPE.COHORT;
}

function getLOTEID(){
  return SEARCH_TYPE.LOTE;
}

function getGroupID(){
  return SEARCH_TYPE.GROUP;
}

function searchAll(string){
  var searchtype = getParameterByName('type',string);
  if(searchtype){
    searchtype = Number(searchtype);
        var out = '<div id="name">'+getSearchTypeName(searchtype)+' Lookup</div><br><div class="noanimation">';
    var arr = filterOutDuplicates(peoplenames,searchtype);
    if(!arr||arr.length<=1){
      return 'There are no '+getSearchTypeName(searchtype).toLowerCase()+'s this project';
    }
    for(var i =0;i<arr.length;i++){
      if(arr[i]){
      out+=getHTMLButtonForType(searchtype,arr[i])+'<br>';
      }
    }
    out = out.concat('</div>');
    return out;
  }else{
    return getErrorPage(422,'\'type\' not found. This usually happens when the URL is wrong.');
  }
}

function getGradeSpreadsheet(target) {
    // Return spreadsheet based on grade
    if (target == '9') {
        // 9th grade spreadsheet
        return 'https://docs.google.com/a/pisd.edu/spreadsheets/d/1MiMdKA9BW-BVG1UnDOW58kF1Btd2YBVs6fueGOM6TbM/edit?usp=sharing';
    } else if (target == '10') {
        // 10th grade spreadsheets
        // This will need to be updated when actually deploying it
        return 'https://docs.google.com/a/pisd.edu/spreadsheets/d/1HsbA9Sjj2qTzKikSJBsH9wPZCZlQnxQyvp00v2QSbJo/edit?usp=sharing';
    } else if(target=='8'){
      //for debugging
      return 'https://docs.google.com/spreadsheets/d/1I1tOOUHjoeqWRTUcbDeO5WXNDBERg9mH3EWMa1X9cNg/edit#gid=0';
    }
}

function viewFullSchedule(){
  var date = new Date();
  return '<div id="name">Schedule</div><br>'+embedSchedule();
}

function getFullModName(name) {
    for (var i = 0; i < modnames.length; i++) {
        if (modnames[i][0] == name) {
          return modnames[i][1];
        }
    }
}

function getModColor(name) {
    for (var i = 0; i < modnames.length; i++) {
        if (modnames[i][0] == name) {
          return sheet.getRange(i+18, 1).getBackground();
        }
    }
}

function parseLearnerSchedule(sched, person) {
    var newsched = sched.split('<br>');
    var out=''
    if (newsched) {
        for (var i = 0; i < newsched.length; i++) {
            if (newsched[i]) {
                var split = newsched[i].split('-');
                var hdindex = split[1].indexOf('%HD');
                if (hdindex >= 0) {
                    if (isInHelpDesk(person)) {
                        split[1] = '  <i>' + settings[11][0] + '</i>';
                    } else {
                        split[1] = split[1].substring(0,hdindex);
                    }
                }
                out += split[0] + '-' +split[1] + '<br>';
            }
        }
    }
    return out;
}

function replaceAll(string, search, replacement) {
    // Replace the requested item with the replacement
    return string.replace(new RegExp(search, 'g'), replacement);
};

function parseGroupSchedule(sched, person) {
    return replaceAll(sched,'%HD','<i> or ' + settings[11][0] + '</i>');
}

function filterOutDuplicates(a,xindex) {
    var result = [];
    for (var i = 0; i < a.length; i++) {
        if (result.indexOf(a[i][xindex]) == -1) {
            result.push(a[i][xindex]);
        }
    }
    return result;
}

function findPersonByName(first,last) {
    // Get the ID of the personS
    for (var i = 0;i < peoplenames.length; i++) {
        if (peoplenames[i][0].toLowerCase() === first && peoplenames[i][1].toLowerCase() === last) {
            return i;
        }
    }
    // Didn't find it. Return -1
    return -1;
}

function getTime(date) {
    // Only check for current day
    return (date.getHours() * 60) + date.getMinutes();
}


//don't even try understanding this. I basically wrote a O(n) algorithim to parse the schedule. It is extremely complicated.
function getSchedule(person) {
    // TODO: Rename one of them
    var row = -1;
    var rows = '';
    // HTML output variable
    var out = '';
    // Current represents where the person is currently
    var current = '<b>Currently at - Before school</b>';;
    var next = '';
    // I have no idea what's going on here - Jason
    // Check every time
    for (var i = 0; i<16; i++) {
        if (times[0][i]) {
            // Iff it is a criteria key
            if (times[0][i] == 'KEY') {
                // Check all the mod names
                for (var y = 0; y < 15; y++) {
                    if (mods[y][i] != 'NULL' || mods[y][i]) {
                        //check key type
                        if (mods[y][i].substring(0,1) == 'c') {
                            if (mods[y][i].substring(1) == peoplenames[(person)][SEARCH_TYPE.COHORT]) {
                                row = y;
                                break;
                            }
                        } else if (mods[y][i].substring(0,1) == 'g') {
                            var range = mods[y][i].substring(1).split('-');
                            var cindex = range[1].indexOf('c');
                          if(cindex<=0){
                            cindex = range[1].length;
                          }
                            if (peoplenames[person][SEARCH_TYPE.GROUP] >= range[0] && peoplenames[person][SEARCH_TYPE.GROUP] <= range[1].substring(0,cindex)) {
                              if(cindex>0&&cindex!=range[1].length){
                                  if(peoplenames[person][SEARCH_TYPE.COHORT]==range[1].substring(cindex+1)){
                                    row=y;
                                    break;
                                  }else{
                                    continue;
                                  }
                                }else{
                                row = y;
                                break;
                                }
                            }
                        }
                    }
                }
            } else {
                // Check actual times
                var d = new Date(times[0][i]);
                var hours = parseInt(d.getHours());
                if (hours > 12) {
                    // Convert to AM/PM from military time
                    hours -= 12;
                }
                // Add new time to output
                rows += hours + ':' + addZero(d.getMinutes());
                // Current time
                var currenttime = new Date();
                if (getTime(currenttime) >= getTime(d)&&row>=0) {
                    // Get display name of current class
                    current = '<b>Currently at - ' + getFullModName(mods[row][i]) + '</b>';
                    if (typeof getFullModName(mods[row][i + 1]) == 'undefined') {
                        // Since the next mod is undefined, we can safely assume that school is over
                        next = '<b>Next - End of school </b>';
                    } else {
                        // Get the next class
                        next = '<b>Next - ' + getFullModName(mods[row][i +1]) + '</b>';
                    }
                }
              if(row>=0){
              rows+='&' + mods[row][i]+';';
              }
            }
        }
    }
  if(row<0){
    return 'Oops! Your personalized schedule wasn\'t found!';
  }
    rows = rows.split(';');
    for (var i =0; i < rows.length; i++) {
        if (rows[i]) {
            var currentrow = rows[i].split('&');
            out += currentrow[0] + ' - ' + getFullModName(currentrow[1]) + '<br>';
        }
    }

    out += '<br>' + current;
    out += '<br>' + next;
    return out;
}

function addZero(i) {
    // Add a leading zero if the number is a single digit
    if (i < 10) {
        // Implicit cast
        i = "0" + i;
    }
    return i;
}

function blah(){
  return "hey";
}

/**for updating the schedule*/
function getUpdatedSchedule(grade,id){
    return "hi";
//  createVariables(grade);
//  return getSchedule(id);
}
