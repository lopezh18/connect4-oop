/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


class Game {
  constructor(width, height, player1, player2) {
    this.width = width
    this.height = height
    this.board = []
    this.player2 = player2
    console.log(player1)
    this.player1 = player1
    this.currPlayer = player1
    
    
  }

  


  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }


  makeHtmlBoard() {
    const boardDOM = document.getElementById('board');
  
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    boardDOM.append(top);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      boardDOM.append(row);
    }
  }


  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }


  placeInTable(y, x) {
    const piece = document.createElement('div');
    let abc;
    if (this.currPlayer === this.player1) {
      abc = "p1"
    } else {
      abc = "p2"
    }

    piece.classList.add('piece');
    console.log(piece)
    piece.style.backgroundColor = `${this.currPlayer}`
    
    piece.classList.add(`${abc}`);
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  
  /** endGame: announce game end */
  
  endGame(msg) {
    
    setTimeout(function(){
      alert(msg)
    }, 600)
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);
  
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
  
    // check for win
    if (this.checkForWin()) {
      this.disableBoard()
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
  
    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }


  disableBoard() {
   let boardDom = document.getElementById("board")
    boardDom.classList.add('disabled')
  }



  checkForWin() {
    const _win = (cells) => {
    // function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      
      return cells.every(
        
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
          
      );
    }
  
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true; 
        }
      }
    }
  }

  resetGame() {
    //clear DOM Board
    
    let cells = document.getElementsByTagName("td")
    let boardDOM = document.getElementById("board")

    boardDOM.classList.remove("disabled")

    for (let cell of cells) {
      if (cell.firstChild) {
        cell.removeChild(cell.firstChild)
      }
 
    }


    //clear array board
    this.board = []
    this.makeBoard()
  }



}

class Player {
  constructor(color) {
    this.color = color
  }
}


let startButton = document.getElementById("start")
startButton.addEventListener("click", startGame)

function startGame(){
  
  let player1 = new Player("orange")
  let player2 = new Player("blue")
  let newGame = new Game(7,6, player1.color, player2.color)
  newGame.makeBoard();
  newGame.makeHtmlBoard();
  startButton.removeEventListener("click", startGame)
  startButton.addEventListener("click", newGame.resetGame.bind(newGame))
}


