class components{
   constructor(){
       this.isStartButtonClk = 0,
       this.isDestinationButtonClk=0,
       this.startPos = "",
       this.destinationPos = "",
       this.obstacleClk = 0,
       this.twoDimCell = new Array(25).fill(0).map(()=>Array(40).fill(0)),// make 25 * 40 2d array for the grid and fill all value 0
       this.visited = new Array(25).fill(false).map(()=>Array(40).fill(false)),//make 25*40 2d array for the visited cell and fill false
       this.route = [],
       this.obstacleList = [],
       this.parentNode = new Array(25).fill(-1).map(()=>Array(40).fill(-1)); // for all nodes parent node
   }
};
let pathLen; // 
/* Save Destination and Start point */
let obj = new components();
//just check if the buttos is clicked or not, if click then handle it in Grid cell click.
let startPoint = () =>{
    obj.isStartButtonClk++;
}
let endPoint = () =>{
    obj.isDestinationButtonClk++;
}

/* grid cell click */
//Here when cell click after Start or destination button click then count the position 
//as destionation or start
//Else other time when cell click it means , hover over grid and 
//make obstacle, when second click obstacle make is over then it can start 
//making the path.
let gridCellClk = (id) =>{
    //Create clicked cell obj for change color 
    let changeColor = document.getElementById(id);
    //Check whether click is happened after start or destination button click
    if(obj.isStartButtonClk === 1 && obj.destinationPos != id && changeColor.style.backgroundColor!=="rgb(135, 128, 128)"){
        obj.startPos = id;
        obj.isStartButtonClk++;
        //color green for start
        //changeColor.style.backgroundColor="green";
        changeColor.style.transform="scale(1.25) perspective(1px)";
        changeColor.style.backgroundImage="url('./Icons/map.png')";
    }
    else if(obj.isDestinationButtonClk === 1 && obj.startPos !== id && changeColor.style.backgroundColor!=="rgb(135, 128, 128)"){
        obj.destinationPos = id;
        obj.isDestinationButtonClk++;
        //color red for destination
        changeColor.style.transform="scale(1.25) perspective(1px)";
        changeColor.style.backgroundImage="url('./Icons/flag.png')";
        //changeColor.style.backgroundColor="red";
    }
    else if(obj.isStartButtonClk!==1 && obj.isDestinationButtonClk !== 1
            && obj.startPos!==id && obj.destinationPos !==id ){
                //Its time to make obstacle
                obj.obstacleClk++;
                if(obj.obstacleClk<2){
                   collectObstacle(id);
                }
                if(obj.obstacleClk == 2){
                    obstacleList();
                }
            }
}

/* Collect obstacle and add into an array */
//1 means in the 2d array its a obstacle 0 means path clear
 //id is row-col string format, so first divide its row col from "-"
let collectObstacle = (id) =>{
    let idSplit = id.split('-'); //Here idSplit arrays 0 no value is row and 1 is column
    let changeColor = document.getElementById(id);
    if(changeColor.style.backgroundColor==="rgb(135, 128, 128)"){
        changeColor.style.backgroundColor="transparent";
        obj.twoDimCell[parseInt(idSplit[0])][parseInt(idSplit[1])] = 0;//Remove the obstacle
        obj.visited[parseInt(idSplit[0])][parseInt(idSplit[1])] = false;//Clear to this cell and make visited
    }
    else{
        //if its not previously added now add it in twoDimCell
        obj.twoDimCell[parseInt(idSplit[0])][parseInt(idSplit[1])] = 1;//mark obstacle by 1
        obj.visited[parseInt(idSplit[0])][parseInt(idSplit[1])] = true;//mark visited cell true, because its a obstacle so we are not gonna visit it further
        
       // alert(obj.twoDimCell[5][33]);
        changeColor.style.backgroundColor="rgb(135, 128, 128)";
    }
}

/* collect obstacle list for animation of obstacle */
let obstacleList = () =>{
   for(let i=0;i<25;i++){
     for(let j=0;j<40;j++){
         if(obj.twoDimCell[i][j]===1){
             obj.obstacleList.push(i+"-"+j);
         }
     }
   }
}

/*grid Mouse Over */
let gridMouseOver = (id) =>{
    if(obj.obstacleClk > 0 && obj.obstacleClk < 2 && obj.startPos !==id && obj.destinationPos!== id){
        collectObstacle(id);
    }
}

/* start the search */
let searchRoute = () =>{
    //make sure start and desstination is set
    if(obj.destinationPos ==="" || obj.startPos === ""){
        alert('Mark Start and Destination point first!')
    }
    else{
        startAnimateObstacle();
    }
}

