const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const bcrypt = require('bcrypt-nodejs');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    //User name and pass not needed due to passport plugin
    portfolioLink:{
        type: String
      },
    name:{
        type: String,
        required: 'Please enter Your Name'
      },
    photographer:{
        type: String
      },
    instagram:{
      type: String
    },
    facebook:{
      type: String
    },
    profilePicture:{
      type: { data: Buffer, contentType: String }
    },
    phoneNumber:{
      type: String
    },
    description:{
      type: String
    },
    location:{
      type: String
    },
    featured:{
      type: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});


userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
