
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var fs = require('fs');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/*', function (req, res) {

  var search = req.params[0];

  if (search.substr(-4) === '.gif') {
    search = search.substr(0, search.length - 4);
  }
  var files = fs.readdirSync(path.join(__dirname, 'public', 'images'));

  files = files.filter(function (file) {
    return file.substr(-4) === '.gif';
  });

  var results = files.filter(function (file) {
    return file.indexOf(search) > -1;
  });

  if (results.length) {
    var serveThisFile = path.join(__dirname, 'public', 'images', results[0]);
    console.log(serveThisFile);
    res.sendfile(serveThisFile);
  } else {
    res.send('nope sorry');
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
