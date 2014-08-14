module.exports = function(_args, _callback) {
	var androidview = Ti.UI.createView({
		height : 80,
		width : Ti.UI.FILL
	});
	
	var self = Ti.UI.createOptionDialog({
		androidView : androidview,
		message : 'Um erweiterte Funktionen zu nutzen, brauchen wir eine Identität.',
		title : 'Identität',
		buttonNames : ['Abbruch', 'OK']
	});
	self.show();
	self.addEventListener('click', function(_e) {
		_callback();
	});
	var kennung = Ti.UI.createTextField({
		top : 0,
		width : '90%',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText : 'F-Kennung oder StiNE-Kennung',
		height : 40
	});
	var password = Ti.UI.createTextField({
		top : 40,
		width : '90%',
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText : 'Passwort dazu',
		passwordMask : true,
		height : 40
	});
	androidview.add(kennung);
	androidview.add(password);
};
