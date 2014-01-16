var fs = require('fs'),
    ffmetadata = require("ffmetadata");

exports.index = function(req, res) {
  //API docs
  res.render('index', { title: 'Music Library API' });
}

exports.music = function(req, res) {
  var path = "./music",
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
          res.jsonp(music);
          /*
          console.log('mp3 files data loaded: ' + music.length);
          //console.log(music);
          var i, html = "<h1>MP3 Files</h1>";
          html += "<h2>" + path + "</h2>";
          html += '<ul>';
          for(i=0; i<music.length; i++) {
            html += '<li>';
            html += '<ul>';
            html += '<li>Title: ' + music[i].title + '</li>';
            html += '<li>Path: ';
            html += '<a href="' + music[i].path + '">';
            html += music[i].path + '</a></li>';
            html += '<li>Album: ' + music[i].album + '</li>';
            html += '<li>Artist: ' + music[i].artist + '</li>';
            html += '</ul>';
            html += '</li>' + "\n";
          }
          html += '</ul>';
          res.send(html);
          */

        }
      }
    };
    var getMeta = function(path) {
      ffmetadata.read(path, metacallback);  
    };
    getMeta(music[0].path);
  });

};


