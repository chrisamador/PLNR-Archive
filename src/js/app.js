/**
 *
 * Table of contents
 *
 *  	App Setup
 *  	Models
 * 	Collections
 * 	Views
 *		App init()
 *
 *
 */

/**
 *
 * App Setup
 *
 */

// Namespace
var PLNR = {
	View : {},
	Model : {},
	Collection : {},
	Utility : {},
}


/**
 *
 * Utilities
 *
 */

PLNR.Utility.template = function(id){
	return _.template($('#'+id).html());
}


/**
 *
 * Model
 *
 */

PLNR.Model.SingleTask = Backbone.Model.extend({
	defaults : {
		name : 'No Name',
		age : 'No Age'
	}
});

/**
 *
 * Collections
 *
 */

// Collection that will become a Project
PLNR.Collection.SingleProjectColl = Backbone.Collection.extend({
		model : PLNR.Model.SingleTask
});

var singleProjectCollection = new PLNR.Collection.SingleProjectColl([
	{
		name : 'chris',
		email : 'chris@email.com'
	},
	{
		name : 'john',
		email : 'johnwithah@email.com'
	}
]);

/**
 *
 * Views
 *
 */

// Header
PLNR.View.DateHeader = Backbone.View.extend({
	tagName: 'header',
	html: PLNR.Utility.template('header__block'),
	render: function(){
		this.$el.html(this.html());
		return this;
	}

});

// Week View
PLNR.View.WeekView = Backbone.View.extend({
	tagName: 'ul',
	daysInView : 7,
	render : function (){
		var daysInView = this.daysInView;
		while(daysInView){
			console.log('print day');
			daysInView--;
		}
		return this;
	}
})

PLNR.View.MainView = Backbone.View.extend({
	tagName : 'main',
	id : 'week-cal',
	className : 'app-cal-view__block',
	render : function(){
		// Output the Date Header
		var dateHeader = new PLNR.View.DateHeader();
		this.$el.html(dateHeader.render().el);

		// Output the Week View
		var weekView = new PLNR.View.WeekView();
		this.$el.append(weekView.render().el);

		return this;
	}
});

PLNR.View.WeekCalSingleHour = Backbone.View.extend({
	tagName : 'li',

	className : 'single-day__hour',
	render : function(){

		this.$el.html(this.html);
		return this;
	}
});


/**
 *
 * App init()
 *
 */

var PLNRInit = new PLNR.View.MainView();

$('#PLNR-APP').html(PLNRInit.render().el)

/**
 *
 * Form functions
 *
 */

$('.wt-times__select').selectmenu({
	position: { my : "top+15", at: "center center" }
});

$('#task-name').selectmenu();


$(".datepicker").datepicker({
  buttonImage: '/img/icon/icon-more-options.svg',
  buttonImageOnly: true,
  showOn: 'both',
  onSelect : function(dateText, inst){
  		console.log(dateText);
  		console.log(this);
  }
});

$('.wt-dates__link').on('click',function(){
	$(this).find('.datepicker').datepicker('show');
})

$('.module-wt__block').draggable({ handle: ".wt-header__module-title" });