var fs = require('fs'),
    ffmetadata = require("ffmetadata");

exports.start = function(req, res) {
  var path = "../music",
      music = [];

  var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var i = 0;
      (function next() {
        var file = list[i++];
        if (!file) return done(null, results);
        file = dir + '/' + file;
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            //results.push(file);
            walk(file, function(err, res) {
              results = results.concat(res);
              next();
            });
          } else {
            var ext = file.split('.').pop();
            if (ext==="mp3" || ext==="m4p") 
              results.push(file);
            next();
          }
        });
      })();
    });
  };

  walk(path, function(err, results) {
    if (err) throw err;
    var i, track, indx = 0;
    for(i=0;i<results.length;i++) {
      track = { path: results[i] };
      music.push(track);
    }
    var metacallback = function(err, data) {
      if (err) console.error("Error reading metadata:" + err);
      else {
        data.path = music[indx].path;
        music[indx] = data;
        if (indx < music.length-1) {
          indx++;
          getMeta(music[indx].path);
        } else {
          console.log('mp3 files data loaded: ' + music.length);
          //console.log(music);
          res.send('mp3 files data loaded: ' + music.length);
        }
      }
    };
    var getMeta = function(path) {
      ffmetadata.read(path, metacallback);  
    };
    getMeta(music[0].path);
  });

};
