var VIEW_TYPE = {
  /*
  Default view, fills up the entire page
  */
  PAGE:0,
  /*
  Simple message in middle of screen
  */
  MESSAGE:1,
  /*
  Overlays the page with more HTML
  */
  OVERLAY:2
};

function pullBackground() {
  google.script.run.withSuccessHandler(function(result){
    $('body').append(result);
  }).pullBackground();
}

function stopMessage(){
   var body = $('body');
   body.css('visibility','visible');
   $('#message').remove();
   
   //we dont want the page to spaz out as all the transitions trigger... so using some black magic, we disable transitions, flush the css, and then renable them.
   body.toggleClass('notransition');
   body[0].offsetHeight;//trigger a flush. this works... somehow.
   $('#main-stylesheet').append('*{transition: all 0.3s ease 0s;}');
   body.toggleClass('notransition');
}

function pushView(type,content){
  if(type===VIEW_TYPE.MESSAGE){
    stopMessage();
    var body = $('body');
    body.css('visibility','hidden');
    body.append('<h1 id="message">'+content+'</h1>');
  }else if(type===VIEW_TYPE.PAGE){
    //this removes the message, which overloads
    stopMessage();
    
    $('#page').empty().html(content);
  }
}