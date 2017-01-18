var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set('port', (process.env.PORT || 8080));

// var p2pserver = require('socket.io-p2p-server').Server
// io.use(p2pserver)

var width = 700;
var height = 700;
var tileDimension = 50;
var tiles = createBoard(width, height, tileDimension);
var players = {};
var player_sockets = [];

io.on('connection', function(client) {
    console.log('Server: new player connected');
    player_sockets.push(client);

    client.emit('createBoard', tiles, tileDimension);

    client.on('playerJoinedGame', function(player, parent) {
        tiles[parent.tile].children[player.username] = player;
        players[player.username] = player;
        io.sockets.emit('updateClientEnemies', players);
    });

    client.on('updatePlayer', function(player, newParent) {
        delete tiles[newParent.prevTile].children[player.username];
        tiles[newParent.newTile].children[player.username] = player;
        players[player.username].tile = player.tile;
        io.sockets.emit('updateClientEnemies', players);
    });

    client.on('disconnect', function() {
        console.log('Server: player disconnected from server');
        var i = player_sockets.indexOf(client);
        var x = 0
        var dcPlayer = null
        for (var player in players) {
            if (x == i) { dcPlayer = player }
            x++
        }
        delete players[dcPlayer]
        io.sockets.emit('removeEnemy', dcPlayer);
        player_sockets.splice(i, 1);

    });
});

app.use(express.static(__dirname + '/client'));

app.get('/*', function(req, res, next) {
    res.sendFile(__dirname + '/client/index.html');
});

server.listen(app.get('port'));

function createBoard(width, height, tileDimension) {
    // Calculate dimensions for our game board
    var columns = width / tileDimension,
        rows = height / tileDimension;
    // Counter for tile property name
    var counter = 0;
    // Store tiles in result
    var result = {};

    // Iterate over rows
    for (var i = 0; i < rows; i++) {
        // Iterate over columns
        for (var j = 0; j < columns; j++) { // For each column in a row
            // Assign x and y positions
            result[counter] = { pos: { x: i, y: j } };
            // Assign random color
            result[counter].color = generateColor();
            // Make space for the children elements (players)
            result[counter].children = {};
            // Increase tile count
            counter++;
        }
    }

    // Return all the tiles
    return result;
}

// Generate random color for tile
function generateColor() {
    // These colors are predefined in the client css
    return "rgba(" + colorComponent() + "," + colorComponent() + "," + colorComponent() + ",1.0)"
        // var colors = ['red', 'blue', 'grey', 'green']
        // Generate a random color from the array and return it
        // return colors[Math.floor(Math.random() * colors.length)];
}

function colorComponent() {
    return Math.floor(Math.random() * 155)
}