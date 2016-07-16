//file with a lot of helper functions

function addZero(i) {
    // Add a leading zero if the number is a single digit
    if (i < 10) {
        // Implicit cast
        i = "0" + i;
    }
    return i;
}

function getFriendlyKeyName(key){
  var out=key;
  if(out.substring(0,1)=='g') out = out.replace("c"," & ");
  out=out.substring(1);
  return out;
}

//function getTimes(){
//  var out;
//  for(var i : out){
//    
//  }
//}

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
        if (peoplenames[i][0].toLowerCase() === first.toLowerCase() && peoplenames[i][1].toLowerCase() === last.toLowerCase()) {
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


/**
*Because the schedule isn't always for the current day (you can view tommorow's schedule for example,) we need a method to get what day the schedule is for.
*/
function getDayOfTheMonth(){
var date = new Date();
  return ((date.getDate()-((date.getDay()-day))+1)/*find the difference for the actual date*/);
}

function getFullModName(name) {
    for (var i = 0; i < modnames.length; i++) {
        if (modnames[i][0] == name) {
          return modnames[i][1];
        }
    }
  return '<i> Unknown mod '+name+'</i>';
}

function getModColor(name,modnamesarr,modcolorsarr) {
  if(!modnames){
    modnames=modnamesarr;
  }
  if(!modcolors){
    modcolors=modcolorsarr;
  }
    for (var i = 0; i < modnames.length; i++) {
        if (modnames[i][0] == name) {
          return modcolors[i][0];
        }
    }
  return '#FFF';
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

function getSearchTypeName(num){
  if(num==SEARCH_TYPE.COHORT){
    return getGradeClassName();
  }else if(num==SEARCH_TYPE.LOTE){
    return 'LOTE';
  }else if(num==SEARCH_TYPE.GROUP){
    return 'Group';
  }
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

function getGreeting(){
  var d= new Date();
  if(d.getHours()<12){
     return 'Good morning';
  } else if(d.getHours()<17){
     return 'Good afternoon';
  }else {
     return 'Good evening';
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

function clone(src) {
  if(!src)return [];
  var out = '[';
  for(var x =0;x<src.length;x++){
    out+='[';
    for(var y = 0;y<src[x].length;y++){
      out+='\''+src[x][y]+'\',';
    }
    out+=']';
    if(x<src.length-1)out+=',';
  }
  out+=']';
  return out;
}

function getSheet(){
return sheet;
}

function getDayNoun(day){
  var current =new Date().getDay()-1;
  var offset = day-current;
  if(offset==0){
    return 'today';
  }else if(offset==1){
    return 'tomorrow';
  }else if(offset==-1){
    return 'yesterday';
  }else if(offset<=-2){
    return (offset*-1)/*absolute value, will always be negative here*/+' days ago';
  }else if(offset>=2){
    return offset+' days from now';
  }
}

function getGlobalAnnouncement(){
  const out = globalSettings.getActiveSheet().getRange(2,1).getValue();
  Logger.log("Todays global announcement: "+out);
  if(out){
  return '<div class="noanimation">'+out+'</div><br>';
  }else return '';
}

function getLocalAnnouncement(){
  const out = sheet.getRange(y-1/*the y-1 is because it is next to the name*/,2).getValue();
  if(out){
    return '<i>'+out+'</i>';
  }
  return '';
}
