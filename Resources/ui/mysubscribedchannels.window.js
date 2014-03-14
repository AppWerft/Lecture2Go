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
		Ti.App.Apiomat.getMySubscribedChannels({}, {
			onload : function(_listofchannels) {
				if (!_listofchannels) {
					Ti.UI.createNotification({message:'Es liegen noch keine abonnierten Vorlesungsreihen vor.'}).show();
					return;
				}
				var dataitems = [], channelitem;
				for (var i = 0; i < _listofchannels.length; i++) {
					var channel = _listofchannels[i]
					if (!channel)
						continue;
					dataitems.unshift({
						title : {
							text : channel.name
						},
						subtitle : {
							text : channel.author
						},
						thumb : {
							image : channel.thumb
						},
						properties : {
							//	selectionStyle : TiTi.UI.iPhone.ListViewCellSelectionStyle.NONE,
							allowsSelection : true,
							itemId : JSON.stringify(channel),
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
						}
					});
				}
				sections[0].setItems(dataitems);
				self.listview.sections = sections;
			}
		});
	};
	self.listview.addEventListener('itemclick', function(_e) {
		var channel =JSON.parse( _e.itemId);
		require('ui/videolist.window').create({
			key : 'channel',
			value : channel.id,
			title :'Abonnierte Vorlesungsreihe',
			subtitle: channel.name,
		}).open();
	});
	Ti.App.addEventListener('app:lecture2go_ready', function() {
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

