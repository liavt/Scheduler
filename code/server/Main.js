//tinyurl.com/ahsscheduler
//https://github.com/liavt/Scheduler
//holidays to work on:
/*
Shakespeare's Birthday (4/22)
Christmas/Hannukah
Halloween
New Years
Thanksgiving
Last day of school
First day of school
*/
/*** Variables ***/
// Control Panel. Loaded based on grade
var sheet;
// Variable initialization
var settings;
var peoplenames;
var mods;
var times;
var modcolors;
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
var day;
var y;
var style;
var query;

var globalSettings;

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
    SCHEDULE: 6,
    /**
     *When view=7, views everything that you can search
     */
    VIEW_SEARCH_TYPES: 7,
    /**
     *When view=8, brings up a homepage
     */
    HOMEPAGE: 8,
    /**
     *When view=9, shows the about page
     */
    ABOUT: 9,
    /**
     *When view=10, shows the info for a mod
     */
    MOD: 10,
    /**
     *When view=11, shows the special mod selection schedule.
     */
    MOD_SELECTOR: 11,
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

/**
 *Dimensions for certain stuff in the spreadsheet
 *@enum {number}
 */
var DIMENSIONS = {
    SCHEDULE_WIDTH: 16,
    SCHEDULE_HEIGHT: 16,
    MOD_WIDTH: 4,
    MOD_HEIGHT: 16,
    SCHEDULE_XOFFSET: 5,
    TITLE_OFFSET: 2,
}

//function createVariables(currentgrade){
//  createVariables(currentgrade,new Date().getDay());
//}

function createVariables(currentgrade, dayofweek) {
    if (!dayofweek) {
        dayofweek = new Date().getDay();
    }
    day = dayofweek - 1;
    Logger.log("Creating variables...");
    Logger.log("Current day of the week is " + dayofweek + ", which has been converted to " + day);
    Logger.log("Schedule dimensions: " + DIMENSIONS.SCHEDULE_WIDTH + "x" + DIMENSIONS.SCHEDULE_HEIGHT + ", located at column " + DIMENSIONS.SCHEDULE_XOFFSET);
    Logger.log("Mod names dimensions: " + DIMENSIONS.MOD_WIDTH + "x" + DIMENSIONS.MOD_HEIGHT);
    var spreadsheet = SpreadsheetApp.openByUrl(getGradeSpreadsheet(currentgrade));
    sheet = spreadsheet.getSheetByName("Schedule");
    // Variable initialization
    settings = spreadsheet.getSheetByName("Settings").getRange(1, 1, 37, 5).getValues();
    peoplenames = SpreadsheetApp.openByUrl(settings[1][0]).getActiveSheet().getRange(2, 1, 135, 10).getValues().sort();
    y = Math.ceil(((DIMENSIONS.SCHEDULE_HEIGHT + 1) * day) + (DIMENSIONS.TITLE_OFFSET)) //get where the schedule is on the spreadsheet
    Logger.log("Y value for day " + day + " is " + y);
    mods = sheet.getRange(y + 1, DIMENSIONS.SCHEDULE_XOFFSET, parseInt(DIMENSIONS.SCHEDULE_HEIGHT) - 1, parseInt(DIMENSIONS.SCHEDULE_WIDTH)).getValues();
    times = sheet.getRange(y, DIMENSIONS.SCHEDULE_XOFFSET, 1, DIMENSIONS.SCHEDULE_WIDTH).getValues();
    // When updating modnames don't forget to change the getModColor() function
    modnames = sheet.getRange(y, 1, DIMENSIONS.MOD_HEIGHT, DIMENSIONS.MOD_WIDTH).getValues();
    modcolors = sheet.getRange(y, 1, DIMENSIONS.MOD_HEIGHT, DIMENSIONS.MOD_WIDTH).getBackgrounds();
    // Get remote version
    remoteversion = sheet.getRange(19, 10).getValue();
    grade = currentgrade;
    url = ScriptApp.getService().getUrl();
    Logger.log("Current URL is " + url);
    Logger.log("Current grade is " + grade);
    if (grade == '9' || grade == '8') {
        SEARCH_TYPE.LOTE = 2;
        SEARCH_TYPE.COHORT = 3;
        SEARCH_TYPE.GROUP = 4;
    }
    globalSettings = SpreadsheetApp.openByUrl("https://docs.google.com/a/pisd.edu/spreadsheets/d/1XKQyOwfKj0sW1wQiQTZL5hBZXgYo4Oz8Eyo2n03XCX0/edit?usp=sharing");
    Logger.log("Variables have been created");
}

