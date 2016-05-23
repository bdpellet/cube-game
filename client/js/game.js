var socket = io.connect('http://localhost:8080');


// TODO: bunch a stuff!

// TODO: 

// TODO: 


// Player has joind the game, update client with board information from server
socket.on('createBoard', function(tiles) {
  createBoard(tiles);
});

function createBoard(tiles) {
	for (var tile in tiles) {
		console.log();
		placeTile(tiles[tile].pos.x, tiles[tile].pos.y, tiles[tile].color);
	}
}

function placeTile(x, y, color) {
	var $tile = $('<div x="' + x + '" y="' + y + '"class="tile color-' + color + '"></div>');
	// $tile.append('<span>' + x + ' : ' + y + '</span>');
	$('#game').append($tile);
}

