/**
Copyright (c) 2016-2017 Liav Turkia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var CONFIG = {
    "VERSION":"1.0.0b",
    "INFOBUTTON_IMAGE_SIZE": 70,
    "GREETINGS":[
      "Hi %N!","Hello, %N.","Hiya %N!","What's up, %N?","Yo,;,': %N!","Hey %N!","Greetings, %N",
      "Howdy %N!","What's new, %N?","Good to see you, %N!","Welcome, %N.","Pleased to see you, %N!"
    ],
    "SERVICE_WORKER":false,
    "SERVICE_WORKER_CACHE_NAME":"v3",
    "LANGUAGE_NAME":"en-US",
    "LANGUAGE_DIRECTION":"ltr",
    "NOTIFICATION_VIBRATION_PATTERN":[300,300,100,100,100,300,300],
    "NOTIFICATION_ICON":"https://upload.wikimedia.org/wikipedia/en/c/c7/PlanoAcademyHSLogo.jpg",
    "DEBUG":"false",
    "DEBUG_API_ENDPOINT":"https://script.google.com/a/mypisd.net/macros/s/AKfycbx0ztVoIwRo70rLufDMqqGV2pfYrOyzGg4JraLCp9z5/dev",
    "API_ENDPOINT":"https://script.google.com/macros/s/AKfycbx6UM43jEELsS8VNJCQASpH60veCwJ2fESByIOgFqG8itpvK60v/exec",
    "NASA_IMAGE_API":"UP1G1rpM3KwrpgRw2oMxIdxHlsip8I3ixEfU3L3e",
    "GAPI_TOKEN":"48133947856-qpuod3t3ghkva88jfslo5gaeigi6ce4o.apps.googleusercontent.com",
    "THEME_PATH":"src/client/styles/themes/",
    "THEMES":[
        [[],"Normal","The standard theme.",false],
        //[["dark"],"Dark","Same as the normal theme, except recolored to save energy and be better on your eyes",false],
        [["simple","mobile"],"Fast","Special theme that sacrifices appearance for performance.",false],
        [["enhanced"],"Enhanced","A more 'modern' theme, made out of popular request.",false],
        [["hidden/meme"],"Meme,memes,maymay,maymays,not hardy memes,normal meme,normal memes,rainbow,illuminati,liav,liav turkia,liav tortilla","Maymay the memes bebe with meme.",true],
        [["hidden/aprilfools","hidden/meme"],"Hardy,hardie,hardy meme,hardy memes,michael,micheal,michael hardy,michael hardy,ex-robotics,ex robotics,robotics traitor,not robotics,physkiks,not bailey,physicks,physiks,first year science,first year physics,knock-off bailey,knock off bailey,","A meme theme based on <a href='https://www.reddit.com/r/hardymemes'>Hardy Memes.</a>",true],
        [["hidden/omega","hidden/meme"],"Omega,ohm,om,ohmega,omega herobrine,herobrine,ohmega herobrine,minecraft,noscopes,entertainment,youtube,csgo,csgolotto.com,ohm\"s law,ohms law,resistance,resistance is futile,alpha,beta,gamma,delta,iota,sigma,omnicron,greek letter,pi,tau,amps,ampere,amperes,amperages,amperage,amp,volt,voltage,shocking,volts,","<a href='https://www.youtube.com/channel/UCdfiEmOyIt6BHPZms6Nv1wQ'>A theme to celebrate the best youtube channel ever!</a>",true],
        [["hidden/bailey","hidden/meme"],"Bailey,bailie,bails,bailsey,brad,bradley,bradly,brad bailey,b bailey,rip bailey,rip bails,vp,rice,bradley bailey,bradly bailey,not hardy,spreadsheet,spreadsheets,jeep,jeeps,jeep jeep,longhorn,longhorns,texas longhorn,texas longhorns,longhorns fan,work,paying the bills,working and paying the bills,going to work,social studies","Go to work and pay the bails",true],
        [["hidden/frog","hidden/meme"],"Pepe,frog,le pepe,normie,le frog,4chan,hacker 4chan,sad,toad,sad frog,me_irl,rare,rare meme,rare memes,rare pepe,rare frog,not common,peep,medium rare,rare maymay,rare maymays,me too thanks,me too thx,me_irl,me irl,2meirl4meirl","How rare!",true],
        [["hidden/neel"],"Neel,bernie,bernie sanders,bernie,not hillary,not trump,socialism,not conservative,elon,musk,tesla,spacex,elon musk,pi,pai,neilish,kneel,3.14,3.145,3.1459,should have won,popular vote,pop vote","Bernie Sanders",true],
        [["hidden/harambe","hidden/meme"],"Harambe,harambe,gorilla,ape,big ape,true love,next president,wake me up inside,bonzi buddy,cinncinati,saviour,cinncinati,zoo,animal,primal,winston,monkey,inspiration,orangutan,peace,heaven,ceaser,caeser,planet to the return of the ape,planet of the ape,planet of the apes,return to the planet of the apes,neanderthal,neanderthals,evolution,hair,monk key,science,rip,rest in peace,rest in pieces,rest in peaces,rip in peace","RIP",true],
        [["hidden/hirsch","hidden/meme"],"Hirsch,graph,sheets,sheet,graphs,math,algebra,hirsh,step,steph,stephanie hirsch,stephirsh,geometry,geometery,goodbye,best teacher,spreadsheet,spreadsheets,rip,rip hirsch","It hirsch me to make this.<br>GOODBYE to one of the best teachers!",true],
        [["hidden/bartholew","hidden/meme"],"Bart,bartholew,bartqdino,bartthedino,bartholew q,bart dino,bart q dino,bart the dino,bart,bartholew dino,dinosaur,jurassic,jurassic park,jurassic world,stegosaurus,trex,t-rex,lizard,giant lizard","#bartthedino",true],
        [["hidden/sadbuddy"],"Buddy,bud,dead,rip,chin,chinmaya,chin maya,maya,snake,duck,ducks,ducktales,walks like a duck,murder,evil,snakey,snakish,sad buddy,sad,kill,killed,giraffe,girafe,tall,clay,matthew,orsborn,osborn,matthew o,matthew orsborn,matthew osborn","RIP Buddy. Watch out Chin.<br><a href='https://bit.ly/asadbuddy'>bit.ly/asadbuddy</a>",true],
        [["hidden/jiddibabbu","hidden/meme"],"JiddiBabbu,ashar,ashar rahman,ramen,ramen noodles,ramen noodle,rahmen,from rice and rahmen,of rice and rahmen,of mice and rahman,of mice and rahmen,jiddi,babbu,ashar,scouting,qa,scouting and qa,dirty freshman,freshie,freshies,freshman,gopal,move to ny,new york,moved,moved to new york,big apple,to ny,moved to ny,not old york,quality assurance,scouting and quality assurance,quality assurance and scouting,qa and scouting","Take that Gopal",true]
    ],
}
