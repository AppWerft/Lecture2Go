exports.create = function() {
	var self = null;
	var tabs = [{
		icon : '/icons/home.png',
		selectedIcon : '/icons/home_selected.png',
		window : require('modules/startwindow/main').create('Lecture2Go Mobile')
	}, {
		icon : '/icons/search.png',
		selectedIcon : '/icons/search_selected.png',
		window : require('/modules/search/main').create('Suche')
	}, {
		icon : '/icons/list.png',
		selectedIcon : '/icons/list_selected.png',
		window : require('modules/cattree/main').create('Fakultäten')
	}, {
		icon : '/icons/fav.png',
		selectedIcon : '/icons/fav_selected.png',
		window : require('modules/favorites/main').create('Merkliste')
	}];

	if (Ti.Platform.name === 'android') {
		self = Ti.UI.createTabGroup();
		var tab0 = Ti.UI.createTab(tabs[0]);
		var tab1 = Ti.UI.createTab(tabs[1]);
		var tab2 = Ti.UI.createTab(tabs[2]);
		var tab3 = Ti.UI.createTab(tabs[3]);
		var tab4 = Ti.UI.createTab(tabs[4]);
	} else {
		self = Ti.UI.TabBar.createTabBar({
			selectedImageTintColor : 'red',
			tabBarColor : '#000'
		});
		var tab0 = Ti.UI.TabBar.createTab(tabs[0]);
		var tab1 = Ti.UI.TabBar.createTab(tabs[1]);
		var tab2 = Ti.UI.TabBar.createTab(tabs[2]);
		var tab3 = Ti.UI.TabBar.createTab(tabs[3]);
		var tab4 = Ti.UI.TabBar.createTab(tabs[4]);
	}
	Ti.App.addEventListener('favs_changed', function(e) {
		var favs = e.videos;
		if (e.videos.length)
			tab3.badge = e.videos.length;
		else
			tab3.badge = null;
	});
	self.addTab(tab0);
	
	self.addTab(tab2);self.addTab(tab1);
//	self.addTab(tab3);

	var dialog = require('/modules/login/dialog').create({}, function(_user) {
		console.log(_user);
		self.user = _user;
		tab5.window.navtitle.text = _user.title;
		//	tab5.window.add(require('modules/login/usermessage').create(self.user));
	});
	/*
	 tab5.addEventListener('focus', function(t) {
	 if (!self.user)
	 dialog.open();
	 });
	 tab5.addEventListener('blur', function(t) {
	 dialog.close();
	 });
	 */
	return self;
};
