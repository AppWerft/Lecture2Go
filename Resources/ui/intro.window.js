exports.create = function() {
	var self = Ti.UI.createWindow({
		fullscreen : true,
		backgroundImage : '/assets/default.png',
		navBarHidden : true,
	});
	var kennung = Ti.UI.createTextField({
		top : 150,
		width : '90%',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText : 'F-Kennung oder StiNE-Kennung',color:'white',
		height : 40,font:{fontSize:30}
	});
	var password = Ti.UI.createTextField({
		top : 240,
		width : '90%',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText : 'Passwort dazu',
		passwordMask : true,
		height : 40
	});
	//self.add(kennung);
	//self.add(password);
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
				if (_result.success) {
					Ti.App.fireEvent('app:lecture2go_ready', {});
					setTimeout(function() {
						self.close({
							animated : false
						});
					}, 30);
				}

			}
		});

	});
	
	return self;
};
