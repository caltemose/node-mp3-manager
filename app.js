var express = require('express'); 
  music = require('./routes/music');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    // app.use(express.bodyParser());
    app.use(express.static(__dirname + '../music'));
    // app.use(function (req, res, next) {
    //   res.header('Access-Control-Allow-Credentials', true);
    //   res.header('Access-Control-Allow-Origin',      '*'); //req.headers.origin
    //   res.header('Access-Control-Allow-Methods',     'GET,PUT,POST,DELETE');
    //   res.header('Access-Control-Allow-Headers',     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    //   next();
    // });
});

app.get('/', music.start);

app.listen(3000);
console.log('Listening on port 3000...');


