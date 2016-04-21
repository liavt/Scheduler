//This file is for functions that deal with primarily HTML

/**
*This function returns an HTML file's content as a string. Can be used with JQuery or scriptlets to include other HTML files dynamically without <script src>
*/
function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate()
      .getContent();
}

function getURL(){
  return url;
}

function getStarButton(id){
  if(view!=5){
    return '<form action="'+url+'"class="infobuttonsform"><input type="hidden" name="first" value="'+peoplenames[id][0]+'" />   <input type="hidden" name="last" value="'+peoplenames[id][1]+'" />  <input type="hidden" name="grade" value="'+grade+'" /><input type="hidden" name="view"value="5"/><input id="star"class="infobutton"type="submit"value="Special"></form>';
  }else{
        return '<form action="'+url+'"class="infobuttonsform"><input type="hidden" name="first" value="'+peoplenames[id][0]+'" />   <input type="hidden" name="last" value="'+peoplenames[id][1]+'" />  <input type="hidden" name="grade" value="'+grade+'" /><input type="hidden" name="view"value="0"/><input id="unstar"class="infobutton"type="submit"value="Standard"></form>';
  }
}

function getPeopleButtonForGroup(num){
  return '<form action="'+url+'"class="infobuttonsform"> <input type="hidden" name="grade" value="'+grade+'" /><input type="hidden" name="view"value="3"/><input type="hidden" name="type"value="'+SEARCH_TYPE.GROUP+'"/><input type="hidden" name="term"value="'+num+'"/><input id="personbutton"class="infobutton"type="submit"value="People"></form>';
}

function getCohortButtonForGroup(num){
  return getCohortButtonForPerson(findGroup(num));
}

function getCohortButtonForPerson(id){
  var cohort = peoplenames[id][SEARCH_TYPE.COHORT];
  return '<form action="'+url+'"class="infobuttonsform"> <input type="hidden" name="grade" value="'+grade+'" /><input type="hidden" name="view"value="3"/><input type="hidden" name="type"value="'+SEARCH_TYPE.COHORT+'"/><input type="hidden" name="term"value="'+cohort+'"/><input id="cohortsbutton"class="infobutton"type="submit"value="'+cohort+'"></form>';
}

function getGroupButtonForPerson(id){
  var groupnum = peoplenames[id][SEARCH_TYPE.GROUP];
  if(!groupnum) return '';
        return '<form action="'+url+'"class="infobuttonsform"> <input type="hidden" name="grade" value="'+grade+'" /><input type="hidden"name="group"value="'+groupnum+'"/><input type="hidden" name="view"value="1"/><input id="groupsbutton"class="infobutton"type="submit"value="Group '+groupnum+'"></form>';
}

function getLOTEButtonForPerson(id){
    var lote = peoplenames[id][SEARCH_TYPE.LOTE];
  return '<form action="'+url+'"class="infobuttonsform"> <input type="hidden" name="grade" value="'+grade+'" /><input type="hidden" name="view"value="3"/><input type="hidden" name="type"value="'+SEARCH_TYPE.LOTE+'"/><input type="hidden" name="term"value="'+lote+'"/><input id="lotebutton"class="infobutton"type="submit"value="LOTE: '+lote+'"></form>';
}

function getInfoButtons(id){
  return '<div id="infobuttons"class="noanimation">'+getStarButton(id)+getGroupButtonForPerson(id)+getCohortButtonForPerson(id)+getLOTEButtonForPerson(id)+'</div>';
}

function getInfoButtonsForGroup(groupnum){
  return '<div id="infobuttons"class="noanimation">'+getCohortButtonForGroup(groupnum)+getPeopleButtonForGroup(groupnum)+'</div>';
}

function getQuoteOfTheDay() {  
  return '';
}

function pullBackground() {
  var response = UrlFetchApp.fetch("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US"); var json = JSON.parse(response.getContentText());
  var url = 'https://www.bing.com'+json.images[0].url;
  return '<style>body{background-image: url("'+url+'");}</style><div class="imgdesc">'+json.images[0].copyright+' - Bing</div>';
}

function getHTMLButtonForType(searchtype, name){
  if(searchtype!=SEARCH_TYPE.GROUP){
  return '<form action="'+url+'"><input type="hidden" name="view" value="3" />  <input type="hidden" name="grade" value="'+grade+'" /> <input type="hidden" name="type" value="'+searchtype+'" /> <input type="hidden" name="term" value="'+name+'" /> <input type="submit" value="'+name+'"></form>';
  }else{
    return getHTMLButtonForGroup(name);
  }
  }

