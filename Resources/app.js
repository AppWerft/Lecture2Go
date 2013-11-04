// Toni   d98b399c4bbb9e78b35d7aad753ef344ed60dea5

(function() {
	console.log('Info: Starting App ============================');
	var fb = require('facebook');
	console.log(fb);
	Ti.UI.orientation = Ti.UI.PORTRAIT;
	if (Ti.Platform.name != 'android') {
		Ti.App.Social = require('de.marcelpociot.social');
		Ti.UI.TabBar = require('me.izen.tabbar');
	}
	Ti.include('prototypes.js');
	Ti.App.CONF = {
		fontsize_title : '16dp',
		fontsize_subitle : '12dp',
		padding : '10dp',
		width_thumb : '80dp',
		color_even : '#ddd',
		color_odd : '#fff'
	};
	var modelObj = require('model/lecture2go');
	Ti.App.Model = new modelObj();
	var tabgroup = require('ui/tabgroup').create()
	tabgroup.open();
	var introWin = require('ui/intro.window').create(tabgroup);
})();

/*

 scp /Users/fuerst/Documents/Titanium\ Studio\ Workspace/lecture2go/build/iphone/build/Debug-iphoneos/*.ipa ra1n3r@webmasterei.com:/hausweb/tools/l2g

 https://shib.stine.uni-hamburg.de/idp/Authn/UserPassword
 https://uhh-srv-olatweb.rrz.uni-hamburg.de/olat/dmz/

 */