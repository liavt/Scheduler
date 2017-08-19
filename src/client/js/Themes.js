/**
Copyright (c) 2016-2017 Liav Turkia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*
Here is a visualized explanation:

[
[stylesheets],
name and terms,
description,
hidden
]
*/

function applyTheme(theme){
  if(theme.length<=0||theme==''){
     stopMessage();
  }else{
    console.log('Applying theme(s): '+theme);
    
    var styles = theme.split(',');
    
    var requests = new Array();
    
    for(var i =0;i<styles.length;i++){
    
      requests.push(
        $.get({
          url: CONFIG.THEME_PATH+styles[i]+".html",
          data: "",
          success: function(result){
            $('head').append(result);
          },
          dataType: "html"
        })
      );
    }
    
    $.when.apply($,requests).done(function(){
      stopMessage();
    });
    
  }
}

//create the description for the currently selected theme. takes in <select> object which controls style.
function addThemeDescription(object){
  var desc = $("#settings-style-description");
  var selectedValue = $(object).val();
    for(var i =0;i<CONFIG.THEMES.length;i++){
      if(CONFIG.THEMES[i][0]==selectedValue){
        desc.html(CONFIG.THEMES[i][2]);
      }
    }
}

function addHiddenTheme(){
  var value = $('#hidden-selector').val().toLowerCase();
  for(var i = 0;i<CONFIG.THEMES.length;i++){
    if(CONFIG.THEMES[i][3]==true){
      var splitNames = CONFIG.THEMES[i][1].split(',');
      for(var j=0;j<splitNames.length;j++){
        if(splitNames[j].toLowerCase()==value){
            var styleselect = $('#theme-choice');
            var option = $('<option value="'+CONFIG.THEMES[i][0]+'">'+splitNames[0]+'</option>');
            option.appendTo(styleselect);
            alert('Added '+splitNames[0]);
            return;
        }
      }
    }
  }
  alert('That is not a hidden theme.');
}

