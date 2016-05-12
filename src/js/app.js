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
(function(){

var PLNRAPP = function(){

		this.Config = {};
		this.APP= {
			baseDate : moment().startOf('day'),
			startDate: function(){
				return moment(this.baseDate).day('Sunday');
			},
			endDate : function(){
				return moment(this.baseDate).day('Saturday');
			},
			nextWeek : function(){
				this.baseDate = moment(this.baseDate).add(7,'days');
			},
			prevWeek : function(){
				this.baseDate = moment(this.baseDate).subtract(7,'days');
			},
			setBaseDate : function(dateString){
				this.baseDate = moment(dateString, "MM-DD-YYYY");
			},
			getBaseDate : function(){
				return this.baseDate;
			}
		};
		this.View = {};
		this.Model = {};
		this.Collection = {};
}

window.PLNR = new PLNRAPP();


}())


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
	className: 'date-selector__block',
	html: Utility.template('date-selector__block--template'),
	render: function(){
		this.$el.empty();
		this.$el.html(this.html({
			startDate: PLNR.APP.startDate().format('ddd, MMM D'),
			endDate: PLNR.APP.endDate().format('ddd, MMM D')
		}));
		return this
	},
	events : {
		'click a' : 'clicked'
	},
	clicked : function(e){
		e.preventDefault();
		console.log('it\'s been clicked');
		PLNR.APP.nextWeek();
	}
});

PLNR.View.DateSelectorHeader = Backbone.View.extend({
	tagName: 'header',
	className: 'header__block',
	html: $('#header__block--template').html(),
	events : {
		'click a' : 'btnclick'
	},
	render: function(){
		this.$el.html(this.html);
		this.$el.append(new PLNR.View.DateSelector().render().el);
		return this;
	}
});


PLNR.View.AppCalWeekView = Backbone.View.extend({
	className : 'app-cal-view__block',
	daysToDisplay : 7,
	html: Utility.template('app-cal-view__block-template'),
	render : function (){
		var block = this.$el.find('#app-week-view__block');
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

// App Calendar View
PLNR.View.AppView = Backbone.View.extend({
	collection: singleProjectCollection,
	// className : 'app-cal-view__block',
	render : function(){

		// Output the Header
		this.$el.html(new PLNR.View.DateSelectorHeader().render().el);

		// Output the App Calendar View
		this.$el.append(new PLNR.View.AppCalWeekView().render().el);

		// Output the Task on the board

		return this;
	},
	events : {
		'click a' : 'render'
	}
});


/**
 *
 * App init()
 *
 */

(function(){

	var APP = new PLNR.View.AppView();

	$('body').prepend(APP.render().el);

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