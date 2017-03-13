// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

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
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// USE STATIC DIRECTORY
app.use(express.static("public"));


// DATABASE CONFIG
mongoose.connect("mongodb://heroku_tccb21n1:rfbmisegmqt848lbutmmil54dg@ds129010.mlab.com:29010/heroku_tccb21n1");
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
	request("https://www.reddit.com/r/Bitcoin/", function(error, response, html) {
		var $ = cheerio.load(html);
		$("p.title").each(function(i, element) {
			var result = {};
			result.title = $(this).text();
			result.link = $(element).children().attr("href");
			var entry = new Article(result);
			entry.save(function(err, doc) {
				if (err) {
					console.log(err);
				}
			});
		});
	});
	res.render('scraper',{title:"REDDIT'S BITCOIN SUB"});
});

// ROUTES: GET ALL SCRAPED ARTICLES
app.get("/articles", function(req, res) {
	Article.find({}, function(error, doc) {
		if (error) {
			console.log(error);
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
