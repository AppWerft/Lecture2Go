exports.videorow = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'black'
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'thumb',
		properties : {
			height : '55dp',
			width : '90dp',
			left : 0,
			top : '5dp',
			defaultImage : '/assets/l2g.png'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'duration',
		properties : {
			color : '#ddd',
			height : '16dp',
			font : {
				fontSize : '10dp',
				fontFamily : 'TheSans-B7Bold'
			},
			left : 5,
			text : '____',
			width : Ti.UI.FILL,
			bottom : 1,

		},
		events : {}
	}, {
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			left : '100dp',
			right : '20dp',
			layout : 'vertical'
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				color : '#F17B0D',
				height : Ti.UI.SIZE,
				font : {
					fontSize : '16dp',
					fontWeight : 'bold',
					//			fontFamily : 'Helvetica'
				},
				left : 0,
				width : Ti.UI.FILL,
				top : '5dp',
				right : '15dp'
			},
			events : {}
		}, {
			type : 'Ti.UI.Label',
			bindId : 'subtitle',
			properties : {
				color : '#ccc',
				height : '20dp',
				font : {
					fontSize : '13dp',
					fontFamily : 'TheSans-B7Bold'
				},
				left : 0,
				width : Ti.UI.FILL,
				top : '10dip',
				left : 0
			},
			events : {}
		}]
	}]
};

exports.firstvideorow = {
	properties : {
		height : '200dp'
	},
	childTemplates : [{
		type : 'Ti.UI.View',
		properties : {
			width : Ti.UI.FILL,
		},
		childTemplates : [{
			type : 'Ti.UI.ImageView',
			bindId : 'thumb',
			properties : {
				height : Ti.UI.FILL,
				width : Ti.UI.FILL,
				defaultImage : '/assets/logo.png'
			},
			events : {}
		}]
	}]
};
