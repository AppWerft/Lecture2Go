exports.create = function(_args) {
	var video = _args.video;
	var w = Ti.Platform.displayCaps.platformWidth;
	var cached = Ti.App.Model.getVideoStatus({
		filename : _args.video.filename
	}).exists;
	var online = (Ti.Network.networkType == Ti.Network.NETWORK_WIFI || Ti.Network.networkType == Ti.Network.NETWORK_LAN) ? true : false;

	if (!cached && !online) {
		var options = ['Video ➤ merken', 'QR-Code senden', 'Abbruch'];
	}
	if (cached) {
		var options = ['Video ➤ merken', 'QR-Code senden', 'Video ➤ ansehen', 'Abbruch'], online = true;
	}
	if (!cached && online) {
		var options = ['Video ➤ merken', 'QR-Code senden', 'Video ➤ mitnehmen', 'Video ➤ ansehen', 'Abbruch'], online = true;
	}
	var self = Titanium.UI.createOptionDialog({
		options : options,
		cancel : options.length - 1,
		title : 'Soll dieses Video oder dieser Videokanal viralisiert werden?'
	});
	if (online)
		self.destructive = options.length - 2;
	self.addEventListener('click', function(e) {
		var message = {
			text : video.message,
			image : [video.image],
			link : [video.link]
		};
		switch (e.index) {
			case 0:
				Ti.App.Model.setFav(video)
				break;

			case 1:
				var qr = Ti.UI.createImageView({
					image : 'http://qrfree.kaywa.com/?l=1&s=20&d=' + encodeURI(message.link),
					width : w,
					height : w,
					opacity : 0,
					bottom : 0
				});
				qr.add(Ti.UI.createImageView({
					width : w / 4,
					height : w / 4,
					image : '/assets/logo.png',
					opacity : 0.9
				}));
				self.add(qr);
				qr.animate({
					opacity : 1
				})
				qr.addEventListener('click', function() {
					qr.animate({
						opacity : 0,
						duration : 1000
					}, function() {
						self.remove(qr);
						qr = null;
					});
				});
				break;
			case 2:
				_args.progress.show();
				Ti.App.Model.saveVideo2Storage({
					video : _args.video.filename,
					onload : function() {
						_args.progress.hide();
					},
					onprogress : function(_e) {
						_args.progress.setValue(_e.progress);
					}
				});
				break;
		}

	});
	return self;

}
