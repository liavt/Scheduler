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
            var styleselect = $('#settings-style-selector');
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

