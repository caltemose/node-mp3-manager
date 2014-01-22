//process __dirname to affect
//  -absolute paths for playlists
//  -variable paths for db.json -> db.{root}.json

//console.log(process.argv);

var nmm = {
  title: "Node Music Manager",
  version: "0.0.1",
  port: 3000,
  paths: {
    music: "../music",
    playlists: "../playlists/",
    db: "./dbs/db.json", //should this be affected by __dirname ?
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

app.configure(function () {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  //app.use(express.bodyParser({limit: 1024 * 1024 * 10}));
  app.use(express.urlencoded({limit: 1024 * 1024 * 10}));
  app.use('/music', express.static('../music'));
  app.use('/playlists', express.static('../playlists'));
  app.use(express.static(__dirname + '/public'));
  //app.use(express.json({limit: '50mb'}));
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      '*'); //req.headers.origin
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
});


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
console.log(nmm.title + " " + nmm.version + ' is listening on port ' + nmm.port + '...');
console.log("  at: " + __dirname);
