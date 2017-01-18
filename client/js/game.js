// var socket = io.connect('http://cube-game.herokuapp.com:80');
var socket = io.connect('http://localhost:8080');
var board = new Board();
var player = new Player();

var enemies = {};

socket.on('createBoard', function(tiles, tileDimension) {
    board.instantiate($('body'), tiles, tileDimension);
});

socket.on('updateClientEnemies', function(enemyPlayers) {
    var count = 0;
    for (var enemy in enemyPlayers) {
        if (enemyPlayers[enemy].username !== player.$player.attr('username')) {
            if ($('div[username="' + enemyPlayers[enemy].username + '"]').length) {
                enemies[enemyPlayers[enemy].username].move(enemyPlayers[enemy].tile, board);
            } else {
                newEnemy = new Enemy();
                newEnemy.instantiate(enemyPlayers[enemy].username, enemyPlayers[enemy].tile, board);
                enemies[enemyPlayers[enemy].username] = newEnemy;
                board.$scoreBoard.append('<span style="display:block;">' + enemy + "</span>")
            }
        }
        count++;
    }
    board.$scoreBoard.find("#player_count").html(count)
});

socket.on('removeEnemy', function(dcPlayer) {
    alert(dcPlayer)
    board.$scoreBoard.find("span").filter(function() { return $(this).html().toLowerCase() == dcPlayer.toLowerCase() }).remove()
});

function loginPrompt() {
    player.instantiate($('.login-container div input').val(), board);
    enableMovement();
    $('.login-container').remove();
    board.$scoreBoard.append('<span style="display:block;font-weight:bold;">' + player.$player.attr('username') + "</span>")
}

function enableMovement() {
    $('.tile').click(function(e) {
        player.move(Number($(this).attr('x')), Number($(this).attr('y')), board)
    });
}