exports.create = function() {
	self = Ti.UI.createTabGroup({
		exitOnClose : true,
		fullscreen : true,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	var tabs = [];
	var taboptions = [{
		title : 'Neuankömmlinge',
		window : require('ui/videolist.window').create({
			key : 'latest'
		})
	}, {
		title : 'Straßenfeger',
		window : require('ui/videolist.window').create({
			key : 'popular'
		})
	}, {
		icon : 'images/list.png',
		title : 'Gesamtkatalog',
		window : require('ui/departmenttree.window').create()
	}, {
		title : 'Suchen&Finden',
		window : require('ui/search.window').create()

	}, {
		icon : 'images/favorite.png',
		title : 'Meine Favoriten',
		window : Ti.UI.createWindow()//require('modules/favorites/main').create('Merkliste')
	}];
	for (var i = 0; i < taboptions.length; i++) {
		tabs[i] = Ti.UI.createTab({
			title : taboptions[i].title,
			window : taboptions[i].window
		});
		self.addTab(tabs[i]);
	}
	self.addEventListener('open', require('ui/actionbar_menu.widget'));
	return self;
};
