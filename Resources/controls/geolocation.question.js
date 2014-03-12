exports.create = function(_args, _callbacks) {
	if (Ti.App.Properties.hasProperty('GEOALLOWED') || true)
		_callbacks.onallowed();
	var dialog = Ti.UI.createAlertDialog({
		buttonNames : ['Nur diesmal erlauben', 'Immer freigeben', 'Nein'],
		message : "Es besteht die Möglichkeit, dass Du Deinen gegenwärtigen Standort völlig anonym teilst. " + "\nSo können andere Studierende auf der Live-Karte sehen, wo welche Videos gesehen  werden.",
		title : 'Standortfrage – „Sag mir wo Du stehst …“'
	});
	dialog.show();
	dialog.addEventListener('click', function(e) {
		console.log('Dialogstatus'+e.index);
		switch (e.index) {
			case 0:
				_callbacks.onallowed();
				break;
			case 1:
				_callbacks.onallowed();
				Ti.App.Properties.setString('GEOALLOWED', '1');
				break;
			default:
				_callbacks.ondisallowed();
		}
	});
};

