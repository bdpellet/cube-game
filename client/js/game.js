var socket = io.connect('http://localhost:80');
// var socket = io.connect('http://localhost:' + 8080);
var board = new Board();
var player = new Player();

var enemies = {};

socket.on('createBoard', function(tiles, tileDimension) {
	board.instantiate($('body'), tiles, tileDimension);
});

socket.on('updateClientEnemies', function(enemyPlayers) {
  for (var enemy in enemyPlayers) {
  	if (enemyPlayers[enemy].username !== player.$player.attr('username')) {
  		if ($('div[username="' + enemyPlayers[enemy].username + '"]').length) {
  			enemies[enemyPlayers[enemy].username].move(enemyPlayers[enemy].tile, board);
  		} else {
  			newEnemy = new Enemy();
  			newEnemy.instantiate(enemyPlayers[enemy].username, enemyPlayers[enemy].tile, board);
  			enemies[enemyPlayers[enemy].username] = newEnemy;
  		}
  	}
  }
});


function loginPrompt() {
	player.instantiate($('.login-container div input').val(), board);
	enableMovement();
	$('.login-container').remove();
}

function enableMovement() {
	$('.tile').click(function(e) {
		player.move(Number($(this).attr('x')), Number($(this).attr('y')), board)
	});
}

