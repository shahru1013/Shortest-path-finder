/* Clone 20 * 40 grid  */
let gridBox = document.getElementById('a');
let board = document.getElementById('mid-grid-id');
let row = 0,col = 0;
for(let i=1;i<=1000;i++){
    let cln = gridBox.cloneNode(true);
    cln.id = row+"-"+col;
    board.appendChild(cln);
    col++;
    if(col==40){
       col = 0;
       row++;
    }
}