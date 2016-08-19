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

/*

- Notes for the task, so sub task can be explained
 - on hover the other projects besides that project being hover on, on the screen dim down
 - Tool bar on the left side, photoshopish
 - Right top put for the task drawer
   - Can keep track of to do and assign them to projects and track the time
 - Left show case the todos
 - Left top config options
 - Can start the days on any hour of the day, eg: 7 am instead of 12 am
 - Add colors to the projects
 - On click of task edit
 - Check list for the task
 - Pre amount of hours for regular events
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
				this.trigger('weekChange');
				return this.startDate();
			},
			prevWeek : function(){
				this.baseDate = moment(this.baseDate).subtract(7,'days');
				this.trigger('weekChange');
				return this.startDate();
			},
			resetToday: function(){
				this.baseDate = moment().startOf('day');
				this.trigger('weekChange');
				return this.startDate();

			},
			setBaseDate : function(dateString){
				this.baseDate = moment(dateString, "MM-DD-YYYY");
			},
			getBaseDate : function(){
				return this.baseDate;
			},
			amountOfDays : 7,
			amountOfHours : 24,
		};
		this.View = {};
		this.Model = {};
		this.Collection = {};
		this.Projects = {};

		_.extend(this.APP, Backbone.Events);
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
			suffix = (h == 0) ? 'am' : 'pm'
		}else if(h > 12){
			hour = h - 12;
			suffix = 'pm';
		}else{
			hour = h;
			suffix = 'am';
		}

		if(m == true) mins = ':00';

	return hour + mins + ' ' + suffix;
}

Utility.selectTimeOptions = function(hour){

	var argHour = parseInt(hour, 10),
		baseHour = (argHour == 0 ? argHour: argHour - 1),
		output = [],
		min = ['00','15','30','45'],
		suffix = ' am',
		hour;

	for(var h = 0; h < 24; h++){
		hour = baseHour + h;

		if(hour == 0){
			hour = 12
		}else if(hour > 11){
			suffix = ' pm';
			hour = hour - 12;

			if(hour == 12) hour = 13
			if(hour == 0) hour = 12;
		}

		for(var m = 0; m < min.length; m++){
			if(hour < 13){
				output.push( hour + ':' + min[m] + suffix);
			}
		}
	}

	return output;

}

Utility.calculateHumanTime = function (mStart,mEnd){
	var duration, h, m, humantime;

	duration = mEnd.diff(mStart, 'minutes');

	if( duration < 0){
		humantime = '-0 minutes'

	}else if( duration < 60){
		humantime = duration + ' minutes'

	}else{
		h = Math.floor(duration/60);
		m = Math.floor(duration % 60);

		humantime = (h > 1 ? h + ' hours ' : h + ' hour ') +  ( m > 0 ? m + ' mins': '');
	}
	// eg: 1 hour 30 mins
	return humantime;
}

Utility.calculateMinsToHumanTime = function(mins){
	var humantime;
	if( mins < 60){
		humantime = mins + ' minutes'

	}else{
		h = Math.floor(mins/60);
		m = Math.floor(mins % 60);

		humantime = (h > 1 ? h + 'h ' : h + 'h ') +  ( m > 0 ? m + 'm': '');
	}
	// eg: 1 hour 30 mins
	return humantime;
}

Utility.currentTimeBar = function(){
	var timeBar = $('#time-bar');
	console.log(timeBar);



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
	initialize: function(options){

		// Sets up the collection for the model
		var config = {
			title: options.title,
		}

		this.ProjectTasks = new PLNR.Collection.ProjectTasks(config);
		this.ProjectTasks.fetch();

	},
	defaults : {
		title : '',

	},
	validate: function(attr,options){
		if(attr.title.length < 1){
			return 'Title must be filled';
		}
	},
	hoursThisYear: function(){
		var year = moment().year(),
			minThisYear = 0;

		this.ProjectTasks.each(function(task){
			if(year == moment(task.get('startDate')).year()){
				minThisYear = minThisYear + parseInt(task.durationInMins(), 10);
			}
		});

		return minThisYear;
	},
	hoursThisWeek: function(){
		var week = moment().week(),
			minThisWeek = 0;

		this.ProjectTasks.each(function(task){
			if(week == moment(task.get('startDate')).week()){
				minThisWeek = minThisWeek + parseInt(task.durationInMins(), 10);
			}
		});

		return minThisWeek;
	},
	hoursThisMonth: function(){
		var month = moment().month(),
			minThisMonth = 0;

		this.ProjectTasks.each(function(task){
			if(month == moment(task.get('startDate')).month()){
				minThisMonth = minThisMonth + parseInt(task.durationInMins(), 10);
			}
		});

		return minThisMonth;
	}
});

PLNR.Model.SingleTask = Backbone.Model.extend({
	initialize: function(options){

		// this.save(this.toJSON());
	},
	defaults : {
		startDate: moment(),
		endDate: moment().add(1, 'h'),

	},
	validate: function(attr,options){

	},
	isInView: function(){
		if(moment(this.get('startDate')).isBetween(PLNR.APP.startDate(), PLNR.APP.endDate(), null, '[]')){
			return true;
		}else{
			return false
		}
	},
	durationInMins: function(){
		return moment(this.get('endDate')).diff(moment(this.get('startDate')), 'minutes');
	},

});

/**
 *
 * Collections
 *
 */

