exports.create = function() {
	var self = Ti.UI.createWindow({
		fullscreen : true,
	//	backgroundImage : '/assets/default.png',
		navBarHidden : true
	});
	self.progressview = require('ui/progress.widget').create();
	self.add(self.progressview);
	self.progressview.show();
	self.progressview.setTitle('Lecture2Go – Datenabgleich mit Videoserver');
	self.addEventListener('open', function() {
		Ti.App.Lecture2Go.initVideoDB({
			onprogress : function(_p) {
				self.progressview.setProgress(_p);
			},
			onstatuschanged : function(_status) {
				self.progressview.setMessage(_status.text);
			},
			onload : function(_result) {
				if (_result) {
					Ti.App.fireEvent('app:ready', {});
				}
				setTimeout(function() {
					self.close({
						animated : false
					});
				}, 3000);
				Ti.Android && Ti.UI.createNotification({
					message : 'Besorge Liste der Videos'
				}).show();
			}
		});

	});
	return self;
};
