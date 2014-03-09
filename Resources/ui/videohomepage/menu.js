exports.add = function(_menu, _videodata) {
	var status = Ti.App.Apiomat.getStatusofVideo(_videodata.id);
	if (_videodata.downloadlink) {
		_menu.add({
			title : "Sharing",
			icon : '/assets/share.png',
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			itemId : 0
		}).addEventListener("click", function() {
			var intent = Ti.Android.createIntent({
				action : Ti.Android.ACTION_VIEW,
				type : "video/mp4",
				data : _videodata.videouri.mp4
			});
			Ti.Android.currentActivity.startActivity(intent);
		});
	}
	_menu.add({
		title : "Vormerken",
		showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
		itemId : 1,
		visible : (status.faved || !_videodata.downloadlink) ? false : true,
		icon : '/assets/paperclip.png'
	}).addEventListener("click", function(_e) {
		console.log(_e);
		_e.source.visible = false;

		Ti.App.Apiomat.favVideo({
			video : _videodata,
			onsuccess : function() {
				Ti.Media.vibrate();
			}
		});
	});
	_menu.add({
		title : "Mitnehmen",
		showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
		itemId : 2,
		visible : (status.localsaved || !status.faved || !_videodata.downloadlink) ? false : true,
		icon : '/assets/download.png'
	}).addEventListener("click", function() {

	});
	_menu.add({
		title : "Alle Videos des Autors",
		showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
		itemId : 3
	}).addEventListener("click", function() {
		var win = require('ui/videolist.window').create({
			key : 'author',
			value : _videodata.author,
			title : 'Videos des Autors',
			subtitle : _videodata.author
		});
		win.open();
	});
	_menu.add({
		title : "Alle Videos des Publishers",
		showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
		itemId : 4
	}).addEventListener("click", function() {
		var win = require('ui/videolist.window').create({
			key : 'publisher',
			title : 'Videos des Publishers',
			subtitle : _videodata.publisher,
			value : _videodata.publisher
		});
		win.open();
	});
	_menu.add({
		title : "Videos des Tages",
		showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
		itemId : 5
	}).addEventListener("click", function() {
		var win = require('ui/videolist.window').create({
			key : 'day',
			value : _videodata.day,
			title : 'Videos vom',
			subtitle : moment(_videodata.day, 'YYYY-MM-DD').format('dddd, D. MMMM YYYY')
		});
		win.open();
	});
	_menu.add({
		title : "Vorlesungsreihe",
		showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER,
		itemId : 6
	}).addEventListener("click", function() {
		var win = require('ui/videolist.window').create({
			key : 'channel',
			value : _videodata.channel.id,
			title : 'Vorlesungsreihe',
			subtitle : _videodata.channel.name,
			channel : _videodata.channel // for subsribing of channel=lectureseries
		});
		win.open();
	});
};
