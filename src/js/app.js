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
		this.Projects = {};
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

Utility.toStdTime = function(h, m){

		var hour,mins = '', suffix;
		if(h === 0 || h === 12){
			hour = '12';
			suffix = (h == 0) ? ' AM' : ' PM'
		}else if(h > 12){
			hour = h - 12;
			suffix = ' PM';
		}else{
			hour = h;
			suffix = ' AM';
		}

		if(m == true) mins = ':00';

	return hour + mins + ' ' + suffix;
}

Utility.selectTimeOutput = function(hour){
	var o = [],
		 hr = (parseInt(hour) === 0 ? parseInt(hour) : parseInt(hour) - 1), // 0 - 1 == -1
		 suffix;
		 min = [':00',':15',':30',':45'];

	for(var i = 0; i < 24; i++){
		var stdHour = (hr + i > 11 ? hr + i - 12 : hr + i);
			stdHour = (stdHour == 0 ? 12 : stdHour);
		suffix = (hr + i > 11 ? ' PM' : ' AM' );

		for(var j = 0; j < min.length; j++){
			if(stdHour <= 12 && !(stdHour > 11 && suffix == ' PM') ) o.push( stdHour + min[j] + suffix);
		}
	}

	return o;

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

PLNR.Model.SingleProject = Backbone.Model.extend({
	initialize: function(){
		// Sets up the collection for the model
		this.tasks = new PLNR.Collection.SingleProjectColl();
	},
	defaults : {
		title : 'Required: a string title',
		durationTotal: 0
	},
	validate : function(){
		console.log('validated');
	},
	durationThisWeek : function(){
			this.tasks.pluck('durationInMins')
	}
});

PLNR.Model.SingleTask = Backbone.Model.extend({
	initialize: function(){
		this.setDurationInMins();
	},
	defaults : {
		// Required: a moment object
		startDate: '',
		// Required: a moment object
		endDate: '',
		// Assigned by the setDurationInMins functions
		durationInMins: 0,
		// Optional: a string
		taskNote: ''
	},
	setDurationInMins: function(){
		this.set('durationInMins', 300);
	},
	validate: function(){
		console.log('validate single task')
	}
});

/**
 *
 * Collections
 *
 */

// The full collection holder
PLNR.Collection.Projects = Backbone.Collection.extend({
		model : PLNR.Model.SingleProject,
		localStorage: new Backbone.LocalStorage("PLNRCOL"),
})

// Collection that will become a Project
PLNR.Collection.SingleProjectColl = Backbone.Collection.extend({
		model : PLNR.Model.SingleTask
});

/**
 *
 * PLNR Projects
 *
 */


PLNR.Projects = new PLNR.Collection.Projects([
	{
		title : 'Gene Website',
	},
	{
		title : 'Workout',
	},
	{
		title : 'Family Stuff',
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
	tagName: 'div',
	className: 'module-new-project__wrapper',
	events: {
		'click .mnp-header__closebtn': 'closebtn'
	},
	initialize: function(attr){
		this.config = attr;
	},
	render: function(){
		var module;

		this.$el.html(this.html(this.config));

		module = this.$el.find('#module-new-project');



		module.find('.mnp-times__select').selectmenu({
			position: { my : "top+15", at: "center center" }
		});

		module.find('#task-name').selectmenu();

		module.find(".datepicker").datepicker({
		  buttonImage: '/img/icon/icon-more-options.svg',
		  buttonImageOnly: true,
		  showOn: 'both',
		  onSelect : function(dateText, inst){
		  		console.log(dateText);
		  		console.log(this);
		  }
		});

		module.find('.mnp-dates__link').on('click',function(){
			$(this).find('.datepicker').datepicker('show');
		})

		module.draggable({ handle: ".mnp-header__module-title" });

		console.log(module.outerHeight() + 'thanks')

		module.css({
			top: '35%',
			left: '35%',
			position: 'fixed'
		});


		module.animateCss('bounceIn');

		return this;
	},
	closebtn: function(e){
		e.preventDefault();
		this.removeModule();
	},
	removeModule: function(){
		var that = this,
			module = this.$el.find('#module-new-project');

		that.$el.one(Utility.animationEnd, function(){
			that.$el.remove();
		});

		that.$el.animateCss('fadeOut');
	},

})

// Week View Overlay
PLNR.View.WeekViewOverlay = Backbone.View.extend({
	className: 'week-view-overlay__block',
	render: function(){
		// this.collection.each(function(item){
		// 	var item = new PLNR.View.WeekViewOverlayItem({model: item});
		// 	this.$el.append(item.render().el);
		// }, this);

		return this;
	}
})
PLNR.View.WeekViewOverlayItem = Backbone.View.extend({
	html: Utility.template('week-view-overlay__item--template'),
	className: 'week-view-overlay__item',
	render: function(){
		var dayWidth = 100/7,
			 hourHeight = 100/12;

		this.$el.css({
			width: dayWidth + '%',
			height: hourHeight + '%',
			left: (this.model.get('startDate').format('d') * dayWidth) + '%'
		})
		this.$el.html(this.html(this.model.toJSON()))
		return this;
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
				today = false;
				dataDay = moment(m).add(d ,'days').format('YYYY-D-M');

				if(dataDay == moment().format('YYYY-D-M')) today = true;

			var day = ['<li class="week-view__day"><ul class="single-day__block'+ (today?' __today': '') +'"  data-day="'+ dataDay +'">'];

			// create hours
			for(var h = 0; h < this.config.amountOfHours; h++){

				var hour,
					hourClasses = '',
					dataHour = h;

					if(h == 0) hourClasses += '  __top';
					if(d == 0 && h == 0) hourClasses += '  __top-left';
					if(d == this.config.amountOfDays - 1 && h == 0) hourClasses += '  __top-right';
					if(d == 0 && h == this.config.amountOfHours - 1) hourClasses += '  __bottom-left';
					if(d == this.config.amountOfDays - 1 && h == this.config.amountOfHours - 1) hourClasses += '  __bottom-right';
					if(h == 12) hourClasses += '  __noon';

				hour = '<li class="single-day__hour'+ hourClasses +'" data-hour="'+ dataHour +'"> <small class="hour">'+ Utility.toStdTime(dataHour, true) +'</small class="hour">  </li>';

				day.push(hour);

			}
			day.push('</ul></li>')
			html.push(day.join(' '));
		}

		this.$el.html(html);

		return this;
	},
	onHourClick : function(e){
		var item = $(e.target);
		if(item.hasClass('hour')) item = item.parent();
		var data = {
			hour: parseInt(item.attr('data-hour')),
			day: item.parent().attr('data-day')
		}

		$('#module-new-project').remove();
		$('#PLNR').append(new PLNR.View.NewProjectForm(data).render().el);
	}
})

PLNR.View.WeekDayTitles = Backbone.View.extend({
	tagName: 'ul',
	className: 'week-day-titles__block',
	initialize: function(attr){
		this.config = attr;
	},
	render: function(){
		var html = [];

		for(var d = 0; d < this.config.amountOfDays; d++){
			var m = this.config.startDate,
				title = moment(m).add(d ,'days').format('ddd, DD');

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
					var time = Utility.toStdTime(i);
					return '<li class="view-hours__hour">'+ time +'</li>';
				}(i));
			}

			html.push('</ul>');
			return html.join('');
		}(this.config.amountOfHours));

		// Output the weekview
		this.$el.find('.app-week-view__week-view')
			.html(weekView.render().el);

		// Output the overlaying componets
		this.$el.find('.app-week-view__week-view')
			.append(new PLNR.View.WeekViewOverlay({collection: PLNR.Projects}).render().el)

		return this;
	}
})

// App Calendar View
PLNR.View.AppView = Backbone.View.extend({
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

