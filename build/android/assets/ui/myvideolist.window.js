exports.create = function() {
	var options = arguments[0] || {};
	var self = require('modules/l2g').create();
	console.log('Start Favs ==============');
	self.listview = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').videorow
		},
		defaultItemTemplate : 'row'
	});
	var sections = [Ti.UI.createListSection({
		headerTitle : 'Meine Favoriten'
	}), Ti.UI.createListSection({
		headerTitle : 'Mitnehmvideos'
	}), Ti.UI.createListSection({
		headerTitle : 'Meine letztgesehenen Videos'
	})];
	self.add(self.listview);
	self.updateSections = function() {
		Ti.App.Apiomat.getMe({}, {
			onload : function(_data) {
				var items = [], item;
				//  {"myfavorites":[{"data":{"@type":"lecture2goMain$WatchedVideo","createdAt":1393765482803,"lastModifiedAt":1393765483204,"id":"53132c6ae4b02a008da637e0","applicationName":"lecture2go","ownerUserName":"9b3f7fa3-5418-4fa3-8d74-ab35f6f56f46","moduleName":"lecture2goMain","allowedRolesRead":[],"allowedRolesWrite":[],"allowedRolesGrant":[],"restrictResourceAccess":false,"referencedHrefs":{},"videoid":15866,"videouserHref":"https://apiomat.org/yambas/rest/apps/lecture2go/models/lecture2goMain/WatchedVideo/53132c6ae4b02a008da637e0/videouser","href":"https://apiomat.org/yambas/rest/apps/lecture2go/models/lecture2goMain/WatchedVideo/53132c6ae4b02a008da637e0"},"video":{"ctime":"2014-01-06_18-15","duration_min":73,"ctime_i18n":"Montag, 6. Januar 2014 18:15 Uhr","day":"2014-01-06","ratio":0.75,"title":"Bildung und Gerechtigkeit: Anna Siemsen (1882-1952)","hits":63,"author":"Prof. Dr. Christine Mayer","publisher":"Uni Hamburg","description":"","pathpart":"6l2gkooepb","id":15866,"filename":"41-61.081_mayer_2014-01-06_18-15.mp4","downloadlink":1,"channel":{"id":4251,"lang":"de_DE","nr":"41-61.081","name":"Bildung und Gerechtigkeit"},"duration":"01:13:28","videouri":{"cuppertino":"http://fms1.rrz.uni-hamburg.de/vod/_definst_/mp4:6l2gkooepb/41-61.081_mayer_2014-01-06_18-15/playlist.m3u8","mp4":"http://fms1.rrz.uni-hamburg.de/abo/41-61.081_mayer_2014-01-06_18-15.mp4","rtsp":"rtsp://fms.rrz.uni-hamburg.de/vod/_definst_/mp4:6l2gkooepb/41-61.081_mayer_2014-01-06_18-15.mp4"},"thumb":"https://lecture2go.uni-hamburg.de/images/41-61.081_mayer_2014-01-06_18-15_m.jpg","image":"https://lecture2go.uni-hamburg.de/images/41-61.081_mayer_2014-01-06_18-15.jpg"}},{"data":{"@type":"lecture2goMain$WatchedVideo","createdAt":1393787462041,"lastModifiedAt":1393787462532,"id":"53138246e4b02a008da64456","applicationName":"lecture2go","ownerUserName":"9b3f7fa3-5418-4fa3-8d74-ab35f6f56f46","moduleName":"lecture2goMain","allowedRolesRead":[],"allowedRolesWrite":[],"allowedRolesGrant":[],"restrictResourceAccess":false,"referencedHrefs":{},"videoid":16001,"videouserHref":"https://apiomat.org/yambas/rest/apps/lecture2go/models/lecture2goMain/WatchedVideo/53138246e4b02a008da64456/videouser","href":"https://apiomat.org/yambas/rest/apps/lecture2go/models/lecture2goMain/WatchedVideo/53138246e4b02a008da64456"},"video":{"ctime":"2014-02-18_13-58","duration_min":5,"ctime_i18n":"Dienstag, 18. Februar 2014 13:58 Uhr","day":"2014-02-18","ratio":0.5625,"title":"MCC Premiere CS6 Tutorials - 6. Rohschnitt & Werkzeuge","hits":84,"author":"MCC Videoteam","publisher":"MCC Videoteam","description":"","pathpart":"37l2gmccvideoteam","id":16001,"filename":"00.000_MCCVideoteam_2014-02-18_13-58.mp4","downloadlink":1,"channel":{"id":4079,"lang":"de","nr":"00.000","name":"MCC Tutorials"},"duration":" 00:05:29","videouri":{"cuppertino":"http://fms1.rrz.uni-hamburg.de/vod/_definst_/mp4:37l2gmccvideoteam/00.000_MCCVideoteam_2014-02-18_13-58/playlist.m3u8","mp4":"http://fms1.rrz.uni-hamburg.de/abo/00.000_MCCVideoteam_2014-02-18_13-58.mp4","rtsp":"rtsp://fms.rrz.uni-hamburg.de/vod/_definst_/mp4:37l2gmccvideoteam/00.000_MCCVideoteam_2014-02-18_13-58.mp4"},"thumb":"https://lecture2go.uni-hamburg.de/images/00.000_MCCVideoteam_2014-02-18_13-58_m.jpg","image":"https://lecture2go.uni-hamburg.de/images/00.000_MCCVideoteam_2014-02-18_13-58.jpg"}},{"data":{"@type":"lecture2goMain$WatchedVideo","createdAt":1393956009328,"lastModifiedAt":1393956010274,"id":"531614a9e4b0eee571e8615c","applicationName":"lecture2go","ownerUserName":"9b3f7fa3-5418-4fa3-8d74-ab35f6f56f46","moduleName":"lecture2goMain","allowedRolesRead":[],"allowedRolesWrite":[],"allowedRolesGrant":[],"restrictResourceAccess":false,"referencedHrefs":{},"videoid":13710,"videouserHref":"https://apiomat.org/yambas/rest/apps/lecture2go/models/lecture2goMain/WatchedVideo/531614a9e4b0eee571e8615c/videouser","href":"https://apiomat.org/yambas/rest/apps/lecture2go/models/lecture2goMain/WatchedVideo/531614a9e4b0eee571e8615c"},"video":{"ctime":"2012-06-12_18-25","duration_min":60,"ctime_i18n":"Dienstag, 12. Juni 2012 18:25 Uhr
				while ( item = _data.myfavorites.pop()) {
					console.log(item);
					items.push({
						title : {
							text : item.video.title
						},
						subtitle : {
							text : item.video.author
						},
						thumb : {
							image : item.video.thumb
						},
						duration : {
							text : parseInt(item.video.duration.split(':')[0] * 60) + parseInt(item.video.duration.split(':')[1]) + ' min.'
						},
						properties : {
							//	selectionStyle : TiTi.UI.iPhone.ListViewCellSelectionStyle.NONE,
							allowsSelection : true,
							itemId : item.video.id,
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
						}
					});
				}
				sections[0].setItems(items);
				self.listview.sections = sections;
			}
		});
	};
	self.listview.addEventListener('itemclick', function(_e) {
		var win = require('ui/videohomepage/window').create(_e.itemId);
		win.open();
	});
	Ti.App.addEventListener('app:lecture2go_ready', function() {
		console.log('Info: Lecture2go ready ================');

		self.lecture2goready = true;
		if (self.lecture2goready && self.apiomatuserready)
			self.updateSections();
	});
	Ti.App.addEventListener('app:apiomatuser_ready', function() {
		console.log('Info: APIOMAT-user ready ==============');
		self.apiomatuserready = true;
		if (self.lecture2goready && self.apiomatuserready)
			self.updateSections();

	});
	self.addEventListener('open', function() {
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
			}
		}
	});
	return self;
};
