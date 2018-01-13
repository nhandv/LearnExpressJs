//Database connection and configuration
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/restuarant");
var userSchema = mongoose.Schema({
    username:{
        type:String,
        unique: true,
        reqired: true,
        trim: true
    },
    password:{
        type:String,
        required: true
    },
    passwordConf:{
        type:String,
        required:true
    }
});

var user = mongoose.model('user',userSchema);

exports.user = user;
