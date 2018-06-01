var express = require("express");
var mongojs = require("mongojs");
var bodyparser = require("body-parser");
var db = require("./models");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var app = express();

var port = process.env.PORT || 3000;

// mongoose.connect("mongodb://localhost/reviewDB");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/reviewDB";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static("public"));

app.get("/scrape", function(req, res) {
  request("https://pitchfork.com/best/", function(e, r, html) {
    if (e) throw e;
    var $ = cheerio.load(html);
    $("div.bnm-small.album-small").each(function(i, element) {
      var result = {
        artist: $(element)
          .find(".artist-list li")
          .text(),
        title: $(element)
          .find("h2.title")
          .text(),
        genre: $(element)
          .find("li.genre-list__item")
          .text(),
        img: $(element)
          .find("img")
          .attr("src"),
        link:
          "https://pitchfork.com" +
          $(element)
            .children("a")
            .attr("href")
      };

      db.reviews
        .create(result)
        .then(function(dbReview) {
        //   console.log(dbReview);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
  });
});

app.get("/reviews", function(req, res) {
  db.reviews
    .find({})
    .then(function(dbReviews) {
      res.json(dbReviews);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/comments", function(req, res) {
  db.comments
    .find({})
    .then(function(dbReviews) {
      res.json(dbReviews);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/comments/new", function(req, res) {
  db_id = req.body.review_id;
  var commentObj = {
      comment : req.body.comment,
      is_deleted: false
  }
  db.comments
    .create({ comment: req.body.comment, is_deleted: false })
    .then(function(dbReview) {
      console.log(dbReview);
      console.log(dbReview._id)
      return db.reviews.findByIdAndUpdate(
        { _id: db_id },
        { $push: { comment: dbReview._id } },
        { new: true }
      );
    })
    .catch(function(e) {
      res.send(e);
    });
});

app.get("/reviews/:id", function(req, res) {
  db.reviews
    .findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbReview) {
      res.json(dbReview);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.delete("/comments/:id", function(req, res) {
    db.comments
    .deleteOne({_id: req.params.id})
    .then(function(dbCommentDelete) {
        res.json(dbCommentDelete);
      })
      .catch(function(err) {
        res.json(err);
      });
})


app.listen(port, function(e) {
  if (e) throw e;
  console.log("Listening on: " + port);
});


// app.put("/comments/:id", function(req, res) {
//     db.comments
//     .findOne({_id: req.params.id})
//     .update({"is_deleted": false}, {$set: {"is_deleted" : true}})
//     .then(function(dbComment) {
//         res.json(dbComment);
//       })
//       .catch(function(err) {
//         res.json(err);
//       });
// })
