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
    if(localStorage[param]){
        return localStorage[param];
    }else{
        var cookie = getCookie(param);
        if(!cookie){
            var urlParam = getUrlParameter(param);
            if(!urlParam){
                return "";
            }else{
                return urlParam;
            }
        }else{
            return cookie;
        }
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
        init();
    });
}

function onSignIn(googleUser){
    pushView(VIEW_TYPE.MESSAGE,"Fetching your schedule...");
    var id_token = googleUser.getAuthResponse().id_token;
    
    var settings = {
      "async": true,
      "crossDomain": true,
      "dataType":"jsonp",
      "url": "https://script.google.com/macros/s/AKfycbyf4XMwLFWqDYH-jYfbS_jH-xlNm7eSyB0tWj0AidzD5wSB41gD/exec",
      "method": "POST",
      "headers": {
        "cache-control": "no-cache",
      },
      "data": {
          "grade":getGrade(),
          "day":getDay(),
          "code":encodeURIComponent(id_token),
          "callback":"foo"
      }
    };
    
    $.ajax(settings).done(function (response) {
        var json = JSON.parse(response);
        if(json.failed){
            pushView(VIEW_TYPE.MESSAGE,String(json.failed)+"<br>Please try to login again.<br><br><input type='submit'value='Log in again'onclick='loadGoogleApi()'/><br><input type='submit'value='Change grade level'onclick='reset()'/>");
        }else{
            updatePage(json);
        }    
    });

    
}

function viewLogin(auth2){
  var html = '<span id="login"><div><br><h1>'+getGrade()+'th Grade Sign In</h1><br>Please sign in to your Google account.</div><br> <div id="gSignInWrapper"><div id="login-button" class="customGPlusSignIn"><span id="login-icon"></span><span>Sign in with Google</span></div></div></span>';
  pushView(VIEW_TYPE.PAGE,html);
  
  //we are using getElementById instead of JQuery because that is what the google api accepts
  auth2.attachClickHandler('login-button', {},
    onSignIn,
    function(error){
      console.log(error);
    }
  );
}

function loadGoogleApi(){
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: '48133947856-qpuod3t3ghkva88jfslo5gaeigi6ce4o.apps.googleusercontent.com',
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

function init(){
    if (window.location.protocol !== 'https:') {
        //redirect to https
        window.location = 'https://' + window.location.hostname + window.location.pathname + window.location.hash;
    }
    
    console.log("Initializing");
    var grade = getGrade();
    if(!grade||isNaN(grade)){
        
        
        var html = "<div id='name'>Welcome!</div><br>";
        html += "<div>Please select your grade level:<br>";
        html += "<select id='grade'><option value='9'>9th</option><option value='10'>10th</option></select>";
        html += "<br><br><input type='submit'id='grade-submit'/></div>";
        
        pushView(VIEW_TYPE.PAGE,html);
        
        $("#grade-submit").click(function(){
            setCookie("grade",$("#grade").val());
            
            init();
        });
    }else{
     
        pushView(VIEW_TYPE.MESSAGE,'Generating Theme...');
     
        loadGoogleApi();
     
        loadData();
    
    }
}

//actually run it
$(init);