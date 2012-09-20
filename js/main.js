
// Creating the application namespace
var myApp = {
    models: {},
    views: {},
    utils: {},
    dao: {}
};

Backbone.View.prototype.close = function () {
    if (this.beforeClose) {
        this.beforeClose();
    }

    this.remove();
    this.unbind();
    
    console.log('View undelegateEvents');
    this.undelegateEvents();
};

// -------------------------------------------------- The Data Access Object (DAO) ---------------------------------------------------- //
// This class the passed constructor function to access the Stuff DB via the 
// persistence API specifically it access the stuffnotes table.
// The Backbone.sync calls this object to create, read, update and delete models  
myApp.DAO = function (db) {
    this.db = db;
};

_.extend(myApp.DAO.prototype, {

    findAll:function (callback) {
         console.log("made it to find all");

		var stuffs = [];
		this.db.all().order("name", true).list(null, function(results){	
			var len = results.length;					
            for (var i = 0; i < len; i++) {
				stuffs[i] = results[i];
			}
			callback(stuffs);
			
		});	
    },
	
    findById: function(id, callback) {
    	console.log("getting a model information by the id passed");
		if (id != 0) 
		{
			this.db.load(id, callback(results));
		} else {
		  	alert("Transaction Error: " + error);
        }
    },
	
    create:function (model, callback) {
		console.log("dao create model");
		
		var stuffNotes = new this.db(model.toJSON());			
		persistence.add(stuffNotes);
				
		persistence.flush();
		
		callback(model);
    },
	
    update:function (model, callback) {
		console.log("dao update model");
		var id = model.id;
		this.db.load(id, function(results)
					{	
						results.name = model.get('name');
						results.description = model.get('description');
						persistence.add(results);
					});
									
		persistence.flush();
		
		callback(model);
    },
	
	delete:function (model, callback)
	{
		console.log("dao delete model");
		var id = model.id;
		this.db.load(id, function(results)
				{	
					persistence.remove(results);
					persistence.flush();
                });
		callback();

	}
	
    //  Populate table with sample data for testing a debugging purposes only
    //populate:function (callback) {
    //     callback();
         
    //}
         

});


// -------------------------------------------------- The Models ---------------------------------------------------- //

myApp.stuff = Backbone.Model.extend({
    dao: myApp.DAO
});

myApp.stuffCollection = Backbone.Collection.extend({
	model: myApp.stuff,
    dao: myApp.DAO
});


// -------------------------------------------------- The Views ---------------------------------------------------- //

myApp.StuffAddView = Backbone.View.extend({
	
	renderedOnce: false,
                                            
    initialize: function() {
			var tpl = myApp.templateLoader;
			this.template = _.template(tpl.get('stuff-add'));
			this.model.bind("change", this.render, this);
    },
                                            
    render: function(eventName) {
			console.log('AddView render');
			if(this.renderedOnce == false) {
				$(this.el).html(this.template(this.model.toJSON()));
				this.renderedOnce=true;
			}
			return this;
    },  
	
    events: {
        "change"        : "change",
        "click .save"   : "save",
    },

    change: function (event) {
        // Remove any existing alert message
       console.log("view change event");

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },
	
    save: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
				console.log("view called model save");
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    }	                                          
});

myApp.StuffListView = Backbone.View.extend({

    initialize: function() {
        var tpl = myApp.templateLoader;
        this.template = _.template(tpl.get('stuff-list'));
        this.model.bind("reset", this.render, this);
    },

    render: function(eventName) {
    
    	//to render this page, we only have the html for the outer shell formatting
    	//like the header and the ul. To render each individual model in the collection
    	//we iterate through the collection and create a new StuffListItemView that will
    	//render the name and description of each model
        console.log('list render');
        $(this.el).html(this.template());
        var ul = $('ul', $(this.el));
        console.log(ul);
		_.each(this.model.models, function(stuff) {
           ul.append(new myApp.StuffListItemView({model: stuff}).render().el);
		}, this);
		return this;
    }
});

myApp.StuffListItemView = Backbone.View.extend({

	tagName: "li",

    initialize: function() {
        var tpl = myApp.templateLoader;
        this.template = _.template(tpl.get('stuff-list-item'));
		this.model.bind("change", this.render, this);
		this.model.bind("destroy", this.close, this);
    },

    render: function(eventName) {
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
    }

});

myApp.StuffView = Backbone.View.extend({

    initialize: function() {
        var tpl = myApp.templateLoader;
        this.template = _.template(tpl.get('stuff-details'));
		this.model.bind("change", this.render, this);
    },

    render: function(eventName) {
        console.log('render');
		$(this.el).html(this.template(this.model.toJSON()));
		return this;
    },

    events: {
        "click .delete"   : "delete"
    },

    delete: function () {
        var self = this;
        this.model.destroy({
            success: function () {
                alert('coffee deleted successfully');
                //window.history.back();
            }
        });
        return false;
    }	                                          


});


