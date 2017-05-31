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

function onSignIn(googleUser){
	pushView(VIEW_TYPE.MESSAGE,"Fetching your schedule...");
	
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
		  "grade":encodeURIComponent(getGrade()),
		  "day":encodeURIComponent(getDay()),
		  "code":encodeURIComponent(googleUser.getAuthResponse().id_token),
		  "callback":"foo"
	  }
	};
	
	var pullData = function(){
		$.ajax(settings).done(function (response) {
			try{
				var json = JSON.parse(response);
			}catch(e){
				pushView(VIEW_TYPE.MESSAGE,"<span aria-live='assertive'>"+String(e)+"<br>Please try to login again.</span><br><br><input type='submit'value='Log in again'onclick='loadGoogleApi()'/><br><input type='submit'value='Change grade level'onclick='reset()'/>");
			}
			if(!json||json.failed){
				pushView(VIEW_TYPE.MESSAGE,"<span aria-live='assertive'>"+(json.failed ? String(json.failed) : "No respond recieved")+"<br>Please try to login again.</span><br><br><input type='submit'value='Log in again'onclick='loadGoogleApi()'/><br><input type='submit'value='Change grade level'onclick='reset()'/>");
			}else{
				updatePage(json);
			}    
		});
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
	html += "<select aria-labelledby='Grade' id='grade' autofocus><option value='9'>9th</option><option value='10'>10th</option><option value='11'>11th</option></select>";
	html += "<br><br><input type='submit'id='grade-submit'value='Select'/></div>";
	
	pushView(VIEW_TYPE.PAGE,html);
	
	$("#grade-submit").click(function(){
		setCookie("grade",$("#grade").val());
		
		init();
	});
}

function init(){
	console.log("Initializing...");
	
	setTouchScreen(Modernizr.touch||Modernizr.mq('only all and (max-device-width: 800px)')||('ontouchstart' in document.documentElement));
	
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
