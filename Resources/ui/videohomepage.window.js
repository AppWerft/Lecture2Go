exports.create = function(_id) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var moment = require('vendor/moment');
	moment.lang('de_DE');
	var self = require('modules/l2g').create();
	var metaview = require('ui/videometa.widget');
	self.container = Ti.UI.createScrollView({
		height : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
		layout : 'vertical'
	});
	self.add(self.container);
	var videodata = Ti.App.Lecture2Go.getVideoById(_id)[0];
	if (!videodata) {
		alert('Kein Video gefunden');
		return self;
	}
	self.teasercontainer = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : w * videodata.ratio,
	});
	self.teasercontainer.add(Ti.UI.createImageView({
		image : videodata.image,
		width : Ti.UI.FILL,
		touchEnabled : false,
		height : w * videodata.ratio
	}));
	self.add(self.teasercontainer);
	self.container.add(self.teasercontainer);
	self.teasercontainer.add(Ti.UI.createImageView({
		image : '/assets/play.png',
		width : '40dp',
		opacity : '0.4',
		touchEnabled : false
	}));
	self.container.add(Ti.UI.createLabel({
		color : '#F17B0D',
		text : videodata.title,
		top : '5dp',
		left : '5dp',
		right : '5dp',
		font : {
			fontWeight : 'bold',
			fontSize : '20dp'
		}
	}));
	self.container.add(metaview.create({
		label : 'Autor:',
		value : videodata.author
	}));
	self.container.add(metaview.create({
		label : 'Publisher:',
		value : videodata.publisher
	}));
	self.container.add(metaview.create({
		label : 'Aufrufe:',
		value : videodata.hits
	}));
	self.container.add(metaview.create({
		label : 'Laufzeit:',
		value : videodata['duration_min'] + ' min.'
	}));
	self.container.add(metaview.create({
		label : 'Aufnahmezeit:',
		value : videodata['ctime_i18n']
	}));
	self.container.add(Ti.UI.createLabel({
		html : videodata.description,
		top : '5dp',
		color : '#ddd',
		left:'10dp',right:'10dp',
		font : {
			fontSize : '12dp'
		}
	}));
	self.container.add(require('ui/channel.widget').create({
		id : videodata.channel.id,
		title : videodata.channel.name
	}));
	self.teasercontainer.addEventListener('click', function() {
		require('ui/videoplayer.widget').create(videodata.videouri);
	});

	self.addEventListener('open', function() {
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
				activity.actionBar.setDisplayHomeAsUp(true);
				activity.actionBar.setTitle(videodata.channel.name);
				activity.actionBar.onHomeIconItemSelected = function() {
					self.close();
				};
				activity.onCreateOptionsMenu = function(e) {
					e.menu.add({
						title : "Vormerken",
						showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
						itemId : 0,
						icon : '/assets/paperclip.png'
					}).addEventListener("click", function() {

					});
					e.menu.add({
						title : "Alle Videos des Autors",
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
						itemId : 0
					}).addEventListener("click", function() {
						var win = require('ui/videolist.window').create({
							key : 'author',
							value : videodata.author,
							title : 'Videos des Autors',
							subtitle : videodata.author
						});
						win.open();
					});
					e.menu.add({
						title : "Alle Videos des Publishers",
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
						itemId : 1
					}).addEventListener("click", function() {
						var win = require('ui/videolist.window').create({
							key : 'publisher',
							title : 'Videos des Publishers',
							subtitle : videodata.publisher,
							value : videodata.publisher
						});
						win.open();
					});
					e.menu.add({
						title : "Alle Videos des Tages",
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
						itemId : 2
					}).addEventListener("click", function() {
						var win = require('ui/videolist.window').create({
							key : 'day',
							value : videodata.day,
							title : 'Alle Videos vom',
							subtitle : moment(videodata.day, 'YYYY-MM-DD').format('dddd, D. MMMM YYYY')
						});
						win.open();
					});
					e.menu.add({
						title : "Alle Videos des Kurses",
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
						itemId : 3
					}).addEventListener("click", function() {
						var win = require('ui/videolist.window').create({
							key : 'channel',
							value : videodata.channel.id,
							title : 'Videos der gleichen Vorlesungsreihe',
							subtitle : ''
						});
						win.open();
					});
				};
			}
		}
	});
	return self;
};
