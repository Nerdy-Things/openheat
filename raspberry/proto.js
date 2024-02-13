const moment = require("moment");

String.prototype.cutExceptLast4 = function() {
  // Check if the string's length is greater than 4
  if (this.length > 4) {
    // Return the last 4 characters of the string
    return this.substring(this.length - 4);
  } else {
    // If the string is 4 characters or less, return the original string
    return this;
  }
};

String.prototype.toDateFormat = function () {
  const date = moment(new Date(this));
  return date.format("HH:mm:ss DD.MM.YYYY");
}



String.prototype.toTime = function () {
  const date = moment(new Date(this));
  return date.format("HH:mm:ss");
}

Date.prototype.toDateFormat = function () {
  const date = moment(this);
  return date.format("HH:mm:ss DD.MM.YYYY");
}

Date.prototype.toTime = function () {
  const date = moment(this);
  return date.format("HH:mm:ss");
}