// The full collection holder
PLNR.Collection.Projects = Backbone.Collection.extend({
		model : PLNR.Model.SingleProject,
		localStorage: new Backbone.LocalStorage("PLNR"),
		getTask: function(id){
			var output;
			this.each(function(project){
				var matched = project.ProjectTasks.get(id);
				if(matched){
					output = matched;
				}
			});
			return output;
		}
})

// Collection that will become a Project
PLNR.Collection.ProjectTasks = Backbone.Collection.extend({
		model : PLNR.Model.SingleTask,
		initialize: function(config){
			this.localStorage = new Backbone.LocalStorage("Task-" + config.title.replace(/\s+/g, ''));
		}
});

/**
 *
 * PLNR Projects
 *
 */


PLNR.Projects = new PLNR.Collection.Projects();


/**
 *
 * Views
 *
 */

// Date Selector
PLNR.View.DateSelector = Backbone.View.extend({
	className: 'date-selector',
	id: 'date-selector',
	html: Utility.template('date-selector--template'),
	initialize: function(){
		// this.listenTo(this.model, 'change', this.render);
		PLNR.APP.on('weekChange', this.render, this);
	},
	render: function(){
		this.$el.empty();
		this.$el.html(this.html({
			startDate: PLNR.APP.startDate().format('ddd, MMM D'),
			endDate: PLNR.APP.endDate().format('ddd, MMM D')
		}));
		return this
	},
	events : {
		'click .week-selector-timeline--lastbtn' : 'lastWeek',
		'click .week-selector-timeline--nextbtn' : 'nextWeek',
		'click .date-selector__todaybtn' : 'today',
		'click #sidebar-task': 'sidebarTasks'
	},
	nextWeek : function(e){
		e.preventDefault();
		PLNR.APP.nextWeek();
	},
	lastWeek : function(e){
		e.preventDefault();
		PLNR.APP.prevWeek();
	},
	today : function(e){
		e.preventDefault();
		PLNR.APP.resetToday();
	},
	sidebarTasks: function(e){
		e.preventDefault();
		$('.sidebar-tasks').toggleClass('in-view');

	}
});

