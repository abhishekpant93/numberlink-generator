// Functions to generate a board along with its solution.
// ==================================================================
// Global variables storing intermediate state of the generator.
var pathClr = 0;
var covered = 0;

// Returns a board of the specified size. Each cell of the board is empty.
function GetEmptyBoard(size) {
	var board = new Array(size);
    for (var i = 0; i < size; ++i) {
        board[i] = new Array(size);
        for (var j = 0; j < size; ++j) board[i][j] = 0;
    }
    return board;
}

// Returns the number of neighbours of cell (k, l) that have already been added
// to a path.
function NumAddedNeighbours(board, k, l) {
    var n = board.length;
    var cnt = 0;
    if (k == 0) ++cnt;
    else if (board[k - 1][l]) ++cnt;
    if (k == n - 1) ++cnt;
    else if (board[k + 1][l]) ++cnt;
    if (l == 0) ++cnt;
    else if (board[k][l - 1]) ++cnt;
    if (l == n - 1) ++cnt;
    else if (board[k][l + 1]) ++cnt;
    return cnt;
}

// Returns the number of neighbours of cell (k, l) that are of color 'clr'.
function NumSameColoredNeighbours(board, k, l, clr) {
    var n = board.length;
    var cnt = 0;
    if (k != 0) {
        if (board[k - 1][l] == clr) ++cnt;
    }
    if (k != n - 1) {
        if (board[k + 1][l] == clr) ++cnt;
    }
    if (l != 0) {
        if (board[k][l - 1] == clr) ++cnt;
    }
    if (l != n - 1) {
        if (board[k][l + 1] == clr) ++cnt;
    }
    return cnt;
}

// Returns whether adding cell (k, l) to the path causes one or more isolated
// uncolored squares.
function HasIsolatedSquares(board, k, l, clr, isLastNode) {
    var n = board.length;
    if (isLastNode) {
        if ((k != 0) && (board[k - 1][l] == 0) && (NumAddedNeighbours(board, k - 1, l) == 4) && (NumSameColoredNeighbours(board, k - 1, l, clr) > 1)) return true;
        if ((k != n - 1) && (board[k + 1][l] == 0) && (NumAddedNeighbours(board, k + 1, l) == 4) && (NumSameColoredNeighbours(board, k + 1, l, clr) > 1)) return true;
        if ((l != 0) && (board[k][l - 1] == 0) && (NumAddedNeighbours(board, k, l - 1) == 4) && (NumSameColoredNeighbours(board, k, l - 1, clr) > 1)) return true;
        if ((l != n - 1) && (board[k][l + 1] == 0) && (NumAddedNeighbours(board, k, l + 1) == 4) && (NumSameColoredNeighbours(board, k, l + 1, clr) > 1)) return true;
    } else {
        if ((k != 0) && (board[k - 1][l] == 0) && (NumAddedNeighbours(board, k - 1, l) == 4)) return true;
        if ((k != n - 1) && (board[k + 1][l] == 0) && (NumAddedNeighbours(board, k + 1, l) == 4)) return true;
        if ((l != 0) && (board[k][l - 1] == 0) && (NumAddedNeighbours(board, k, l - 1) == 4)) return true;
        if ((l != n - 1) && (board[k][l + 1] == 0) && (NumAddedNeighbours(board, k, l + 1) == 4)) return true;
    }
    return false;
}

// Locates and returns a random uncolored neighbour of cell (i, j). Additional
// constraints are enforced during path extension if a non-zero 'clr' is 
// passed. This function ensures that the neighbour returned does not lead to
// any isolated uncolored squares.
function GetPathExtensionNeighbour(board, i, j, clr) {
    var n = board.length;
    var u, v, i1, j1;
    var u = Math.floor(Math.random() * 4);
    for (v = 0; v < 4; ++v) {
        if (++u == 4) u = 0;
        i1 = i;
        j1 = j;
        switch (u) {
            case 0:
                if (i == 0) continue;
                i1 = i - 1;
                break;
            case 1:
                if (j == n - 1) continue;
                j1 = j + 1;
                break;
            case 2:
                if (j == 0) continue;
                j1 = j - 1;
                break;
            case 3:
                if (i == n - 1) continue;
                i1 = i + 1;
                break;
        }
        // Uncolored neighbour found.
        if (board[i1][j1] == 0) {
            // Check the color constraint.
            if (clr) {
                if (NumSameColoredNeighbours(board, i1, j1, clr) > 1) continue;
            }
            board[i1][j1] = clr;
            // Check whether this neighbour causes isolated empty cells.
            if (HasIsolatedSquares(board, i, j, clr, false) || HasIsolatedSquares(board, i1, j1, clr, true)) {
                board[i1][j1] = 0;
                continue;
            }
            // This neighbour is suitable for path extension.
            return [i1, j1];
        }
    }
    // None of the 4 neighbours can extend the path, so return fail.
    return [0, 0];
}

