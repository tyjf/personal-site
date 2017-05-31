var views = {};

// simple view to render html file
// --------------------------------------------------
views.SimpleView = Backbone.View.extend({
	initialize: function(){
		this.$el.empty();
		this.$el.load(this.model.get("htmlFile"));
	}
});

// Gallery view to load a list of GalleryItems
// --------------------------------------------------
views.GalleryView = Backbone.View.extend({
	imageModel: null,
	initialize: function(){
		this.$el.empty();
		this.$el.load(this.model.get("htmlFile"), function(){
			// create models once the html is loaded, as otherwise the el for GalleryItems may not be there
			this.imageModel = new models.GalleryItems(null, {page_name: this.model.get("page_name")});
			_.bindAll(this, 'createGallery');
			this.createGallery();
		}.bind(this));
	},
	createGallery: function(){
		if(App.debug) {console.log("createGallery for "+ this.model.get("page_name"));}
		var p = this.imageModel.fetch({data: { page: 1 },processData: true});
		p.done(function(){
			var view = new views.GalleryItems({collection: this.imageModel, el: App.galleryViewEl}); 
			view.render();
		}.bind(this));
	}
});

// Gallery Items
// --------------------------------------------------
views.GalleryItems = Backbone.View.extend({
	collection: null,
	initialize: function(options) {
		this.collection = options.collection;		
		
		_.bindAll(this, 'render');
		this.collection.bind('reset', this.render);
		this.collection.bind('add', this.render);
		this.collection.bind('remove', this.render);
	},
	render: function() {
		var self = this;
		this.collection.forEach(function(item) {
			// handle item creation based on their type
			if(App.debug) {console.log("creating gallery items: type = "+ item.get("type"));}
			switch(item.get("type")){
				case "image":
					var galleryItemView = new views.GalleryItemImage({model: item}); 
					break;
				case "image-with-link":
					var galleryItemView = new views.GalleryItemImageLink({model: item}); 
					break;
				case "text":
					var galleryItemView = new views.GalleryItemText({model: item}); 
					break;
				default:
					console.log("unrecognised type: " + item.get("type"));
			}
			self.el.append(galleryItemView.el);
		});
		$("#container").delay(2000).animate({"opacity": "1"}, 700);
		return this;
	}
});
// Gallery Item will then create GalleryItem - base class
// child classes inherit from this and implement the underscore template
//-------------------------------------------
views.GalleryItem = Backbone.View.extend({
	initialize: function(options) {
		_.bindAll(this, 'render');
		this.model.bind('change', this.render);
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.attributes)); 
	}
});

/* Basic image */
views.GalleryItemImage = views.GalleryItem.extend({
	className: "image",
	template: _.template('<img src="<%=url%>">')
});

/* Image with a href link */
views.GalleryItemImageLink = views.GalleryItem.extend({
	className: "image",
	template: _.template('<a href="<%=link%>"><img src="<%=url%>" class="center"></a><figcaption class="caption-text"><%=text%><figcaption>')
});

/* Text with header */
views.GalleryItemText = views.GalleryItem.extend({
	className: "gallery-text",
	template: _.template('<h3><%=title%></h3><p><%=paragraph%></p>')
});

