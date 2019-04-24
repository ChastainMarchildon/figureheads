const mongoose = require('mongoose');

// define a schema for the listing model
// this and all other models inherit from mongoose.Schema

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Please enter Listing title',
  },
  city: {
    type: String
  },
  category:{
    type: String,
    required: 'Please enter a category'
  },
  description:{
    type: String,
    required: 'Please enter a brief description'
  },
  userID:{
    type: String,
    required: 'Must be associated with a user'
  },
  date:{
    type: String
  },
  tags:{
    type: String
  }
});


// before it is saved, it will run this function
/*
listingSchema.pre('save', function (next) {
  // ! must use 'function' above so 'this' refers to correct object
  // turn datepicker datetime into a reader friendly format
  //const indexOfT = this.date.lastIndexOf('T');
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  this.date = this.date.toLocaleDateString("en-US", options);
  next();
});
*/



module.exports = mongoose.model('Listing', listingSchema);
