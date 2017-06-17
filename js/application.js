
var ApplicationRouter = Backbone.Router.extend({

	//map url routes to contained methods
	routes: {
		""			: "home",
		"home"		: "home",
		"page/:pagename" 	: "loadPage",
		"gallery/:pagename" : "loadGallery"
	},
	formatLink(pagename){
		$("#navbar a").removeClass("link-active");
		$(".navbar-brand").removeClass("link-active"); // remove class on title explicitly
		$("#" + pagename).addClass("link-active");
	},
	// route /home 
	home: function() {
		if(App.debug) {console.log("route home");}
		var model = new models.SimplePage({page_name: "homepage", htmlFile: "./pages/homepage.html"});
		var view = new views.SimpleView({model: model, el: $(App.containerEl)});
		this.formatLink("home");
	},
	
	// route /gallery/:pagename
	loadGallery : function(pagename){
		if(App.debug) {console.log("router - loadGallery " + pagename);}
		var galleryModel = new models.Gallery({page_name: pagename, htmlFile: "./pages/gallery.html"});
		var galleryView = new views.GalleryView({model: galleryModel, el: $(App.containerEl)});
		this.formatLink(pagename);
	},
	// route /page/:pagename
	loadPage: function(pagename){
		if(App.debug) {console.log("route - page "+ pagename);}
		var simplePageModel = new models.SimplePage({htmlFile: "./pages/"+pagename+".html"});
		var simpleView = new views.SimpleView({ model:simplePageModel, el: $(App.containerEl)});
		this.formatLink(pagename);
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
var NavHeaderView = Backbone.View.extend({
	initialize: function(){ 
		_.bindAll(this, 'render');
		this.render();
	},
	render: function() {
		var self = this;
		$.getJSON(App.configFile, function(data){
			$(self.el).append(data.title);
		});
	}
});

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
	template: _.template('<a id=<%=page_name%> ><%=page_display_name%></a>'),
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
		// create header
		new NavHeaderView({el: App.navbarHeader});
		// create items in the nav bar
		this.collection.forEach(function(item) {
			var navItem = new NavItemView( {model: item} );
			if(item.get("position") == "left"){
				$(App.navItemsLeft).append(navItem.el);
			} else {
				$(App.navItemsRight).append(navItem.el);
			}
		});
		return this;
	}
});

// TO DO:
// nav link highlight - sometimes doesnt work on homepage click 
// sizing of d3 on homepage
// nav items wrap
// delay in retrieving url image

// define navigation items
// ----------------------------------------------
window.App = {
	debug			: false,
	containerEl		: "#container",
	navbarHeader	: ".navbar-brand", 
	navItemsLeft	: "#navbar-left",
	navItemsRight	: "#navbar-right",
	galleryViewEl	: ".gallery-items-container",
	configFile		: './config.json',
	nav : function(){
		$.getJSON(App.configFile, function(data){
			var collection = new NavCollection(data.navigation);
			new NavView({collection:collection});
		});
	}
};

$(document).ready(function() {
	App.nav();
});
