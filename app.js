//@TODO create nmm elsewhere and inject _nmm.json data
//@TODO clean json data (strip/add trailing path slashes)
var nmm = require('./public/assets/js/_nmm');
//@TODO strip last directory off path instead of hard-coded string
nmm.paths.root = __dirname.replace("node-mp3-manager", "");

require('coffee-script');

//@TODO handle routing externally (see CrowdNotes)
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


//@TODO simplify routing

// --- web paths (http) -------------------------
app.get('/', function(req, res) { res.render('index'); });
app.get('/player', player.play);
app.get('/tunes', tunes.index);
app.get('/playlists', playlists.index);
app.post('/playlists/create', playlists.create);

// --- utility paths (http) --------------------------------
app.get('/db/create', db.create);
app.get('/db/ajax', db.ajax);

// --- compile jade templates for browser ----------------
var jadePrecompiler = require("./jadePrecompiler.coffee"),
    precompiledTemplatesSource = "",
    doneCompile = function(source, err) {
      if (err) { throw err; } 
      precompiledTemplatesSource = source;
    };
jadePrecompiler.compile(doneCompile, "./views/client-templates/");
app.get("/assets/js/templates.js", function(req, res) {
  res.set("Content-Type", "application/javascript");
  res.send(precompiledTemplatesSource);
});


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