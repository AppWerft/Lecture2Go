exports.create = function() {
	console.log('Info: Starting introwindow');
	var self = Ti.UI.createWindow({
		backgroundColor : '#fff',
	});
	self.open();
	var container = Ti.UI.createView({
		backgroundImage : '/Default.png',
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
	});
	self.add(container);
	self.progress = Ti.UI.createProgressBar({
		bottom : '40dip',
		width : '80%',
		height : '40dip',	message:'Bitte etwas Geduld …',
		min : 0,
		max : 1,
		value : 0
	});
	self.progress.show();
	container.add(self.progress);
	console.log('Info: introwindow progress added and shown');

	Ti.App.Model.mirrorRemoteDB({
		progress : self.progress,
		onload : function(_result) {
			console.log('Info: callback from model (mirroddb) ' + _result);
			setTimeout(function() {
				console.log('Info: end of intro animiation');
				Ti.Media.vibrate();
				self.close();
			}, 300);
		}
	});
	console.log('Info: ==> Ending introwindow (mirrorDB in background)');
	return self;

}
