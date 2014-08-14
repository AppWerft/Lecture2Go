Object.prototype.toType = function() {
  return ({}).toString.call(this).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};