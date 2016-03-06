/*
 * Hey
 * You must be pretty tech savvy to reach here.
 * We trust you enough not to mess with people's computers.
 * If you do do something malicous, then this entire schedule program will probably be banned, and everyone involved will get in huge trouble.
 * Don't mess it up for everyone else.
 *
 * But otherwise congrats on finding the source
 *
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
// Get UI. It won't work when triggered by time triggers
var ui = SpreadsheetApp.getUi();
var user = PropertiesService.getUserProperties();
// Get active spreadsheet
var currentsheet = SpreadsheetApp.getActiveSheet();
// Control Panel. Loaded based on grade
var sheet = SpreadsheetApp.openByUrl(getGradeSpreadsheet(getGrade())).getSheets()[0];
// Variable initialization
var settings = sheet.getRange(24,1,37,5).getValues();
var peoplenames = SpreadsheetApp.openByUrl(settings[1][0]).getActiveSheet().getRange(2,1,135,5).getValues().sort();
var mods = sheet.getRange(2,1,5,16).getValues();
var times = sheet.getRange(1,1,1,16).getValues();
// When updating modnames don't forget to change the getModColor() function
var modnames = sheet.getRange(8,1,15,2).getValues();
// Get remote version
var remoteversion = sheet.getRange(19, 10).getValue();
// Current version
var version = 1.50;
// Variable for tracking whether grade is set or not
var invalidGrade = false;

function init() {
	// No longer necessary, since updateSpreadsheet calls it anyways
    // checkVersion();
    // Check if the init trigger already exists
	if (!triggersExist()) {
		// Get active spreadsheet
	    var ss = SpreadsheetApp.getActive();
		// Add trigger for init when spreadsheet opens
	    ScriptApp.newTrigger('init')
	      .forSpreadsheet(ss)
	      .onOpen()
	      .create();
	}
    // Get latest version of spreadsheet and schedule
	updateSpreadsheet();
    // Add menu items
	var menu = SpreadsheetApp.getUi().createMenu('Schedule');
	menu.addItem('Open menu', 'start');
	menu.addItem('About', 'versionInfo').addToUi();
    //menu.addItem('Report an issue','showBugReports').addToUi();
}

function showBugReports(){
    // https://docs.google.com/a/mypisd.net/forms/d/1WRZtUyp_WJfaPrjWEUcGR0hzeEiUWNH6GDXEpZwnLi4/viewform
    var output = '<p>Have an issue to report?<br>Fill out a simple form to notify us!</p><br><a href="https://docs.google.com/a/mypisd.net/forms/d/1WRZtUyp_WJfaPrjWEUcGR0hzeEiUWNH6GDXEpZwnLi4/viewform" target="_blank">Open</a>';
    var htmlOutput = constructHTML(output, 300, 130);
    // Display the output
    ui.showModalDialog(htmlOutput, 'Bug Report');
}

function firstRun() {
    /* This function is deprecated. Do NOT use this
     * The only reason why it still exists is because
     * the spreadsheet that everyone else has has a button
     * that links to this. If we remove this, it wrill break that.
     */
    ui.alert('Hey! This button has become outdated!\nFeel free to remove this button!\n\nTo remove it, right click on it.\nAt the top right of the button, there should be a dropdown menu.\nClick \'delete image\' and you\'re done!');
	// Call init since it's the real function
    init();
}

function updateGlobalVariables() {
    // Same code as the global initialization
    // This is needed so we can load the new data
    // from the new spreadsheet after updating
    // the current grade
    sheet = SpreadsheetApp.openByUrl(getGradeSpreadsheet(getGrade())).getSheets()[0];
    user = PropertiesService.getUserProperties();
    currentsheet = SpreadsheetApp.getActiveSheet();
    settings = sheet.getRange(24,1,37,5).getValues();
    peoplenames = SpreadsheetApp.openByUrl(settings[1][0]).getActiveSheet().getRange(2,1,135,5).getValues().sort();
    mods = sheet.getRange(2,1,5,16).getValues();
    times = sheet.getRange(1,1,1,16).getValues();
    // When updating modnames don't forget to change the getModColor() function
    modnames = sheet.getRange(8,1,15,2).getValues();
    // Get remote version
    remoteversion = sheet.getRange(19, 10).getValue();
}

