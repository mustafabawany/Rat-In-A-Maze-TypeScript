import {MazeSolver} from "../MazeSolver.js";

let maze;

window.addEventListener("load" , function(event){
	const Rows = 6;
    const Cols = 6;
    maze = new MazeSolver(Rows, Cols);
})

$(".btn").click(function(){
    var chosenColor = $(this).attr("id");
    
    if (chosenColor === "red")
    {           
        maze.Solve_Maze(); 
    }
    else if (chosenColor === 'green')
    {
        maze.Generate_Maze();
    }
})
