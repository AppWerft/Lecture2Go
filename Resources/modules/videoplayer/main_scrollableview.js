exports.create = function(_video) {
	var currentvideo = {};
	var w = Ti.Platform.displayCaps.platformWidth;
	var rightnavi = Ti.UI.createImageView({
		image : '/assets/tripstar.png'
	});
	rightnavi.menue = require('modules/optionsmenue').create({
		active : false,
		right : 20,
		onclick : function() {
		},
		items : [{
			title : 'Fakultäten der Uni Hamburg',
			icon : '/assets/menueicons/uhh-lectures.png'
		}, {
			title : 'Partnerorgane',
			icon : '/assets/menueicons/partner-lectures.png'

		}, {
			title : 'Konferenzen/Tagungen',
			icon : '/assets/menueicons/conference-lectures.png'

		}]
	});
	var self = require('modules/l2g').create({
		back : true,
		title : '',
		rightnavi : rightnavi

	}, function() {
		self.dialog.show();
	});
	self.add(rightnavi.menue);
	self.navtitle.text = _video.channel.description;
	self.container = Ti.UI.createScrollableView({
		top : w / 6,
		bottom : 20,
		width : Ti.UI.FILL,
		pagingControlColor : '#000',
		cacheSize : 1,
		bubbleParent : false,
		height : Ti.UI.FILL,
		showPagingControl : false,
	});

	self.add(self.container);
	require('modules/videoplayer/playlistview').create(_video, function(_data) {
		self.container.setViews(_data.views);
		for (var i = 0; i < _data.views.length; i++) {
			if (_data.views[i].video.id === _video.id) {
				currentvideo = _data.views[i].video;
				self.container.setCurrentPage(i);
				break;
			}
		}
		self.navtitle.setText(_data.title);
	});
	/* save the current video :*/
	self.container.addEventListener('scrollend', function(e) {
		currentvideo = e.view.video;
	})
	return self;
}
