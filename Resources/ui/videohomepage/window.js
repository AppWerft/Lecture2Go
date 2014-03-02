exports.create = function(_id) {
	var self = require('modules/l2g').create();
	var videodata = Ti.App.Lecture2Go.getVideoById({
		id : _id
	});
	self.add(require('ui/videohomepage/widget').create(videodata));
	self.addEventListener('open', function() {
		if (Ti.Android && self.getActivity()) {
			self.getActivity().onCreateOptionsMenu = function(e) {
				require('ui/videohomepage/menu').add(e.menu, videodata);
			};
		}
	});
	return self;
};
