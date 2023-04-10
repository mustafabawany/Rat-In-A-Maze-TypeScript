export var DepthFirstSearch = /** @class */ (function () {
    function DepthFirstSearch(Rows, Columns) {
        this.Directions = {
            Up: [-1, 0],
            Down: [1, 0],
            Left: [0, -1],
            Right: [0, 1]
        };
        this.Rows = Rows;
        this.Columns = Columns;
    }
    DepthFirstSearch.prototype.Check_Safe_States = function (row, col, mazeBoard, States, Visited) {
        return row >= 0 && row < this.Rows && col >= 0 && col < this.Columns && mazeBoard[row][col] !== States.Hurdle;
    };
    DepthFirstSearch.prototype.Check_Path = function (mazeBoard, row, col, endPosition, States, Visited) {
        if (row === endPosition[0] && col === endPosition[1]) {
            return true;
        }
        Visited[row][col] = true;
        for (var dir in this.Directions) {
            var movement = this.Directions[dir];
            var newRow = row + movement[0];
            var newCol = col + movement[1];
            if (this.Check_Safe_States(newRow, newCol, mazeBoard, States, Visited) && !Visited[newRow][newCol]) {
                if (this.Check_Path(mazeBoard, newRow, newCol, endPosition, States, Visited)) {
                    return true;
                }
            }
        }
        Visited[row][col] = false;
        return false;
    };
    DepthFirstSearch.prototype.Mark_Visited = function (mazeBoard, States, Visited) {
        for (var row = 0; row < this.Rows; row++) {
            for (var col = 0; col < this.Columns; col++) {
                if (Visited[row][col] == true) {
                    if (mazeBoard[row][col] !== States.Start && mazeBoard[row][col] !== States.End)
                        mazeBoard[row][col] = States.Visited;
                }
            }
        }
    };
    DepthFirstSearch.prototype.Solve_Maze = function (mazeBoard, startPosition, endPosition, States, Visited) {
        if (this.Check_Path(mazeBoard, startPosition[0], startPosition[1], endPosition, States, Visited)) {
            this.Mark_Visited(mazeBoard, States, Visited);
            return true;
        }
        else {
            return false;
        }
    };
    return DepthFirstSearch;
}());