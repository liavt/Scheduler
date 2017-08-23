/**
Copyright (c) 2016-2017 Liav Turkia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var checkNotifications;

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
	if(touch){
		applyTheme('mobile');
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

function setCookie(cname, cvalue, exdays) {
	var expires = "";
	if(!exdays)exdays = 365;
	
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	expires = "expires="+d.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	if(!document&&!document.cookie){
		return "";
	}
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

function createNotifications(json){
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
	
	if(!json.schedule){
		return;	
	}
	
	if(json.schedule.length<0){
		return json.schedule.failed;
	}
	
	var out = "";
	
	if(json.schedule.needsSelection == true){
		out = "<h1>Pick your mods for today:</h1>";
		for(var i = 0; i < json.schedule.modsForSelection.length; ++i){
			if(json.schedule.modsForSelection[i]&&json.schedule.modsForSelection[i][0]){
				out += timeToString(new Date(json.schedule.modsForSelection[i][0].endTime));
				out += " - ";
				out += timeToString(new Date(json.schedule.modsForSelection[i][0].startTime));
				out += ": ";
				out += "<select id='mod-selection-"+i+"'>";
				out += "<option value=''selected='true'disabled='true'>Pick a mod</option>";
				for(var j = 0; j < json.schedule.modsForSelection[i].length; ++j){
					out += "<option value='" + json.schedule.modsForSelection[i][j].key +"'>";
					out += json.schedule.modsForSelection[i][j].name;
					out += "</option>";
				}
				out += "</select><br>";
			}
		}
		
		out += "<br><i style='color:red'id='mod-selection-error'></i>";
		out += "<br><input type='submit'value='Confirm mods'id='mod-selection-submit'>";
		
		$("#schedule-container").empty().html(out);
		
		$("#mod-selection-submit").click(function(){
			var selection = {};
			
			for(var i = 0; i < json.schedule.modsForSelection.length; ++i){
				var selectedMod = $("#mod-selection-"+i);
				if(selectedMod.length){
					if(!selectedMod.val()){
						$("#mod-selection-error").html("Must select a mod for every time slot!");
						return;
					}
					
					var selectedModJSON = {
						"key":selectedMod.val(),
						"startTime":json.schedule.modsForSelection[i][0].startTime,
						"endTime":json.schedule.modsForSelection[i][0].endTime,
					};
					
					selection[i] = (selectedModJSON);
				}
			}
			
			selection.length = json.schedule.modsForSelection.length;
			
			$("#schedule-container").empty().html("Loading...");
			
			retrieveData("mod-select", refreshPersonalizedSchedule, {"selection":JSON.stringify(selection)});
		});
	}else{
		out = "<h1>Here\'s your schedule for "+getDayNoun(json.day)+":</h1><p id='personalized-schedule'><table><tr bgcolor='#BBB'><td><b>Time</b></td><td><b>Class</b></td></tr>";
		
		for(var i = 0;i<json.schedule.length;++i){
			var start = new Date(json.schedule[i].startTime);
			
			var end = new Date(json.schedule[i].endTime);
			
			out += "<tr id='row"+i+"'><td class='time cell'>";
			out += "<span class='time-contents'><p class='time-hours'>"+timeToString(start) + "</p><p class='time-dash'>&#32;-&#32;</p><p class='time-hours'>"+ timeToString(end)+"</p></span></td><td class='mod cell'bgcolor='"+json.schedule[i].color+"'><p>" + json.schedule[i].name + '</p></td></tr>';
		}
		
		out += "</table></p>";
		
		out += "Group: "+json.info.group +"<br>";
		out += "Cohort: "+json.info.cohort;
		
		$("#schedule-container").empty().html(out);
	}
}

function getGreeting(){
	if(Math.floor(Math.random()*2)===1){
	var d= new Date();
	if(d.getHours()<12){
		 return "Good morning, %N";
	} else if(d.getHours()<17){
		 return "Good afternoon, %N";
	} else {
		 return "Good evening, %N";
	}
	}else{
		return CONFIG.GREETINGS[Math.floor(Math.random() * CONFIG.GREETINGS.length)];
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
		return "today";
	}else if(offset==1){
		return "tomorrow";
	}else if(offset==-1){
		return "yesterday";
	}else{
		return (new Date().getMonth() + 1)+"/"+day;
	}
}


function getAdminConsole(json){
	var out = "<div class='noanimation'id='schedule-parent'><h2>Admin Console</h2><table id='schedule'><tr>";
	
	for(var x = 0;x < json.schedule.length;++x){
		out += "<tr>"
		if(json.schedule[x]){
			for(var y = 0;y < json.schedule[x].length;++y){
				if(json.schedule[x][y]){
					var cellClass = "cell";
					var cellColor = json.schedule[x][y].color;
					var cellText = json.schedule[x][y].text;
					
					if(json.schedule[x][y].type == "TIME" ||json.schedule[x][y].type == "QUERY"){
						cellClass += "key";
					}else if(json.schedule[x][y].type == "EMPTY" || json.schedule[x][y].type == "KEY"){
						cellClass += "empty";
						cellColor = "";
					}
					
					out += "<td class='"+cellClass+"'bgcolor='"+cellColor+"'>"+cellText+"</td>";
				}
			}
		}
		out += "</tr>";
	}
	
	out += "</tr></table>";
	out += "<br><a href='"+json.controlPanel+"'target='_blank'>Control panel</a>";
	out += "</div><br>";
	
	return out;
}

function viewSettings(){
	var html = "<div id='name'>Settings</div><br>";
	html += "<div class='noanimation'>";
	html += "Theme<br><select id='theme-choice'>";
	var currentTheme = getCookie("theme");
	for(var i = 0; i < CONFIG.THEMES.length; ++i){
		if(CONFIG.THEMES&&!CONFIG.THEMES[i][3]){
			html += "<option value='"+CONFIG.THEMES[i][0]+"'"+(currentTheme == CONFIG.THEMES[i][0] ? "selected" : "" ) + ">"+CONFIG.THEMES[i][1]+"</option>";
		}
	}
	html += "</select>"
	html += "<small><i><p id='settings-style-description'></p></i></small>";
	html += "</div><br>";
	html += "<div class='noanimation'>";
	html += "<strong>Add a hidden theme</strong>";
	html += "<input type='text'id='hidden-selector'/>";
	html += "<input type='submit'value='Add'id='hidden-submit'onclick='addHiddenTheme()'/>";
	html += "</div><br>";
	html += "<div class='noanimation'>";
	html += "<strong>Notifications:</strong>";
	html += "<input id='notify-checkbox'type='checkbox'checked='true'/>";
	html += "<br>";
	html += "Notify ";
	html += "<input id='notify-delay'style='width:15%'type='number'min='1'value='5'/>";
	html += "minutes before a class";
	html += "</div><br>";
	html += "<div class='noanimation'>";
	html += "Background: <select id='background-choice'>";
	html += "<option value='Theme'>Theme (Default)</option>";
	html += "<option value='NASA-APOD'>NASA Astronomy Picture</option>";
	html += "<option value='Bing'>Bing Image of the Day</option>";
	html += "<option value='Color'>Custom Color</option>";
	html += "<option value='Image'>Custom Image</option>";
	html += "</select><br>";
	html += "<input id='background-choice-extra'>";
	html += "</div><br>";
	html += "<div class='noanimation'><input id='settings-submit'type='submit'value='Submit'/><br><input type='reset'value='Cancel'onclick='location.reload()'/></div>";
	pushView(VIEW_TYPE.PAGE, html);
	
    var notifyPassPeriod = $('#notify-delay');
    
    notifyPassPeriod.val(getCookie('passPeriod'));
    notifyPassPeriod.attr('disabled',getCookie('notify')=='false');
    
    var notifyCheckbox = $('#notify-checkbox');
    
    notifyCheckbox.prop('checked',getCookie('notify')=='true');
    
	notifyCheckbox.change(function(){
		notifyPassPeriod.attr('disabled',!notifyCheckbox.prop('checked'));
	});
	
	$("#theme-choice").change(function(){
		addThemeDescription(this);
	});
	
	addThemeDescription($("#theme-choice"));
	
	var addExtraBackgroundInfo = function(value){
		if(value == "Color"){
			$("#background-choice-extra").attr("type", "color").css("display", "initial").val("#000000").attr("title", "Custom Color").attr("placeholder", "Color Hexcode");
		}else if(value == "Image"){
			$("#background-choice-extra").attr("type", "url").css("display", "initial").val("").attr("title", "Custom Image").attr("placeholder", "URL to image");
		}else{
			$("#background-choice-extra").css("display", "none");
		}
	}
	
	var currentBackground = getCookie("bg");
	if(currentBackground){
		var backgroundValues = currentBackground.split(":");
		addExtraBackgroundInfo(backgroundValues[0]);
		$("#background-choice option[value=" + backgroundValues[0] + "]").prop("selected", true);
		$("#background-choice-extra").val(decodeURIComponent(backgroundValues[1]));
	}
	
	$("#background-choice").change(function(){
		addExtraBackgroundInfo($(this).val());
	});
	
	$("#settings-submit").click(function(){
		setCookie("theme", $("#theme-choice").val());
		setCookie("notify", $("#notify-checkbox").prop("checked"));
		setCookie("passPeriod", $("#notify-delay").val());
		var background = $("#background-choice").val() + ":" + encodeURIComponent($("#background-choice-extra").val());
		setCookie("bg", background);
		location.reload();
	});
}

function loadPage(json){
	//we can't simply remove the login. the google login button tries to edit it's own style, and deleting it causes the javascript to throw an error and stop. keeping it hidden won't hurt anyone
	$("#login").css("display","none");
	
	var html = "<div id='name'class='personalized'><span id='greeting'>"+getGreeting().replace("%N",capitalizeFirstLetter(json.info.first))+"</span></div>";
	
	html += "<br>"+json.motd.global;
	html += json.motd.local;
	if(json.schedule){
		html += "<div class='personalized noanimation'><p aria-label='Schedule'id='schedule-container'></p></div>"
	}
	
	if(json.isAdmin===true&&json.admin){
		html += "<br>"+getAdminConsole(json.admin)+"";
	}
	
	html += "<img id='settings-button'src='res/gear.png' alt='Settings'>";

	html += "<br>";
	
	pushView(VIEW_TYPE.PAGE,html);
	
	$("#settings-button").click(viewSettings);
	
	$("#glitch").html($("#glitch").attr("data-text"));
}

function readCookies(){
	applyTheme(getCookie("theme"));

	//after the semicolon are parameters
	var backgroundSelection = getCookie("bg").split(":");
	if(backgroundSelection[0]=="NASA-APOD"){
		$.getJSON("https://api.nasa.gov/planetary/apod?api_key="+CONFIG.NASA_IMAGE_API, function(response){
			$("head").append("<style>body{background-image: url(" + response.hdurl + ") !important;background-size:cover;}</style>");
		});
	}else if(backgroundSelection[0] == "Bing"){
		var settings = {
			"async": true,
			"crossDomain": true,
			"dataType":"jsonp",
			"url": CONFIG.API_ENDPOINT,
			"type": "POST",
			"headers": {
				"cache-control": "no-cache",
			},
			"data": {
				"request":"iotd"
			}
		};
		
		$.ajax(settings).done(function(response){
			$("head").append("<style>body{background-image: url(" + JSON.parse(response).url + ") !important;background-size:cover;}</style>");
		});
	}else if(backgroundSelection[0]=="Color"){
		$("head").append("<style>body{background-color: "+decodeURIComponent(backgroundSelection[1])+" !important;}</style>");
	}else if(backgroundSelection[0]=="Image"){
		var pattern = /(?:(?:https):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/;
		var matches = decodeURIComponent(backgroundSelection[1]).match(pattern);
	    if(!matches||matches.length != 1){
	    	alert("Invalid Custom Image URL");
	    }else{
			$("head").append("<style>body{background-image: url("+decodeURIComponent(backgroundSelection[1])+") !important;background-size:cover;}</style>");
	    }
	}else if(backgroundSelection[0] == "" || backgroundSelection[0] == "Theme"){
		setCookie("bg","Theme");
	}
}

function showNotification(title, msg){
	var notification = new Notification(title, {
		icon: CONFIG.NOTIFICATION_ICON,
		body: msg,
		dir: CONFIG.LANGUAGE_DIRECTION,
		lang: CONFIG.LANGUAGE_NAME,
		vibrate: CONFIG.NOTIFICATION_VIBRATION_PATTERN
	}); 
}

function getTime(date) {
	// Only check for current day
	return (date.getHours() * 60) + date.getMinutes();
}

function timeToString(date){
	var pm = false;
	var hours = parseInt(date.getHours());
	if (hours >= 12) {
		// Convert to AM/PM from military time
		if(hours > 12){
			hours -= 12;
		}
		pm = true;
	}else if(hours == 0){
		hours = 12;
		pm = true;
	}
	
	return hours+":"+addZero(date.getMinutes())+" "+(pm ? "PM" : "AM");
}

function updateNotifications(json){
	if(getCookie("notify")){
		clearInterval(checkNotifications);
		checkNotifications = function(){
			var currentTime = getTime(new Date());
			var passingPeriod = getCookie("passPeriod");
			 
			if(!passingPeriod||passingPeriod==""){
				passingPeriod = 5;
			}
			
			for(var i = 0;i<json.schedule.length;++i){
				var start = new Date(json.schedule[i].startTime);
				var nextTime = getTime(start);
				
				var timeDifference = (currentTime-nextTime);
				
				if(Math.abs(timeDifference)==passingPeriod&&timeDifference<0){
					showNotification(json.schedule[i].name+" starts in "+passingPeriod+" minutes.","It starts at "+timeToString(start)+".\nWait to be dismissed.");
					return;
				}else if(i == json.schedule.length - 1){
					nextTime = getTime(new Date(json.schedule[i].endTime));
					timeDifference = (currentTime-nextTime);
					
					if(Math.abs(timeDifference)==passingPeriod&&timeDifference<0){
						showNotification("School ends in "+passingPeriod+" minutes.","Wait to be dismissed.");
						return;
					}
				}
			}
		};
		checkNotifications = setInterval(checkNotifications, 60000);
	}
	
}

/**
This should be called when the JSON gets updated
*/
function updatePage(json){
	loadPage(json);
	refreshPersonalizedSchedule(json);
	updateNotifications(json);
}
