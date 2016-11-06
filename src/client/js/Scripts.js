

//defining the possible options
var days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];//this is index 

//size of the background image in the infobutton in px
var INFOBUTTON_IMAGE_SIZE = 70;

function getTime(date) {
    // Only check for current day
    return (date.getHours() * 60) + date.getMinutes();
}

function fetchData(){

}

/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-touchevents-mq-setclasses !*/
!function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,a,i,r;for(var l in c)if(c.hasOwnProperty(l)){if(e=[],n=c[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),f.push((s?"":"no-")+r.join("-"))}}function a(e){var n=d.className,t=Modernizr._config.classPrefix||"";if(p&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),p?d.className.baseVal=n:d.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):p?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(p?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,c,u="modernizr",p=i("div"),m=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:u+(o+1),p.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+u,(m.fake?m:p).appendChild(a),m.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=u,m.fake&&(m.style.background="",m.style.overflow="hidden",c=d.style.overflow,d.style.overflow="hidden",d.appendChild(m)),l=t(p,e),m.fake?(m.parentNode.removeChild(m),d.style.overflow=c,d.offsetHeight):p.parentNode.removeChild(p),!!l}var f=[],c=[],u={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=u,Modernizr=new Modernizr;var d=n.documentElement,p="svg"===d.nodeName.toLowerCase(),m=u._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];u._prefixes=m;var h=u.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",m.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");h(o,function(e){t=9===e.offsetTop})}return t});var v=function(){var n=e.matchMedia||e.msMatchMedia;return n?function(e){var t=n(e);return t&&t.matches||!1}:function(n){var t=!1;return l("@media "+n+" { #modernizr { position: absolute; } }",function(n){t="absolute"==(e.getComputedStyle?e.getComputedStyle(n,null):n.currentStyle).position}),t}}();u.mq=v,s(),a(f),delete u.addTest,delete u.addAsyncTest;for(var g=0;g<Modernizr._q.length;g++)Modernizr._q[g]();e.Modernizr=Modernizr}(window,document);