myApp.StuffEditView = Backbone.View.extend({
	renderedOnce: false,

    initialize: function() {
        var tpl = myApp.templateLoader;
        this.template = _.template(tpl.get('stuff-edit'));
		this.model.bind("change", this.render, this);
    },

    render: function(eventName) {
        console.log('render');
			if(this.renderedOnce == false) {
				$(this.el).html(this.template(this.model.toJSON()));
				this.renderedOnce=true;
			}
			return this;
    },

    events: {
        "change"        : "change",
        "click .commit"   : "commit"
    },

    change: function (event) {
        // Remove any existing alert message
       console.log("view change event");

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);
    },
	
    commit: function () {
        var self = this;
        this.model.save(null, {
            success: function (model) {
				console.log("view called model save");
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });

    }	                                          


});


// ----------------------------------------------- The Application Router ------------------------------------------ //

myApp.Router = Backbone.Router.extend({

    routes:{
        "":"list",
        "browse":"list",		
        "add":"addStuff",
        "stuff/:id/edit":"editStuff",
        "stuff/:id":"stuffDetails"

    },

    initialize:function () {
        this.firstPage = true;
    },

    list:function () {
        console.log("route: list ");
        var self = this;
        this.before(function () {
           console.log("made it through the before callback");
           self.changePage(new myApp.StuffListView({model:self.stuffList}));
        });
    },
    
    addStuff:function () {
        console.log('Router add');
        var self = this;
        var stuff = new myApp.stuff();
                                        
        self.changePage(new myApp.StuffAddView({model:stuff}));
    
    },
	
    stuffDetails:function (id) {
        console.log('Router details');
        var self = this;
		
        var stuff = self.stuffList.get(id);
        self.changePage(new myApp.StuffView({model:stuff}));
    },
	
    editStuff:function (id) {
        console.log('Router edit details');
        var self = this;
		
        var stuff = self.stuffList.get(id);
        self.changePage(new myApp.StuffEditView({model:stuff}));
    },

    before:function (callback) {
        console.log("getting the stuff list");
        
        if (!this.stuffList) {
            console.log("making a new stuff list");
            this.stuffList = new myApp.stuffCollection();
        }
        
        //getting the data so its up to date!
        this.stuffList.fetch({success:function () {
            callback();
            }});
                                          
    },
    changePage:function (page) {
    	//In the jqm-config.js, we took over the routing and transitions of pages from jquery mobile
    	//using backbone instead. so this function plays the role of changing pages.
    	//the page passed has your basic html but does not have the data-role and data-theme attributes
    	//that are required jquery mobile to render the page.  
    	//So first we attach those attributes
        $(page.el).attr('data-role', 'page');
        $(page.el).attr('data-theme', 'b');
       	
       	//with the correct jquery mobile attributes set, we can render the page
       	page.render();
       	
       	//now we attach it to the body tag of the DOM
        $('body').append($(page.el));
        
        //Our default transition is slide
        var transition = 'slide';
        
        //However, we don't want to slide the first page. 
        //we want it to fade.
        if (this.firstPage) {
            transition = 'fade';
            this.firstPage = false;
        }
        
        //now we are ready to change the page
        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
    }

});


// ----------------------------------------------- Bootstrap App ------------------------------------------ //

$(document).ready(function() {
	$.ajaxSetup({ cache: false });
    var self = this;
    console.log('open database');

	//creating stuffDB database using the persistence websql api
	if (window.openDatabase) {
		persistence.store.websql.config(persistence, 'stuffDB', 'stuff database', 2 * 1024 * 1024);
	}
	else {
		persistence.store.memory.config(persistence);
	}
	
	//the persistence.define function lets you define a schema for your table
	//it returns a constructor functions that allows you to access, insert, update and delete
	//record in this table	
	var stuffnotes = persistence.define('stuffnote', {
														name: "TEXT",
														description: "TEXT"
										});
		
	//Setting this to the window.db so we can access it later	
	myApp.db = stuffnotes;
	
	//this sync with the database the schema we just defined			
	persistence.schemaSync();		
   	console.log('database sync');
	
	//we use the template loader to load our template and
	//set a callback that starts our backbone router and history
	myApp.templateLoader.load(['stuff-list', 'stuff-details', 'stuff-list-item', 'stuff-add', 'stuff-edit'], function () {
                            self.app = new myApp.Router();
                            Backbone.history.start();
                    });
});   

//we are overriding the Backbone.sync function 
//to create, read, update and delete our data via
//our local db
Backbone.sync = function (method, model, options) {

	//making out DAO object by passing the stuff notes constructor create in window.startApp
	//this will give us access to all the major functions needed to CRUD
    var dao = new myApp.DAO(myApp.db);

    switch (method) {
        case "read":
            console.log("sync read")
           if (model.id) {
				console.log("reading a single mode using the passed id");
				dao.findById(model.id, function(data) {
					options.success(data);
				});
			} else {
         		console.log("fetching our list of stuff");
                dao.findAll(function (data) {
                    options.success(data);
                });
			}
			
            break;
        case "create":
            console.log("sync create");
            dao.create(model, function (data) {
                options.success(data);
            });
            break;
        case "update":
            console.log("sync update");
            dao.update(model, function (data) {
                options.success(data);
            });
            break;
        case "delete":
            console.log("sync delete");
             dao.delete(model, function () {
                options.success();
            });
           break;
    }
};

