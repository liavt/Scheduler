/*
 * Hey
 *
 * You found the source
 * Cool.
 * I know it sucks
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
 * good enough, I will add it to the master branch (with Mr. Bailey's approval of course)
 * -Liav
 *
 * PS: If you find this message, come up to me and say the word 'cucumber' to my face.
 */

/*** Variables ***/
// Get UI. It won't work when triggered by time
var ui = SpreadsheetApp.getUi();
// Get active spreadsheet
var currentsheet = SpreadsheetApp.getActiveSheet();
// Control Panel
var sheet = SpreadsheetApp.openByUrl('https://docs.google.com/a/pisd.edu/spreadsheets/d/1MiMdKA9BW-BVG1UnDOW58kF1Btd2YBVs6fueGOM6TbM/edit?usp=sharing').getSheets()[0];
// Variable initialization
var settings = sheet.getRange(24,1,37,5).getValues();
var peoplenames = SpreadsheetApp.openByUrl(settings[1][0]).getActiveSheet().getRange(2,1,135,5).getValues().sort();
var mods = sheet.getRange(2,1,5,16).getValues();
var times = sheet.getRange(1,1,1,16).getValues();
// When updating modnames don't forget to change the getModColor() function
var modnames = sheet.getRange(8,1,15,2).getValues();
// Get remote version
var remoteversion = sheet.getRange(19, 10).getValue();
var version =1.31;

var user = PropertiesService.getUserProperties();

/*** Triggers ***/
function init() {
	// Kickstart everything
    checkVersion();
	updateSpreadsheet();
	var menu = SpreadsheetApp.getUi().createMenu('Schedule');
	menu.addItem('Open menu', 'start');
	// Integrated with the refresh button
	// menu.addItem('Update spreadsheet','updateSpreadsheet');
	menu.addItem('About', 'versionInfo').addToUi();
}

function firstRun() {
	// Ask if this is the first time
	if (Browser.msgBox("Is this your first time clicking this?", ui.ButtonSet.YES_NO) == ui.Button.YES) {
		// Get active spreadsheet
	    var ss = SpreadsheetApp.getActive();
		// Add trigger for init when spreadsheet opens
		if(!triggersExist()){
	    ScriptApp.newTrigger('init')
	      .forSpreadsheet(ss)
	      .onOpen()
	      .create();
		}
		// Run init or else nothing else will appear
	    init();
	} else {
		// Run init
		init();
	}
}

/*** Data Processing ***/

function getModColor(mod) {
	for (var i = 0; i < modnames.length; i++) {
		if (modnames[i][0] == mod) {
			// Get background color of the selected box
			return sheet.getRange(i +8,1).getBackground();
		}
	}
}

function getFullModName(name) {
	for (var i = 0; i < modnames.length; i++) {
		if (modnames[i][0] == name) {
		  return modnames[i][1];
		}
	}
}

function getHTMLPrepend() {
	return '<!DOCTYPE html><link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><html><head><base target="_top"></head><body>';
}

function getHTMLAppend() {
	return ' </body></html>';
}

function constructHTML(data, width, height, title) {
	if (title == 'undefined') {
		var output = HtmlService.createHtmlOutput(getHTMLPrepend() + data + getHTMLAppend())
		.setSandboxMode(HtmlService.SandboxMode.IFRAME)
		.setWidth(width)
		.setHeight(height);
	} else {
		var output = HtmlService.createHtmlOutput(getHTMLPrepend() + data + getHTMLAppend())
		.setSandboxMode(HtmlService.SandboxMode.IFRAME)
		.setWidth(width)
		.setHeight(height)
		.setTitle(title);
	}
	return output;
}

function parseLearnerSchedule(sched, person) {
	var newsched = sched.split('<br>');
	var out='';
	if (newsched) {
		for (var i = 0; i < newsched.length; i++) {
			if (newsched[i]) {
				var split = newsched[i].split('-');
				var hdindex = split[1].indexOf('%HD');
				if (hdindex >= 0) {
					if (isInHelpDesk(person)) {
						split[1] = '  <i>' +settings[11][0] + '</i>';
					} else {
						split[1] = split[1].substring(0,hdindex);
					}
				}
				out+=split[0] + '-' +split[1] + '<br>';
			}
		}
	}
	return out;
}

function replaceAll(string, search, replacement) {
	return string.replace(new RegExp(search, 'g'), replacement);
};

