exports.update = function(_listview, _modus) {
	var sections = [];
	console.log('Info: start getVideoList');
	return;
	Ti.App.Model.getVideoList({
		modus : _modus,
		min : 0,
		max : 50,
		onload : function(_data) {
			console.log('Info: number of elements in videolist: ' +  _data.videos.length);
			var items = [];
			for (var i = 0; i < _data.videos.length; i++) {
				var template;
				if (i == 0)
					template = 'first';
				else
					template = (i % 2) ? 'odd' : 'even';
				items.push({
					template : template,
					title : {
						text : _data.videos[i].title
					},
					subtitle : {
						text : _data.videos[i].author
					},
					thumb : {
						image : _data.videos[i].image
					},
					duration : {
						text : parseInt(_data.videos[i].duration.split(':')[0]*60) + parseInt(_data.videos[i].duration.split(':')[1])+ ' min.'
					},
					properties : {
					//	selectionStyle : TiTi.UI.iPhone.ListViewCellSelectionStyle.NONE,
						allowsSelection : true,
						itemId : {
							video : _data.videos[i]
						},
						accessoryType : Ti.UI.LIST_ACCESSORY_TYPE_DETAIL
					}
				});
			}
			var firstitem = items.shift();
			sections[0] = Ti.UI.createListSection({
				headerView : require('modules/parts/headerview').create(_data.section),
				items : [firstitem]
			});
			sections[1] = Ti.UI.createListSection({
				headerTitle : '',
				items : items
			});
			_listview.setSections(sections);
		}
	});
};
