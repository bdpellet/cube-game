function Player() {
	this.$player = $('<div class="player" username="" moving="false"></div>');
	this.tile = null;
	this.x = null;
	this.y = null;
}

Player.prototype.instantiate = function(username, board) {
	var randomLocation = Math.floor(Math.random() * board.tiles);
	this.$player.attr('username', username.toUpperCase());
	this.spawn(randomLocation, board);
}

Player.prototype.spawn = function(location, board) {
	var nameLen = this.$player.attr('username').length;
	var name;

	if (nameLen > 7) {
		name = this.$player.attr('username').substring(0, 7) + '...';
	} else {
		name = this.$player.attr('username');
	}

	var $spawnTile = $(board.$board.children()[location]);
	this.$player.addClass($spawnTile.attr('class').split(' ')[0]);
	this.$player.append('<span style="border: 2px dashed #000"><p>' + name + '</p></span>');
	$spawnTile.append(this.$player);
	this.updatePlayer($spawnTile);
	addPlayerToServer(this.$player, $spawnTile);
}

Player.prototype.updatePlayer = function(tile) {
	this.tile = Number(tile.attr('tile'));
	this.x = Number(tile.attr('x'));
	this.y = Number(tile.attr('y'));
}

Player.prototype.move = function(x, y, board) {
	this.movePlayer(x, y, board);
}

Player.prototype.movePlayer = function(x, y, board) {
	if (this.x === x) {
		if (this.y === y) {
			console.log('clicked on current position');
		} else if (this.y > y) {
			this.animateMovement({'left': -50}, board)
		} else if (this.y < y) {
			this.animateMovement({'left': 50}, board)
		}
	} else if (this.y === y) {
		if (this.x === x) {
			console.log('clicked on current position');
		} else if (this.x > x) {
			this.animateMovement({'top': -50}, board)
		} else if (this.x < x) {
			this.animateMovement({'top': 50}, board)
		}
	}
}

Player.prototype.animateMovement = function(direction, board) {
	var player = this;
	this.$player.animate(direction, {
		duration: 500,
    complete: function() {
    	player.changeParents(direction, board);
    	player.$player.removeAttr('style');
    }
 	});
}

Player.prototype.changeParents = function(direction, board) {
	var tiles = $(board.$board.children());
	var previousTile = this.tile;

	if (direction.left) {
		if (direction.left < 0) {
			$(tiles[--this.tile]).append(this.$player);
			this.y--;
		} else if (direction.left > 0) {
			$(tiles[++this.tile]).append(this.$player);
			this.y++;
		}
	}

	if (direction.top) {
		if (direction.top < 0) {
			$(tiles[this.tile - board.rows]).append(this.$player);
			this.tile -= board.rows;
			this.x--;
		} else if (direction.top > 0) {
			$(tiles[this.tile + board.rows]).append(this.$player);
			this.tile += board.rows;
			this.x++;
		}
	}

	this.$player.attr('class', $(tiles[this.tile]).attr('class').split(' ')[0] + ' player');
	updatePlayerToServer(this.$player, previousTile, $(tiles[this.tile]));
}

function updatePlayerToServer(player, prevTile, newParent) {
	var playerInfo = {
		username: player.attr('username'),
		tile: newParent.attr('tile')
	}

	var newParentInfo = {
		prevTile: prevTile,
		newTile: newParent.attr('tile')
	}

	socket.emit('updatePlayer', playerInfo, newParentInfo);
}

function addPlayerToServer(player, parent) {
	var playerInfo = {
		username: player.attr('username'),
		tile: parent.attr('tile'),
	}

	var parentInfo = {
		tile: parent.attr('tile')
	}
	socket.emit('playerJoinedGame', playerInfo, parentInfo);
}