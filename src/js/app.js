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

Utility.amountOfDays = function(start, end){
	return Math.floor(moment.duration(start - end).asDays() + 1)
}

Utility.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$.fn.extend({
    animateCss: function (animationName) {
        $(this).addClass('animated ' + animationName).one(Utility.animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

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

// Date Selector
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
// Header
PLNR.View.DateSelectorHeader = Backbone.View.extend({
	tagName: 'header',
	className: 'header__block',
	render: function(){
		this.$el.html($('#header__block--template').html());
		this.$el.append(new PLNR.View.DateSelector().render().el);
		return this;
	}
});

// Form

PLNR.View.NewProjectForm = Backbone.View.extend({
	html: Utility.template('module-new-project__block--template'),
	tagName: 'form',
	id: 'module-new-project',
	className: 'module-new-project__block',
	events: {
		'click .mnp-header__closebtn': 'closebtn'
	},
	initialize: function(attr){
		this.config = attr;
	},
	render: function(){


		this.$el.html(this.html());
		this.$el.css({
			top: '35%',
			left: '35%',
			position: 'fixed'
		});
		this.$el.animateCss('bounceInDown');

		this.$el.find('.mnp-times__select').selectmenu({
			position: { my : "top+15", at: "center center" }
		});

		this.$el.find('#task-name').selectmenu();

		this.$el.find(".datepicker").datepicker({
		  buttonImage: '/img/icon/icon-more-options.svg',
		  buttonImageOnly: true,
		  showOn: 'both',
		  onSelect : function(dateText, inst){
		  		console.log(dateText);
		  		console.log(this);
		  }
		});

		this.$el.find('.mnp-dates__link').on('click',function(){
			$(this).find('.datepicker').datepicker('show');
		})

		this.$el.draggable({ handle: ".mnp-header__module-title" });

		return this;
	},
	closebtn: function(e){
		e.preventDefault();
		this.removeModule();
	},
	removeModule: function(){
		var that = this;

		this.$el.one(Utility.animationEnd, function(){
			that.$el.remove();
		});
		this.$el.animateCss('zoomOut');

	}
})

// Week View
PLNR.View.WeekView = Backbone.View.extend({
	tagName: 'ul',
	html: '',
	initialize: function(attr){
		this.config = attr;
	},
	events: {
		'click .single-day__hour' : 'onHourClick'
	},
	className: 'week-view__block',
	render: function(){


		var html = [];

		// create days
		for(var d = 0; d < this.config.amountOfDays; d++){
			var m = this.config.startDate,
				dataDay = moment(m).add(d ,'days').format('M-D-YYYY');

			var day = ['<li class="week-view__day"><ul class="single-day__block"  data-day="'+ dataDay +'">'];

			// create hours
			for(var h = 0; h < this.config.amountOfHours; h++){

				var hour,
					hourClasses = '',
					dataHour = h;

					if(d == 0 && h == 0) hourClasses += '  __top-left';
					if(d == this.config.amountOfDays - 1 && h == 0) hourClasses += '  __top-right';
					if(d == 0 && h == this.config.amountOfHours - 1) hourClasses += '  __bottom-left';
					if(d == this.config.amountOfDays - 1 && h == this.config.amountOfHours - 1) hourClasses += '  __bottom-right';

				hour = '<li class="single-day__hour'+ hourClasses +'" data-hour="'+ dataHour +'"></li>';

				day.push(hour);

			}
			day.push('</ul></li>')
			html.push(day.join(' '));
		}

		this.$el.html(html);

		return this;
	},
	onHourClick : function(e){
		console.log($(e.target));
		$('#module-new-project').remove();
		$('#PLNR').append(new PLNR.View.NewProjectForm().render().el);
	}

})

PLNR.View.WeekDayTitles = Backbone.View.extend({
	tagName: 'ul',
	className: 'week-day-titles__block',
	initialize: function(attr){
		this.config = attr;
	},
	// html: _.template('<li class="week-day-titles__day <%= class.join(" ") %> "><h5 class="week-day-titles__heading"><%= title %</h5></li>'),
	render: function(){
		var html = [];

		for(var d = 0; d < this.config.amountOfDays; d++){
			var m = this.config.startDate,
				title = moment(m).add(d ,'days').format('ddd');

			html.push('<li class="week-day-titles__day"><h5 class="week-day-titles__heading">'+ title +'</h5></li>');
		}

		this.$el.html(html.join(' '));

		return this;
	}
})

PLNR.View.AppCalWeekView = Backbone.View.extend({
	className : 'cal-view__block',
	daysToDisplay : 7,
	tagName: 'main',
	html: Utility.template('app-cal-view__block--template'),
	initialize : function(attr){
		var defaults = {
			amountOfDays : 7,
			amountOfHours : 24,
			startDate : PLNR.APP.startDate(),
			endDate: PLNR.APP.endDate()
		};

		this.config = _.extend(defaults,attr);

	},
	render : function (){
		var dayTitles = new PLNR.View.WeekDayTitles(this.config),
			weekView = new PLNR.View.WeekView(this.config);

		// Setup the base markup
		this.$el.html(this.html());

		// Output the day-titles
		this.$el.find('.app-week-view__day-titles')
			.html(dayTitles.render().el);

		// Output view-hours
		this.$el.find('.app-week-view__view-hours').html(function(hours){
			var html = ['<ul class="view-hours__block">'];

			for(var i = 0; i < hours; i++){
				html.push(function(i){
					var time, suffix;
					if(i === 0 || i === 12){
						time = '12';
						suffix = (i == 0) ? ' AM' : ' PM'
					}else if(i > 12){
						time = i - 12;
						suffix = ' PM';
					}else{
						time = i;
						suffix = ' AM';
					}
					return '<li class="view-hours__hour">'+ time + suffix +'</li>';
				}(i));
			}

			html.push('</ul>');
			return html.join('');
		}(this.config.amountOfHours));

		// Output the weekview
		this.$el.find('.app-week-view__week-view')
			.html(weekView.render().el);

		return this;
	}
})

// App Calendar View
PLNR.View.AppView = Backbone.View.extend({
	collection: singleProjectCollection,
	id: 'PLNR',
	render : function(){

		// Output the Header
		this.$el.html(new PLNR.View.DateSelectorHeader().render().el);

		// Output the App Calendar View
		this.$el.append(new PLNR.View.AppCalWeekView().render().el);

		// Output the Task on the board

		return this;
	}
});


/**
 *
 * App init()
 *
 */

(function(){

	var APP = new PLNR.View.AppView();

	$('#loading').after(APP.render().el);

}());




/**
 *
 * Form functions
 *
 */