function parseGroupSchedule(sched, person) {
	return replaceAll(sched,'%HD','<i> or ' +settings[11][0] + '</i>');
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
	for (var i = 0;i < peoplenames.length; i++) {
		if (peoplenames[i][0].toLowerCase() === first && peoplenames[i][1].toLowerCase() === last) {
			return i;
		}
	}
	return -1;
}

function searchAndViewStudent() {
	showPerson(askForStudent());
}

function getTime(date) {
	//we don't want to check the dates and weeks and stuff like that, we assume that the schedule is for the same day
	return (date.getHours()*60) +date.getMinutes();
}


function getSchedule(person) {
	var row = 0;
	var rows = '';
	var out = '';
	//current represents where the person is currently
	var current = '<b>Currently at - Before school</b>';;
	var next = '';
	//<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css">
	//cehck every time
	for (var i = 0; i<16; i++) {
		if (times[0][i]) {
		//if it is a criteria key
			if (times[0][i] == 'KEY') {
				//check all the mod names
				for (var y = 0; y<5; y++) {
					if (mods[y][i] != 'NULL' || mods[y][i]) {
						//check key type
						if (mods[y][i].substring(0,1) == 'c') {
							if (mods[y][i].substring(1) == peoplenames[(person)][4]) {
								row = y;
								break;
							}
						} else if (mods[y][i].substring(0,1) == 'g') {
							var range = mods[y][i].substring(1).split('-');
							if (peoplenames[person][3] >= range[0] && peoplenames[person][3] <= range[1]) {
								row = y;
								break;
							}
						}
					}
				}
			} else {
			//check actual times
				var d = new Date(times[0][i]);
				var hours = parseInt(d.getHours());
				if (hours>12) {
					hours-=12;
				}
				rows += hours + ':' +addZero(d.getMinutes()) + '&' +mods[row][i] + ';';
				var currenttime = new Date();
				// ui.alert(getTime(currenttime),getTime(d),ui.ButtonSet.OK);
				if (getTime(currenttime) >= getTime(d)) {
					current = '<b>Currently at - ' + getFullModName(mods[row][i]) + '</b>';
					if (typeof getFullModName(mods[row][i +1]) == 'undefined') {
						next = '<b>Next - End of school </b>';
					} else {
						next = '<b>Next - ' + getFullModName(mods[row][i +1]) + '</b>';
					}
				}
			}
		}
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
	if (i < 10) {
		i = "0" + i;
	}
	return i;
}

function getMainMenuButton() {
	return '<input type="submit"value="Back to Main Menu"onclick="google.script.run.start();">';
}

/*** UI Interaction ***/

function checkVersion() {
	SpreadsheetApp.getActive().toast('Checking for updates...');
	if (remoteversion > version) {
        var output = '<p>A new version is available (version ' + remoteversion + '.) You have version ' + version + '. <br>It is HIGHLY recommended that you copy the newest spreadsheet</p><br><a href="https://docs.google.com/a/pisd.edu/spreadsheets/d/1s0HqXOHvvjrl1Rchg-e7i_TBYpVeOCDbXw2U5SmuB78/edit?usp=sharing" target="_blank">Open</a>';
		var htmlOutput = constructHTML(output, 300, 130);
		ui.showModalDialog(htmlOutput, 'New Version');
	} else {
		SpreadsheetApp.getActive().toast('No updates found.');
	}
	checkProperties();
	// I don't think we should refresh the sidebar after checking version
	// showSidebar();
}

function showSidebar() {
	// Get the ID of a person
	var personid = parseInt(user.getProperty('USER_DATABASE_ID'));
	// Make sure the ID isn't invalid
	if (personid > 0) {
		// Get the schedule
		var schedule = getSchedule(personid);
        var output = '<p>' +schedule+ '</p><br><input type="submit"value="Cohort: ' + peoplenames[personid][4] + '"onclick="google.script.run.viewCohort(\'' + peoplenames[personid][4] + '\')"><br><input type="submit"value="LOTE: ' + peoplenames[personid][2] + '"onclick="google.script.run.viewLOTE(\'' + peoplenames[personid][2] + '\');"><br><input type="submit"value="Group ' + peoplenames[personid][3] + '"onclick="google.script.run.showGroup(' + personid + ');">';
		// Build HTML output
		var htmlOutput = constructHTML(output, 300, 500, peoplenames[personid][0] + ' ' + peoplenames[personid][1] + '\'s schedule');
		// Show the sidebar
		ui.showSidebar(htmlOutput);
	}
}

function checkProperties() {
	if (!user.getProperty('USER_DATABASE_ID') || user.getProperty('USER_DATABASE_ID') == null || user.getProperty('USER_DATABASE_ID') < 0) {
		user.setProperty('USER_DATABASE_ID', -1);
		// While the ID is invalid (because the user doesn't exist)
		while(user.getProperty('USER_DATABASE_ID') < 0) {
			// Prompt the user for their First Name and last name
			var response = ui.prompt('Please enter your full first and last name. If you don\'t want a personalized calender (only want to look at other people\'s) then leave it blank.',ui.ButtonSet.OK);
			// Read the input
			var text = response.getResponseText();
			var spaceindex = text.indexOf(' ');
			// The +1 is because I don't want to include the actual space in the final string
			var second = text.substring(spaceindex + 1).toLowerCase();
			var first = replaceAll(text.substring(0, spaceindex).toLowerCase(),'_',' ');
			user.setProperty('USER_DATABASE_ID', findPersonByName(first,second));
		}
	}
}

function clearSettings() {
	// Start all over
	user.deleteProperty('USER_DATABASE_ID');
	ui.alert('Reset settings.',ui.ButtonSet.OK);
	// checkVersion();
	updateSpreadsheet();
}

function versionInfo() {
    var output = '<p>Current Version: ' + version + '<br>Minimum version: ' + remoteversion + '<br>Person: ' + user.getProperty('USER_DATABASE_ID') + '<br><br>Created by Liav Turkia and contributors</p><br><input type="submit"value="Check for new updates"onclick="google.script.run.checkVersion();"><br><input class="create"type="submit"value="RESET"onclick="google.script.run.clearSettings();">';
	var htmlOutput = constructHTML(output, 200, 250);
	ui.showModalDialog(htmlOutput, 'Version Info');
}

function triggersExist(){
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
   if (triggers[i].getEventType() == ScriptApp.EventType.ON_OPEN&&triggers[i].getHandlerFunction()=="init") {
     return true;
     // Some code here - other options are:
     // ScriptApp.EventType.ON_EDIT
     // ScriptApp.EventType.ON_FORM_SUBMIT
     // ScriptApp.EventType.ON_OPEN
   }
 }
  return false;
}

