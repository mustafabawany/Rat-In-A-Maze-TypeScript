export var GreedyApproach = /** @class */ (function () {
    function GreedyApproach(Rows, Columns) {
        this.Rows = 0;
        this.Columns = 0;
        this.Directions = {
            Up: [-1, 0],
            Down: [1, 0],
            Left: [0, -1],
            Right: [0, 1]
        };
        this.Rows = Rows;
        this.Columns = Columns;
    }
    GreedyApproach.prototype.Check_Safe_States = function (mazeBoard, row, col, States, Visited) {
        if (row <= this.Rows - 1 && col <= this.Columns - 1 && row >= 0 && col >= 0
            && (mazeBoard[row][col] === States.Blank
                || mazeBoard[row][col] === States.Start)) {
            return true;
        }
        return false;
    };
    GreedyApproach.prototype.Check_Path = function (mazeBoard, row, col, endPosition, States, Visited) {
        if (row === endPosition[0] && col === endPosition[1]) {
            return true;
        }
        if (this.Check_Safe_States(mazeBoard, row, col, States, Visited)) {
            if (mazeBoard[row][col] === States.Blank)
                mazeBoard[row][col] = States.Visited;
            if (this.Check_Path(mazeBoard, row + this.Directions.Down[0], col + this.Directions.Down[1], endPosition, States, Visited))
                return true;
            if (this.Check_Path(mazeBoard, row + this.Directions.Right[0], col + this.Directions.Right[1], endPosition, States, Visited))
                return true;
            if (this.Check_Path(mazeBoard, row + this.Directions.Left[0], col + this.Directions.Left[1], endPosition, States, Visited))
                return true;
            if (this.Check_Path(mazeBoard, row + this.Directions.Up[0], col + this.Directions.Up[1], endPosition, States, Visited))
                return true;
            if (mazeBoard[row][col] !== States.Start)
                mazeBoard[row][col] = States.Blank;
            return false;
        }
        return false;
    };
    GreedyApproach.prototype.Solve_Maze = function (mazeBoard, startPosition, endPosition, States, Visited) {
        if (this.Check_Path(mazeBoard, startPosition[0], startPosition[1], endPosition, States, Visited)) {
            return true;
        }
        else {
            return false;
        }
    };
    return GreedyApproach;
}());