// -------------------------------------------------- The Models ---------------------------------------------------- //
// These are our models.  As you can see, they only contain the DAO.  No data is stored specifically here.  The DAO   //
// and in turn the database's schema describes our attributes.														  //
// ------------------------------------------------------------------------------------------------------------------ //
myApp.stuff = Backbone.Model.extend({
    dao: myApp.DAO
});

myApp.stuffCollection = Backbone.Collection.extend({
	model: myApp.stuff,
    dao: myApp.DAO
});

