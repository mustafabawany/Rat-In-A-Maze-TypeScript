export var ConsoleView = /** @class */ (function () {
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
export var WebView = /** @class */ (function () {
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
        const table = document.getElementById('matrix');
        const rows = document.querySelectorAll('tr');
        const Rows = mazeBoard.length;
        const Columns = mazeBoard[0].length;

        if(document.getElementById('Failed'))
        {
            document.getElementById('Failed').remove();
        }

        for(let row = 0 ; row < rows.length; row++)
        {
            rows[row].remove();
        }

        for(let row = 0 ; row < Rows ; row++)
        {
            const TR = document.createElement('tr');
            TR.className = 'row';
            table.appendChild(TR);
            for (let col = 0 ; col < Columns ; col++)
            {
                const TH = document.createElement('th');
                TH.innerText = mazeBoard[row][col];
                if (mazeBoard[row][col] === 'S'){
                    TH.className = 'square-start';
                }
                else if (mazeBoard[row][col] === 'E'){
                    TH.className = 'square-start';
                }
                else if (mazeBoard[row][col] === ' '){
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