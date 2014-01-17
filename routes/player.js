var fs = require('fs'),
    ffmetadata = require("ffmetadata"),
    path = "./music";

exports.play = function(req, res) {
  var data = {};
  if (req.query.playlist) data.playlist = req.query.playlist;
  res.render('player', data);
}