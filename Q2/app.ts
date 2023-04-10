interface MazeUI {
    Print_Maze(mazeBoard: string[][]): void;
    Solution_Failed(): void;
};

class ConsoleView implements MazeUI {
    constructor(Rows: number, Columns: number, mazeBoard:string[][]) {
        for (let i = 0; i < Rows; i++) {
            mazeBoard[i] = new Array(Columns);
            for (let j = 0; j < Columns; j++) {
              mazeBoard[i][j] = ' ';
            }
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

class Maze {
    private mazeStrategy: MazeSolverAlgorithm;
    private mazeUI: MazeUI;
    private mazeBoard: string[][] = [];
    private startPosition:number[];
    private endPosition:number[];
    private Rows: number;
    private Columns: number;
    private visited: boolean[][] = [];
    private States = {
        Start : 'S',
        End: 'E',
        Hurdle: 'W',
        Visited: 'V',
        Blank: 'B'
    }

    constructor() {
        this.startPosition = [0, 0];
        this.endPosition = [0, 0];
        this.Rows = 6;
        this.Columns = 6;
        this.mazeUI = new ConsoleView(this.Rows, this.Columns, this.mazeBoard);
        this.visited = new Array(this.Rows);
    }
    Set_Algorithm(mazeStrategy : MazeSolverAlgorithm):void {
        this.mazeStrategy = mazeStrategy;
    }
    Generate_Maze():void {
        for (let i = 0; i < this.Rows; i++) {
            this.visited[i] = new Array(this.Columns);
            for (let j = 0; j < this.Columns; j++) {
              this.visited[i][j] = false;
            }
        }
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
        this.mazeUI.Print_Maze(this.mazeBoard);
    }
    Solve_Maze():void {
        let result: boolean;
        result = this.mazeStrategy.Solve_Maze(this.mazeBoard, this.startPosition, this.endPosition, this.States, this.visited);
        if(result) {
            this.mazeUI.Print_Maze(this.mazeBoard);
        }
        else {
            this.mazeUI.Solution_Failed();
        }
    }
}

interface MazeSolverAlgorithm  {
    Rows: number;
    Columns: number;
    Solve_Maze(mazeBoard: string[][], startPosition: number[], endPosition:number[], States, Visited:boolean[][]): boolean;
}

class GreedySearch implements MazeSolverAlgorithm {
    Rows = 0;
    Columns = 0;
    private Directions = {
        Up: [-1, 0],
        Down: [1,0],
        Left: [0 , -1],
        Right: [0 , 1]
    }

    constructor(Rows: number, Columns: number) {
        this.Rows = Rows;
        this.Columns = Columns;
    }
    
    Check_Safe_States(mazeBoard:string[][], row: number, col: number , States , Visited:boolean[][]) : boolean {
        if (row <= this.Rows - 1 && col <= this.Columns - 1 && row >= 0 && col >= 0 
            && (mazeBoard[row][col] === States.Blank 
            || mazeBoard[row][col] === States.Start)) {
                return true;
            }
            return false;
    }

    Check_Path(mazeBoard:string[][], row: number, col: number , endPosition:number[] , States, Visited:boolean[][]) : boolean {
        if (row === endPosition[0] && col === endPosition[1]) {
            return true;
        }

        if (this.Check_Safe_States(mazeBoard,row,col,States,Visited)) {
            if (mazeBoard[row][col] === States.Blank)
                mazeBoard[row][col] = States.Visited;
            
            if (this.Check_Path(mazeBoard, row + this.Directions.Down[0] , col + this.Directions.Down[1], endPosition, States, Visited))
                return true;
            
            if (this.Check_Path(mazeBoard, row + this.Directions.Right[0] , col + this.Directions.Right[1], endPosition, States, Visited))
                return true; 
            
            if (this.Check_Path(mazeBoard, row + this.Directions.Left[0] , col + this.Directions.Left[1], endPosition, States, Visited))
                return true;
            
            if (this.Check_Path(mazeBoard, row + this.Directions.Up[0] , col + this.Directions.Up[1], endPosition, States, Visited))
                return true;

            if (mazeBoard[row][col] !== States.Start)
                mazeBoard[row][col] = States.Blank;
            
            return false;
        }
        return false;
    }

    Solve_Maze(mazeBoard: string[][] , startPosition: number[], endPosition: number[], States, Visited:boolean[][]): boolean {
        if (this.Check_Path(mazeBoard, startPosition[0] , startPosition[1], endPosition , States, Visited)) {
            return true;
        }
        else {
            return false;
        }
    }
}

class DepthFirstSearch implements MazeSolverAlgorithm {
    Rows: number;
    Columns: number;
    private Directions = {
        Up: [-1, 0],
        Down: [1,0],
        Left: [0 , -1],
        Right: [0 , 1]
    }
    constructor(Rows: number, Columns: number) {
        this.Rows = Rows;
        this.Columns = Columns;
    }

    Check_Safe_States(row: number, col: number, mazeBoard, States, Visited:boolean[][]) : boolean {
        return row >= 0 && row < this.Rows && col >= 0 && col < this.Columns && mazeBoard[row][col] !== States.Hurdle;
    }

    Check_Path(mazeBoard:string[][], row: number, col: number , endPosition:number[] , States, Visited:boolean[][]) : boolean  {
        if (row === endPosition[0] && col === endPosition[1]) {
            return true;
        }

        Visited[row][col] = true;

        for(const dir in this.Directions) {
            const movement = this.Directions[dir];
            const newRow = row + movement[0];
            const newCol = col + movement[1];
            if(this.Check_Safe_States(newRow, newCol, mazeBoard, States, Visited) && !Visited[newRow][newCol]) {
                if (this.Check_Path(mazeBoard, newRow, newCol, endPosition, States, Visited)) {
                    return true;
                }
            }
        }
        
        Visited[row][col] = false;

        return false;
    }

    Mark_Visited(mazeBoard: string[][], States, Visited:boolean[][]) : void {
        for(let row = 0; row < this.Rows; row++) {
            for(let col = 0; col < this.Columns; col++) {
                if (Visited[row][col] == true) {
                    if (mazeBoard[row][col] !== States.Start && mazeBoard[row][col] !== States.End)
                        mazeBoard[row][col] = States.Visited;
                }
            }
        }
    }

    Solve_Maze(mazeBoard:string[][], startPosition: number[] , endPosition: number[], States, Visited:boolean[][]): boolean {
        if (this.Check_Path(mazeBoard, startPosition[0], startPosition[1], endPosition, States, Visited)) {
            this.Mark_Visited(mazeBoard, States, Visited);    
            return true;
        } 
        else {
            return false;
        }
    }
}
const maze = new Maze;
maze.Set_Algorithm(new DepthFirstSearch(6,6));
maze.Generate_Maze();
maze.Solve_Maze();