// Form
PLNR.View.TaskModule = Backbone.View.extend({
	html: Utility.template('task-module--template'),
	className: 'task-module__wrapper',
	events: {
		'click .tm-header__closebtn': 'closebtn',
		'click .plnr-select__selected': 'optionDropdown',
		'click .plnr-select-options__option': 'optionSelected',
		'click .tm-footer__ctabtn' : 'submitNewTask',
		'click .tm-footer__removebtn' : 'deleteTask',
		'click .tm-footer__savebtn' : 'updateTask',
		'click .tm-task-input__closebtn' : 'cancelNewProject'
	},
	initialize: function(attr){

		this.config = attr;
	},
	render: function(){
		var module;

		this.$el.html(this.html(this.config));

		module = this.$el.find('#task-module');

		module.draggable({ handle: ".tm-header__module-title" });

		module.css({
			top: '25%',
			left: '35%',
			position: 'fixed'
		});

		module.animateCss('bounceIn');

		this.$el.find('.tm-times__link .plnr-select').addClass('loaded');

		// $('body').addClass('module-inview');

		if(this.config.moduleType == 'edit'){
			var project = PLNR.Projects.findWhere({title: this.config.projectTitle})
			this.projectSelected(project.get('id'))
		}

		return this;
	},
	closebtn: function(e){
		e.preventDefault();
		this.closeModule();
	},
	closeModule: function(){
		var self = this,
			module = this.$el.find('#task-module');

		self.$el.find('#task-module').one(Utility.animationEnd, function(){
			self.$el.remove();
			$('body').removeClass('module-inview');
		});

		self.$el.animateCss('fadeOut');
		self.$el.find('#task-module').animateCss('bounceOut');
	},
	optionDropdown: function(e){
		e.preventDefault();
		var el = $(e.currentTarget);
		var plnrSelect = el.parent();
		plnrSelect.toggleClass('plnr-select-options--show');

		if(plnrSelect.parent().hasClass('tm-times__link') && plnrSelect.hasClass('loaded')){
			plnrSelect.find('.plnr-select-options').scrollTop(196);
			plnrSelect.removeClass('loaded');
		}
	},
	optionSelected: function(e){
		e.preventDefault();
		var el = $(e.currentTarget);

		var plnrSelect = el.closest('.plnr-select'),
			selectedValue = el.attr('data-value'),
			selectText = el.text();

		plnrSelect.toggleClass('plnr-select-options--show');

		plnrSelect.find('.plnr-select__selected').attr('data-value', selectedValue);
		plnrSelect.find('.plnr-select__selected-text').text(selectText);

		if(plnrSelect.parent().hasClass('tm-times__link')){

			var times = {
					start : this.$el.find('.tm-times__start').find('.plnr-select__selected').attr('data-value'),
					end :   this.$el.find('.tm-times__end').find('.plnr-select__selected').attr('data-value')
				}

			var timeLength = this.calculateTime(times);

			this.$el.find('.tm-footer__ctabtn').text(timeLength);
		}

		if(plnrSelect.parent().hasClass('tm-task')){

			this.projectSelected(selectedValue)
		}
	},
	calculateTime: function(times){

		var start = moment('12-25-1995 ' + times.start , "MM-DD-YYYY h:mma"),
			end = moment('12-25-1995 ' + times.end , "MM-DD-YYYY h:mma"),
			humanTime = Utility.calculateHumanTime(start,end);

			if(humanTime == '-0 minutes' || humanTime == '0 minutes' ){
				this.triggerError('invalid time');
				return 'please select valid times!'

			}else{
				this.clearError('invalid time');
				return 'Add ' + humanTime;
			}

	},
	projectSelected: function(id){
		var taskBlock = this.$el.find('.tm-task .plnr-select');

		if(id.length > 0 && !(id === 'new-task')){

			var project = PLNR.Projects.get(id);

			var year = this.$el.find('.tm-task-details__years .tm-task-detail__data'),
				month = this.$el.find('.tm-task-details__month .tm-task-detail__data'),
				week = this.$el.find('.tm-task-details__week .tm-task-detail__data');

			year.text(Utility.calculateMinsToHumanTime(project.hoursThisYear()));
			month.text(Utility.calculateMinsToHumanTime(project.hoursThisMonth()));
			week.text(Utility.calculateMinsToHumanTime(project.hoursThisWeek()));

			taskBlock.removeClass('new-project');
			this.$el.find('.tm-task-details').slideDown('slow');
		}else{
			this.$el.find('.tm-task-details').slideUp();
			var input = this.$el.find('.tm-task-input__input');

			input.attr('data-value','new-project-created');
			taskBlock.addClass('new-project');
		}
	},
	cancelNewProject: function(e){
		e.preventDefault();
		var taskBlock = this.$el.find('.tm-task .plnr-select'),
			input = this.$el.find('.tm-task-input__input');

		this.$el.find('.tm-task .plnr-select__selected').attr('data-value', '');
		this.$el.find('.tm-task .plnr-select__selected-text').text('Select a Project');

		taskBlock.removeClass('new-project');
		input.attr('data-value','no-new-project');

	},
	triggerError: function(err){

		if(err == 'invalid time'){
			this.$el.find('.tm-footer__ctabtn').addClass('has-error');
		}

		if(err == 'invalid time' && this.config.moduleType == 'edit'){
			var message = 'Please select valid times';
			this.$el.find('.tm-footer__error').removeClass('is-hidden');
			this.$el.find('.tm-footer__error-text').text(message);
		}

		if(err == 'projectId'){
			var message = 'Please select a project or create a new one';
			this.$el.find('.tm-footer__error').removeClass('is-hidden');
			this.$el.find('.tm-footer__error-text').text(message);
		}

	},
	clearError: function(err){

		if(err == 'invalid time'){
			this.$el.find('.tm-footer__ctabtn').removeClass('has-error');
		}

		if(err == 'invalid time' && this.config.moduleType == 'edit'){
			this.$el.find('.tm-footer__error').addClass('is-hidden');
		}

		if(err == 'projectId'){
			this.$el.find('.tm-footer__error').addClass('is-hidden');
		}
	},
	submitNewTask: function(e){
		e.preventDefault();

		var rawData = {
			projectId : this.$el.find('.tm-task .plnr-select__selected').attr('data-value'),
			startDateTime: this.$el.find('.tm-times__start .plnr-select__selected').attr('data-value'),
			endDateTime: this.$el.find('.tm-times__end .plnr-select__selected').attr('data-value'),
			startDate: this.$el.find('#start-date').val(),
			endDate: this.$el.find('#end-date').val(),
			newProjectVal: this.$el.find('.tm-task .tm-task-input__input').val()
		},passCheck = true, entry;

		if(rawData['projectId'].length == 0) {
			passCheck = false;
			this.triggerError('projectId')
		}else{
			passCheck = true;
			this.clearError('projectId')
		}

		if(this.$el.find('.tm-footer__ctabtn').hasClass('has-error')){
			passCheck = false;
		}

		if(!this.$el.find('.tm-footer__error').hasClass('is-hidden')){
			passCheck = false;
		}

		if(passCheck){

			entry = {
				projectId: rawData.projectId,
				projectName: rawData.newProjectVal,
				startDate: moment(rawData.startDate + ' ' + rawData.startDateTime.replace(/\s+/g, ''), "YYYY-MM-DD  h:mma"),
				endDate: moment(rawData.endDate + ' ' + rawData.endDateTime.replace(/\s+/g, ''), "YYYY-MM-DD  h:mma")
			}

			if(entry.projectName.length > 0 || entry.projectId == 'new-task'){
				var newProject = PLNR.Projects.create({title: entry.projectName});
				PLNR.Projects.get(newProject.id).ProjectTasks.create({startDate:entry.startDate,endDate: entry.endDate});
				PLNR.Projects.trigger('projectChange');
			}else{
				PLNR.Projects.get(entry.projectId).ProjectTasks.create({startDate:entry.startDate,endDate: entry.endDate})
				PLNR.Projects.trigger('projectChange');
			}

			this.closeModule();
		}
	},
	deleteTask: function(e){
		e.preventDefault();
		var self = this;

		this.config.task.destroy();
		PLNR.Projects.trigger('projectChange');
		self.closeModule();
	},
	updateTask: function(e){
		e.preventDefault();

		var rawData = {
			startDateTime: this.$el.find('.tm-times__start .plnr-select__selected').attr('data-value'),
			endDateTime: this.$el.find('.tm-times__end .plnr-select__selected').attr('data-value'),
			startDate: this.$el.find('#start-date').val(),
			endDate: this.$el.find('#end-date').val(),
		},passCheck = true,entry;

		entry = {
			startDate: moment(rawData.startDate + ' ' + rawData.startDateTime.replace(/\s+/g, ''), "YYYY-MM-DD  h:mma"),
			endDate: moment(rawData.endDate + ' ' + rawData.endDateTime.replace(/\s+/g, ''), "YYYY-MM-DD  h:mma")
		}

		if(!this.$el.find('.tm-footer__error').hasClass('is-hidden')){
			passCheck = false;
		}

		if(passCheck){

			this.config.task.save({
				startDate: entry.startDate,
				endDate: entry.endDate
			});

			PLNR.Projects.trigger('projectChange');
			this.closeModule();

		}

	},
	errorMessages: function(){
	}
})