function getUpdateScript(id){
  return '';
  //return '<script>var i = 0;setInterval(function(){ var html = google.script.run.getUpdatedSchedule("'+grade+'",'+id+'); i++;document.getElementById("personalized-schedule").innerHTML=google.script.run.blah();},1000);</script>';
}

function getHTMLButtonForPerson(id){
  return '<form action="'+url+'"><input type="hidden" name="view" value="0" />   <input type="hidden" name="first" value="'+peoplenames[id][0]+'" />   <input type="hidden" name="last" value="'+peoplenames[id][1]+'" />  <input type="hidden" name="grade" value="'+grade+'" />  <input type="submit" value="'+peoplenames[id][0]+' '+peoplenames[id][1]+'"></form>';
}

function getHTMLButtonForGroup(num){
  return '<form action="'+url+'"><input type="hidden" name="view" value="1" />   <input type="hidden" name="grade" value="'+grade+'" /> <input type="hidden"name="group" value="'+num+'"> <input type="submit" value="'+num+'"></form>';
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
  return string + '</div><br><div><h3>'+message+'<br></h3><br><h2>We have some specialized monkeys on their way to help you out</h2></div>';
}

    // Embed the schedule spreadsheet into the page
function embedSchedule(){
  var out = '<div class="noanimation"id="schedule"><table><tr>';
  for(var i =0;i<times[0].length;i++){
    if(times[0][i]){
      if(times[0][i]=='KEY'){
        out+='<td bgcolor="#888"width=6% style="background-color:rgba(0,0,0,0) !important;"></th>';
      }else{
        var time = new Date(times[0][i]);
        var hours = parseInt(time.getHours());
         if (hours > 12) {
           // Convert to AM/PM from military time
           hours -= 12;
        }
        out+='<td bgcolor="#AAA"width=6%>'+hours+':'+addZero(time.getMinutes())+'</th>';
      }
    }
  }
  out+='</tr>';
  for(var y = 0;y<mods.length;y++){
    out+='<tr>';
    for(var x=0;x<mods[y].length;x++){
      if(mods[y][x]){
        var modname = mods[y][x];
        var color;
        if(!times[0][x]||times[0][x]=='KEY'){
          modname = getFriendlyKeyName(modname);
          color = "#AAA";
        }else{
          modname = getFullModName(modname);
          color = getModColor(mods[y][x]);
          if(!modname){
            modname = '<i>'+modname+' is not a valid mod</i>';
          }
        }
        out+='<td bgcolor="'+color+'">'+modname+'</td>';
      }
    }
    out+='</tr>';
  }
	out+='</tr></table></div>';
  return out;
}

function getHTMLPrepend() {
    // HTML header
    //important to include the Reset stylesheet, to make sure that different browsers (cough cough IE) all look that same
    return '<!DOCTYPE html><?!= include("Reset"); ?><?!= include("Stylesheet"); ?><html><head><base target="_top"></head><body><?!= include("MenuBar"); ?>';
}

function getHTMLAppend() {
    // HTML footer
  return '<br></body></html>';//the extra line break (<br>) is so the elements don't go off the screen and show the bottom of them.
}

function getCurrentAttribute(){
  var out = '<input type="hidden" name="grade" value="'+grade+'" />';
  if(style){
    out+='<input type="hidden" name="style" value="'+style+'" />';
  }
  return out;
}

function constructHTML(data, width, height, title) {
//  var outhtml = replaceAll(replaceAll((,'%%url%%',url)),'%%grade%%',grade);
  var outhtml = getHTMLPrepend() + data + getHTMLAppend();
   
      // title is undefined if one wasn't provided as an argument
    if (title == 'undefined') {
        // Title doesn't exist. Generate a message without it.
        var output = HtmlService.createTemplate(outhtml).evaluate();
    } else {
        // Title DOES exist. Set the title too
        var output = HtmlService.createTemplate(outhtml).evaluate().setTitle(title);
    }
    return output.setWidth(width).setHeight(height).setFaviconUrl('https://raw.githubusercontent.com/liavt/Scheduler/master/res/favicon.ico');
}