function getGradeSpreadsheet(target) {
    // Return spreadsheet based on grade
    if (target == '9') {
		// 9th grade spreadsheet
        return 'https://docs.google.com/a/pisd.edu/spreadsheets/d/1MiMdKA9BW-BVG1UnDOW58kF1Btd2YBVs6fueGOM6TbM/edit?usp=sharing';
    } else if (target == '10') {
		// 10th grade spreadsheets
		// This will need to be updated when actually deploying it
        return 'https://docs.google.com/a/pisd.edu/spreadsheets/d/1-aABE6GOqhMauoxXE7YX1e4VQOdoW-FDoFR3fSd7JnM/edit?usp=sharing';
    }
}

function chooseGrade() {
	var html = HtmlService.createHtmlOutputFromFile('grade')
	  .setSandboxMode(HtmlService.SandboxMode.IFRAME).setWidth(250).setHeight(250);
	ui.showModalDialog(html,'Select Grade');
}

function setGrade(target) {
	// var inputValid = false;
	// while (!inputValid) {
	//     // Prompt for a valid grade
	//     var response = ui.prompt('Enter a valid grade (9, 10): ', ui.ButtonSet.OK);
	//     // Read the input
	//     var text = response.getResponseText();
	//     // Are there JavaScript switch statements?
	//     // TODO: Switch to switch case if they exist in JavaScript
	//     if (text == '9' || text == '10') {
	//         user.setProperty('USER_GRADE', text);
	// 		// Escape the loop
	// 		inputValid = true;
	//     } else {
	//         ui.alert("Invalid grade was entered.", ui.ButtonSet.OK);
	//     }
	// }
    // Set invalidGrade to false so it won't trigger another prompt
	user.setProperty('USER_GRADE', target);
    invalidGrade = false;
    ui.alert("Your grade has been updated.", ui.ButtonSet.OK);
}

function getGrade() {
    // Detect invalid grade
    if (!user.getProperty('USER_GRADE') || user.getProperty('USER_GRADE') == null || user.getProperty('USER_GRADE') < 0) {
        // Set invalidGrade to true, so later the user will be prompted
        invalidGrade = true;
        // Return default grade (9) so it won't choke
		// Otherwise, the script will halt with
		// strange errors. DO NOT DELETE THIS
        return '9';
    } else {
        // Return the stored grade
        return user.getProperty('USER_GRADE');
    }
}

function getModColor(mod) {
    // Loop through modnames array and set the appropriate color
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
    // HTML header
	return '<!DOCTYPE html><link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons1.css"><html><head><base target="_top"></head><body>';
}

function getHTMLAppend() {
    // HTML footer
	return ' </body></html>';
}

