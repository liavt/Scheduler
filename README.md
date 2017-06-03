## You can find this live [here](https://liavt.github.io/Scheduler)

# Scheduler
Scheduler for school. 
![Demo](https://github.com/liavt/Scheduler/blob/master/demos/DemoStudent.PNG)

# WHAT?
Yep, the school now runs this for 9th grade and 10th grade

# Can I fix it
Sure. Make a pull request. Make sure it works perfectly, as remember the school uses this. It must be reliable.
**Master branch should always be ready to be pushed to live. If you want to test something, create a new branch+pull request**

# How do I use it
You can use the API endpoint:
`https://script.google.com/macros/s/AKfycbyf4XMwLFWqDYH-jYfbS_jH-xlNm7eSyB0tWj0AidzD5wSB41gD/exec`

It accepts POST requests. You will need to send a couple of parameters:

| *Parameter* 	| *Content*                                                                                     	|
|-------------	|-----------------------------------------------------------------------------------------------	|
| code        	| Google API token                                                                              	|
| grade       	| Grade level to search for. Valid values are 9 and 10.                                       	  |
| day         	| Which day to get the schedule for. Day of the month. If not specified, the current day is used  |
| request       | What type of request you are doing.                                                             |

It will then return some JSON with all of the Schedule data. If you want JSONP to get around CORS, you can specify a callback parameter and a function name. It will then return JSONP instead.

There are different types of requests you can make which changes what data it is returning.

| *Request Type* 	| *Response*                    	|
|----------------	|-------------------------------	|
| schedule       	| Returns the person's schedule 	|
