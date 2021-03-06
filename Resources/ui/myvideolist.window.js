exports.create = function() {
	var options = arguments[0] || {};
	var self = require('modules/l2g').create();
	self.listview = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').videorow
		},
		defaultItemTemplate : 'row'
	});
	var sections = [Ti.UI.createListSection({
		headerTitle : null
	})];
	self.add(self.listview);
	self.updateSections = function() {
		if (!self.apiomatuserready)
			return;
		Ti.App.Apiomat.getMyFavorites({}, {
			onload : function(_listofvideos) {
				if (!_listofvideos)
					return;
				var dataitems = [], videoitem;
				for (var i = 0; i < _listofvideos.length; i++) {
					var video = _listofvideos[i].video;
					if (!video)
						continue;
					dataitems.unshift({
						title : {
							text : video.title
						},
						subtitle : {
							text : video.author
						},
						thumb : {
							image : video.thumb
						},
						duration : {
							text : parseInt(video.duration.split(':')[0] * 60) + parseInt(video.duration.split(':')[1]) + ' min.'
						},
						properties : {
							//	selectionStyle : TiTi.UI.iPhone.ListViewCellSelectionStyle.NONE,
							allowsSelection : true,
							itemId : video.id,
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLUSURE
						}
					});
				}
				sections[0].setItems(dataitems);
				self.listview.sections = sections;
			}
		});
	};
	self.listview.addEventListener('itemclick', function(_e) {
		var win = require('ui/videohomepage/window').create(_e.itemId);
		win.open();
	});
	Ti.App.addEventListener('app:lecture2go_ready', function() {
		return;
		self.lecture2goready = true;
		self.updateSections();
	});
	Ti.App.addEventListener('app:apiomatuser_ready', function() {
		self.apiomatuserready = true;
		self.updateSections();

	});
	self.addEventListener('focus', self.updateSections);
	self.addEventListener('open', function() {
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
			}
		}
	});
	return self;

};

