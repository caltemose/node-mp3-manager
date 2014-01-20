var fs = require('fs'),
    ffmetadata = require("ffmetadata");

module.exports = function(nmm) {
  return {
    index: function(req, res) {
      res.render('tunes', {music: require('../dbs/db')});
    }
  }
}
