var express = require('express');
var path = require('path');

var app = express();

app.set('case sensitive routing', false);
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'angular'));

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var port = Number(process.env.PORT || 3000);

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port, function() {
    console.log('ready on '+port);
});