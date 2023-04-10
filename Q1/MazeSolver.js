import {WebView} from "./MazeUI.js";

export var MazeSolver = /** @class */ (function () {
    function MazeSolver(Rows, Columns) {
        this.Maze_Board = [];
        this.States = {
            Start: 'S',
            End: 'E',
            Hurdle: 'W',
            Visited: 'V',
            Blank: ' '
        };
        this.Directions = {
            Up: [-1, 0],
            Down: [1, 0],
            Left: [0, -1],
            Right: [0, 1]
        };
        this.UI = new WebView(Rows, Columns,this.Maze_Board);
        this.Start_Position = [0,0];
        this.End_Position = [0,0];
        this.Rows = Rows;
        this.Columns = Columns;
    }
    MazeSolver.prototype.Generate_Maze = function () {
        let _this = this;
        setTimeout(function(){
            _this.Start_Position = [Math.floor(Math.random() * _this.Rows), Math.floor(Math.random() * _this.Columns)];
            _this.End_Position = [Math.floor(Math.random() * _this.Rows), Math.floor(Math.random() * _this.Columns)];
            for (let row = 0; row < _this.Rows ; row++) {
                for (let col = 0; col < _this.Columns; col++) {
                    if (row === _this.Start_Position[0] && col === _this.Start_Position[1]) {
                        _this.Maze_Board[row][col] = _this.States.Start;
                    }
                    else if (row === _this.End_Position[0] && col === _this.End_Position[1]) {
                        _this.Maze_Board[row][col] = _this.States.End;
                    }
                    else {
                        let random_number = Math.floor(Math.random() * 4);
                        if (random_number === 0) {
                            _this.Maze_Board[row][col] = _this.States.Hurdle;
                        }
                        else {
                            _this.Maze_Board[row][col] = _this.States.Blank;
                        }
                    }
                }
            }
            _this.UI.Print_Maze(_this.Maze_Board);   
        }, 1000);
    };
    MazeSolver.prototype.Check_Safe_States = function (row, col) {
        if (row <= this.Rows - 1 && col <= this.Columns - 1 && row >= 0 && col >= 0
            && (this.Maze_Board[row][col] === this.States.Blank
                || this.Maze_Board[row][col] === this.States.Start)) {
            return true;
        }
        return false;
    };
    MazeSolver.prototype.Check_Path = function (row, col) {
        if (row === this.End_Position[0] && col === this.End_Position[1]) {
            return true;
        }
        if (this.Check_Safe_States(row, col)) {
            this.UI.Print_Maze(this.Maze_Board);
            if (this.Maze_Board[row][col] === this.States.Blank)
                this.Maze_Board[row][col] = this.States.Visited;
            if (this.Check_Path(row + this.Directions.Down[0], col + this.Directions.Down[1]))
                return true;
            if (this.Check_Path(row + this.Directions.Right[0], col + this.Directions.Right[1]))
                return true;
            if (this.Check_Path(row + this.Directions.Left[0], col + this.Directions.Left[1]))
                return true;
            if (this.Check_Path(row + this.Directions.Up[0], col + this.Directions.Up[1]))
                return true;
            if (this.Maze_Board[row][col] !== this.States.Start) {
                this.Maze_Board[row][col] = this.States.Blank;
            }
            return false;
        }
        return false;
    };
    MazeSolver.prototype.Solve_Maze = function () {
        if (this.Check_Path(this.Start_Position[0], this.Start_Position[1])) {
            this.UI.Print_Maze(this.Maze_Board);
        }
        else {
            this.UI.Solution_Failed();
        }
    };
    return MazeSolver;
}());