function constructHTML(data, width, height, title) {
    // title is undefined if one wasn't provided as an argument
	if (title == 'undefined') {
        // Title doesn't exist. Generate a message without it.
		var output = HtmlService.createHtmlOutput(getHTMLPrepend() + data + getHTMLAppend())
		.setSandboxMode(HtmlService.SandboxMode.IFRAME)
		.setWidth(width)
		.setHeight(height);
	} else {
        // Title DOES exist. Set the title too
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

function searchAndViewStudent() {
    // This is really just a wrapper
	showPerson(askForStudent());
}

function getTime(date) {
	// Only check for current day
	return (date.getHours() * 60) + date.getMinutes();
}


function getSchedule(person) {
    // TODO: Rename one of them
	var row = 0;
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
				for (var y = 0; y < 5; y++) {
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
    			// Check actual times
				var d = new Date(times[0][i]);
				var hours = parseInt(d.getHours());
				if (hours > 12) {
                    // Convert to AM/PM from military time
					hours -= 12;
				}
                // Add new time to output
				rows += hours + ':' + addZero(d.getMinutes()) + '&' + mods[row][i] + ';';
                // Current time
				var currenttime = new Date();
				if (getTime(currenttime) >= getTime(d)) {
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
    // Add a leading zero if the number is a single digit
	if (i < 10) {
        // Implicit cast
		i = "0" + i;
	}
	return i;
}

function getMainMenuButton() {
	// Generate a HTML button
	return '<input type="submit"value="Back to Main Menu"onclick="google.script.run.runRemote(\'start\')">';
}

/*** UI Interaction ***/

function checkVersion() {
    // Display something so it won't seem like nothing happened
	SpreadsheetApp.getActive().toast('Checking for updates...');
	if (remoteversion > version) {
        // Display the update message
        var output = '<p>A new version is available (version ' + remoteversion + '.) You have version ' + version + '. <br>It is HIGHLY recommended that you copy the newest spreadsheet</p><br><a href="https://docs.google.com/a/pisd.edu/spreadsheets/d/1s0HqXOHvvjrl1Rchg-e7i_TBYpVeOCDbXw2U5SmuB78/edit?usp=sharing" target="_blank">Open</a>';
		var htmlOutput = constructHTML(output, 300, 130);
		ui.showModalDialog(htmlOutput, 'New Version');
	} else {
        // No updates
		SpreadsheetApp.getActive().toast('No updates found.');
	}
	checkProperties();
}

function showSidebar() {
	// Get the ID of a person
	var personid = parseInt(user.getProperty('USER_DATABASE_ID'));
	// Make sure the ID isn't invalid
	if (personid > 0) {
		// Get the schedule
		var schedule = getSchedule(personid);
        var output = '<p>' +schedule+ '</p><br><input type="submit"value="Cohort: ' + peoplenames[personid][4] + '"onclick="google.script.run.runRemote(\'viewCohort\',\''+peoplenames[personid][4]+'\');"><br><input type="submit"value="LOTE: ' + peoplenames[personid][2] + '"onclick="google.script.run.runRemote(\'viewLOTE\',\''+peoplenames[personid][2]+'\');"><br><input type="submit"value="Group ' + peoplenames[personid][3] + '"onclick="google.script.run.runRemote(\'showGroup\',\''+personid+'\');">';
		// Build HTML output
		var htmlOutput = constructHTML(output, 300, 500, peoplenames[personid][0] + ' ' + peoplenames[personid][1] + '\'s schedule');
		// Show the sidebar
		ui.showSidebar(htmlOutput);
	}
}

function checkProperties() {
    // Invalid user ID
	if (!user.getProperty('USER_DATABASE_ID') || user.getProperty('USER_DATABASE_ID') == null || user.getProperty('USER_DATABASE_ID') < 0) {
        // Set the invalid ID
		user.setProperty('USER_DATABASE_ID', -1);
		// While the ID is invalid (because the user doesn't exist)
		while(user.getProperty('USER_DATABASE_ID') < 0) {
            if (ui.alert('Attempt automatic user detection?', ui.ButtonSet.YES_NO) == ui.Button.YES)
            {
                SpreadsheetApp.getActive().toast('Attempting automatic user detection...');
                // Get the first and last name of our user
                var first = detectUser('first');
                var second = detectUser('last');
                if (first == 'undefined' || second == 'undefined') {
                    // detectUser returned undefined because some error was encountered
                    SpreadsheetApp.getActive().toast('Automatic user detection failed.');
                    ui.prompt("Please try again, and select NO when asked whether you want to use automatic detection or not.", ui.ButtonSet.OK);
        			// Prompt the user for their First Name and last name
                } else {
                    SpreadsheetApp.getActive().toast('User detected. First: ' + first + ' Last: ' + second);
                    // Set the user ID
                    // Even if it was an invalid ID (because teacher, maybe),
                    // This thing would just loop over because the ID would be invalid (-1)
                    user.setProperty('USER_DATABASE_ID', findPersonByName(first, second));
                }
            } else {
                var response = ui.prompt('Please enter your full first and last name. If you don\'t want a personalized calender (only want to look at other people\'s) then leave it blank.',ui.ButtonSet.OK);
                // Read the input
                var text = response.getResponseText();
                var spaceindex = text.indexOf(' ');
                // The +1 is because I don't want to include the actual space in the final string
                second = text.substring(spaceindex + 1).toLowerCase();
                first = replaceAll(text.substring(0, spaceindex).toLowerCase(),'_',' ');
				// Set the user ID
				// Even if it was an invalid ID (because teacher, maybe),
				// This thing would just loop over because the ID would be invalid (-1)
                user.setProperty('USER_DATABASE_ID', findPersonByName(first,second));
            }
		}
	}
}

function clearSettings() {
	if (ui.alert('This will delete all your settings! Continue?', ui.ButtonSet.YES_NO) == ui.Button.YES) {
		// Start all over
		user.deleteProperty('USER_DATABASE_ID');
	    user.deleteProperty('USER_GRADE');
	    // Alert that settings were completely reset
		ui.alert('Settings reset',ui.ButtonSet.OK);
	}
	// Reload the spreadsheet to get user data
	updateSpreadsheet();
}

function versionInfo() {
    // Version HTML output
    var output = '<p>Current Version: ' + version + '<br>Minimum Required Version: ' + remoteversion + '<br>Person ID: ' + user.getProperty('USER_DATABASE_ID') + '<br><br>Created by Liav Turkia and Jason Lu</p><br><input type="submit"value="Report an issue"onclick="google.script.run.runRemote(\'showBugReports\');"><input type="submit"value="Check for new updates"onclick="google.script.run.runRemote(\'checkVersion\')"><br><input class="create"type="submit"value="RESET"onclick="google.script.run.runRemote(\'clearSettings\');">';
	var htmlOutput = constructHTML(output, 200, 250);
    // Display the output
	ui.showModalDialog(htmlOutput, 'Version Info');
}

function triggersExist() {
    // Get all project triggers
    var triggers = ScriptApp.getProjectTriggers();
    for (var i = 0; i < triggers.length; i++) {
        // Very specific check to make sure we only detect our trigger
        // Just in case that another trigger exists
        if (triggers[i].getEventType() == ScriptApp.EventType.ON_OPEN && triggers[i].getHandlerFunction() == 'init') {
            return true;
            // Some code here - other options are:
            // ScriptApp.EventType.ON_EDIT
            // ScriptApp.EventType.ON_FORM_SUBMIT
            // ScriptApp.EventType.ON_OPEN
        }
    }
    return false;
}

function detectUser(target) {
    // Get email of the currently logged in user
    // This works because PISD emails are in the format of
    // firstname.lastname.x@mypisd.net
    // This will not work for non mypisd.net accounts
    // because security restrictions
    var useremail = Session.getActiveUser().getEmail();
    var emailPattern = /[A-Za-z]+\.[A-Za-z]+\.[1-9]\@mypisd.net/;
    if (!emailPattern.test(useremail)) {
        return 'undefined';
    }
    if (useremail == null || useremail == 'undefined' || useremail == '') {
        // This means that the user is A) not logged in or 2) not in PISD domain
        return 'undefined';
    }
    // Remove the trailing @mypisd.net
    useremail = useremail.substring(0, useremail.indexOf("@mypisd.net"));
    // Logger.log(useremail);
    // Grab the first name by getting everything up to the first .
    var firstname = useremail.substring(0, useremail.indexOf("."));
    // Logger.log(firstname);
    // Get the last name by getting everything between the first . and the last . (there are only 2)
    var lastname = useremail.substring(useremail.indexOf(".") + 1, useremail.lastIndexOf("."));
    // Logger.log(lastname);
    if (target == 'first') {
        // Return what's requested
        return firstname;
    } else if (target == 'last') {
        // Return what's requested
        return lastname;
    }
}



function start() {
	// Main menu
	var html = HtmlService.createHtmlOutputFromFile('entry')
	  .setSandboxMode(HtmlService.SandboxMode.IFRAME).setWidth(250).setHeight(250);
	ui.showModalDialog(html,'Main Menu');
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
    getGrade();
    // invalidGrade is set if getGrade detects that USER_GRADE isn't set
    if (invalidGrade) {
        chooseGrade();
    }
    // Set correct grade spreadsheet
    getGradeSpreadsheet(getGrade());
    // Update global variables, so the functions after this
    // such as updateModNames and updateSchedule will
    // use the updated data
    updateGlobalVariables();
	// Update everything
    checkVersion();
	updateModNames();
	updateModColors();
	updateSchedule();
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
				out += '<input type="submit"value="' + newarray[i] + '"onclick="google.script.run.runRemote(\'view' + target + '\',\''+newarray[i]+'\');"><br>';
			}
		}
	} else if (target == 'People') {
		for (var i = 0; i < peoplenames.length; i++) {
			if (peoplenames[i][0] && peoplenames[i][1]) {
				out += '<input type="submit"value="' + peoplenames[i][0] + ' ' + peoplenames[i][1] + '"onclick="google.script.run.runRemote(\'showPerson\','+i+');"><br>';
			}
		}
	}
	out += '</div><br>';
	if (target == 'People') {
		out += '<input type="submit"value="Search for a student"onclick="google.script.run.runRemote(\'searchAndViewStudent\');">';
	}
	out += getMainMenuButton();

	var htmlOutput = constructHTML(out, 300, 500);
	ui.showModalDialog(htmlOutput, target);
}

// Following three functions are wrapper functions for the
// unified listAll function for compatibility
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
	for (var i = 0; i < peoplenames.length; i++) {
		if (peoplenames[i][4].toLowerCase()==cohort.toLowerCase()) {
            // Generate a button for each person in a cohort
			out+='<input type="submit"value="' +peoplenames[i][0] + ' ' +peoplenames[i][1] + '"onclick="google.script.run.runRemote(\'showPerson\','+i+');"><br>';
		}
	}
	out += '<br>';
	out += getMainMenuButton();

	var htmlOutput = constructHTML(out, 300, 500);
	ui.showModalDialog(htmlOutput, 'Cohort: ' +cohort);
}

