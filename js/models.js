var models = {};

// Simple page model
// -----------------------------------------
models.SimplePage= Backbone.Model.extend({
});

// gallery model
// -----------------------------------------
models.Gallery= Backbone.Model.extend({
});

// Images model
// -----------------------------------------
models.GalleryItem= Backbone.Model.extend({

});

models.GalleryItems= Backbone.Collection.extend({
	model: models.GalleryItem,
	initialize: function (models, options){
		this.page_name = options.page_name;
	},
	url: App.configFile,
	parse: function(response) {
		return response.pages[this.page_name];
	}
});