function start() {
	// Menu
	var html = HtmlService.createHtmlOutputFromFile('entry')
	  .setSandboxMode(HtmlService.SandboxMode.IFRAME).setWidth(250).setHeight(250);
	ui.showModalDialog(html,'Main Menu');
	// Why would you call this right now?
	// checkVersion();
}

function updateModNames() {
	for (var i = 7; i < 23; i++) {
		var newrange = currentsheet.getRange(i,1,1,4);
		var remoterange = sheet.getRange(i,1,1,4);

		var remotevalues = remoterange.getValues();
		remotevalues[0][1] = remotevalues[0][1].replace('%HD','');
		// You can't copy from a remote spreadsheet so you must do it manually
		newrange.setValues(remotevalues);
		newrange.setFontColors(remoterange.getFontColors());
		newrange.setFontFamilies(remoterange.getFontFamilies());
		newrange.setFontLines(remoterange.getFontLines());
		newrange.setBackgrounds(remoterange.getBackgrounds());
	}
}

function updateSchedule() {
	var timerange = currentsheet.getRange(1,1,1,16);
	var modrange = currentsheet.getRange(2,1,5,16);
	var timevalues = timerange.getValues();
	var modvalues = modrange.getValues();

	// Reset the values
	for (var x = 0; x < 16; x++) {
		for (var y = 0; y < 5; y++) {
			modvalues[y][x] = '';
			timevalues[0][x] = '';
		}
	}
	for (var x = 0; x < 16; x++) {
		if (times[0][x]) {
			if (times[0][x] == 'KEY') {
				timevalues[0][x] = '';
				for (var y = 0; y < mods.length; y++) {
					if (mods[y][x]) {
						modvalues[y][x] = mods[y][x].substring(1);
					}
				}
			} else {
				timevalues[0][x] = times[0][x];
				for (var y = 0; y < mods.length; y++) {
					if (mods[y][x]) {
						modvalues[y][x] = mods[y][x];
					}
				}
			}
		}
	}
	modrange.setValues(modvalues);
	timerange.setValues(timevalues);
}

