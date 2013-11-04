exports.create = function(title) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var menueitems = require('modules/catitems').list;
	var rightnavi = Ti.UI.createImageView({
		image : '/assets/trip.png'
	});
	rightnavi.menue = require('modules/optionsmenue').create({
		active : false,
		onclick : function(_key) {
			rightnavi.fireEvent('click', {})
			Ti.App.Model.getTree({
				key : _key,
				onload : self.updateTableView
			})
		},
		right : 10,
		items : menueitems
	});

	var self = require('modules/l2g').create({
		title : '',
		back : false,
		rightnavi : rightnavi
	}, function() {
		self.dialog.show();
	});
	self.add(rightnavi.menue);
	self.tv = Ti.UI.createTableView({
		top : w / 6,
		backgroundColor : 'transparent'
	});
	self.updateTableView = function(_data) {
		self.navtitle.text = _data.title;
		var sections = [];
		for (var s = 0; s < _data.tree.length; s++) {
			sections[s] = Ti.UI.createTableViewSection({
				headerView : require('modules/parts/headerview').create({
					title : _data.tree[s].name,
					icon : _data.icon
				})
			})
			if (_data.tree[s].subs) {
				for (var i = 0; i < _data.tree[s].subs.length; i++) {
					var department = _data.tree[s].subs[i];
					for (var id in department) {
						var row = Ti.UI.createTableViewRow({
							backgroundColor : '#fff',
							hasChild : true,
							height : Ti.UI.SIZE,
							department : {
								id : id,
								name : department[id]
							},
						});
						row.add(Ti.UI.createLabel({
							text : department[id],
							color : 'black',
							width : Ti.UI.FILL,
							left : '5dp',
							top : '10dp',
							bottom : '10dp',
							right : '10dp',
							height : Ti.UI.SIZE,
							font : {
								fontSize : '16dp',
								fontWeight: 'bold'
							}
						}));
						sections[s].add(row);
					}
				}
			}
		}
		self.tv.setData(sections);
	}

	self.add(self.tv);
	// Events:
	Ti.App.Model.getTree({
		onload : self.updateTableView
	});
	self.tv.addEventListener('click', function(_e) {
		
		self.tab.open(require('modules/cattree/channelbydepartment').create({
			department : _e.row.department
		}));
	});

	self.addEventListener('focus', function() {
		Ti.App.fireEvent('tab1_changed', {
			label : 'Fakultätsbereiche'
		})
	});
	return self;
}
