var fs = require('fs'),
    ffmetadata = require("ffmetadata");

module.exports = function(musicPath, playlistsPath) {
  return {
    ajax: function(req, res) {
      res.render('db-create-ajax');
    },

    create: function(req, res) {
      var music = [];
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

      walk(musicPath, function(err, results) {
        if (err) throw err;
        var i, track, indx = 0;
        for(i=0;i<results.length;i++) {
          track = { path: results[i] };
          music.push(track);
        }
        var metacallback = function(err, data) {
          if (err) console.error("Error reading metadata:" + err);
          else {
            var i, j, k, l;
            data.path = music[indx].path;
            music[indx] = data;
            if (indx < music.length-1) {
              indx++;
              getMeta(music[indx].path); } 
            else {
              var musicSorted = [], album = {}, track;
              for(i=0; i<music.length; i++) {
                track = music[i];
                if (track.comment) delete track.comment;
                for(j in track) {
                  if (typeof track[j]==="string" && track[j].match(/^\s+$/i)) 
                    delete track[j];
                  //console.log(track[j].indexOf("\\"));
                }

                if (music[i].album === album.album) {
                  //same album
                  album.tracks.push(track);
                } else {
                  //new album
                  album = {};
                  album.album = track.album;
                  album.artist = track.artist;
                  album.genre = track.genre;
                  album.date = track.date;
                  //@TODO strip file name (included in above TODO)
                  album.path = track.path;
                  album.tracks = [];
                  album.tracks.push(track);
                  musicSorted.push(album);
                }
              }
              //res.jsonp(musicSorted);
              var filepath = "./dbs/db.json";
              var txt = '{"music":[' + "\n";
              //for each album
              for(i=0; i<musicSorted.length; i++) {
                txt += "\t" + '{' + "\n";
                //for each album property
                for(j in musicSorted[i]) {
                  if(j != "tracks")
                    txt += "\t\t" + '"' + j + '":"' + musicSorted[i][j] + '", ' + "\n";
                  else if (musicSorted[i][j].length) {
                    txt += "\t\t" + '"tracks":[' + "\n";
                    //for each track
                    for(k=0; k<musicSorted[i][j].length; k++) {
                      txt += "\t\t\t" + '{';
                      track = musicSorted[i][j][k];
                      //for each track property
                      for(l in track) {
                        txt += '"' + l + '":"' + track[l] + '",';
                      }
                      txt = txt.substr(0, txt.length-1); //strip comma
                      txt += '}';
                      if (k<musicSorted[i][j].length-1) txt += ',';
                      txt += "\n";
                    }
                    txt += "\t\t" + ']' + "\n";
                  }
                }
                txt += "\t" + '}';
                if (i<musicSorted.length-1) txt += ',';
                txt += "\n";
              }
              txt += ']}';
              res.send(txt);
              var filepath = './dbs/db.json';
              fs.writeFile(filepath, txt, function(err){
                var data = {};
                data.filepath = filepath.substr(1);
                if (err) data.err = err;
                res.render('db-create', data);
              });
            }
          }
        };
        var getMeta = function(path) {
          ffmetadata.read(path, metacallback);  
        };
        getMeta(music[0].path);
      });
    }
  };
};
