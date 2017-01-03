##You can find this live at tinyurl.com/ahsscheduler

#Scheduler
Scheduler for school. 
![Demo](https://github.com/liavt/Scheduler/blob/master/demos/DemoStudent.PNG)

#WHAT?
Yep, the school now runs this for 9th grade and 10th grade

#Can I fix it
Sure. Make a pull request. Make sure it works perfectly, as remember the school uses this. It must be reliable.
**Master branch should always be ready to be pushed to live. If you want to test something, create a new branch+pull request**

#How do I use it
You can use the API endpoint:
`https://script.google.com/a/macros/mypisd.net/s/AKfycbxu3RD39BI1mpo6iIW2JKsFoVUM47ZhSXMrIcEk55Z5/dev`
It accepts both POST and GET requests. You will need to send a couple of parameters:

| *Parameter* 	| *Content*                                                                                   	|
|-------------	|---------------------------------------------------------------------------------------------	|
| code        	| Google API token                                                                            	|
| grade       	| Grade level to search for. Valid values are 9 and 10.                                       	|
| day         	| Which day to look in. This is weekday not day of the month. 1 is Monday, 2 is Tuesday, etc. 	|

It will then return some JSON with all of the Schedule data. If you want JSONP to get around CORS, you can specify a callback parameter and a function name. It will then return JSONP instead.
