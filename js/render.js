// Functions to render the cell values to the grid.2
// ==================================================================

// The size of the game board.
var MAX_WIDTH = 452;
var MAX_HEIGHT = 452;
// Stores the random colors used while rendering the board.
var colors_ = {};

// Helper function to print to string using format sequence.
if (!String.format) {
  String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
  };
}

// Returns the CSS id corresponding to the cell.
function GetCellCSSId(r, c) {
    return (r + 1) + "-" + (c + 1);
}

// Fills the cell with the no. 'val'.
function FillCell(r, c, val) {
    var id = GetCellCSSId(r, c);
    var canvas = document.getElementById(id);
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (val == 0) return;
    context.textAlign = "center";
    context.textBaseline = 'middle';
    context.font = "25px Arial";
    if (val in colors_) {
        context.fillStyle = colors_[val];
    } else {
        colors_[val] = randomColor({
            luminosity: 'dark',
            format: 'rgb'
        });
        context.fillStyle = colors_[val];
    }
    context.fillText(val, canvas.width / 2, canvas.height / 2);
}

// Resizes the board to size height x width.
function UpdateBoardDOM(height, width) {
    var border_px = 1.5;
    var cell_width = Math.round(MAX_WIDTH / width) - 2 * border_px;
    var cell_height = Math.round(MAX_HEIGHT / height) - 2 * border_px;
    var cellHTML = String.format(
        "<canvas class=\"field\" id=\"{2}\" width=\"{0}\" height=\"{1}\"></canvas>", 
        cell_width, cell_height, "{0}");
    var html = "";
    for (var i = 0; i < height; ++i) {
        html += "<div class=\"gamerow\">";
        for (var j = 0; j < width; ++j) {
            html += String.format(cellHTML, GetCellCSSId(i, j));
        }
        html += "</div>"
    }
    $('#numberlink-vis').html(html).show();
}

// Renders the board to the grid.
function RenderBoard(board) {
    var height = board.length;
    var width = board[0].length;
    UpdateBoardDOM(height, width);
    for (var r = 0; r < height; ++r) {
        for (var c = 0; c < width; ++c) {
            FillCell(r, c, board[r][c]);
        }
    }
}