function viewLOTE(lote) {
	var out = '<div>';
	for (var i = 0; i < peoplenames.length; i++) {
		if (peoplenames[i][2] === lote) {
            // Generate a button for that person
			out+='<input type="submit"value="' + peoplenames[i][0] + ' ' + peoplenames[i][1] + '"onclick="google.script.run.runRemote(\'showPerson\','+i+');"><br>';
		}
	}
	out += '</div><br>';
	out += getMainMenuButton();
    // Display the output
	var htmlOutput = constructHTML(out, 300, 500);
	ui.showModalDialog(htmlOutput, 'LOTE: ' + lote);
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
            // The response was empty
			ui.alert('Please make a selection', ui.ButtonSet.OK);
			found = true;
			askForCohort();
        } else {
            // Valid response
			found = true;
			viewCohort(response.toLowerCase());
		}
		if (!found) {
			ui.alert('Cohort not found', ui.ButtonSet.OK);askForCohort();
		}
	} else if (button == ui.Button.CANCEL) {
        // Return to menu
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
			found = true;
			askForLOTE();
		} else {
			found = true;
			viewLOTE(response.toUpperCase());
		}
		if (!found) {
			ui.alert('LOTE not found',ui.ButtonSet.OK);askForLOTE();
		}
	} else if (button == ui.Button.CANCEL) {
		// Back to menu
		start();
	}
}