function setTouchScreen(touch){
  calculateInfoButtonWidth(touch);
  if(touch){
    applyTheme('mobile');
  }else{
  }
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function calculateInfoButtonWidth(touch){
  var infobuttons=$('.infobutton');

  var enlarge = function(index){
    var element = $(this);
    var text = element.val();
    var font = element.css("font");
    
    //70 is the size of the icon
    element.css("width",(INFOBUTTON_IMAGE_SIZE+getTextWidth(text,font)+"px"));
  };
  
  var defaultSize = function(index){
      var element = $(this);
      element.css("width",INFOBUTTON_IMAGE_SIZE+"px");
  };
    
  if(!touch){
    defaultSize();
    infobuttons.hover(enlarge,defaultSize);
  }else{
    //if its a touch screen, we dont want special hover effects
    infobuttons.each(enlarge);
  }
  
}

function setCookie(cname, cvalue, exdays) {
    var expires = "";
    if(!exdays)exdays = 365;
    
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    if(!document&&!document.cookie)return "";
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showNotification(title,body,icon,onclick){
  if(getCookie('notify')){
    if(!onclick)onclick = function(){};
    if(!icon){
        //woah woah wikipedia? the academy website doesnt have a version of the logo hosted with https (which will invalidate the security certificate.) Wikipedia, however, does have one for the page. Thanks Obama.
       icon = 'https://upload.wikimedia.org/wikipedia/en/c/c7/PlanoAcademyHSLogo.jpg';

    }
  
    var notification = new Notification(title, {
      icon: icon,
      body: body,
    });
    
    notification.onclick = onclick;
  }
}

function checkTime(json){
  var currentDate = new Date();
  var currentMinutes = parseInt(currentDate.getMinutes())+(parseInt(currentDate.getHours())*60);
  
  var passingPeriod = getCookie("passPeriod");
  if(!passingPeriod){
    passingPeriod = 5;
  }
  
  var notify = getCookie("notify");

  for(var i = 0;i<json.schedule.length;i++){
    var date = new Date(json.schedule[i].time);
    var hours = parseInt(date.getHours());
    var minutes = parseInt(date.getMinutes())+(hours*60);//we convert the hours into minutes so we can compare. the times we get are from 1976, so simply doing > will be wrong.
    
    var element = $("#row"+i+" .cell");
    
    if(minutes<currentMinutes){
      element.addClass("disabled");
      if(i==json.schedule.length-1){
        $('#personalized-schedule').attr("id","school-over");
      }
    }else{
      element.removeClass("disabled");
      
      var timeCell = element.add(".time");
    }
  }
}

function createTimers(json){  
  //we only want to update the current place if its today
  if(json.day+1==new Date().getDay()){
    createNotifications();

    window.setInterval(function(){
      //console.log(times);
      checkTime(json);
    },6);
  }
}

function createNotifications(){
      if(getCookie('notify')==''||!getCookie('notify')){
      if (!Notification) {
        setCookie('notify','false');
        return;
      }
  
      Notification.requestPermission().then(function(result) {
        if (result === 'denied') {
          setCookie('notify','false');
          return;
        }
        if (result === 'default') {
          setCookie('notify','false');
          return;
        }
        setCookie('notify','true');
      });
      setCookie('notify','true');
    }
    
    if(getCookie('passPeriod')==''||!getCookie('passPeriod')){
      setCookie('passPeriod',5);
    }
}

function addZero(i) {
    // Add a leading zero if the number is a single digit
    if (i < 10) {
        // Implicit cast
        i = "0" + i;
    }
    return i;
}

function refreshPersonalizedSchedule(json){
  var person = json.info.id;
  var day = json.day;
  if(json.schedule.length<0){
    return json.schedule.failed;
  }
  
  var out = "<table><tr bgcolor='#BBB'><td><b>Time</b></td><td><b>Class</b></td></tr>";
  
  for(var i = 0;i<json.schedule.length;i++){
  
    var start = new Date(json.schedule[i].startTime);
    var startHours = parseInt(start.getHours());
    if (startHours > 12) {
      // Convert to AM/PM from military time
      startHours -= 12;
    }
    
    var end = new Date(json.schedule[i].endTime);
    var endHours = parseInt(end.getHours());
    if (endHours > 12) {
      // Convert to AM/PM from military time
      endHours -= 12;
    }
    
    out += "<tr id='row"+i+"'><td class='time cell'>";
    if(startHours<10){
      out += "&nbsp;";
    }
    out += startHours + ":" + addZero(start.getMinutes()) + " - "+ endHours+":"+addZero(end.getMinutes())+"</td><td class='mod cell'bgcolor='"+json.schedule[i].color+"'>" + json.schedule[i].name + '</td></tr>';
  }
  
  out += "</table>";
  
  $('#personalized-schedule').empty().html(out);
}

function getGreeting(){
  if(Math.floor(Math.random()*2)===1){
    var d= new Date();
    if(d.getHours()<12){
       return 'Good morning, %N';
    } else if(d.getHours()<17){
       return 'Good afternoon, %N';
    } else {
       return 'Good evening, %N';
    }
  }else{
    var greetings = [
      "Hi %N!","Hello, %N.","Hiya %N!","What's up, %N?","Yo %N!","Hey %N!","Greetings, %N",
      "Howdy %N!","What's new, %N?","Good to see you, %N!","Welcome, %N.","Pleased to see you, %N!"
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
}

function capitalizeFirstLetter(target) {
    // Return a string with the first letter capitalized.
    return target.substring(0,1).toUpperCase()+target.substring(1);
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

function loadPage(json){
  //we can't simply remove the login. the google login button tries to edit it's own style, and deleting it causes the javascript to throw an error and stop. keeping it hidden won't hurt anyone
  $("#login").css("display","none");
    
  var html = "<div id='name'class='personalized'><span id='greeting'>"+getGreeting().replace("%N",capitalizeFirstLetter(json.info.first))+"</span></div>";
  
  if(json.day<=0||json.day>4){
    html += "<br><div>No school today!</div>";
  }else{
    
    html += "<br>"+json.motd.global;
    html += json.motd.local;
    html += "<div class='personalized noanimation'><p><h1>Here\'s your schedule for "+getDayNoun(json.day)+":</h1>";
    html += "<p id='personalized-schedule'></p></p></div>"
    if(json.isAdmin===true&&json.admin){
      html += json.admin;
    }
  }
  
  html += "<br><div id='infobuttons'><form action='javascript:void(0)'class='infobuttonsform'id='settingshook'><input id='settingsbutton'class='infobutton'type='submit'value='Settings'></form></div><br>";
  
  pushView(VIEW_TYPE.PAGE,html);
}

function loadData(){
  applyTheme(getCookie('theme'));

  //after the semicolon are parameters
  var backgroundSelection = getCookie('bg').split(';');
  if(backgroundSelection[0]=="Bing"){
    pullBackground();
  }else if(backgroundSelection[0]=="Color"){
    $('head').append('<style>body{background-image: '+backgroundSelection[1]+' !important;}</style>');
  }else if(backgroundSelection[0]==""){
    setCookie('bg','Theme');
  }
}

function updatePage(json){

  createTimers(json);
    
  loadPage(json);
  refreshPersonalizedSchedule(json);

  //settings bar (see Settings.html)
  addHookClickListener();
  
  setTouchScreen(Modernizr.touch||Modernizr.mq('only all and (max-device-width: 800px)')||('ontouchstart' in document.documentElement));
}

function addHookClickListener(){
  $("#settingshook").stop(true,true).unbind().click(function(){
    $("#shade").css("display","inline").css("opacity","0").css("opacity","0.7");
    $("#settings").stop(true,true).css("width","100%");
    });
    
    
    $("#cancel-settings-button").unbind().click(function(){
      //this closes the settings
      $("#settings").stop(true,true).css("width","0%");
      //why arent i using fadeout()? because it jitters for some reason. this way is faster, but a bit messier.
      $("#shade").css("display","none");
    });
    
    var form = $("#settings-form");
    var query = window.location.href.substring(1).split('&');
    var day = new Date().getDay();
    var style = getCookie('theme');
    for(var i =0;i<query.length;i++){
      var parameter = query[i].split('=');
      //we dont want to add day and style to the output, as the <select> is adding it.
      //Additionally, we store those 2 values so then we can decide the default values for said <select>
      if(parameter[0]=='day'){
        day=parameter[1];
      }else{
        $('<input type="hidden"name="'+parameter[0]+'"value="'+parameter[1]+'"/>').prependTo(form);
      }
    }
    
    var dayselect = $('#settings-day-selector');
    var styleselect = $('#settings-style-selector');
    
    for(var i=0;i<styles.length;i++){//add the style <option>'s
      var current = (styles[i][0]==style);
      if(!styles[i][3]||(current)){
        var select = '<option value="'+styles[i][0]+'"';
        if(styles[i][0]==style){
          select+='selected="selected"id="selected-style"';//make it default
        }
        select+='>'+styles[i][1].split(',')[0]+'</option>';
        $(select).appendTo(styleselect);
      }
    }
    
    addThemeDescription(styleselect);
    
    //code for the theme description
    styleselect.change(
      function(){
          addThemeDescription(this);
          setCookie('theme',styleselect.val());
      }
    );
    
    var notifyPassPeriod = $('#notify-delay');
    
    notifyPassPeriod.val(getCookie('passPeriod'));
    notifyPassPeriod.attr('disabled',getCookie('notify')=='false');
    
    notifyPassPeriod.change(
      function(){
        setCookie('passPeriod',notifyPassPeriod.val());
      }
    );
    
    var notifyCheckbox = $('#notify-checkbox');
    
    notifyCheckbox.prop('checked',getCookie('notify')=='true');
    
    notifyCheckbox.change(
      function(){
        var value = notifyCheckbox.prop('checked');
        setCookie('notify',value.toString());
        notifyPassPeriod.attr('disabled',!value);
      }
    );
    
    var backgroundSelector = $('#bg-select');
    
    backgroundSelector.val(getCookie('bg'));
    
    backgroundSelector.change(function(){
       setCookie('bg',backgroundSelector.val());
    });
    
    for(var i =0;i<days.length;i++){
      var select = '<option value="'+(i+1)+'"';
      var selected = ((i+1)==day);//whether the current selected day is this value
      var today = (i==new Date().getDay()-1);//whether the iterated value represents today
      if(selected){
          select+='selected="selected"id="selected-day"';//set it to default
      }
      select +='>'+days[i];
      if(today){
        select+=' (Today)';//mark that it is today
      }
      select+='</option>';
      $(select).appendTo(dayselect);
    }
    
    $("#submit-settings-button").unbind().click(function(){
      var dayval = dayselect.val();
      if(dayval !=  new Date().getDay()){
        $('<input type="hidden"name="day"value="'+dayval+'"/>').appendTo(form);
      }
  });
}