PLNR.View.WeekViewOverlayItem = Backbone.View.extend({
	className: 'week-view-overlay__item',
	html: Utility.template('week-view-overlay__item--template'),
	render: function(){
		var model = this.model.toJSON(),
			 mStartDate = moment(model.startDate),
			 mEndDate =  moment(model.endDate);

		// sun = 0, mon = 1, tue = 2
		var days = mStartDate.weekday();
		var left = days * (100/ PLNR.APP.amountOfDays);

		var minutes = parseInt(mStartDate.hours() * 60 + mStartDate.minutes(), 10);
		var n15mins = minutes / 15;
		var top = n15mins / 96 * 100

		var dur = mEndDate.diff(mStartDate, 'minutes');
		var durMin = dur / 15;
		var height = durMin / 96 * 100;


		// 96 15 mins in 24 hours
		//

		this.$el.css({
			width: (100/ PLNR.APP.amountOfDays) + '%',
			height: height + '%',
			top: top + '%',
			left: left + '%'
		});

		model.amountOfTime = Utility.calculateHumanTime(mStartDate,mEndDate);
		model.duration = mStartDate.format('h:mma') + ' - ' + mEndDate.format('h:mma');

		this.$el.html(this.html(model));
		return this;
	}
})

// Week View Overlay
PLNR.View.WeekViewOverlay = Backbone.View.extend({
	className: 'week-view-overlay',
	initialize: function(){
		this.listenTo(PLNR.Projects, 'projectChange', this.render);
		PLNR.APP.on('weekChange', this.render, this);
	},
	events: {
		'click .week-view-overlay__item' : 'editTaskModule'
	},
	render: function(){

		this.$el.find('.items').remove();
		this.$el.append('<div class="items"></div>');
		var view = this.$el.find('.items');

		PLNR.Projects.forEach(function(project){
			// console.log(project);
			project.ProjectTasks.forEach(function(task){
				// console.log(task);
				if(task.isInView()){
					task.set({title: project.get('title')});
					view.append(new PLNR.View.WeekViewOverlayItem({model:task}).render().el);
				}
			})
		});

		return this;
	},
	editTaskModule: function(e){
		var el = $(e.currentTarget),
			taskId = el.find('.overlay-item').attr('data-task-id'),
			taskInfo = PLNR.Projects.getTask(taskId);

		//console.log(taskInfo);

		if(taskInfo){

			var config = {
				moduleTitle: 'Edit Task',
				moduleType: 'edit',
				day: moment(taskInfo.get('startDate')).format('YYYY-D-M'),
				startingHour: moment(taskInfo.get('startDate')).format('h:mm a'),
				endingHour: moment(taskInfo.get('endDate')).format('h:mm a'),
				projectTitle: taskInfo.get('title'),
				task: taskInfo
			}

			$('#PLNRAPP').append(new PLNR.View.TaskModule(config).render().el);
		}
	}
});


