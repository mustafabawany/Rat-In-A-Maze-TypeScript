;
var ConsoleView = /** @class */ (function () {
    function ConsoleView(Rows, Columns, mazeBoard) {
        for (var i = 0; i < Rows; i++) {
            mazeBoard[i] = new Array(Columns);
            for (var j = 0; j < Columns; j++) {
                mazeBoard[i][j] = ' ';
            }
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
var Maze = /** @class */ (function () {
    function Maze() {
        this.mazeBoard = [];
        this.visited = [];
        this.States = {
            Start: 'S',
            End: 'E',
            Hurdle: 'W',
            Visited: 'V',
            Blank: 'B'
        };
        this.startPosition = [0, 0];
        this.endPosition = [0, 0];
        this.Rows = 6;
        this.Columns = 6;
        this.mazeUI = new ConsoleView(this.Rows, this.Columns, this.mazeBoard);
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
var GreedySearch = /** @class */ (function () {
    function GreedySearch(Rows, Columns) {
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
    GreedySearch.prototype.Check_Safe_States = function (mazeBoard, row, col, States, Visited) {
        if (row <= this.Rows - 1 && col <= this.Columns - 1 && row >= 0 && col >= 0
            && (mazeBoard[row][col] === States.Blank
                || mazeBoard[row][col] === States.Start)) {
            return true;
        }
        return false;
    };
    GreedySearch.prototype.Check_Path = function (mazeBoard, row, col, endPosition, States, Visited) {
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
    GreedySearch.prototype.Solve_Maze = function (mazeBoard, startPosition, endPosition, States, Visited) {
        if (this.Check_Path(mazeBoard, startPosition[0], startPosition[1], endPosition, States, Visited)) {
            return true;
        }
        else {
            return false;
        }
    };
    return GreedySearch;
}());
var DepthFirstSearch = /** @class */ (function () {
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
var maze = new Maze;
maze.Set_Algorithm(new DepthFirstSearch(6, 6));
maze.Generate_Maze();
maze.Solve_Maze();