// Tries to add a random path to the board, and returns whether it was
// successfull.
function AddPath(board_unsolved, board_solved) {
    var i, j, s, t, nbr;
    var n = board_unsolved.length;
    // Use the next color.
    ++pathClr;
    // Try and locate uncolored neighboring squares (i,j) and (k,l).
    s = Math.floor(Math.random() * n * n)
    for (t = 0; t < n * n; ++t) {
        // Wrap-around row-major search.
        if (++s == n * n) s = 0;
        i = Math.floor(s / n);
        j = s % n;
        if (board_solved[i][j] == 0) {
            board_unsolved[i][j] = pathClr;
            board_solved[i][j] = pathClr;
            if (HasIsolatedSquares(board_solved, i, j, pathClr, true)) {
                board_solved[i][j] = 0;
                board_unsolved[i][j] = 0;
                continue;
            } else {
                nbr = GetPathExtensionNeighbour(board_solved, i, j, pathClr);
                if (nbr[0] == 0 && nbr[1] == 0) {
                    board_solved[i][j] = 0;
                    board_unsolved[i][j] = 0;
                    continue;
                } else {
                    // Found path starting with (i, j) and nbr.
                    break;
                }
            }
        }
    }
    if (t == n * n) {
        // Backtrack
        --pathClr;
        return false;
    }

    var pathlen = 2;
    covered += 2;
    console.log("Path No " + pathClr + ": (" + i + ", " + j + ") (" + nbr[0] + ", " + nbr[1] + ")");
    var nextNbr = [];
    while (true) {
        i = nbr[0];
        j = nbr[1];
        nextNbr = GetPathExtensionNeighbour(board_solved, i, j, pathClr);
        if ((nextNbr[0] != 0 || nextNbr[1] != 0) && pathlen < n * n) {
            nbr = nextNbr;
        } else {
            console.log('returning true, pathClr = ' + pathClr + ', nbr = ' + nbr);
            board_unsolved[nbr[0]][nbr[1]] = pathClr;
            return true;
        }
        console.log("adding (" + nbr[0] + ", " + nbr[1] + ")");
        pathlen += 1;
        covered += 1;
    }
}

// Returns a random permutation of array using Fisher-Yates method.
function Shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle
    while (0 !== currentIndex) {

        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Shuffles the colors on the board so as to not give the user any hints
// regarding the length of the path (since by this method, paths generated
// earlier will be longer).
function ShuffleColors(board_unsolved, board_solved, numColors) {
    var colors = [];
    for (var i = 1; i <= numColors; i++) {
        colors.push(i);
    }
    colors = Shuffle(colors);
    var n = board_unsolved.length;
    for (var i = 0; i < n; ++i) {
        for (var j = 0; j < n; ++j) {
            if (board_unsolved[i][j] != 0) {
                board_unsolved[i][j] = colors[board_unsolved[i][j] - 1];
            }
            board_solved[i][j] = colors[board_solved[i][j] - 1];
        }
    }
}

function GenerateBoard(size) {
    var board_unsolved = GetEmptyBoard(size);
    var board_solved = GetEmptyBoard(size);
    // Randomized Numberlink board generation strategy. Repeat until all
    // squares are covered and satisfy the constraints.
    var iters = 0;
    do {
        ++iters;
        board_unsolved = GetEmptyBoard(size);
        board_solved = GetEmptyBoard(size);
        pathClr = 0;
        covered = 0;
        while (AddPath(board_unsolved, board_solved)) {
            console.log("    covered = " + covered + ", pathClr = " + pathClr);
        }
        console.log("      covered = " + covered + ", pathClr = " + pathClr);
        if (iters > 100) break;
    } while (covered < size * size);
    console.log("iters: " + iters);
    ShuffleColors(board_unsolved, board_solved, pathClr);
    return [board_unsolved, board_solved];
}
