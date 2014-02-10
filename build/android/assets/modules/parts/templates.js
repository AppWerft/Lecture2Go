exports.videorow = {
	properties : {
		height : Ti.UI.SIZE,
		backgroundColor : 'white'
	},
	childTemplates : [{
		type : 'Ti.UI.ImageView',
		bindId : 'thumb',
		properties : {
			height : '55dp',
			width : '90dp',
			left : 0,
			top : 0,
			defaultImage : '/assets/logo.png'
		}
	}, {
		type : 'Ti.UI.Label',
		bindId : 'duration',
		properties : {
			color : '#666',
			height : '16dp',
			font : {
				fontSize : '13dp',
				fontWeight : 'bold',
				fontFamily : 'TheSans-B7Bold'
			},
			left : 5,
			text : '01.06.2013',
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
			backgroundColor : 'white',
			layout : 'vertical'
		},
		childTemplates : [{
			type : 'Ti.UI.Label',
			bindId : 'title',
			properties : {
				color : '#222',
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
				color : '#666',
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
