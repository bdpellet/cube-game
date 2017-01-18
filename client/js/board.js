function Board() {
    this.$board = $('<div id="game"></div>');
    this.tileDimension = null;
    this.columns = null;
    this.rows = null;
    this.tiles = 0;
    this.$scoreBoard = null;
}

Board.prototype.instantiate = function(body, tiles, tileDimension, players) {
    body.append(this.$board);
    this.tileDimension = tileDimension;
    this.createBoard(tiles);
    this.scoreBoard()
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
    // this.$board.append($('<div tile="' + this.tiles + '" x="' + x + '" y="' + y + '"class="color-' + color + ' tile"></div>'));
    this.$board.append($('<div tile="' + this.tiles + '" x="' + x + '" y="' + y + '" style="background-color:' + color + ';" class="tile"></div>'));

    this.tiles++;
}

Board.prototype.scoreBoard = function() {
    this.$scoreBoard = $(`
    <div class="scoreBoard">
      <h2 style="display:inline-block">Players in game: </h2>
      <span id="player_count">0</span>
    </div>`).appendTo(this.$board)
}