function getGroupMembers(group) {
	var groupnum = peoplenames[group][3];
	var out = 'Group Members:<br>';
	for (var i = 0; i < peoplenames.length; i++) {
		if (peoplenames[i][3] == groupnum) {
            // Generate a button for each person in the group
			out += '<input type="submit"onclick="google.script.run.runRemote(\'showPerson\',' + i + ');"value="' + peoplenames[i][0] + ' ' + peoplenames[i][1] + ' - ' + peoplenames[i][2] + '"><br>';
		}
	}
	return out;
}

function showGroup(row) {
    // Construct group HTML output
	var htmlOutput = constructHTML('<p>' + getSchedule(row) + '</p><br><input type="submit"value="Cohort: ' + peoplenames[row][4] + '"onclick="google.script.run.runRemote(\'viewCohort\',\'' + peoplenames[row][4] + '\');"><br>' + getGroupMembers(row) + '<br><br>', 300, 500);
	ui.showModalDialog(htmlOutput, 'Group ' +peoplenames[row][3]);
}

function showPerson(person) {
    // Create the HTML for the schedule
	var htmlOutput = constructHTML('<p>' +getSchedule(person) + '</p><br><input type="submit"value="Cohort: ' +peoplenames[person][4] + '"onclick="google.script.run.runRemote(\'viewCohort\',\''+ peoplenames[person][4]+'\');"><br><input type="submit"value="LOTE: ' + peoplenames[person][2] + '"onclick="google.script.run.runRemote(\'viewLOTE\',\'' + peoplenames[person][2] + '\');"><br><input type="submit"value="Group ' + peoplenames[person][3] + '"onclick="google.script.run.runRemote(\'showGroup\',' + person + ');"><br><br>', 300, 500);
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
