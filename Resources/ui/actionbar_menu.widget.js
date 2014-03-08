module.exports = function() {
	if (!Ti.Android)
		return;
	var activity = self.getActivity();
	if (!activity.actionBar)
		return;
	activity.actionBar.setDisplayHomeAsUp(false);
	activity.actionBar.setTitle('Lecture2Go');
	activity.onCreateOptionsMenu = function(e) {
		e.menu.add({
			title : "Suchen",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			itemId : 0,
			icon : '/assets/search.png'
		}).addEventListener("click", function() {
			self.setActiveTab(0);
			activity.invalidateOptionsMenu();
		});
		e.menu.add({
			title : "Einstellungen",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			itemId : 0,
			icon : '/assets/preferences.png'
		}).addEventListener("click", function() {
			Ti.UI.Android.openPreferences();
			activity.invalidateOptionsMenu();
		});
		e.menu.add({
			title : "QR-Code",
			showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
			itemId : 0,
			icon : '/assets/qr.png'
		}).addEventListener("click", function() {
			require('ui/scan.widget').create();
		});
	};
};
