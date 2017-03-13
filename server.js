// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var port = process.env.PORT || 3000

mongoose.Promise = Promise;

// INITIALIZE DEPENDENCIES
var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// USE STATIC DIRECTORY
app.use(express.static("public"));


// DATABASE CONFIG
mongoose.connect("mongodb://localhost/week18day3mongoose");
var db = mongoose.connection;
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//-ROUTES-
// ROUTES: SCRAPE GOOGLE NEWS FOR BLOCKCHAIN VOTING ARTICLES
app.get("/scrape", function(req, res) {
	request("https://www.google.com/search?hl=en&gl=us&tbm=nws&authuser=0&q=blockchain+voting&oq=blockchain+voting&gs_l=news-cc.12..43j43i53.1423.2799.0.4301.17.9.0.8.8.1.115.680.7j2.9.0...0.0...1ac.1.Re9Do_NKWsQ", function(error, response, html) {
		var $ = cheerio.load(html);
		$("_cnc h3").each(function(i, element) {
			var result = {};
			result.title = $(this).children("a").text();
			result.link = $(this).children("a").attr("href");
			var entry = new Article(result);
			entry.save(function(err, doc) {
				if (err) {
					console.log(err);
				}
			});
		});
	});
	res.send("Scrape Complete");
});

// ROUTES: GET ALL SCRAPED ARTICLES
app.get("/articles", function(req, res) {
	Article.find({}, function(error, doc) {
		if (error) {
			onsole.log(error);
		}
		else {
			res.json(doc);
		}
	});
});

// ROUTES: GET ARTICLE BY OBJECTID
app.get("/articles/:id", function(req, res) {
	Article.findOne({ "_id": req.params.id })
	.populate("note")
	.exec(function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			res.json(doc);
		}
	});
});

// ROUTES: CREATE NEW NOTE OR REPLACE EXISTING NOTE
app.post("/articles/:id", function(req, res) {
	var newNote = new Note(req.body);
	newNote.save(function(error, doc) {
		if (error) {
			console.log(error);
		}
		else {
			Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
			.exec(function(err, doc) {
				if (err) {
					console.log(err);
				}
				else {
					res.send(doc);
				}
			});
		}
	});
});

//START APP ON PORT 3000
app.listen(port, function() {
  console.log("App running on port 3000");
});
