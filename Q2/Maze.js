import {WebView} from "./MazeUI.js";

export var Maze = /** @class */ (function () {
    function Maze() {
        this.mazeBoard = [];
        this.visited = [];
        this.States = {
            Start: 'S',
            End: 'E',
            Hurdle: 'W',
            Visited: 'V',
            Blank: ' '
        };
        this.startPosition = [0, 0];
        this.endPosition = [0, 0];
        this.Rows = 6;
        this.Columns = 6;
        this.mazeUI = new WebView(this.Rows, this.Columns, this.mazeBoard);
        this.visited = new Array(this.Rows);
    }
    Maze.prototype.Set_Algorithm = function (mazeStrategy) {
        this.mazeStrategy = mazeStrategy;
    };
    Maze.prototype.Generate_Maze = function () {
        for (var i = 0; i < this.Rows; i++) {
            this.visited[i] = new Array(this.Columns);
            for (var j = 0; j < this.Columns; j++) {
                this.visited[i][j] = false;
            }
        }
        this.startPosition = [Math.floor(Math.random() * this.Rows), Math.floor(Math.random() * this.Columns)];
        this.endPosition = [Math.floor(Math.random() * this.Rows), Math.floor(Math.random() * this.Columns)];
        for (var row = 0; row < this.Rows; row++) {
            for (var col = 0; col < this.Columns; col++) {
                if (row === this.startPosition[0] && col === this.startPosition[1]) {
                    this.mazeBoard[row][col] = this.States.Start;
                }
                else if (row === this.endPosition[0] && col === this.endPosition[1]) {
                    this.mazeBoard[row][col] = this.States.End;
                }
                else {
                    var random_number = Math.floor(Math.random() * 4);
                    if (random_number === 0) {
                        this.mazeBoard[row][col] = this.States.Hurdle;
                    }
                    else {
                        this.mazeBoard[row][col] = this.States.Blank;
                    }
                }
            }
        }
        this.mazeUI.Print_Maze(this.mazeBoard);
    };
    Maze.prototype.Solve_Maze = function () {
        var result;
        result = this.mazeStrategy.Solve_Maze(this.mazeBoard, this.startPosition, this.endPosition, this.States, this.visited);
        if (result) {
            this.mazeUI.Print_Maze(this.mazeBoard);
        }
        else {
            this.mazeUI.Solution_Failed();
        }
    };
    return Maze;
}());