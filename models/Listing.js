const mongoose = require('mongoose');

// define a schema for the listing model
// this and all other models inherit from mongoose.Schema

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Please enter Listing title',
  },
  city: {
    type: String,
    required: 'Please enter City',
  },
  description:{
    type: String,
    required: 'Please enter a brief description'
  },
  postingDetails:{
    type:String,
    required: 'Please enter the body of the posting'
  },
  userID:{
    type: String,
    required: 'Must be associated with a user'
  }
});

/*   Code used for images later
// before it is saved, it will run this function
listingSchema.pre('save', function (next) {
  // ! must use 'function' above so 'this' refers to correct object
  // get year from last 4 characters of imageUrl
  this.year = this.imageUrl.substr(-4);
  next();
});

listingSchema.methods.lastUrl = function () {
  const indexOfSlash = this.imageUrl.lastIndexOf('/');
  return this.imageUrl.substring(indexOfSlash + 1);
};
*/

module.exports = mongoose.model('Listing', listingSchema);
