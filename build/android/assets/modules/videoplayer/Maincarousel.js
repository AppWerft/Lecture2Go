exports.create = function(_video) {
	var currentvideo = {};
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = require('modules/l2g').create({
		back : true,
		title : '…',
		rightbutton : '✭'
	}, function() {
		self.dialog.show();
	});
	self.navtitle.text = _video.channel.description;
	
	self.rightbutton.setOpacity(0);
	self.dialog = Titanium.UI.createOptionDialog({
		options : ['Video ➤ Merkzettel', 'Video ➤ Mitnehmen', 'QR-Code senden', 'Abbruch'],
		cancel : 5,
		title : 'Soll dieses Video oder dieser Videokanal viralisiert werden?'
	});

	self.container = Ti.UI.createScrollableView({
		top : w / 6,bottom:20,
		width : Ti.UI.FILL,
		pagingControlColor : '#000',
		cacheSize : 1,
		bubbleParent : false,
		height : Ti.UI.FILL,
		showPagingControl : false,
	});
	self.add(self.container);
	require('modules/videoplayer/playlistview').create(_video, function(_data) {
		self.rightbutton.animate({
			opacity : 1,
			duration : 2000
		});
		self.container.setViews(_data.views);
		for (var i = 0; i < _data.views.length; i++) {
			if (_data.views[i].video.id === _video.id) {
				currentvideo = _data.views[i].video;
				self.container.setCurrentPage(i);
				break;
			}
		}
		console.log(_data);
		self.navtitle.setText(_data.title);
	});
	/* save the current video :*/
	self.container.addEventListener('scrollend', function(e) {
		currentvideo = e.view.video;
	});
	self.dialog.addEventListener('click', function(e) {
		var message = {
			text : currentvideo.message,
			image : [currentvideo.image],
			link : [currentvideo.link]
		};
		switch (e.index) {
			case 0:
				Ti.App.Model.setFav(currentvideo);
				break;
			case 1:
				var dialog = Ti.UI.createAlertDialog({
					ok : 'Verstanden',
					message : 'Leider ist das noch nicht gebaut –  später vielleicht einmal',
					title : 'Video zum Mitnehmen'
				});
				dialog.show();
				break;
/*			case 2:
				Ti.App.Social.showSheet({
					service : 'facebook',
					message : message.text,
					urls : message.link,
					images : message.image
				});
				break;
			case 3:
				Ti.App.Social.showSheet({
					service : 'twitter',
					message : message.text,
					urls : message.link,
					images : message.image
				});
				break; */
			case 2:
				var qr = Ti.UI.createImageView({
					image : 'http://qrfree.kaywa.com/?l=1&s=20&d=' + encodeURI(message.link),
					width : w,
					height : w,
					opacity : 0,
					bottom : 0
				});
				qr.add(Ti.UI.createImageView({
					width : w / 4,
					height : w / 4,
					image : '/assets/logo.png',
					opacity : 0.9
				}));
				self.add(qr);
				qr.animate({
					opacity : 1
				});
				qr.addEventListener('click', function() {
					qr.animate({
						opacity : 0,
						duration : 1000
					}, function() {
						self.remove(qr);
						qr = null;
					});
				});
		}

	});
	return self;
};
