const mongoose = require('mongoose');

// define a schema for the listing model
// this and all other models inherit from mongoose.Schema

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  category:{
    type: String,
  },
  description:{
    type: String,
  },
  content:{
    type: String,
  },
  date:{
    type: String
  },
  tags:{
    type: String
  }
});

module.exports = mongoose.model('Blog', blogSchema);
