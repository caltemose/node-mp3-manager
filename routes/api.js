var fs = require('fs'),
    ffmetadata = require("ffmetadata");

module.exports = function(nmm) {
  return {
    tracks: function(req, res) {
      //return a track object if given an id via GET
      if (req.query.id) {
        var id = req.query.id;
        fs.exists(id, function(exists) {
          if (exists) {
            ffmetadata.read(id, function(err, data) {
              if (err) res.jsonp({"err":"error reading meta info for: " + id});
              else {
                data.path = id;
                res.jsonp(data);
              }
            });
          } else {
            res.jsonp({"err":"file does not exist: " + id});
          }
        });

      //@TODO parse db into just an array of tracks? not sure i care...
      //otherwise return the database
      } else res.jsonp(require('../dbs/db'));
    },

    albums: function(req, res) {
      res.jsonp(require('../dbs/db'));
    },

    paths: function(req, res) {
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

      walk(nmm.paths.music, function(err, results) {
        if (err) throw err;
        res.jsonp(results);
      });
    },

    saveDb: function(req, res) {
      var txt = '[' + "\n", albumProp, trackProp, i, 
          musicSorted = req.body.music;
      //for each album
      for(i=0; i<musicSorted.length; i++) {
        txt += "\t" + '{' + "\n";
        //for each album property
        for(j in musicSorted[i]) {
          if(j != "tracks") {
            albumProp = musicSorted[i][j];
            if (albumProp) {
              albumProp = albumProp.replace(/"/g, '').replace(/\\/g, '');
              txt += "\t\t" + '"' + j + '":"' + albumProp + '", ' + "\n";
            }
          } else if (musicSorted[i][j].length) {
            txt += "\t\t" + '"tracks":[' + "\n";
            //for each track
            for(k=0; k<musicSorted[i][j].length; k++) {
              txt += "\t\t\t" + '{';
              track = musicSorted[i][j][k];
              //for each track property
              for(l in track) {
                trackProp = track[l];
                if (trackProp) {
                  trackProp = trackProp.replace(/"/g, '').replace(/\\/g, '');
                  txt += '"' + l + '":"' + trackProp + '",';
                }
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
      txt += ']';

      var filepath = nmm.paths.db;
      fs.writeFile(filepath, txt, function(err){
        var data = {};
        data.filepath = filepath.substr(1);
        if (err) data.err = err;
        res.jsonp(data);
      });
      
    }


  }
}
