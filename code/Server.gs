/*
 * Hey
 * Congrats on finding the source
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
var user = PropertiesService.getUserProperties();
// Get active spreadsheet
var currentsheet = SpreadsheetApp.getActiveSheet();
// Control Panel. Loaded based on grade
var sheet = SpreadsheetApp.openByUrl(getGradeSpreadsheet('9')).getSheets()[0];
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
var version = 1.6;
// Variable for tracking whether grade is set or not
var invalidGrade = false;

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

function capitalizeFirstLetter(target) {
    // Return a string with the first letter capitalized.
    return target.substring(0,1).toUpperCase()+target.substring(1);
}

function processQuery(querystring) {
    // Needed so the querystring parse won't choke
    // It needs it in the format ?field1=data&field2=data&field3=data etc.
    querystring = '?' + querystring;
    // Get the first name
    var firstName = getParameterByName('first', querystring);
    // Get the last name
    var lastName = getParameterByName('last', querystring);
    // Resolve the name into an ID that we can use
    var id = findPersonByName(firstName, lastName);
    if (id != -1) {
        // Return the normal data
        return '<h1>' + capitalizeFirstLetter(firstName) + ' ' + capitalizeFirstLetter(lastName) + '</h1>' + getSchedule(id);
    } else {
        // Invalid user
        // Return an error message
        return capitalizeFirstLetter(firstName) + ' ' + capitalizeFirstLetter(lastName) + ' was not found. Please enter a valid name.';
    }
}

function doGet(e) {
    // Function that runs when the page opens
    var html = processQuery(e.queryString);
    var htmlOutput = constructHTML('<div style="margin: 20px 20px 20px 20px">' + html + '<br>' + embedSchedule() + '</div>', 1000, 1000, 'Schedule');
    return htmlOutput;
}

function embedSchedule(){
    // Embed the schedule spreadsheet into the page
	return '<iframe src="https://docs.google.com/spreadsheets/d/1s0HqXOHvvjrl1Rchg-e7i_TBYpVeOCDbXw2U5SmuB78/pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false" width=1000 height=500></iframe>'
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
