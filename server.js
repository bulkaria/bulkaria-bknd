var express = require('express');
var app = express();

/*
var public_dir = './www/';

// routes to serve the static HTML files
app.get('/', function(req, res) {
    res.render(public_dir + 'index.html');
});
*/

var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html', 'css', 'js'],
  index: "index.html",
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  }
};

app.use(express.static('www', options));

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);

});