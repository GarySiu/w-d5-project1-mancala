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
mancala.direction = 0;
mancala.sow = function(row, index) {
  if(mancala.checkValidSow(row)) {
    // mancala.startRow = row; // Save the starting position. Do I even need to do this?!
    // mancala.startIndex = index;
    mancala.takeSeeds(row,index);
    // If the start row is 0, decrease the index until it === 0
    // while incrementing each pocket by 1 and decrementing the hand by 1 until hand is empty
    // if the start row is 1, increase the index until it === 5 
    // while incrementing each pocket by 1 until hand is empty
    row === 0 ? mancala.direction = -1 : mancala.direction = 1; // Set initial sow direction
    console.log('Direction set to: ' + mancala.direction);
    while(mancala.hand > 0 ) {
      if(index + mancala.direction < 0 || index + mancala.direction > 5) {  // If you hit the end of the row, reverse direction on the row.
        mancala.direction === 1 ? mancala.direction = -1 : mancala.direction = 1;
        console.log('Direction set to: ' + mancala.direction);
        row === 0 ? row = 1 : row = 0;
        mancala.board[row][index] = mancala.board[row][index] + 1; // Don't change the index when you're changing row
        mancala.hand--;
        console.log(mancala.hand +' seeds in the hand');
      } else {
      index = index + mancala.direction;
      mancala.board[row][index] = mancala.board[row][index] + 1;
      mancala.hand--;
      console.log(mancala.hand +' seeds in the hand');
      }
    }
  mancala.turn === 0 ? mancala.turn = 1 : mancala.turn = 0;
  console.log('Player turn set to ' + mancala.turn);
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