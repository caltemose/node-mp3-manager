var fs = require('fs');

module.exports = function(nmm) {
  return {
    index: function(req, res) {
      res.render('playlists', {"playlists": nmm.paths.playlists});
    },

    create: function(req, res) {
      var paths = req.body.playlist.split(","),
          txt = "", i,
          filepath, filename;
      filename = req.body.playlistName ? req.body.playlistName : new Date().getTime();
      filepath = nmm.paths.playlists + filename + ".m3u";

      for(i=0; i<paths.length; i++) {
        //@TODO playlist path replacement should be dynamic, not hardcoded to as: "../"
        txt += paths[i].replace("../", nmm.paths.root);
        if (i < paths.length-1) txt += "\n";
      }

      fs.writeFile(filepath, txt, function(err){
        var data = {};
        data.filepath = filepath;
        if (err) data.err = err;
        res.render('playlist-create', data);
      });      
    }


  }
}
