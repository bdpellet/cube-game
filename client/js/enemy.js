// Should refactor this to be a subclass of player

function Enemy() {
	this.$enemy = $('<div class="player" username="" moving="false"></div>');
	this.x = null,
	this.y = null,
	this.tile = null
}

Enemy.prototype.instantiate = function(username, location, board) {
	this.$enemy.attr('username', username);
	this.spawn(location, board);
}

Enemy.prototype.spawn = function(location, board) {
	var nameLen = this.$enemy.attr('username').length;
	var name;
	
	if (nameLen > 7) {
		console.log('in greater than 7')
		name = this.$enemy.attr('username').substring(0, 7) + '.....';
	} else {
		console.log('not in greater than 7')
		name = this.$enemy.attr('username');
	}

	var $spawnTile = $(board.$board.children()[location]);
	this.$enemy.addClass($spawnTile.attr('class').split(' ')[0]);
	this.$enemy.append('<span style="border: 2px dashed red"><p>' + name.toUpperCase() + '</p></span>');
	$spawnTile.append(this.$enemy);
	console.log(this.$enemy);

	this.updateEnemy($spawnTile);
}

Enemy.prototype.updateEnemy = function(tile) {
	this.tile = Number(tile.attr('tile'));
	this.x = Number(tile.attr('x'));
	this.y = Number(tile.attr('y'));
}

Enemy.prototype.move = function(tile, board) {
	var x = Number($(board.$board.children()[tile]).attr('x'));
	var y = Number($(board.$board.children()[tile]).attr('y'));
	this.moveEnemy(x, y, board);
}

Enemy.prototype.moveEnemy = function(x, y, board) {
	if (this.x === x) {
		if (this.y > y) {
			this.animateMovement({'left': -50}, board)
		} else if (this.y < y) {
			this.animateMovement({'left': 50}, board)
		}
	} else if (this.y === y) {
		if (this.x > x) {
			this.animateMovement({'top': -50}, board)
		} else if (this.x < x) {
			this.animateMovement({'top': 50}, board)
		}
	}
}

Enemy.prototype.animateMovement = function(direction, board) {
	console.log('animating enemey');
	var enemy = this;
	this.$enemy.animate(direction, {
		duration: 500,
    complete: function() {
    	enemy.changeParents(direction, board);
    	enemy.$enemy.removeAttr('style');
    }
 	});
}

Enemy.prototype.changeParents = function(direction, board) {
	var tiles = $(board.$board.children());
	var previousTile = this.tile;

	if (direction.left) {
		if (direction.left < 0) {
			$(tiles[--this.tile]).append(this.$enemy);
			this.y--;
		} else if (direction.left > 0) {
			$(tiles[++this.tile]).append(this.$enemy);
			this.y++;
		}
	}

	if (direction.top) {
		if (direction.top < 0) {
			$(tiles[this.tile - board.rows]).append(this.$enemy);
			this.tile -= board.rows;
			this.x--;
		} else if (direction.top > 0) {
			$(tiles[this.tile + board.rows]).append(this.$enemy);
			this.tile += board.rows;
			this.x++;
		}
	}

	this.$enemy.attr('class', $(tiles[this.tile]).attr('class').split(' ')[0] + ' player');
}