// DEPENDENCIES
var mongoose = require("mongoose");

// SCHEMA CLASS
var Schema = mongoose.Schema;

// NOTE SCHEMA
var NoteSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});

// NOTE MODEL
var Note = mongoose.model("Note", NoteSchema);

// MAKE AVAILABLE EXTERNALLY
module.exports = Note;