function updateModColors() {
	var timerange = currentsheet.getRange(1,1,1,16);
	var modrange = currentsheet.getRange(2,1,5,16);
	var modtext = modrange.getValues();
	var timetext = timerange.getValues();
	var timevalues = timerange.getBackgrounds();
	var modvalues = modrange.getBackgrounds();
	var defaultcolor = '#F5F5F5'

	for (var x = 0; x < 16; x++) {
		if (timetext[0][x]) {
			timevalues[0][x] = defaultcolor;
			for (var y = 0; y < modtext.length; y++) {
				if (modtext[y][x]) {
					modvalues[y][x] = getModColor(modtext[y][x]);
				} else {
					modvalues[y][x] = '#000000';
				}
			}
		} else {
			timevalues[0][x] = '#000000';
			for (var y = 0; y < modtext.length; y++) {
				if (modtext[y][x]) {
					modvalues[y][x] = defaultcolor;
				} else {
					modvalues[y][x] = '#000000';
				}
			}
		}
	}
	// Actually set the background colors
	modrange.setBackgrounds(modvalues);
	timerange.setBackgrounds(timevalues);
}

function updateSpreadsheet() {
	SpreadsheetApp.getActive().toast('Refreshing schedule...');
	// Check for updates
	checkVersion();
	// Update everything
	updateModNames();
	updateModColors();
	updateSchedule();
	// Prevent editing of the sheet
	// TODO: Fix this
	var protection = currentsheet.protect().setDomainEdit(false).setDescription('Cannot edit the schedule');;
	var users = protection.getEditors();
	for (var i =0; i < users.length; i++) {
		protection.removeEditor(users[i]);
	}
	SpreadsheetApp.getActive().toast('Schedule updated');
	showSidebar();
}

function listAll(target) {
	var out = '<div>';
	Logger.log(target);
	if (target == 'LOTE') {
		var newarray = filterOutDuplicates(peoplenames, 2);
	} else if (target == 'Cohort') {
		var newarray = filterOutDuplicates(peoplenames, 4);
	}
	if (target == 'LOTE' || target == 'Cohort') {
		for (var i = 0; i < newarray.length; i++) {
			if (newarray[i]) {
				out += '<input type="submit"value="' + newarray[i] + '"onclick="google.script.run.view' + target + '(\'' + newarray[i] + '\');"><br>';
			}
		}
	} else if (target == 'People') {
		for (var i = 0; i < peoplenames.length; i++) {
			if (peoplenames[i][0] && peoplenames[i][1]) {
				out += '<input type="submit"value="' + peoplenames[i][0] + ' ' + peoplenames[i][1] + '"onclick="google.script.run.showPerson(' + i + ');"><br>';
			}
		}
	}
	out += '</div><br>';
	if (target == 'LOTE' || target == 'Cohort') {
		out += '<input type="submit"value="Search for a ' + target + '"onclick="google.script.run.askFor' + target + '();">';
	} else if (target == 'People') {
		out += '<input type="submit"value="Search for a student"onclick="google.script.run.searchAndViewStudent()">';
	}
	out += getMainMenuButton();

	var htmlOutput = constructHTML(out, 300, 500);
	ui.showModalDialog(htmlOutput, target);
}

function listAllLOTE() {
	listAll('LOTE');
}

function listAllPeople() {
	listAll('People');
}


function listAllCohort() {
	listAll('Cohort');
}

function viewCohort(cohort) {
	var out = '';
	for (var i=0;i<peoplenames.length;i++) {
		if (peoplenames[i][4].toLowerCase()==cohort.toLowerCase()) {
			out+='<input type="submit"value="' +peoplenames[i][0] + ' ' +peoplenames[i][1] + '"onclick="google.script.run.showPerson(' + i + ');"><br>';
		}
	}
	out+='<br>';
	out+=getMainMenuButton();

	var htmlOutput = constructHTML(out, 300, 500);
	ui.showModalDialog(htmlOutput, 'Cohort: ' +cohort);
}

function viewLOTE(lote) {
	var out = '<div>';
	for (var i=0;i<peoplenames.length;i++) {
		if (peoplenames[i][2]===lote) {
			out+='<input type="submit"value="' +peoplenames[i][0] + ' ' +peoplenames[i][1] + '"onclick="google.script.run.showPerson(' + i + ');"><br>';
		}
	}
	out+='</div><br>';
	out+=getMainMenuButton();

	var htmlOutput = constructHTML(out, 300, 500);
	ui.showModalDialog(htmlOutput, 'LOTE: ' +lote);
}

