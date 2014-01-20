module.exports = function(nmm) {
  return {
    play: function(req, res) {
      var data = {};
      if (req.query.playlist) data.playlist = req.query.playlist;
      res.render('player', data);
    }
  }
}