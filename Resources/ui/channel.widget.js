const H = '100dp';
exports.create = function() {
	var options = arguments[0] || {};
	var self = Ti.UI.createView({
		top : '5dp',
		height : '120dp'
	});
	self.add(Ti.UI.createLabel({
		text : 'Alle Videos der Reihe „' + options.title + '“:',
		height : '20dp',
		top : 0,
		color : '#999',
		textAlign : 'left',
		left : '5dp',
		font : {
			fontSize : '10dp'
		}
	}));
	self.container = Ti.UI.createScrollView({
		top : '20dp',
		height : H,
		scrollType : 'horizontal',
		width : Ti.UI.FILL,
		contentWidth : Ti.UI.SIZE,
		layout : 'horizontal',
		horizontalWrap : false,
		contentHeight : H
	});
	self.add(self.container);
	Ti.App.Lecture2Go.getVideosByChannel({
		id : options.id,
		onload : function(_videodata) {
			var videos = _videodata.videos;
			for (var i = 0, len = videos.length; i < len; i++) {
				self.container.add(Ti.UI.createImageView({
					left : 0,
					right : '5dp',
					height : H,
					itemId : videos[i].id,
					width : parseInt(H) / videos[i].ratio + 'dp',
					image : videos[i].thumb
				}));
			}
			self.container.addEventListener('click', function(_e) {
				var win = require('ui/videohomepage.window').create(_e.source.itemId);
				win.open();
			});
		}
	});
	return self;
};
