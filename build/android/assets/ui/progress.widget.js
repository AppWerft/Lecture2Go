exports.create = function() {
	var self = Ti.UI.createView({
		zIndex : 9999
	});
	self.add(Ti.UI.createView({
	}));
	self.add(Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.9,
		bottom : 0,
		height : '120dp'
	}));
	self.container = Ti.UI.createView({
		bottom : 0,
		left : '10dp',
		right : '10dp',
		layout : 'vertical',
		height : '120dp'
	});
	self.add(self.container);
	self.title = Ti.UI.createLabel({
		color : '#F17B0D',
		top : '5dp',
		height : '20dp',
		width : Ti.UI.FILL,
		font : {
			fontSize : '16dp',
			fontWeight : 'bold'
		}
	});
	self.container.add(self.title);
	self.message = Ti.UI.createLabel({
		color : 'white',
		width : Ti.UI.FILL,
		top : '5dp',
		text : 'Meldung',
		font : {
			fontSize : '12dp'
		}
	});
	self.container.add(self.message);

	self.progress = Ti.UI.createProgressBar({
		width : '100%',
		min : 0,
		max : 1,
		height : '30dp',
		top : 0
	});
	self.container.add(self.progress);
	self.progress.show();
	self.actind = Ti.UI.createActivityIndicator({
		left : '5dp',
		style : Titanium.UI.ActivityIndicatorStyle.PLAIN
	});
	//self.actind.show();
	//	self.container.add(self.actind);
	self.setProgress = function(_value) {
		self.progress.setValue(_value);
	};
	self.setTitle = function(_foo) {
		self.title.setText(_foo);
	};
	self.setMessage = function(_foo) {
		self.message.setText(_foo);
	};
	return self;
};
