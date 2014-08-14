module.exports = function(_tree, _hits) {
	var self = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').treerow,
		},
		defaultItemTemplate : 'row'
	}), sections = [];

	for (var i = 0; i < _tree.length; i++) {
		var items = [];
		for (var s = 0; s < _tree[i].subs.length; s++) {
			var item = _tree[i].subs[s];
			for (var id in item) {
				if (item.hasOwnProperty(id)) {
					console.log(id + '  ' + item[id] + '    #' + _hits[id]);
					var hits = (_hits[id] > 1000) ? _hits[id] / 1000 + ' Aufrufe' : _hits[id] + ' Aufrufe';
					if (_hits[id])
						items.push({
							title : {
								text : item[id]
							},
							statistic : {
								text : (_hits[id]) ? hits : ''
							},
							properties : {
								allowsSelection : true,
								itemId : JSON.stringify({
									id : id,
									title : item[id]

								}),
								accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
							}
						});
				}
			}
		}
		sections[i] = Ti.UI.createListSection({
			headerView : require('ui/sectionheader.widget').create(_tree[i].name),
			items : items
		});
	}
	self.setSections(sections);
	self.addEventListener('itemclick', function(_e) {
		var win = require('ui/lectureseries.window').create(JSON.parse(_e.itemId)).open();
	});
	return self;
};