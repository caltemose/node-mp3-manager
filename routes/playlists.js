var fs = require('fs');

exports.create = function(req, res) {
  var paths = req.body.playlist.split(","),
      txt = "", i,
      filepath = "playlists/playlist.m3u";

  for(i=0; i<paths.length; i++) {
    txt += paths[i];
    if (i < paths.length-1) txt += "\n";
  }

  fs.writeFile(filepath, txt, function(err){
    var data = {};
    data.filepath = filepath;
    if (err) data.err = err;
    res.render('playlist-create', data);
  });
  
}