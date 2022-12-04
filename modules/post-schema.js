const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let postSchema = new Schema({
    email: String,
    firstname: String,
    lastname: String,
    password: String,
    usertype: Number
}, {
    versionKey: false
});

module.exports = postSchema;