// Week View Bg
PLNR.View.WeekView = Backbone.View.extend({
	tagName: 'ul',
	className: 'week-view',
	initialize: function(attr){
		this.config = PLNR.APP;
		PLNR.APP.on('weekChange', this.render, this);
	},
	render: function(){
		this.$el.empty();
		var html = [];

		// create days
		for(var d = 0; d < this.config.amountOfDays; d++){

			var m = this.config.startDate(),
				today = false;
				dataDay = moment(m).add(d ,'days').format('YYYY-D-M');

				if(dataDay == moment().format('YYYY-D-M')) today = true;

			var day = ['<li class="week-view__day">',
							'<ul class="single-day'+ (today?' __today': '') +'"  data-day="'+ dataDay +'">'];

			// create hours
			for(var h = 0; h < this.config.amountOfHours; h++){

				var hour,
					hourClasses = '';

					if(h == 0) hourClasses += '  __top';
					if(d == 0 && h == 0) hourClasses += '  __top-left';
					if(d == this.config.amountOfDays - 1 && h == 0) hourClasses += '  __top-right';
					if(d == 0 && h == this.config.amountOfHours - 1) hourClasses += '  __bottom-left';
					if(d == this.config.amountOfDays - 1 && h == this.config.amountOfHours - 1) hourClasses += '  __bottom-right';
					if(h == 12) hourClasses += '  __noon';

				hour = '<li class="single-day__hour'+ hourClasses +'" data-hour="'+ h +'"> <small class="hour"> + '+ Utility.toStdTime(h, true) +'</small class="hour">  </li>';

				day.push(hour);

			}
			day.push('</ul></li>')
			html.push(day.join(' '));
		}

		this.$el.html(html.join(' '));

		return this;
	},
	events: {
		'click .single-day__hour' : 'newTaskModule'
	},
	newTaskModule: function(e){
		var el = $(e.currentTarget);
		if(!el.hasClass('single-day__hour')){
			el = el.parent();
		}
		var config = {
			day: el.parent().attr('data-day'),
			hour: el.attr('data-hour'),
			moduleTitle: 'Add New Task',
			moduleType: 'new'
		}

		$('.edit-task-module__wrapper').remove();

		$('#PLNRAPP').append(new PLNR.View.TaskModule(config).render().el);
	},
	testing: function(){
		var config = {
			day: '2016-3-6',
			hour: '9'
		}
		$('#PLNRAPP').append(new PLNR.View.TaskModule(config).render().el);
	}
})

