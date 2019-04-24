const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

const passportLocalMongoose = require('passport-local-mongoose');

const imageSchema = new mongoose.Schema({
    img: { data: Buffer, contentType: String }
});

imageSchema.plugin(passportLocalMongoose);
imageSchema.plugin(findOrCreate);

module.exports = mongoose.model('Image', imageSchema);