//@ignore-file

import MyGraph from "./MyGraph";

async function main(){
    console.log("Starting dev");
    const graph = new MyGraph();
    let shortestPath = graph.getShortestPath("K42", "K60a");
    console.log("Shortest path: ", shortestPath);
}

main();

