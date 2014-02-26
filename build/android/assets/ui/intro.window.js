exports.create = function() {
	console.log('Info: Starting introwindow');
	var self = Ti.UI.createWindow({
		fullscreen : true,
		backgroundImage : '/assets/default.png',
		navBarHidden : true
	});
	self.progressview = require('ui/progress.widget').create();
	self.add(self.progressview);
	self.progressview.show();
	self.progressview.setTitle('Lecture2Go – Datenabgleich mit Videoserver');
	console.log('Info: introwindow progress added and shown');
	Ti.App.Lecture2Go.initVideoDB({
		onprogress : function(_p) {
			self.progressview.setProgress(_p);
		},
		onstatuschanged : function(_status) {
			console.log('Info: Message from Mirror = ' + _status.text);
			self.progressview.setMessage(_status.text);
		},
		onload : function(_result) {
			if (_result) {
				setTimeout(function() {
					console.log('Info: end of intro animiation');
					Ti.Media.vibrate();
					Ti.App.fireEvent('app:ready', {});
				}, 300);
			}
		}
	});
	return self;
};
