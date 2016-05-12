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
var PLNRAPP = function(){

	var today = moment();

	this.startDate = today.day('Sunday');
	this.endDate = today.day('Saturday');

	this.nextWeek = function(){
		console.log('its next week yo');
	};
	this.prevWeek = function(){
		console.log('its last week yo');
	};

	return {
		Config : {
			today : today
		},
		WeekInView: {
			mStartDate: this.startDate,
			mEndDate : this.endDate,
			nextWeek : this.nextWeek,
			prevWeek : this.prevWeek,
		},
		View : {},
		Model : {},
		Collection : {},
	}
}

var PLNR = new PLNRAPP();



/**
 *
 * Utilities
 *
 */

var Utility = {}

Utility.template = function(id){
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
PLNR.View.DateSelector = Backbone.View.extend({
	html: Utility.template('date-selector__template'),
	render: function(){
		this.$el.empty();
		this.$el.html(this.html({
			startDate: PLNR.WeekInView.mStartDate.format('dddd, MMMM Do YYYY'),
			endDate: PLNR.WeekInView.mEndDate.format('dddd, MMMM Do YYYY')
		}));
		return this
	},
	events : {
		'click a' : 'clicked'
	},
	clicked : function(e){
		e.preventDefault();
		console.log('it\'s been clicked');
		PLNR.WeekInView.nextWeek();
	}
});

PLNR.View.DateSelectorHeader = Backbone.View.extend({
	tagName: 'header',
	className: 'date-selector__block',
	html: $('#date-selector-header__template').html(),
	events : {
		'click a' : 'btnclick'
	},
	render: function(){
		this.$el.html(this.html);
		this.$el.prepend(new PLNR.View.DateSelector().render().el);
		return this;
	}
});


// App Calendar View
PLNR.View.AppCalView = Backbone.View.extend({
	tagName: 'ul',
	daysToDisplay : 7,
	html : '',
	render : function (){
		// Output the day-titles

		// Output view-hours

		// Output the weekview
		var daysToDisplay = this.daysToDisplay;
		while(daysToDisplay){
			console.log('print day');
			daysToDisplay--;
		}
		return this;
	}
})

PLNR.View.MainView = Backbone.View.extend({
	tagName : 'main',
	className : 'app-cal-view__block',
	render : function(){
		// Output the Date Header
		var dateSelectorHeader = new PLNR.View.DateSelectorHeader();
		this.$el.html(dateSelectorHeader.render().el);

		// Output the App Calendar View
		var weekView = new PLNR.View.AppCalView();
		this.$el.append(weekView.render().el);

		// Output the Task on the board
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

(function(){

	var PLNRInit = new PLNR.View.MainView();

	$('#app-cal-view__block').html(PLNRInit.render().el)

}());




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