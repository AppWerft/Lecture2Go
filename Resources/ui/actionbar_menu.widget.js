module.exports = function(_e) {
	var elem = _e.source;
	var self = elem.getActivity();
	if (self) {
		self.onCreateOptionsMenu = function(e) {
			var menu = e.menu;
			};
		var ab = self.actionBar;
		if (ab) {
			ab.displayHomeAsUp = false;
			ab.setTitle('Lecture2Go');
		}
	}
};
