exports.create = function(_tree, _hits) {
	var self = Ti.UI.createListView({
		templates : {
			'row' : require('ui/TEMPLATES').treerow,
		},
		defaultItemTemplate : 'row'
	}), sections = [];
	function getSectionheader(label) {
		var self = Ti.UI.createView({
			backgroundColor : '#F17B0D',
			height : Ti.UI.SIZE
		});
		self.add(Ti.UI.createLabel({
			width : Ti.UI.FILL,
			left : '10dp',
			top : '2dp',
			bottom : '2dp',
			text : label,
			font : {
				fontSize : '12dp'
			},
			color : 'black'
		}));
		return self;
	}

	for (var i = 0; i < _tree.length; i++) {
		var items = [];
		for (var s = 0; s < _tree[i].subs.length; s++) {
			var item = _tree[i].subs[s];
			for (var id in item) {
				var hits = (_hits[id]>1000) ? _hits[id]/1000 + ' Aufrufe'  : _hits[id] + ' Aufrufe' ;
 				if (_hits[id]) items.push({
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
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
					}
				});
			}
		}
		sections[i] = Ti.UI.createListSection({
			headerView : getSectionheader(_tree[i].name),
			items : items
		});
	}
	self.setSections(sections);
	self.addEventListener('itemclick', function(_e) {
		var win = require('ui/lectureseries.window').create(JSON.parse(_e.itemId)).open();
	});
	return self;
};
