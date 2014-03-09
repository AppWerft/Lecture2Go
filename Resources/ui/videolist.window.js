exports.create = function() {
	var options = arguments[0] || {};

	var lectureseriesId = options.value;
	var self = require('modules/l2g').create();
	self.listview = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').videorow
		},
		defaultItemTemplate : 'row'
	});
	self.add(self.listview);
	self.update = function() {
		Ti.App.Lecture2Go.getVideoList({
			key : options.key,
			value : options.value,
			min : 0,
			max : 150,
			onload : function(_data) {
				var data = [];
				for (var i = 0; i < _data.videos.length; i++) {
					var item = {
						title : {
							text : _data.videos[i].title
						},
						subtitle : {
							text : _data.videos[i].author
						},
						thumb : {
							image : _data.videos[i].thumb
						},
						duration : {
							text : parseInt(_data.videos[i].duration.split(':')[0] * 60) + parseInt(_data.videos[i].duration.split(':')[1]) + ' min.'
						},
						properties : {
							//	selectionStyle : TiTi.UI.iPhone.ListViewCellSelectionStyle.NONE,
							allowsSelection : true,
							itemId : _data.videos[i].id,
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
						}
					};
					data.push(item);
				}
				var section = Ti.UI.createListSection();
				section.setItems(data);
				self.listview.sections = [section];
			}
		});
	};
	Ti.App.addEventListener('app:lecture2go_ready', function() {
		self.update();
	});
	self.listview.addEventListener('itemclick', function(_e) {
		var win = require('ui/videohomepage/window').create(_e.itemId);
		win.open();
	});
	if (options.value) {
		self.update();
	}
	self.addEventListener('open', function() {
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
				var abextras = require('com.alcoapps.actionbarextras');
				abextras.setExtras({
					title : options.title,
					subtitle : options.subtitle
				});
				if (options.value) {
					activity.actionBar.setDisplayHomeAsUp(true);
					activity.actionBar.onHomeIconItemSelected = function() {
						self.close();
					};
				}
				if (options.key == 'channel' || options.key == 'lectureseries') {
					activity.onCreateOptionsMenu = function(e) {
						var SUBSCRIBE = 0, UNSUBSCRIBE = 1;
						var subscribed = Ti.App.Apiomat.isChannelsubscribed(options.value);
						e.menu.add({
							title : "Vorlesungsreihe abonnieren",
							showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
							itemId : SUBSCRIBE,
							visible : (subscribed) ? false : true,
							icon : '/assets/abo.png'
						}).addEventListener("click", function() {
							e.menu.removeItem(SUBSCRIBE);
							Ti.App.Apiomat.subscribeChannel({
								lectureseriesId : lectureseriesId,
								lectureseries : options.channel
							}, {
								onsuccess : function() {
									e.menu.findItem(UNSUBSCRIBE).visible = true;
								}
							});
						});
						e.menu.add({
							title : "Vorlesungsreihe abbestellen",
							showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
							itemId : UNSUBSCRIBE,
							visible : (subscribed) ? true : false,

							icon : '/assets/unabo.png'
						}).addEventListener("click", function() {

						});

					};
				}
			}
		}
	});
	return self;
};
