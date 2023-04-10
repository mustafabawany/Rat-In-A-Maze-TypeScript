interface MazeUI {
    Print_Maze(mazeBoard: string[][]): void;
    Solution_Failed(): void;
};

class ConsoleView implements MazeUI {
    constructor(Rows: number, Columns:number, mazeBoard:string[][]) {
        var tempArray : string[] = [];

        for(let row = 0 ; row < Rows ; row++) {
            tempArray = []
            for (let col = 0 ; col < Columns ; col++) {
                tempArray.push(' ');
            }
            mazeBoard.push(tempArray);
        }    
    }

    Print_Maze(mazeBoard: string[][]): void {
        var Rows = mazeBoard.length;
        for (var rows = 0 ; rows < Rows ; rows++) {
            console.log(mazeBoard[rows]);
        }
        console.log("\n");
    }

    Solution_Failed() {
        console.log("No Solution!");
    }
}

class WebView implements MazeUI {
    constructor(Rows: number, Columns: number, mazeBoard:string[][]) {
        const table = document.getElementById('matrix') as HTMLInputElement;
        var tempArray : string[] = [];
        for(let row = 0 ; row < Rows ; row++) {
            const TR = document.createElement('tr');
            TR.className = 'row';
            table.appendChild(TR);
            tempArray = []
            for (let col = 0 ; col < Columns ; col++) {
                const TH = document.createElement('th');
                TH.innerText = ' ';
                TH.className = 'square-hollow';
                TR.appendChild(TH);
                tempArray.push(' ');
            }
            mazeBoard.push(tempArray);
        }    
    }
    Print_Maze(mazeBoard: string[][]): void {
        const table = document.getElementById('matrix') as HTMLInputElement;
        const rowTag = document.querySelectorAll('tr');
        const Rows = mazeBoard.length;
        const Columns = mazeBoard.length[0];
        const heading = document.getElementById('Failed');
        
        if(heading) 
            heading.remove();

        rowTag.forEach(row => row.remove());  

        for(let row = 0 ; row < Rows ; row++) {
            const TR = document.createElement('tr');
            TR.className = 'row';
            table.appendChild(TR);
            for (let col = 0 ; col < Columns ; col++) {
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
    }
    Solution_Failed() { 
        const table = document.getElementById('matrix') as HTMLInputElement;
        const rows = document.querySelectorAll('tr');
        for(let row = 0 ; row < rows.length; row++) {
            rows[row].remove();
        }
        let heading = document.createElement('h1');
        heading.innerText = "Solution Does Not Exist";
        heading.id = "Failed";
        table.appendChild(heading);
    }
}

class MazeSolver {
    private UI;
    private mazeBoard: string[][] = [];
    private Rows: number;
    private Columns: number;
    private startPosition: number[];
    private endPosition: number[];

    private States = {
        Start : 'S',
        End: 'E',
        Hurdle: 'W',
        Visited: 'V',
        Blank: 'B'
    }
    
    private Directions = {
        Up: [-1, 0],
        Down: [1,0],
        Left: [0 , -1],
        Right: [0 , 1]
    }

    constructor(Rows: number, Columns: number) {
        this.UI = new ConsoleView(Rows, Columns, this.mazeBoard);
        this.startPosition = [0,0];
        this.endPosition = [0,0]
        this.Rows = Rows;
        this.Columns = Columns;
    }

    Generate_Maze() : void {
        this.startPosition = [Math.floor(Math.random() * this.Rows), Math.floor(Math.random() * this.Columns)];
        this.endPosition = [Math.floor(Math.random() * this.Rows), Math.floor(Math.random() * this.Columns)];
        for (let row = 0; row < this.Rows ; row++) {
            for (let col = 0; col < this.Columns; col++) {
                if (row === this.startPosition[0] && col === this.startPosition[1]) {
                    this.mazeBoard[row][col] = this.States.Start;
                }
                else if (row === this.endPosition[0] && col === this.endPosition[1]) {
                    this.mazeBoard[row][col] = this.States.End;
                }
                else {
                    let random_number = Math.floor(Math.random() * 4);
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
    }
    
    Check_Safe_States(row: number, col: number) : boolean {
        if (row <= this.Rows - 1 && col <= this.Columns - 1 && row >= 0 && col >= 0 
            && (this.mazeBoard[row][col] === this.States.Blank 
            || this.mazeBoard[row][col] === this.States.Start)) {
                return true;
            }
            return false;
    }

    Check_Path(row: number, col: number) : boolean {
        if (row === this.endPosition[0] && col === this.endPosition[1]) {
            return true;
        }

        if (this.Check_Safe_States(row,col)) {
            this.UI.Print_Maze(this.mazeBoard);
            if (this.mazeBoard[row][col] === this.States.Blank)
                this.mazeBoard[row][col] = this.States.Visited;
            
            if (this.Check_Path(row + this.Directions.Down[0] , col + this.Directions.Down[1]))
                return true;
            
            if (this.Check_Path(row + this.Directions.Right[0] , col + this.Directions.Right[1]))
                return true; 
            
            if (this.Check_Path(row + this.Directions.Left[0] , col + this.Directions.Left[1]))
                return true;
            
            if (this.Check_Path(row + this.Directions.Up[0] , col + this.Directions.Up[1]))
                return true;

            if (this.mazeBoard[row][col] !== this.States.Start)
                this.mazeBoard[row][col] = this.States.Blank;
            
            return false;
        }
        return false;
    }

    Solve_Maze(): void {
        if (this.Check_Path(this.startPosition[0], this.startPosition[1])) {
            this.UI.Print_Maze(this.mazeBoard);
        }
        else {
            this.UI.Solution_Failed();
        }
    }
}

const maze = new MazeSolver(4,4);
maze.Generate_Maze();
maze.Solve_Maze();