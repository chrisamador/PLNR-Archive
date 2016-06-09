/**
 *
 * Table of contents
 *
 *
 *
 */

var APP = {
	Model: {},
	Collection: {},
	View: {}
}


// Contact list ul li


// Models

APP.Model.contact = Backbone.Model.extend({
	defaults : {
		name: '',
		phoneNumber: ''
	}
});


// Collection
APP.Collection.contacts = Backbone.Collection.extend({
	model: APP.Model.contact,
	howManyLeft: function () {
		return this.length;
	}
})

// View
APP.View.form = Backbone.View.extend({
	el: $("#test"),
	html: $('#form').html(),
	render: function(){
		this.$el.html(this.html);
		return this;
	}
})

