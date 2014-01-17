var express = require('express'), 
    path = require('path'),
    api = require('./routes/api'),
    tunes = require('./routes/tunes'),
    playlists = require('./routes/playlists'),
    player = require('./routes/player');

var app = express();

app.configure(function () {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use('/music', express.static(__dirname + '/music'));
  app.use(express.static(__dirname + '/public'));
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      '*'); //req.headers.origin
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
});


// --- Public Web paths -------------------------
app.get('/', function(req, res) {
  res.render('index');
});
app.get('/player', player.play);
app.get('/tunes', tunes.index);
app.post('/playlists/create', playlists.create)

// --- API paths --------------------------------
app.get('/api', function(req, res) {
  res.redirect('/');
});
app.get('/api/tracks', api.tracks);
app.get('/api/albums', api.albums);



app.listen(3000);
console.log('Node Music Manager listening on port 3000...');


