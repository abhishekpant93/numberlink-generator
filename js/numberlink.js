// NumberLink Generator and Solver
//
// Global variables to store the state of the solver.
// ==================================================================
var board_solved_ = [];
var board_unsolved_ = [];
// ==================================================================

function Solve(callback) {
    setTimeout(function() {
        RenderBoard(board_solved_);
        callback();
    }, 0);
}

$(function() {
    $('#new-game').click(function(e) {
        e.preventDefault();
        var size = parseInt($('.input-number').val());
        boards = GenerateBoard(size);
        board_unsolved_ = boards[0];
        board_solved_ = boards[1];
        RenderBoard(board_unsolved_);
        $('#solve-board').prop('disabled', false);
    });
});


$(function() {
    $('#solve-board').click(function(e) {
        e.preventDefault();
        $('#solve-board').prop('disabled', true);
        var l = Ladda.create(this);
        l.start();
        Solve(function() {
            l.stop();
            $('#solve-board').prop('disabled', true);
        });
    });
});