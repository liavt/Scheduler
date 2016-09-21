//This file is for functions that deal primarily with HTML construction.

/**
*This function returns an HTML file's content as a string. Can be used with JQuery or scriptlets to 
other HTML files dynamically without <script src>
*/
function include(filename) {
  var out = HtmlService.createTemplateFromFile(filename);
  return out.evaluate()
      .getContent();
}

/**
Same as include(), however allows the output to be used in javascript by escpaing new lines.
*/
function includeMultiline(filename){
  return include(filename).replace(/(?:\r\n|\r|\n)/g,"\\");
}

function getURL(){
  return url;
}

function getStarButton(id){
  if(view!=5){
    return '<form action="'+url+'"class="infobuttonsform"><input type="hidden" name="first" value="'+peoplenames[id][0]+'" />   <input type="hidden" name="last" value="'+peoplenames[id][1]+'" />  '+getCurrentAttribute()+'<input type="hidden" name="view"value="5"/><input id="star"class="infobutton"type="submit"value="Special"></form>';
  }else{
        return '<form action="'+url+'"class="infobuttonsform"><input type="hidden" name="first" value="'+peoplenames[id][0]+'" />   <input type="hidden" name="last" value="'+peoplenames[id][1]+'" />  '+getCurrentAttribute()+'<input type="hidden" name="view"value="0"/><input id="unstar"class="infobutton"type="submit"value="Standard"></form>';
  }
}

function getPeopleButtonForGroup(num){
  return '<form action="'+url+'"class="infobuttonsform"> '+getCurrentAttribute()+'<input type="hidden" name="view"value="3"/><input type="hidden" name="type"value="'+SEARCH_TYPE.GROUP+'"/><input type="hidden" name="term"value="'+num+'"/><input id="personbutton"class="infobutton"type="submit"value="People"></form>';
}

function getCohortButtonForGroup(num){
  return getCohortButtonForPerson(findGroup(num));
}

function getCohortButtonForPerson(id){
  var cohort = peoplenames[id][SEARCH_TYPE.COHORT];
  if(!cohort) return '';
  return '<form action="'+url+'"class="infobuttonsform"> '+getCurrentAttribute()+'<input type="hidden" name="view"value="3"/><input type="hidden" name="type"value="'+SEARCH_TYPE.COHORT+'"/><input type="hidden" name="term"value="'+cohort+'"/><input id="cohortsbutton"class="infobutton"type="submit"value="'+getGradeClassName()+' '+cohort+'"></form>';
}

function getGroupButtonForPerson(id){
  var groupnum = peoplenames[id][SEARCH_TYPE.GROUP];
  if(!groupnum) return '';
  return '<form action="'+url+'"class="infobuttonsform"> '+getCurrentAttribute()+'<input type="hidden"name="group"value="'+groupnum+'"/><input type="hidden" name="view"value="1"/><input id="groupsbutton"class="infobutton"type="submit"value="Group '+groupnum+'"></form>';
}

function getLOTEButtonForPerson(id){
  var lote = peoplenames[id][SEARCH_TYPE.LOTE];
  if(lote){
    return '<form action="'+url+'"class="infobuttonsform"> '+getCurrentAttribute()+'<input type="hidden" name="view"value="3"/><input type="hidden" name="type"value="'+SEARCH_TYPE.LOTE+'"/><input type="hidden" name="term"value="'+lote+'"/><input id="lotebutton"class="infobutton"type="submit"value="LOTE '+lote+'"></form>';
  }else{
    return '';
  }
}

function getSettingsHook(){
  //creates a hook for a script located in Settings.html to use. The script uses DOM, which is why it needs to be defined in HTML and use a hook.
  //The script adds additional parameters for settings.
  return '<form action="javascript:void(0)"class="infobuttonsform"id="settingshook"> '+getCurrentAttribute()+'<input type="hidden" name="view"value="'+url+'"/><input id="settingsbutton"class="infobutton"type="submit"value="Settings"></form>';
}

function getEmbeddedScheduleButtons(){
  var out='';
  out+=getSettingsHook();
  return out;
}

function getInfoButtons(id){
  return '<div id="infobuttons"class="noanimation">'+getStarButton(id)+getGroupButtonForPerson(id)+getCohortButtonForPerson(id)+getLOTEButtonForPerson(id)+getEmbeddedScheduleButtons()+'</div>';
}

function getInfoButtonsForGroup(groupnum){
  return '<div id="infobuttons"class="noanimation">'+getCohortButtonForGroup(groupnum)+getPeopleButtonForGroup(groupnum)+getEmbeddedScheduleButtons()+'</div>';
}

function getQuoteOfTheDay() {  
  return '';
}

