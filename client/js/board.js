function Board() {
	this.$board = $('<div id="game"></div>');
	this.tileDimension = null;
	this.columns = null;
	this.rows = null;
	this.tiles = 0;
}

Board.prototype.instantiate = function(body, tiles, tileDimension) {
	body.append(this.$board);
	this.tileDimension = tileDimension;
	this.createBoard(tiles);
}

Board.prototype.createBoard = function(tiles) {	
	for (var tile in tiles) {
		this.placeTile(tiles[tile].pos.x, tiles[tile].pos.y, tiles[tile].color);
	}

	var dimension = Math.sqrt(this.tiles);

	this.rows = dimension;
	this.columns = dimension;
}

Board.prototype.placeTile = function(x, y, color) {
	this.$board.append($('<div tile="' + this.tiles + '" x="' + x + '" y="' + y + '"class="color-' + color + ' tile"></div>'));
	this.tiles++;
}