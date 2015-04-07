var express = require('express');
var app = express();

var public_dir = './www/';

// routes to serve the static HTML files
app.get('/', function(req, res) {
    res.sendfile(public_dir + 'index.html');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);

});