var mongoose = require('mongoose');

// Create a new schema for our address data
var schema = new mongoose.Schema({
    dayofyear       : String
  , sequence        : String
  , lessonid        :  {type: Schema.Types.ObjectId, ref: 'Lesson'}
  , status          : String
  , lastmodified    : Date
});



// Return an Address model based upon the defined schema
module.exports = Log = mongoose.model('Log', schema);
