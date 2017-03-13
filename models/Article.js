// DEPENDENCIES
var mongoose = require("mongoose");

// SCHEMA CLASS
var Schema = mongoose.Schema;

// ARTICLE SCHEMA
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// ARTICLE MODEL
var Article = mongoose.model("Article", ArticleSchema);

// MAKE AVAILABLE EXTERNALLY
module.exports = Article;
