var path = require('path');
var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;

app.use('/build', express.static('build'));
app.use('/css', express.static('css'));
app.use('/css/todomvc', express.static('node_modules/todomvc-common'));
app.use('/css/todomvc', express.static('node_modules/todomvc-app-css'));

app.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

var PORT = process.env.PORT || 3000;
var server = app.listen(PORT);

app.use('/peerjs', ExpressPeerServer(server, {
    allow_discovery: true,
    key: "peerjs"
}));
