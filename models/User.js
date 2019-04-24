const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

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
    profilePicture:{
      type: { data: Buffer, contentType: String }
    }
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
