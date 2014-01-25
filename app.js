var nmm = {
  title: "Node Music Manager",
  version: "0.0.1",
  port: process.argv[2] || 3000,
  paths: {
    music: process.argv[3] || "../music",
    playlists: process.argv[4] || "../playlists/",
    db: process.argv[5] || "./dbs/db.json",
    // @TODO strip last directory off path instead of hard-coded string
    root: __dirname.replace("node-mp3-manager", "")
  }
}

var express = require('express'), 
    path = require('path'),
    api = require('./routes/api')(nmm),
    db = require('./routes/db')(nmm), 
    tunes = require('./routes/tunes')(nmm),
    playlists = require('./routes/playlists')(nmm),
    player = require('./routes/player')(nmm);

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded({limit: 1024 * 1024 * 10}));
app.use(express.json({limit: 1024 * 1024 * 10}));
//@TODO update these static paths using nmm.paths info
app.use('/music', express.static(nmm.paths.music));
app.use('/playlists', express.static(nmm.paths.playlists));
app.use(express.static(__dirname + '/public'));


// --- web paths (http) -------------------------
app.get('/', function(req, res) { res.render('index'); });
app.get('/player', player.play);
app.get('/tunes', tunes.index);
app.get('/playlists', playlists.index);
app.post('/playlists/create', playlists.create);

// --- utility paths (http) --------------------------------
app.get('/db/create', db.create);
app.get('/db/ajax', db.ajax);

// --- API paths (json) --------------------------------
app.get('/api', function(req, res) { res.redirect('/'); });
app.get('/api/tracks', api.tracks);
app.get('/api/albums', api.albums);
app.get('/api/paths', api.paths);
app.get('/api/playlists', api.playlists);
app.post('/api/save-db', api.saveDb);

app.listen(nmm.port);

console.log("");
console.log(nmm.title + " " + nmm.version + ' is running:');
console.log("");
console.log("  path: " + __dirname);
console.log("  port:      " + nmm.port);
console.log("  music:     " + nmm.paths.music);
console.log("  playlists: " + nmm.paths.playlists);
console.log("  database:  " + nmm.paths.db);
console.log("");
console.log("");