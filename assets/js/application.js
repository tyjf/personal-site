
var ApplicationRouter = Backbone.Router.extend({

	//map url routes to contained methods
	routes: {
		""			: "home",
		"home"		: "home",
		"page/:pagename" 	: "loadPage",
		"gallery/:pagename" : "loadGallery"
	},
	
	// route /home 
	home: function() {
		if(App.debug) {console.log("route home");}
		var galleryModel = new models.Gallery({page_name: "homepage", htmlFile: "./homepage.html"});
		var galleryView = new views.GalleryView({model: galleryModel, el: $(App.containerEl)});
	},
	
	// route /gallery/:pagename
	loadGallery : function(pagename){
		if(App.debug) {console.log("router - loadGallery " + pagename);}
		var galleryModel = new models.Gallery({page_name: pagename, htmlFile: "./gallery.html"});
		var galleryView = new views.GalleryView({model: galleryModel, el: $(App.containerEl)});
	},
	
	loadPage: function(pagename){
		if(App.debug) {console.log("route - page "+ pagename);}
		var simplePageModel = new models.SimplePage({htmlFile: "./"+pagename+".html"});
		var simpleView = new views.SimpleView({ model:simplePageModel, el: $(App.containerEl)});
	}
});

// Navigation model
// -----------------------------------------
var NavModel = Backbone.Model.extend({
});

var NavCollection = Backbone.Collection.extend({
	model: NavModel
});

// navigation view
//------------------------------------------------------
var NavItemView = Backbone.View.extend({
	tagName: 'li',
	events: {
		'click': 'itemClick'
	},
	initialize: function(){
        this.router = new ApplicationRouter();
		_.bindAll(this, 'render');
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes)); 
	},
	template: _.template('<a><%=page_display_name%></a>'),
	itemClick: function(e){	
		// route to the correct view
		var route = this.model.get("page_type") + "/" + this.model.get("page_name");
        this.router.navigate(route, true);
	}
});

var NavView = Backbone.View.extend({
	collection: null,
	initialize: function(options){
		_.bindAll(this, 'render');
		this.render();
		
		// handle soft reload of pages
		if (Backbone.history.fragment == undefined) {
			Backbone.history.start(); //{pushState : true}
		} else {
			Backbone.history.loadUrl(Backbone.history.fragment);
		}
	},
	render: function(){
		var self = this;
		this.collection.forEach(function(item) {
			var navItem = new NavItemView( {model: item} );
			self.el.append(navItem.el);
		});
		return this;
	}
});

// TO DO:
// page transition
// nav bar collapse

// define navigation items
// ----------------------------------------------
window.App = {
	debug			: false,
	containerEl		: "#container",
	navViewEl		: ".navbar-items",
	galleryViewEl	: ".gallery-items-container",
	configFile		: './config.json',
	nav : function(){
		$.getJSON(App.configFile, function(data){
			var collection = new NavCollection(data.navigation);
			new NavView({collection:collection, el:$(App.navViewEl)});
		});
	}
};

$(document).ready(function() {
	App.nav();
});
