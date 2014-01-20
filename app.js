var nmm = {
  paths: {
    music: "../music/chad",
    playlists: "../playlists/",
    db: "./dbs/db.json"
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
  console.log(__dirname);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  //app.use(express.json({limit: '50mb'}));
  app.use(express.bodyParser({limit: 1024 * 1024 * 10}));
  app.use('/music', express.static('../music'));
  app.use(express.static(__dirname + '/public'));
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
app.post('/playlists/create', playlists.create);

// --- utility paths (http) --------------------------------
app.get('/db/create', db.create);
app.get('/db/ajax', db.ajax);

// --- API paths (json) --------------------------------
app.get('/api', function(req, res) { res.redirect('/'); });
app.get('/api/tracks', api.tracks);
app.get('/api/albums', api.albums);
app.get('/api/paths', api.paths);
app.post('/api/save-db', api.saveDb);


app.listen(3000);
console.log('Node Music Manager listening on port 3000...');


