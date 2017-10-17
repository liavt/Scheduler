/**
Copyright (c) 2016-2017 Liav Turkia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};

function getSetting(param){
	var urlParam = getUrlParameter(param);
	if(!urlParam){
		var cookie = getCookie(param);
		if(!cookie||cookie==""){
			return;
		}else{
			return cookie;
		}
	}else{
		return urlParam;
	}
}

function getGrade(){
	return getSetting("grade");
}

function getDay(){
	return getSetting("day");
}

function reset(){
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		setCookie("grade","",-1);
		setCookie("day","",-1);
		location.reload();
	});
}

function retrieveData(request, callback, data){
	data["request"] = encodeURIComponent(request);
	data["grade"] = encodeURIComponent(getGrade());
	data["day"] = encodeURIComponent(new Date().getDate());
	data["code"] = encodeURIComponent(auth2.currentUser.get().getAuthResponse().id_token);
	data["callback"] = "foo";
	
	var settings = {
		"async": true,
		"crossDomain": true,
		"dataType":"jsonp",
		"url": CONFIG.API_ENDPOINT,
		"type": "POST",
		"headers": {
			"cache-control": "no-cache",
		},
		"data": data
	};
	
	$.ajax(settings).done(function(response){
		if(!response){
			pushView(VIEW_TYPE.MESSAGE,"<span aria-live='assertive'>No response recieved<br>Please try to login again.</span><br><br><input type='submit'value='Log in again'onclick='loadGoogleApi()'/><br><input type='submit'value='Change grade level'onclick='reset()'/>");
			return;
			
		}

		try{
			var json = JSON.parse(response);
		}catch(e){
			console.error(response);
			pushView(VIEW_TYPE.MESSAGE,"<span aria-live='assertive'>"+e+"<br>Please try to login again.</span><br><br><input type='submit'value='Log in again'onclick='loadGoogleApi()'/><br><input type='submit'value='Change grade level'onclick='reset()'/>");
			return;
		}
		
		if(json.failed){
			pushView(VIEW_TYPE.MESSAGE,"<span aria-live='assertive'>"+json.failed+"<br>Please try again later.</span><br><br><input type='submit'value='Log in again'onclick='loadGoogleApi()'/><br><input type='submit'value='Change grade level'onclick='reset()'/>");
			return;
		}
		
		try{
			if(json.premium !== true){
				//hey john
				$("#main-stylesheet").remove();
				setCookie("bg", "");
				setCookie("theme", "");
			}
			
			callback(json);
		}catch(e){
			console.error(e);
			pushView(VIEW_TYPE.MESSAGE,"<span aria-live='assertive'>Oops! An error occcured.<br>Please try again soon.</span><br><br><input type='submit'value='Log in again'onclick='loadGoogleApi()'/><br><input type='submit'value='Change grade level'onclick='reset()'/>");
		}
	});
}

function onSignIn(googleUser){
	pushView(VIEW_TYPE.MESSAGE,"Fetching your schedule...");
	
	var pullData = function(){
		retrieveData("schedule", updatePage, {});
	};
	
	pullData();
//	setInterval(pullData,600000);
}

function viewLogin(auth2){
	var grade = getGrade();
	if(!grade||isNaN(grade)){
		viewGradeSelect();
		return;
	}
	var html = '<span id="login"><div id="name">'+getGrade()+'th Grade Sign In</div><br><div>Please sign in to your Google account.</div><br> <div id="gSignInWrapper"><div aria-label="Google Sign In"id="login-button" class="customGPlusSignIn"><span id="login-icon"></span><span>Sign in with Google</span></div></div></span>';
	pushView(VIEW_TYPE.PAGE,html);
	
	//we are using getElementById instead of JQuery because that is what the google api accepts
	auth2.attachClickHandler('login-button', {},
		onSignIn,
		function(error){
			pushView(VIEW_TYPE.MESSAGE,error);
			console.log(error);
		}
	);
}

function loadGoogleApi(){
  gapi.load('auth2', function() {
	auth2 = gapi.auth2.init({
	  client_id: CONFIG.GAPI_TOKEN,
	});
		
	//run the actual code when we are initialized with google api
	auth2.then(function(){
	
		 //if the user logs out, then we ask for a login again. we dont want people hacking the accounts!
		 auth2.isSignedIn.listen(function(signedIn){
		   if(!signedIn)viewLogin(auth2);
		 });
	
	
		 //if they haven't accepted the permissions, we show them the log in screen
		 if(auth2.isSignedIn.get() == false){
		   viewLogin(auth2);
		 }else{
		   onSignIn(auth2.currentUser.get());
		 }
	   }
	);
	
   
  });
}

function viewGradeSelect(){
	var html = "<div id='name'>Welcome!</div><br>";
	html += "<div>Please select your grade level:<br>";
	html += "<select aria-labelledby='Grade' id='grade' autofocus>"
	for(var i = CONFIG.DEBUG == true ? 8 : 11; i < 12; ++i){
		html += "<option value='"+i+"'>"+i+"th</option>";
	}
	html += "</select>";
	html += "<br><br><input type='submit'id='grade-submit'value='Select'/></div>";
	
	pushView(VIEW_TYPE.PAGE,html);
	
	$("#grade-submit").click(function(){
		setCookie("grade",$("#grade").val());
		
		init();
	});
}

function init(){
	console.log("Initializing...");
	
	if(window.location.hostname == "schedular-liavt.c9users.io"){
		CONFIG.API_ENDPOINT = CONFIG.DEBUG_API_ENDPOINT;
		CONFIG.DEBUG = true;
	}
	
	console.log(CONFIG.DEBUG);
	
	setTouchScreen(Modernizr.touch||Modernizr.mq('only all and (max-device-width: 800px)')||('ontouchstart' in document.documentElement));
	
	setCookie("day", 31);
	
	createNotifications();

	var grade = getGrade();
	if(!grade||isNaN(grade)){
		viewGradeSelect();
	}else{
		pushView(VIEW_TYPE.MESSAGE,'Generating Theme...');
	 
		loadGoogleApi();
	 
		readCookies();
	}
}

//actually run it
$(init);
