// Toni   d98b399c4bbb9e78b35d7aad753ef344ed60dea5

(function() {
	console.log('Info: Starting App ============================');
	Ti.include('prototypes.js');
	Ti.UI.backgroundImage='/assets/default.png';
	Ti.App.Lecture2Go = new (require('controls/lecture2go'))();
	Ti.App.Apiomat = new (require('controls/apiomat.adapter'))();
	var tabgroup = require('ui/tabgroup').create().open();
	require('ui/intro.window').create().open({
		animated : false
	});
})();

/*

 scp /Users/fuerst/Documents/Titanium\ Studio\ Workspace/lecture2go/build/iphone/build/Debug-iphoneos/*.ipa ra1n3r@webmasterei.com:/hausweb/tools/l2g

 https://shib.stine.uni-hamburg.de/idp/Authn/UserPassword
 https://uhh-srv-olatweb.rrz.uni-hamburg.de/olat/dmz/

 */