;
var ConsoleView = /** @class */ (function () {
    function ConsoleView(Rows, Columns, mazeBoard) {
        var tempArray = [];
        for (var row = 0; row < Rows; row++) {
            tempArray = [];
            for (var col = 0; col < Columns; col++) {
                tempArray.push(' ');
            }
            mazeBoard.push(tempArray);
        }
    }
    ConsoleView.prototype.Print_Maze = function (mazeBoard) {
        var Rows = mazeBoard.length;
        for (var rows = 0; rows < Rows; rows++) {
            console.log(mazeBoard[rows]);
        }
        console.log("\n");
    };
    ConsoleView.prototype.Solution_Failed = function () {
        console.log("No Solution!");
    };
    return ConsoleView;
}());
var WebView = /** @class */ (function () {
    function WebView(Rows, Columns, mazeBoard) {
        var table = document.getElementById('matrix');
        var tempArray = [];
        for (var row = 0; row < Rows; row++) {
            var TR = document.createElement('tr');
            TR.className = 'row';
            table.appendChild(TR);
            tempArray = [];
            for (var col = 0; col < Columns; col++) {
                var TH = document.createElement('th');
                TH.innerText = ' ';
                TH.className = 'square-hollow';
                TR.appendChild(TH);
                tempArray.push(' ');
            }
            mazeBoard.push(tempArray);
        }
    }
    WebView.prototype.Print_Maze = function (mazeBoard) {
        var table = document.getElementById('matrix');
        var rowTag = document.querySelectorAll('tr');
        var Rows = mazeBoard.length;
        var Columns = mazeBoard.length[0];
        var heading = document.getElementById('Failed');
        if (heading)
            heading.remove();
        rowTag.forEach(function (row) { return row.remove(); });
        for (var row = 0; row < Rows; row++) {
            var TR = document.createElement('tr');
            TR.className = 'row';
            table.appendChild(TR);
            for (var col = 0; col < Columns; col++) {
                var TH = document.createElement('th');
                TH.innerText = mazeBoard[row][col];
                if (mazeBoard[row][col] === 'S') {
                    TH.className = 'square-start';
                }
                else if (mazeBoard[row][col] === 'E') {
                    TH.className = 'square-start';
                }
                else if (mazeBoard[row][col] === ' ') {
                    TH.className = "square-hollow";
                }
                else if (mazeBoard[row][col] === 'W') {
                    TH.className = "square-filled";
                }
                else {
                    TH.className = "square-visited";
                }
                TR.appendChild(TH);
            }
        }
    };
    WebView.prototype.Solution_Failed = function () {
        var table = document.getElementById('matrix');
        var rows = document.querySelectorAll('tr');
        for (var row = 0; row < rows.length; row++) {
            rows[row].remove();
        }
        var heading = document.createElement('h1');
        heading.innerText = "Solution Does Not Exist";
        heading.id = "Failed";
        table.appendChild(heading);
    };
    return WebView;
}());
var MazeSolver = /** @class */ (function () {
    function MazeSolver(Rows, Columns) {
        this.mazeBoard = [];
        this.States = {
            Start: 'S',
            End: 'E',
            Hurdle: 'W',
            Visited: 'V',
            Blank: 'B'
        };
        this.Directions = {
            Up: [-1, 0],
            Down: [1, 0],
            Left: [0, -1],
            Right: [0, 1]
        };
        this.UI = new ConsoleView(Rows, Columns, this.mazeBoard);
        this.startPosition = [0, 0];
        this.endPosition = [0, 0];
        this.Rows = Rows;
        this.Columns = Columns;
    }
    MazeSolver.prototype.Generate_Maze = function () {
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
        this.UI.Print_Maze(this.mazeBoard);
    };
    MazeSolver.prototype.Check_Safe_States = function (row, col) {
        if (row <= this.Rows - 1 && col <= this.Columns - 1 && row >= 0 && col >= 0
            && (this.mazeBoard[row][col] === this.States.Blank
                || this.mazeBoard[row][col] === this.States.Start)) {
            return true;
        }
        return false;
    };
    MazeSolver.prototype.Check_Path = function (row, col) {
        if (row === this.endPosition[0] && col === this.endPosition[1]) {
            return true;
        }
        if (this.Check_Safe_States(row, col)) {
            this.UI.Print_Maze(this.mazeBoard);
            if (this.mazeBoard[row][col] === this.States.Blank)
                this.mazeBoard[row][col] = this.States.Visited;
            if (this.Check_Path(row + this.Directions.Down[0], col + this.Directions.Down[1]))
                return true;
            if (this.Check_Path(row + this.Directions.Right[0], col + this.Directions.Right[1]))
                return true;
            if (this.Check_Path(row + this.Directions.Left[0], col + this.Directions.Left[1]))
                return true;
            if (this.Check_Path(row + this.Directions.Up[0], col + this.Directions.Up[1]))
                return true;
            if (this.mazeBoard[row][col] !== this.States.Start)
                this.mazeBoard[row][col] = this.States.Blank;
            return false;
        }
        return false;
    };
    MazeSolver.prototype.Solve_Maze = function () {
        if (this.Check_Path(this.startPosition[0], this.startPosition[1])) {
            this.UI.Print_Maze(this.mazeBoard);
        }
        else {
            this.UI.Solution_Failed();
        }
    };
    return MazeSolver;
}());
var maze = new MazeSolver(4, 4);
maze.Generate_Maze();
maze.Solve_Maze();