function viewLearnerSchedule(querystring) {
    // Get the first name
    var firstName = getParameterByName('first', querystring);
    // Get the last name
    var lastName = getParameterByName('last', querystring);
    // Resolve the name into an ID that we can use
    var id = findPersonByName(firstName, lastName);
    if (id != -1) {
        // Return the normal data
        //pullBackground();
        return '<div id="name"><p>' + capitalizeFirstLetter(firstName) + ' ' + capitalizeFirstLetter(lastName) + '</p></div><br><div class="noanimation"><img src="https://raw.githubusercontent.com/liavt/Scheduler/master/res/star-gold.png"width="20em"height="100%">Is this you? If so, for a more personalized experience, click the star at the bottom of the page</div><br>' + getGlobalAnnouncement() + '<div><p>' + getSchedule(id) + '</p></div><br>' + embedSchedule() + '<br>' + getInfoButtons(id);
    } else {
        // Invalid user
        // Return an error message
        return '<div id="name">' + capitalizeFirstLetter(firstName) + ' ' + capitalizeFirstLetter(lastName) + ' was not found. </div><br><div>Please enter a valid name.<br>If this continues to happen, try clicking on the \'Learners\' tab above.</div>';
    }
}

function viewPersonalizedSchedule(querystring) {
    // Get the first name
    var firstName = getParameterByName('first', querystring);
    // Get the last name
    var lastName = getParameterByName('last', querystring);
    // Resolve the name into an ID that we can use
    var id = findPersonByName(firstName, lastName);
    if (id != -1) {
        // Return the normal data
        return pullBackground() + '<div id="name"class="personalized"><p>' + getGreeting() + ', ' + capitalizeFirstLetter(firstName) + '</p></div><br>' + getGlobalAnnouncement() + '<div class="personalized"><p><h1>Here\'s your schedule for ' + getDayNoun(day) + ':</h1><p id="personalized-schedule">' + getSchedule(id) + '</p></p></div>' + getUpdateScript(id) + getQuoteOfTheDay() + '<br>' + embedSchedule() + '<br>' + getInfoButtons(id);
    } else {
        // Invalid user
        // Return an error message
        return '<div id="name">' + capitalizeFirstLetter(firstName) + ' ' + capitalizeFirstLetter(lastName) + ' was not found.</div>';
    }
}

function listAllPeople() {
    var html = '<div id="name"><p>' + grade + 'th grade</p></div><br><div class="noanimation">';
    for (var i = 0; i < peoplenames.length; i++) {
        if (peoplenames[i][0] && peoplenames[i][1]) {
            html += getHTMLButtonForPerson(i) + '<br>';
        }
    }
    html += '</div>';
    return html;
}

function viewGroupSchedule(querystring) {
    var group = getParameterByName('group', querystring);
    // Resolve the name into an ID that we can use
    var id = findGroup(group);
    if (id != -1) {
        // Return the normal data
        return '<div id="name"><p>Group ' + group + '</p></div><br><div class="noanimation"><i>Note: This schedule is an estimate and may not be accurate for all people in the group. For a more accurate one, view an individual learner\'s schedule.</i></div><br><div>' + getSchedule(id) + '</div><br>' + embedSchedule() + '<br>' + getInfoButtonsForGroup(group);
    } else {
        // Invalid user
        // Return an error message
        return 'Group ' + group + ' was not found. Please enter a valid number.';
    }
}

function viewModSchedule(query) {
    var mod = getParameterByName('mod', query);
    if (!mod) {
        return getErrorPage(404, '\'mod\' parameter not found in URL');
    }
    return '<div id="name">' + mod + '</div><br><div>' + getScheduleForMod(mod) + '</div><br>' + embedSchedule(EMBED_TYPE.MOD, mod) + '<br><div id="infobuttons"class="noanimation">' + getEmbeddedScheduleButtons() + '</div>';
}

function getDay() {
    return day;
}

function viewAboutPage() {
    return '<?!= include("About.html"); ?>';
}

function viewModSelection() {
    return '<div id="name">Click on a mod cell to view info about it.</div><br>' + embedSchedule() + '<br><div id="infobuttons"class="noanimation">' + getEmbeddedScheduleButtons() + '</div>';
}

