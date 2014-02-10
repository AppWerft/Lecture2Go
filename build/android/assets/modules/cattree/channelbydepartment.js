exports.create = function(_args) {
	var w = Ti.Platform.displayCaps.platformWidth;
	var self = require('/modules/l2g').create({
		title : _args.department.name,
		back : true
	});
	self.tv = Ti.UI.createTableView({
		top : w / 6,
		backgroundColor : 'transparent'
	});
	var channels = Ti.App.Model.getChannelsByDepartment({
		id : _args.department.id
	});
	var rows = [];
	for (var i = 0; i < channels.length; i++) {
		var row = Ti.UI.createTableViewRow({
			backgroundColor : '#fff',
			hasChild : true,
			height : Ti.UI.SIZE,
			width : Ti.UI.FILL,
			video : channels[i].video
		});
		row.add(Ti.UI.createImageView({
			image : channels[i].image,
			left : 0,
			top : 0,
			borderWidth : 1,
			borderRadius : '5dp',
			borderColor : 'silver',
			height : Ti.UI.SIZE,
			width : '90dp',
		}));
		var container = Ti.UI.createView({
			left : '100dp',
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			layout : 'vertical'
		});
		container.add(Ti.UI.createLabel({
			text : channels[i].name,
			color : 'black',
			width : Ti.UI.FILL,
			left : 0,
			right : '10dp',
			top : '5dp',
			bottom : 0,
			height : Ti.UI.SIZE,
			font : {
				fontSize : '16dp',
				fontWeight : 'bold'
			}
		}));
		container.add(Ti.UI.createLabel({
			text : channels[i].instructors,
			color : 'gray',
			width : Ti.UI.FILL,
			left : '1dp',
			right : '10dp',
			top : '5dp',
			bottom : '5dp',
			height : Ti.UI.SIZE,
			font : {
				fontSize : '14dp',
				fontFamily : 'TheSans-B6SemiBold'
			}
		}));
		row.add(container);
		rows.push(row);
	}
	self.tv.setData(rows);
	self.add(self.tv);
	self.tv.addEventListener('click', function(_e) {
		console.log(_e.rowData.video);
		self.tab.open(require('modules/videoplayer/main').create(_e.rowData.video), {
			animated : true
		});
	});
	return self;
};
