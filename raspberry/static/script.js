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