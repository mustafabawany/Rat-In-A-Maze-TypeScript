import {Maze} from "../Maze.js";
import {GreedyApproach} from "../GreedyApproach.js";
import {DepthFirstSearch} from "../DepthFirstSearch.js";

let maze;
const Rows = 6;
const Cols = 6;

window.addEventListener("load" , function(event){
    maze = new Maze();
})

$(".btn").click(function(){
    var chosenColor = $(this).attr("id");
    
    if (chosenColor === "red")
    {   
        maze.Set_Algorithm(new GreedyApproach(Rows,Cols));        
        maze.Solve_Maze(); 
    }
    else if (chosenColor === 'green')
    {
        maze.Generate_Maze();
    }
    else if (chosenColor === 'blue')
    {
        maze.Set_Algorithm(new DepthFirstSearch(Rows,Cols));
        maze.Solve_Maze();
    }
})