// Titles
PLNR.View.WeekDayTitles = Backbone.View.extend({
	className: 'app-week-view__day-titles',
	initialize: function(){
		this.config = PLNR.APP;
		PLNR.APP.on('weekChange', this.render, this);
	},
	render: function(){
		var html = [];
		html.push('<ul class="week-day-titles">');

		for(var d = 0; d < this.config.amountOfDays; d++){
			var m = this.config.startDate(),
				title = moment(m).add(d ,'days').format('ddd, DD');

			html.push('<li class="week-day-titles__day"><h5 class="week-day-titles__heading">'+ title +'</h5></li>');
		}

		html.push('</ul>');

		this.$el.html(html.join(' '));

		return this;
	}
})

// Hours
PLNR.View.WeekHours = Backbone.View.extend({
	className: 'app-week-view__view-hours',
	initialize: function(attr){
		this.config = PLNR.APP;
	},
	render: function(){
		var html = [];

		html.push('<ul class="view-hours">');

		for(var i = 0; i < this.config.amountOfHours; i++){
			html.push(function(i){
				var time = Utility.toStdTime(i);
				return '<li class="view-hours__hour">'+ time +'</li>';
			}(i));
		}

		html.push('</ul>');

		this.$el.html(html.join(' '));

		return this;
	}
})

