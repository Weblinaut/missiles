var mongoose = require('mongoose');
var Schema  = mongoose.Schema;
var db_name = 'NodeJS';

var Comment = new Schema({
    title : String
});

mongoose.model('comments', Comment);

mongoose.connect('mongodb://localhost:27017/' + db_name);