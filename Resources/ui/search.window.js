exports.create = function() {
	var options = arguments[0] || {};
	var self = require('modules/l2g').create();
	var search = Ti.UI.createSearchBar({
		height : '45dp',
		barColor : '#000',
		showCancel : true,
		backgroundColor : '#F17B0D',
		top : 0,
		focusable : true,
		softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS,
		hintText : 'Suchwort'
	});
	self.add(search);
	var section = Ti.UI.createListSection();
	self.listview = Ti.UI.createListView({
		//searchView : search,
		top : '45dp',
		templates : {
			'row' : require('ui/TEMPLATES').videorow,
		},
		defaultItemTemplate : 'row',
		sections : [section]

	});
	self.add(self.listview);
	self.update = function(_needle) {
		Ti.App.Lecture2Go.searchNeedle({
			needle : _needle,
			onload : function(_datas) {
				var listitems = [];
				for (var i = 0; i < _datas.length; i++) {
					var video = _datas[i];
					listitems.push({
						properties : {
							allowsSelection : true,
							itemId : video.id,
							accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
						},
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
							text : ''
						}
					});
				}
				section.setItems(listitems);
				self.listview.sections = [section];
				section.headerView = require('ui/sectionheader.widget').create('Suche nach „' + _needle + '“ ergab ' + listitems.length + ' Treffer.');
				//console.log(self.listview.sections);
			}
		});
	};
	self.listview.addEventListener('itemclick', function(_e) {
		var win = require('ui/videohomepage.window').create(_e.itemId).open();
	});
	self.addEventListener('open', function() {
		if (Ti.Android) {
			var activity = self.getActivity();
			if (activity.actionBar) {
				var abextras = require('com.alcoapps.actionbarextras');
				abextras.setExtras({
					title : 'Vorlesungsreihen',
					subtitle : options.title,
					backgroundColor : '#ff4f00'
				});
				activity.actionBar.setDisplayHomeAsUp(true);
				activity.actionBar.onHomeIconItemSelected = function() {
					self.close();
				};
			}
		}
	});
	self.addEventListener('focus', function() {
		search.value = '';
		search.focus();
	});
	search.addEventListener('change', function(_e) {
		var needle = search.getValue();
		if (needle.length > 2) {
			self.update(needle);
			setTimeout(function() {
				search.blur();
			}, 1500);
		}
	});
	return self;
};
