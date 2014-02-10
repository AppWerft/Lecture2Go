module.exports = function(_e) {
	var elem = _e.source;
	var activity = elem.activity;
	if (activity) {
		activity.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
			var items = [{
				title : 'Video of developer',
				onclick : function() {
					require('ui/video.widget').create({
						mp4 : '/assets/stefan.mp4'
					});
				}
			}, {
				title : 'Project homepage',
				onclick : function() {
					var win = Ti.UI.createWindow({
						fullscreen : true
					});
					win.open();
					win.add(Ti.UI.createWebView({
						url : 'http://tinybrain.de:8080/'
					}));
				}
			}, {
				title : 'Restart chat',
				onclick : function() {
					window.close();
				}
			}, {
				title : 'Kill my photo!',
				onclick : function() {
					Ti.App.TinyBrainProxy.killMe();
				}
			}, {
				title : 'Changing of avatar',
				onclick : function() {
					require('ui/avatar_select.widget').create();
				}
			}];

			for ( i = 0; i < items.length; i++) {
				items[i].menuItem = menu.add({
					title : items[i].title,
					icon : Ti.Android.R.drawable.ic_menu_save,
					showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
				});
				items[i].menuItem.addEventListener("click", items[i].onclick);
			}
		};
		var ab = activity.actionBar;
		if (ab) {
			ab.displayHomeAsUp = true;
			ab.title = 'Lecture2Go';
			ab.subtitle ='Neueste Videos';
		}
	}
};
