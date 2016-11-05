var styles = [[[],'Normal','The standard theme.',false],
[['dark'],'Dark','Same as the normal theme, except recolored to save energy and be better on your eyes',false],
[['simple','mobile'],'Fast','Special theme that sacrifices appearance for performance.',false],
[['enhanced'],'Enhanced','A more "modern" theme, made out of popular request.',false],
[['hidden/aprilfools','hidden/meme'],'Hardy,hardie,hardy meme,hardy memes,michael,micheal,michael hardy,michael hardy,physkiks,not bailey,physicks,physiks,first year science,','A meme theme based on <a href="https://www.reddit.com/r/hardymemes">Hardy Memes.</a>',true],
[['hidden/omega','hidden/meme'],'Omega,ohm,om,ohmega,omega herobrine,herobrine,ohmega herobrine,minecraft,noscopes,entertainment,youtube,csgo,ohm\'s law,ohms law,resistance,resistance is futile','<a href="https://www.youtube.com/channel/UCdfiEmOyIt6BHPZms6Nv1wQ">A theme to celebrate the best youtube channel ever!</a>',true],
[['hidden/meme'],'Meme,memes,maymay,maymays,not hardy memes,normal meme,normal memes,rainbow,illuminati,liav,liav turkia,liav tortilla','Maymay the memes bebe with meme.',true],
[['hidden/bailey','hidden/meme'],'Bailey,bailie,bails,bailsey,brad,bradley,bradly,brad bailey,b bailey,bradley bailey,bradly bailey,not hardy,spreadsheet,spreadsheets,jeep,jeeps,jeep jeep,longhorn,longhorns,texas longhorn,texas longhorns,longhorns fan,work,paying the bills,working and paying the bills,going to work,social studies','Go to work and pay the bails',true],
[['hidden/wizer','hidden/meme'],'Wizer,wizor,senor,spanish,over 20,sunor,senor wizer,senor wizor,none the wizer,none the wizor,not cool','"Anyone above 20 is too uncool"',true],
[['hidden/frog','hidden/meme'],'Pepe,frog,le pepe,normie,le frog,4chan,hacker 4chan,sad,toad,sad frog,me_irl,rare,rare meme,rare memes,rare pepe,rare frog,not common,peep,medium rare,rare maymay,rare maymays','How rare!',true],
[['hidden/neel'],'Neel,bernie,bernie sanders,bernie,not hillary,not trump,socialism,not conservative,elon,musk,tesla,spacex,elon musk,pi,pai,neilish,kneel,3.14,3.145,3.1459','Bernie Sanders',true],
[['hidden/harambe','hidden/meme'],'Harambe,harambe,gorilla,ape,big ape,true love,saviour,cinncinati,zoo,animal,primal,winston,monkey,inspiration,orangutan,peace,heaven,ceaser,caeser,planet of the ape,planet of the apes,return to the planet of the apes,neanderthal,neanderthals,evolution,hair,monk key,science,rip,rest in peace,rest in pieces,rest in peaces,rip in peace','RIP',true],
[['hidden/hirsch','hidden/meme'],'Hirsch,graph,sheets,sheet,graphs,math,algebra,hirsh,step,steph,stephanie hirsch,stephirsh,geometry,geometery','It hirsch me to make this',true],
[['hidden/bartholew','hidden/meme'],'Bart,bartholew,bartqdino,bartthedino,bartholew q,bart dino,bart q dino,bart the dino,bart,bartholew dino,dinosaur,jurassic,jurassic park,jurassic world,stegosaurus,trex,t-rex,lizard,giant lizard','#bartthedino',true],
];//the first element of the nested array is the stylesheet name, and dependenencies.. The second is a list of terms to describe it. The first word is the name that appears to the user. The third is a description. Fourth is if its hidden or not

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
          url: "/src/client/styles/themes/"+styles[i]+".html",
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
    for(var i =0;i<styles.length;i++){
      if(styles[i][0]==selectedValue){
        desc.html(styles[i][2]);
      }
    }
}

function addHiddenTheme(){
  var value = $('#hidden-selector').val().toLowerCase();
  for(var i = 0;i<styles.length;i++){
    if(styles[i][3]==true){
      var splitNames = styles[i][1].split(',');
      for(var j=0;j<splitNames.length;j++){
        if(splitNames[j].toLowerCase()==value){
            var styleselect = $('#settings-style-selector');
            var option = $('<option value="'+styles[i][0]+'">'+splitNames[0]+'</option>');
            option.appendTo(styleselect);
            alert('Added '+splitNames[0]);
            return;
        }
      }
    }
  }
  alert('That is not a hidden theme.');
}

