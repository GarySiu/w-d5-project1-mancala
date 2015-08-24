var mancala = mancala || {};
// 6 pockets each side of the board.
mancala.board = [[  4,4,4,4,4,4  ],    // mancala.board[0] is the far side
                 [  4,4,4,4,4,4  ]];   // mancala.board[1] is the near side
mancala.mancala = [0,0] // mancala.mancala[0] is the far side. We track it seperately because the players can't pick them as a move.
                        // Also we use it for scoring.
mancala.turn = 0; //Alternates between 0 and 1
mancala.startRow = 0;
mancala.startIndex = 0;
mancala.hand = 0;
mancala.sow = function(row, index) {
  if(mancala.checkValidSow(row)) {
    mancala.startRow = row; // Save the starting position
    mancala.startIndex = index;
    mancala.takeSeeds(row,index);
    // If the start row is 0, decrease the index until it === 0
    // while incrementing each pocket by 1 and decrementing the hand by 1 until hand is empty
    // if the start row is 1, increase the index until it === 5 
    // while incrementing each pocket by 1 until hand is empty
    row === 0 ? sowDirection = -1 : sowDirection = 1;
  }
}
mancala.checkValidSow = function(row) {
  if(mancala.turn !== row) {
    console.log('Invalid move. You can only sow from your own row.');
    return false;
  }
  return true;
}
mancala.takeSeeds = function (row, index) {
    mancala.hand = mancala.board[row][index]; // move the seeds from the board to the hand
    console.log(mancala.hand +' seeds in the hand');
    mancala.board[row][index] = 0;
}