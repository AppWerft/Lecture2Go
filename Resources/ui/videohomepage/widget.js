exports.create = function(_videodata) {
	var self = Ti.UI.createScrollView({
		height : Ti.UI.FILL,
		contentHeight : Ti.UI.SIZE,
		layout : 'vertical',
		scrollType : 'vertical',
		width : Ti.UI.FILL,
	});

	self.videocontainer = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.Platform.displayCaps.platformWidth * _videodata.ratio,
	});
	self.videocontainer.add(Ti.UI.createImageView({
		image : _videodata.image,
		width : Ti.UI.FILL,
		touchEnabled : false,
		height : Ti.Platform.displayCaps.platformWidth * _videodata.ratio
	}));
	self.add(self.videocontainer);
	self.videocontainer.add(Ti.UI.createImageView({
		image : '/assets/play.png',
		width : '40dp',
		opacity : '0.4',
		touchEnabled : false
	}));
	self.add(Ti.UI.createLabel({
		color : '#F17B0D',
		text : _videodata.title,
		top : '5dp',
		left : '5dp',
		right : '5dp',
		font : {
			fontWeight : 'bold',
			fontSize : '20dp'
		}
	}));

	var metaview = require('ui/videohomepage/videometa.widget');
	self.add(metaview.create({
		label : 'Autor:',
		value : _videodata.author
	}));
	self.add(metaview.create({
		label : 'Publisher:',
		value : _videodata.publisher
	}));
	self.add(metaview.create({
		label : 'Aufrufe:',
		value : _videodata.hits
	}));
	self.add(metaview.create({
		label : 'Laufzeit:',
		value : _videodata['duration_min'] + ' min.'
	}));
	self.add(metaview.create({
		label : 'Aufnahmezeit:',
		value : _videodata['ctime_i18n']
	}));
	self.add(Ti.UI.createLabel({
		html : _videodata.description,
		top : '5dp',
		color : '#ddd',
		left : '10dp',
		right : '10dp',
		font : {
			fontSize : '12dp'
		}
	}));
	self.add(require('ui/videohomepage/channel.widget').create({
		id : _videodata.channel.id,
		title : _videodata.channel.name
	}));
	var qr = 'http://qrfree.kaywa.com/?l=3&s=20&d=lecture2go%3A%2F%2F' + _videodata.id;
	self.add(Ti.UI.createWebView({
		top : '40dp',
		bottom : '100dp',
		width : Ti.Platform.displayCaps.platformWidth,
		height : Ti.Platform.displayCaps.platformWidth,
		html : '<img src="' + qr + '" width="60%"/>',
		scalesPageToFit : true,
		backgroundColor : 'black',
		hideLoadIndicator : true,
		enableZoomControls : false,
		disableBounce : true
	}));
	self.videocontainer.addEventListener('click', function() {
		require('ui/videohomepage/videoplayer.widget').create(_videodata.videouri);
	});
	return self;
};
