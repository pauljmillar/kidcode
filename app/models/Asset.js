var mongoose = require('mongoose');

// Create a new schema for our address data
var schema = new mongoose.Schema({
    username        :  String
  , userid          : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}  
  , html          : String
  , css          : String
  , images      : []
  , lastmodified      : Date
});


// Return an Address model based upon the defined schema
module.exports = Asset = mongoose.model('Asset', schema);
