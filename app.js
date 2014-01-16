var express = require('express'), 
    path = require('path'),
    music = require('./routes/music');

var app = express();

app.configure(function () {
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use('/music', express.static(__dirname + '/music'));
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin',      '*'); //req.headers.origin
    res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
});

app.get('/', music.index);
app.get('/music', music.music)

app.listen(3000);
console.log('Listening on port 3000...');