function processQuery(querystring) {
    // Needed so the querystring parse won't choke
    // It needs it in the format ?field1=data&field2=data&field3=data etc.
    querystring = '?' + querystring;
    var type = getParameterByName('view', querystring);
    view = type;
    if (type == VIEW_TYPE.LEARNER_SCHEDULE.toString()) {
        return viewLearnerSchedule(querystring);
    } else if (type == VIEW_TYPE.GROUP_SCHEDULE.toString()) {
        return viewGroupSchedule(querystring);
    } else if (type == VIEW_TYPE.LIST_ALL.toString()) {
        return searchAll(querystring);
    } else if (type == VIEW_TYPE.LIST_ALL_IN.toString()) {
        return searchAllIn(querystring);
    } else if (type == VIEW_TYPE.LIST_PEOPLE.toString()) {
        return listAllPeople();
    } else if (type == VIEW_TYPE.PERSONALIZED_SCHEDULE.toString()) {
        return viewPersonalizedSchedule(querystring);
    } else if (type == VIEW_TYPE.SCHEDULE.toString()) {
        return viewFullSchedule();
    } else if (type == VIEW_TYPE.VIEW_SEARCH_TYPES.toString()) {
        return viewSearchTypes(querystring);
    } else if (type == VIEW_TYPE.HOMEPAGE.toString()) {
        return viewHomepage();
    } else if (type == VIEW_TYPE.ABOUT.toString()) {
        return viewAboutPage();
    } else if (type == VIEW_TYPE.MOD.toString()) {
        return viewModSchedule(querystring);
    } else if (type == VIEW_TYPE.MOD_SELECTOR.toString()) {
        return viewModSelection(querystring);
    } else {
        return getErrorPage(404, type + ' is not a view');
    }
}

function viewSearchTypes(string) {
    return '<?!= include("ViewSearchTypes.html"); ?>';
}

function doGet(e) {
    // Function that runs when the page opens
    var html = '';
    query = '?' + e.queryString;
    var tempGrade = getParameterByName('grade', query);
    var tempDay = getParameterByName('day', query);

    if (!tempGrade) {
        html = getErrorPage(422, 'Parameter \'grade\' not found. This happens when the URL is wrong.');
    } else {
        var currentday = new Date().getDay();
        if ((currentday <= 0 || currentday > 5) || (tempDay && (tempDay <= 0 || tempDay > 5))) {
            html = getErrorPage(416, 'Silly you. There isn\'t school today!');
        } else {
            createVariables(tempGrade, tempDay);
            html = processQuery(e.queryString);
            style = getParameterByName('style', e.queryString);
            if (style) {
                html += '<?!= include("' + style + '.html"); ?>';
            }
        }
    }
    var htmlOutput = constructHTML(html, 1000, 1000, 'Schedule');
    // return HtmlService.createHtmlOutput('You must be signed in as a mypisd.net account to access the schedule.');
    return htmlOutput;
    //return UrlFetchApp.fetch('https://raw.githubusercontent.com/liavt/Scheduler/master/code/server/Main.js').getContentText();
}

function searchAllIn(string) {
    var searchtype = getParameterByName('type', string);
    var searchterm = getParameterByName('term', string);
    if (searchtype && searchterm) {
        searchtype = Number(searchtype);
        var out = '<div id="name">' + getSearchTypeName(searchtype) + ':' + capitalizeFirstLetter(searchterm) + '</div><br><div class="noanimation">';
        for (var i = 0; i < peoplenames.length; i++) {
            if (peoplenames[i] && peoplenames[i][searchtype].toString().toUpperCase() == searchterm.toString().toUpperCase()) {
                out += getHTMLButtonForPerson(i) + '<br>';
            }
        }
        out = out.concat('</div>');
        return out;
    } else {
        return getErrorPage(422, '\'type\' or \'term\' not found. This usually happens when the URL is wrong.');
    }
}

function viewHomepage() {
    return '<?!= include("Homepage.html") ?>';
}

function searchAll(string) {
    var searchtype = getParameterByName('type', string);
    if (searchtype) {
        searchtype = Number(searchtype);
        var out = '<div id="name">' + getSearchTypeName(searchtype) + ' Lookup</div><br><div class="noanimation">';
        var arr = filterOutDuplicates(peoplenames, searchtype);
        if (!arr || arr.length <= 1) {
            return 'There are no ' + getSearchTypeName(searchtype).toUpperCase() + 's this project';
        }
        for (var i = 0; i < arr.length; i++) {
            if (arr[i]) {
                out += getHTMLButtonForType(searchtype, arr[i]) + '<br>';
            }
        }
        out = out.concat('</div>');
        return out;
    } else {
        return getErrorPage(422, '\'type\' not found. This usually happens when the URL is wrong.');
    }
}