// Timebar
PLNR.View.TimeBar = Backbone.View.extend({
	id: 'time-bar',
	className: 'time-bar',
	html : _.template('<div class="time-bar__time"> <%= time %> </div>'),
	initialize: function(){
		var self = this;

		var draw = function(){
			self.render();
			setTimeout(function(){
				requestAnimationFrame(draw);
			},60000)
		};

		var now = moment().second();

		setTimeout(function(){
			requestAnimationFrame(draw);
		}, (60 - now) * 1000 );

	},
	render: function(){

		var now = moment();

		this.$el.html(this.html({time: now.format('h:mm a')}));

		// 1440 min in 24 hrs
		var n = ((now.hour() * 60) + now.minute()),
			top = n / 1440 * 100;

		this.$el.css({
			top: top + '%'
		});

		return this;
	}
});

// Sidebar Tasks
PLNR.View.SidebarTask = Backbone.View.extend({
	html: $('#sidebar-tasks--template').html(),
	className: 'sidebar-tasks',
	initialize: function(){
		this.listenTo(PLNR.Projects, 'projectChange', this.render);
		//PLNR.APP.on('weekChange', this.render, this);
	},
	events: {
		'click #close-btn' : 'toggleDisplay'
	},
	render: function(){
		this.$el.html(this.html);

		var details = this.$el.find('.sidebar-task__details'),
			graph = this.$el.find('.sidebar-task__graph'),
				detailList = ['<ul class="sidebar-task__listing">'],
				projectListHours = [],
				graphList = ['<ul class="graph-listing">'];

		var projectList = PLNR.Projects.sortBy(function(project){
			var hours = project.hoursThisWeek();
			projectListHours.push({
				title: project.get('title'),
				mins: hours
			});
			return hours
		}).reverse();

		projectListHours = projectListHours.sort(function(a,b){
			return b.mins - a.mins;
		});


		_.each(projectList, function(project,i){

			detailList.push('<li>')
			detailList.push('<h4>' + project.get('title') + '</h4>');
			detailList.push('<h6>Hours this week: ' + Utility.calculateMinsToHumanTime(projectListHours[i].mins)  +' | Precent: ' + (projectListHours[i].mins / 10080 * 100).toPrecision(3) + '%</h6>');

			detailList.push('</li>')
		});

		detailList.push('</ul>')

		details.html(detailList.join(''));

		_.each(projectListHours,function(obj){
			var percent = (obj.mins / 10080) * 100;

			graphList.push('<li class="graph-listing__item" title="'+obj.title+'" style="width:'+ percent +'%;">')
			graphList.push('<div class="graph-listing__title"> '+obj.title+' </div>')
			graphList.push('</li>')
		});

		graphList.push('</ul>')

		graph.html(graphList.join(''))

		return this;
	},
	toggleDisplay: function(e){
		e.preventDefault();
		this.$el.toggleClass('in-view');
	}
});

// App Cal View
PLNR.View.AppCalWeekView = Backbone.View.extend({
	className : 'app-week-view',
	daysToDisplay : 7,
	render : function (){

		// Output the day-titles
		this.$el.append(new PLNR.View.WeekDayTitles().render().el);

		// Hours
		this.$el.append(new PLNR.View.WeekHours().render().el);

		this.$el.append('<div class="app-week-view__week-view"></div>');

		// Output the weekview
		this.$el.find('.app-week-view__week-view').append(new PLNR.View.WeekView().render().el);

		// Output the overlaying componets
		this.$el.find('.app-week-view__week-view').append(new PLNR.View.WeekViewOverlay().render().el)

		// Time Bar
		this.$el.find('.app-week-view__week-view').append(new PLNR.View.TimeBar().render().el);

		// Sidebar
		$('#PLNRAPP').append(new PLNR.View.SidebarTask().render().el);

		return this;
	}
})

// App Calendar View
PLNR.View.AppView = Backbone.View.extend({
	el: $('#PLNRAPP'),
	render : function(){

		// Output the Header
		this.$el.find('#app-header').append(new PLNR.View.DateSelector().render().el)

		// Output the App Calendar View
		this.$el.find('#app-cal-view').append(new PLNR.View.AppCalWeekView().render().el);

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
	PLNR.Projects.fetch();

	APP.render();

$( document ).tooltip();

}());

