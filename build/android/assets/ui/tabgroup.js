exports.create = function() {
	self = Ti.UI.createTabGroup({
		exitOnClose : true,
		fullscreen:true,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	var tabs = [];
	var taboptions = [{
		//	icon : 'images/home.png',
		title : 'Neueste Videos',
		window : require('ui/home.window').create('Lecture2Go Mobile')
	}, {
		icon : 'images/search.png',
		title : 'Video-Suche',
		window : require('ui/search.window').create('Videosuche')
	}, {
		icon : 'images/list.png',
		title : 'Einrichtungen',
		window : require('modules/cattree/main').create('Fakultäten')
	}, {
		icon : 'images/favorite.png',
		title : 'Favoriten',
		window : Ti.UI.createWindow()//require('modules/favorites/main').create('Merkliste')
	}, {
		icon : 'images/preferences.png',
		title : 'Einstellungen',
		window : Ti.UI.createWindow()//require('modules/favorites/main').create('Merkliste')
	}];
	for (var i = 0; i < taboptions.length; i++) {
		tabs[i] = Ti.UI.createTab({
			title : taboptions[i].title
		});
		self.addTab(tabs[i]);
	}
	console.log('Info: tabs builded');

	var tab0 = Ti.UI.createTab(tabs[0]);
	//var tab1 = Ti.UI.createTab(tabs[1]);
	//var tab2 = Ti.UI.createTab(tabs[2]);
	//var tab3 = Ti.UI.createTab(tabs[3]);
	//var tab4 = Ti.UI.createTab(tabs[4]);
	/*
	 Ti.App.addEventListener('favs_changed', function(e) {
	 var favs = e.videos;
	 if (e.videos.length)
	 tab3.badge = e.videos.length;
	 else
	 tab3.badge = null;
	 });*/
	self.addTab(tab0);
	//self.addTab(tab2);
	//self.addTab(tab1);
	//self.addTab(tab3);
	//self.addTab(tab4);
	/*
	 var dialog = require('/modules/login/dialog').create({}, function(_user) {
	 console.log(_user);
	 self.user = _user;
	 //	tab5.window.navtitle.text = _user.title;
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
	console.log('Info: Ending building tabgroup');
	self.addEventListener('open',require('ui/actionbar_menu.widget'));
	return self;
};
