##You can find this live at tinyurl.com/ahsscheduler

# Scheduler
Scheduler for school. 

#WHAT?
Yep, the school now runs this.

#Can I fix it
Sure. Make a pull request. Make sure it works perfectly, as remember the school uses this. It must be reliable.
**Master branch should always be ready to be pushed to live. If you want to test something, create a new branch+pull request**

#How does it work?
doGet(e) in Code.gs is what gets called when the site is open. Using HTTP GET queries (the parameters in the url,) the scripts decides what HTML to display. It calls various other files

#How are you running functions inline from the HTML without JQuery or script tags?
Google scripts has a feature, like JQuery, where you can run functions from javascript, and have it return HTML. It called scriptlets. It's quite nice. It is denoted by the <?!= ?> tags.

#Can I add a feature that everyone will get?
If it's good enough, I will add it to main branch, and add it to the live.
