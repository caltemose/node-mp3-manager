var nmm = nmm || {};

var fs = require('fs'),
    ffmetadata = require("ffmetadata"),
    path = "../music";

exports.tracks = function(req, res) {
  //return a track object if given an id via GET
  if (req.query.id) {
    var id = req.query.id;
    fs.exists(id, function(exists) {
      if (exists) {
        ffmetadata.read(id, function(err, data) {
          if (err) res.jsonp({"err":"error reading meta info for: " + id});
          else {
            data.path = id;
            res.jsonp({"meta": data});
          }
        });
      } else {
        res.jsonp({"err":"file does not exist: " + id});
      }
    });

  //@TODO parse db into just an array of tracks? not sure i care...
  //otherwise return the database
  } else res.jsonp(require('../dbs/db'));
}

exports.albums = function(req, res) {
  res.jsonp(require('../dbs/db'));
}

