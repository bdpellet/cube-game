var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Client has connected to server
io.on('connection', function(client) {
  console.log('Server: new player connected');

  // test emit to client
  client.emit('test', 'Hello, from server!');

  // When client disconnected from servers
  client.on('disconnect', function() {
    console.log('server: player disconnected from server');
  });
});

app.use(express.static(__dirname + '/client'));

// Always route to index.html
app.get('/*', function(req, res, next) {
  res.sendFile(__dirname + '/client/index.html');
});

server.listen(8080);