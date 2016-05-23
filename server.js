var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

// #GLOBALS# //

// Board settings
var width = 700;
var height = 700;
var tileDimension = 50;
var tiles = createBoard(width, height, tileDimension);


// TODO: bunch a stuff!

// TODO: 

// TODO: 

io.on('connection', function(client) {

	// Player joined the game
  console.log('Server: new player connected');
  client.emit('createBoard', tiles);

  client.on('disconnect', function() {
    console.log('Server: player disconnected from server');
  });
});

app.use(express.static(__dirname + '/client'));

app.get('/*', function(req, res, next) {
  res.sendFile(__dirname + '/client/index.html');
});

server.listen(8080);




// Create a board object based on the dimensions provided
function createBoard(width, height, tileDimension) {
	var columns = width / tileDimension, rows = height / tileDimension;
	var counter = 0;
	var result = {};

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < columns; j++) {
	  	result[counter] = {pos: { x: i, y: j}};
	  	result[counter].color = generateColor();
	  	counter++;
	  }
	}

	return result;
}

// Generate random color for tile
function generateColor() {
  var colors = ['red', 'blue', 'grey', 'green']
  return colors[Math.floor(Math.random() * colors.length)];
}