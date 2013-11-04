exports.create = function(title, message, onretry) {
	if (!title)
		return;
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Wiederholen', 'Abbrechen'],
		message : 'Das Videoportal benötigt eine Internetverbindung. Da scheint es ein Problem zu geben',
		title : 'Offline/Internet kaputt'
	});
	dialog.show();
	dialog.addEventListener('click', function(e) {
		if (e.index == 0) {
			onretry();
		}
	});
}