/* Animate obstacle */
let pos = 0;
let startAnimateObstacle = () =>{
    setTimeout(()=>{
        if(pos<obj.obstacleList.length){
            startAnimateObstacle();
        }
        else{
         let isFound =  startBfs(); //after obstacle animate finished check for path result
         isFound === true ? pathFound() : pathNotFound();
        }
       let obst = document.getElementById(obj.obstacleList[pos]);
       obst.style.animation = "obst-ani .6s";
       obst.style.backgroundColor = "#E45050";
       obst.style.transform="scale(1.1) perspective(1px)";
       pos++;
      
    },25);
}


/* BFS start */
let startBfs = () =>{
        //Make a position array for left - right - up - down cell for row and column
        let rowDirection = [-1,0,1,0],
            colDirection = [0,1,0,-1];
       //Start bfs
       let splitStart = obj.startPos.split('-'),
           splitDestination = obj.destinationPos.split('-');
       let queue = [{row:splitStart[0],col:splitStart[1]}]; //1st insert the start cell into queue
       obj.visited[splitStart[0]][splitStart[1]] = true; //make start cell visited true
       while(queue.length !==0){
           //pop the top element from queue and search its neighbous node, if not visited then visit them!
           let topElem = queue.shift();
           for(let i=0;i<4;i++){ //visit up - down - right - left
              let rowNow = parseInt(topElem.row) + parseInt(rowDirection[i]),
                  colNow = parseInt(topElem.col) + parseInt(colDirection[i]);
              if(isValidCell(rowNow,colNow)){ //Check If neighbours is valid cell or not
                  queue.push({row:rowNow,col:colNow});
                  obj.parentNode[rowNow][colNow] = topElem.row+'-'+topElem.col; //save this cells parent node 
                  obj.visited[rowNow][colNow] = true;
                  if(rowNow == splitDestination[0] && colNow == splitDestination[1]){ //We reach our destination now return from this function
                    return true; //we found it
                  }  
              }
           }
       }
       return false; //Not found 
    
}

// Check validity of up down right let cell visit
let isValidCell = (row,col) =>{
    if(row >= 25 || row < 0 || col >= 45 || col < 0){ //We have row size 25 and column size 45
        return false;
    }
    else {
        if(obj.visited[row][col]){ //if cell valid but already visited then return false
           return false;
        }
        else{
            return true;
        }
    }
}

//Path Print 
let pathFound = () =>{
    let row,col;
    let splitDestination = obj.destinationPos.split('-');
    let parentNodeValue  = obj.parentNode[parseInt(splitDestination[0])][parseInt(splitDestination[1])];
    let parentNodeValueSplit = parentNodeValue.split('-');
    row = parentNodeValueSplit[0]-'0',col = parentNodeValueSplit[1]-'0';
    while(obj.parentNode[row][col] !="-1"){
        obj.route.push(row+'-'+col);
        //change row col value by its present parendNode value
        let presentParentNode = obj.parentNode[row][col].split('-');
        row = presentParentNode[0],col = presentParentNode[1];
    }
    pathLen= obj.route.length - 1;
    drawPath();
    let printLen = document.getElementById('path-len');
    printLen.innerText+=`Shortest Path Length : ${pathLen+2}`

}
/* Draw the path */
let drawPath = () =>{
    setTimeout(()=>{
        let obst = document.getElementById(obj.route[pathLen]);
        obst.style.animation = "obst-ani .5s";
        obst.style.backgroundColor = "#5F8A3B";
        obst.style.transform="scale(1.1) perspective(1px)";
        pathLen--;
        if(pathLen >= 0){
            drawPath();
        }
    },50);
}

//path not found
let pathNotFound = ()=>{
   let pathLenText = document.getElementById('path-len');
    pathLenText.style.color="red";
    pathLenText.innerText="Path Not Found!";
}

/*Reset All */
let reset = () =>{
    pathLen=0,
    pos=0,
    obj.isStartButtonClk = 0,
    obj.isDestinationButtonClk=0,
    obj.startPos = "",
    obj.destinationPos = "",
    obj.obstacleClk = 0,
    obj.twoDimCell = new Array(25).fill(0).map(()=>Array(40).fill(0)),// make 25 * 40 2d array for the grid and fill all value 0
    obj.visited = new Array(25).fill(false).map(()=>Array(40).fill(false)),//make 25*40 2d array for the visited cell and fill false
    obj.route = [],
    obj.obstacleList = [],
    obj.parentNode = new Array(25).fill(-1).map(()=>Array(40).fill(-1)); // for all nodes parent node
    let pathLenText = document.getElementById('path-len');
    pathLenText.innerText="";
    for(let i=0;i<25;i++){
     for(let j=0;j<40;j++){
        let cell = document.getElementById(i+'-'+j);
        if(cell.style.backgroundColor!=="transparent"){
            cell.style.backgroundColor="transparent";
        }
        if(cell.style.backgroundImage){
            cell.style.backgroundImage="none";
        }
        cell.style.transform="scale(1) perspective(1px)";
     }
   }

}