function pullBackground() {
  var response = UrlFetchApp.fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US"); var json = JSON.parse(response.getContentText());
  var url = 'https://www.bing.com'+json.images[0].url;
  return '<style>div{filter: url("'+url+'");}body{background-image: url("'+url+'");}</style><div id="imgdesc">'+json.images[0].copyright+' - Bing</div>';
}

function getHTMLButtonForType(searchtype, name){
  if(searchtype!=SEARCH_TYPE.GROUP){
  return '<form action="'+url+'"><input type="hidden" name="view" value="3" />  '+getCurrentAttribute()+' <input type="hidden" name="type" value="'+sanitize(searchtype)+'" /> <input type="hidden" name="term" value="'+sanitize(name)+'" /> <input type="submit" value="'+sanitize(name)+'"></form>';
  }else{
    return getHTMLButtonForGroup(name);
  }
  }

function getUpdateScript(id){
  return '';
  //return '<script>var i = 0;setInterval(function(){ var html = google.script.run.getUpdatedSchedule("'+grade+'",'+id+'); i++;document.getElementById("personalized-schedule").innerHTML=google.script.run.blah();},1000);</script>';
}

function getHTMLButtonForPerson(id){
  return '<form action="'+url+'"><input type="hidden" name="view" value="0" />   <input type="hidden" name="first" value="'+peoplenames[id][0]+'" />   <input type="hidden" name="last" value="'+peoplenames[id][1]+'" />  '+getCurrentAttribute()+'  <input type="submit" value="'+peoplenames[id][0]+' '+peoplenames[id][1]+'"></form>';
}

function getHTMLButtonForGroup(num){
  return '<form action="'+url+'"><input type="hidden" name="view" value="1" />   '+getCurrentAttribute()+' <input type="hidden"name="group" value="'+num+'"> <input type="submit" value="'+num+'"></form>';
}

//overloading
function getErrorPage(code){
  return getErrorPage(code,'');
}

//if we ever want to make it look cooler
function getErrorPage(code,message){
  var string = '<div id="name">';
  if(code==404){
    string += '<h1>404 page not found :(</h1>';
  }else if(code==422){
    string +=  '<h1>422 invalid syntax. :(</h1>';
  }else{
    string +=code+' an error occured. :(';
  }
  return HtmlService.createTemplate(string + '</div><br><div><h3>'+sanitize(message)+'<br></h3><br><h2>Hopefully this doesn\'t happen again!</h2></div>').evaluate().setTitle("Error");
}

function extractRed(color){
  return parseInt(color.substring(0,color.length/3),16);//extract the red from the hexadecimal. doesnt care if its #FFF or #FFFFFF
}

function extractGreen(color){
  var third =color.length/3;
  return parseInt(color.substring(third,third*2),16);
}

function extractBlue(color){
  var third =color.length/3;
  return parseInt(color.substring(third*2,third*3),16);
}

function getDisabledColor(color){
  return '#555';
}

function getHTMLPrepend() {
    // HTML header
    //important to include the Reset stylesheet, to make sure that different browsers (cough cough IE) all look that same
    return '<!DOCTYPE html><html lang="en-US"><?!=include("Head.html");?><body><?!= include("Settings.html");?><?!= include("MenuBar.html"); ?><span id="page">';//the <span> is for manipulation of all the content
}

function getHTMLAppend() {
    // HTML footer
  return '<br></span></body><?!=include("OnLoad.html")?></html>';//the extra line break (<br>) is so the elements don't go off the screen and show the bottom of them.
}

function getDynamicScheduleHook(){
  return '<div class="noanimation"id="schedule"></div>';
}

function getPersonalizedScheduleHook(){
  return '<p id="personalized-schedule"></p>'
}

function getCurrentAttribute(){
  var day = getParameterByName('day',query);
  var out = '<input type="hidden"name="grade"value="'+sanitize(grade)+'">';
  if(day&&day!=new Date().getDay()-1){
      out+='<input type="hidden" name="day" value="'+sanitize(day)+'" />';
  }
  return out;
}

function constructHTML(data, width, height, title) {
//  var outhtml = replaceAll(replaceAll((,'%%url%%',url)),'%%grade%%',grade);
  var outhtml = getHTMLPrepend() + data + getHTMLAppend();
   
      // title is undefined if one wasn't provided as an argument
    if (title == 'undefined') {
        // Title doesn't exist. Generate a message without it.
        var output = HtmlService.createTemplate(outhtml);
      output = output.evaluate();
    } else {
        // Title DOES exist. Set the title too
        var output = HtmlService.createTemplate(outhtml);
      output = output.evaluate().setTitle(title);
    }
    return output.setWidth(width).setHeight(height).setFaviconUrl('https://raw.githubusercontent.com/liavt/Scheduler/master/res/favicon.ico').setContent(minify(output.getContent()));;
}