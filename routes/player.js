module.exports = function(nmm) {
  return {
    play: function(req, res) {
      var data = {};
      if (req.query.id) data.id = req.query.id;
      res.render('player', data);
    }
  }
}