function parseLearnerSchedule(sched, person) {
    var newsched = sched.split('<br>');
    var out = ''
    if (newsched) {
        for (var i = 0; i < newsched.length; i++) {
            if (newsched[i]) {
                var split = newsched[i].split('-');
                var hdindex = split[1].indexOf('%HD');
                if (hdindex >= 0) {
                    if (isInHelpDesk(person)) {
                        split[1] = '  <i>' + settings[11][0] + '</i>';
                    } else {
                        split[1] = split[1].substring(0, hdindex);
                    }
                }
                out += split[0] + '-' + split[1] + '<br>';
            }
        }
    }
    return out;
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
    for (var i = 0; i < DIMENSIONS.SCHEDULE_WIDTH; i++) {
        if (times[0][i]) {
            // Iff it is a criteria key
            if (times[0][i] == 'KEY') {
                // Check all the mod names
                for (var y = 0; y < DIMENSIONS.SCHEDULE_HEIGHT - 1; y++) {
                    if (mods[y][i] != 'NULL' || mods[y][i]) {
                        //check key type
                        if (mods[y][i].substring(0, 1) == 'c') {
                            if (mods[y][i].substring(1) == peoplenames[(person)][SEARCH_TYPE.COHORT]) {
                                row = y;
                                break;
                            }
                        } else if (mods[y][i].substring(0, 1) == 'g') {
                            var range = mods[y][i].substring(1).split('-');
                            var cindex = range[1].indexOf('c');
                            if (cindex <= 0) {
                                cindex = range[1].length;
                            }
                            if (peoplenames[person][SEARCH_TYPE.GROUP] >= range[0] && peoplenames[person][SEARCH_TYPE.GROUP] <= range[1].substring(0, cindex)) {
                                if (cindex > 0 && cindex != range[1].length) {
                                    if (peoplenames[person][SEARCH_TYPE.COHORT] == range[1].substring(cindex + 1)) {
                                        row = y;
                                        break;
                                    } else {
                                        continue;
                                    }
                                } else {
                                    row = y;
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                if (row >= 0) {
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
                    if (getTime(currenttime) >= getTime(d) && row >= 0) {
                        // Get display name of current class
                        var modname = getFullModName(mods[row][i]);
                        if (!modname) modname = 'Unknown mod';
                        current = '<b>Currently at - ' + modname + '</b>';
                        if (typeof getFullModName(mods[row][i + 1]) == 'undefined') {
                            // Since the next mod is undefined, we can safely assume that school is over
                            next = '<b>Next - End of school </b>';
                        } else {
                            // Get the next class
                            next = '<b>Next - ' + getFullModName(mods[row][i + 1]) + '</b>';
                        }
                    }
                    var modname = mods[row][i];
                    if (!modname) modname = '<i>Unknown mod</i>';
                    rows += '&' + mods[row][i] + ';';
                }
            }
        }
    }
    if (row < 0) {
        return 'Oops! Your personalized schedule wasn\'t found!';
    }
    rows = rows.split(';');
    for (var i = 0; i < rows.length; i++) {
        if (rows[i]) {
            var currentrow = rows[i].split('&');
            out += currentrow[0] + ' - ' + getFullModName(currentrow[1]) + '<br>';
        }
    }

    out += '<br>' + current;
    out += '<br>' + next;
    return out;
}

function getScheduleForMod(name) {
    // HTML output variable
    var out = '';
    var key = -1;
    // Current represents where the person is currently
    var current = '<b>Currently before school</b>';;
    // I have no idea what's going on here - Jason
    // Check every time
    for (var x = 0; x < DIMENSIONS.SCHEDULE_WIDTH; x++) {
        if (times[0][x]) {
            if (times[0][x] == 'KEY') {
                key = x;
            } else {
                for (var y = 0; y < DIMENSIONS.SCHEDULE_HEIGHT - 1; y++) {
                    var modname = getFullModName(mods[y][x]);
                    if (modname.toUpperCase() == name.toUpperCase()) {
                        var d = new Date(times[0][x]);
                        var hours = parseInt(d.getHours());
                        if (hours > 12) {
                            // Convert to AM/PM from military time
                            hours -= 12;
                        }
                        var currenttime = new Date();
                        var currentlyThere = getTime(currenttime) >= getTime(d) && y >= 0;
                        if (currentlyThere) {
                            // Get display name of current class
                            var modname = getFriendlyKeyName(mods[y][key]);
                            if (!modname) modname = 'Unknown mod';
                            current = '<b>Currently with ' + modname + '</b>';
                        }
                        // Add new time to output
                        out += hours + ':' + addZero(d.getMinutes());
                        if (x <= DIMENSIONS.SCHEDULE_WIDTH - 1) {
                            var d = new Date(times[0][x + 1]);
                            var hours = parseInt(d.getHours());
                            if (hours > 12) {
                                // Convert to AM/PM from military time
                                hours -= 12;
                            }
                            // Add new time to output
                            out += ' - ' + hours + ':' + addZero(d.getMinutes());;
                        }
                        out += ' --- ' + getFriendlyKeyName(mods[y][key]) + '<br>';
                    }
                }
            }
        }
    }

    out += '<br>' + current;
    return out;
}


function viewFullSchedule() {
    var date = new Date();
    return '<div id="name">Schedule for ' + (date.getMonth() + 1) + '/' + getDayOfTheMonth() + '</div><br>' + getGlobalAnnouncement() + embedSchedule() + '<br><div id="infobuttons"class="noanimation">' + getEmbeddedScheduleButtons() + '</div>';
}

//removing this function distrupts the balance
function blah() {
    return "hey";
}
