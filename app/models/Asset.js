var mongoose = require('mongoose');

// Create a new schema for our address data
var schema = new mongoose.Schema({
    userid        :  String
  , html          : String
  , lastmodified      : Date
});


// Return an Address model based upon the defined schema
module.exports = Asset = mongoose.model('Asset', schema);
