/**
Copyright (c) 2016-2017 Liav Turkia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var VIEW_TYPE = {
  /*
  Default view, fills up the entire page
  */
  PAGE:0,
  /*
  Simple message in middle of screen
  */
  MESSAGE:1,
};

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