function askForCohort() {
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
		if (!response) {
			ui.alert('Please make a selection', ui.ButtonSet.OK);
			found = true;
			askForCohort();}
		else {
			found = true;
			viewCohort(response.toLowerCase());
		}
		if (!found) {
			ui.alert('Cohort not found',ui.ButtonSet.OK);askForCohort();
		}
	} else if (button == ui.Button.CANCEL) {
		start();
	}
}

function askForLOTE() {
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
		if (!response) {
			ui.alert('Please make a selection',ui.ButtonSet.OK);
			found=true;
			askForLOTE();
		} else {
			found=true;
			viewLOTE(response.toUpperCase());
		}
		if (!found) {
			ui.alert('LOTE not found',ui.ButtonSet.OK);askForLOTE();
		}
	} else if (button == ui.Button.CANCEL) {
		start();
	}
}

function getGroupMembers(group) {
	var groupnum = peoplenames[group][3];
	var out='Group Members:<br>';
	for (var i =0;i<peoplenames.length;i++) {
		if (peoplenames[i][3]==groupnum) {
			out+='<input type="submit"onclick="google.script.run.showPerson(' + i + ');"value="' +peoplenames[i][0] + ' ' +peoplenames[i][1] + ' - ' +peoplenames[i][2] + '"><br>';
		}
	}
	return out;
}

function showGroup(row) {
	var htmlOutput = constructHTML('<p>' +getSchedule(row) + '</p><br><input type="submit"value="Cohort: ' +peoplenames[row][4] + '"onclick="google.script.run.viewCohort(\'' +peoplenames[row][4] + '\')"><br>' +getGroupMembers(row) + '<br><br>', 300, 500);
	ui.showModalDialog(htmlOutput, 'Group ' +peoplenames[row][3]);
}

function showPerson(person) {
	var htmlOutput = constructHTML('<p>' +getSchedule(person) + '</p><br><input type="submit"value="Cohort: ' +peoplenames[person][4] + '"onclick="google.script.run.viewCohort(\'' +peoplenames[person][4] + '\')"><br><input type="submit"value="LOTE: ' +peoplenames[person][2] + '"onclick="google.script.run.viewLOTE(\'' +peoplenames[person][2] + '\');"><br><input type="submit"value="Group ' +peoplenames[person][3] + '"onclick="google.script.run.showGroup(' +person+ ');"><br><br>', 300, 500);
	ui.showModalDialog(htmlOutput, peoplenames[person][0] + ' ' +peoplenames[person][1]);
}

function askForGroup() {
	var result = ui.prompt(
		'Group Lookup',
		'Please enter a valid group number',
		ui.ButtonSet.OK_CANCEL);

	// Process the user's response.
	var button = result.getSelectedButton();
	var first = result.getResponseText();
	if (button == ui.Button.OK) {
		var found = false;
		if (!first) {
			ui.alert('Please make a selection',ui.ButtonSet.OK);
			found=true;
			askForGroup();
		} else if (isNaN(first)) {
			ui.alert('Please enter a valid number');
			found=true;
			askForGroup();
		} else {
			for (var i =0;i<peoplenames.length;i++) {
				if (peoplenames[i][3]==first) {
					showGroup(i);
					found=true;
					break;
				}
			}
		}
		if (!found) {
			ui.alert('Group not found',ui.ButtonSet.OK);askForGroup();
		}
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
		if (!response) {
			ui.alert('Please make a selection',ui.ButtonSet.OK);
			found=true;
			askForStudent();
		} else {
			var spaceindex = response.indexOf(' ');
			//the +1 is because i dont want to include the actual space in the final string
			var second = response.substring(spaceindex+1).toLowerCase();
			var first = replaceAll(response.substring(0,spaceindex).toLowerCase(),'_',' ');
			if (second) {
				for (var i =0;i<peoplenames.length;i++) {
					if (peoplenames[i][0].toLowerCase()===first&&peoplenames[i][1].toLowerCase()===second) {
						found=true;
						return i;
					}
				}
			}
		}
		if (!found) {
			ui.alert('Person not found',ui.ButtonSet.OK);askForStudent();
		}
	} else if (button == ui.Button.CANCEL) {
		start();
	}
}
