#The Backbone Scaffold#

##Introduction##
This is as simple javascript web application (prepped for mobile) using the JQuery mobile for GUI, Backbone.js for MVC framework, Underscore.js for templating and Persistence for offline storage.  All libraries are included in the lib folder.  The tpl folder contains templates.  

##The Mission##
I wanted to develop a mobile web application.  Most web applications use a php or java backend.  However, for mobile applications, the device often has spotty internet connection or needs to go offline (i.e. traveling on an airplane).  So I wanted to create an application that could store information locally at first.  For this case, I use Persistence.

I also wanted to create a mobile web application that used as much non-native code as possible because I also wanted the user to be able to access the application on a traditional browser when they are not on mobile.  I wanted the experience to be relatively consistent.  This is also nice because I could do extensive development in the browser until the later stages when I deep dive in iOS and Android to use features like Geolocation and the camera.

Warning: Because I used WebSQL, this application works on Chrome, Safari and FireFox.  Internet Explorer does not support WebSQL.  I think they plan to support IndexedDB.


##What actually happened##
So the backbone-scaffold represents a way to work with a technology stack of JQM, Backbone and Persistence for building a mobile web app.  

At the foundation is WebSQL.  I used persistence.js as a library to access it. I found it relatively easy to use.  The basic docs are http://persistencjs.org.  You can also follow Zef Hemel's blog at 
http://zef.me/.

JQM (http://jquerymobile.com/) was relatively easy to pick-up for me because I pretty much spend most of my days handing coding html/css templates.  The styling for JQM leaves a lot of room for you to really put your personal mark on it.  I didn't do that in this application but I did use the themeroller (http://jquerymobile.com/themeroller/) to add a little bit of flair.  

Using Backbone.js (http://backbonejs.org/) helped me stick to MVC framework.  There is a popular tutorial called todo.js (http://documentcloud.github.com/backbone/docs/todos.html) that helps you get started.  However, if you really want to use backbone.js is a signficant way, I suggest reading Christophe Coenraets' blog which you can find here http://coenraets.org/blog/.  He discusses many of the finer point of web application development with Backbone as well a mobile app development.  

Out of the box, Backbone allows you to sync with a server.  You can just give it the model's url and additionally the urlRoot.  However, since I wanted to save data locally, I was going to need to override the Backbone.sync method and reroute and handle all CRUD (create, read, update and delete) requests myself.  My implementation can be found in main.js. Chris Coenraets gave me some seriously good pointers along with taking over router handling from JQM.  

JQM does some of its own routing too since it isn't just a GUI toolkit like Twitter Bootstrap (I am playing with the idea of using bootstrap is a different app with backbone). I wanted Backbone to handle this. So I needed to configure JQM so that you are doing the routing yourself.  Then I need to handle it in my extended version of Backbone.Router which you can also find in main.js.

So that's the big picture.  I commented the code extensively for me and you.  So have fun.  


