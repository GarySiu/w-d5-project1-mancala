var mancala = mancala || {};
// 6 pockets each side of the board.
mancala.board = [[  4,4,4,4,4,4  ],    // mancala.board[0] is the far side
                 [  4,4,4,4,4,4  ]];   // mancala.board[1] is the near side
mancala.mancala = [0,0] // mancala.mancala[0] is the far side. We track it seperately because the players can't pick them as a move.
                        // Also we use it for scoring.
mancala.turn = 1; //Alternates between 0 and 1. We'll start with the player facing toward the screen (near side)
mancala.hand = 0;
mancala.direction = 0;
mancala.continuePlaying = true;
mancala.sow = function(row, index) {
  if(mancala.checkValidSow(row, index)) {
    mancala.checkVictory();
    if (mancala.continuePlaying === false) { return; }
    mancala.takeSeeds(row,index);
    // Sowing moves to the right. Player 0 is facing towards the screen so their sowing goes relatively to the left. 
    row === 0 ? mancala.direction = -1 : mancala.direction = 1; // Set initial sow direction
    console.log('Direction set to: ' + mancala.direction);
    while(mancala.hand > 0 ) {
      if(index + mancala.direction < 0 || index + mancala.direction > 5) {  // If you hit the end of the row
        if( (mancala.turn === 0 && index + mancala.direction < 0)||(mancala.turn === 1 && index + mancala.direction > 5) ){ // and you're on your row
          mancala.mancala[mancala.turn]++;                                    // you must be at your mancala. Put a seed in there.
          console.log('Seeds in mancala: ' + mancala.mancala[mancala.turn]);
          mancala.hand--; // Remove a seed from your hand
          console.log(mancala.hand +' seeds in the hand');
          if(mancala.hand === 0) {
            console.log('You finished your turn in your mancala. Take another turn.')
            return;
          }
        }
        mancala.direction === 1 ? mancala.direction = -1 : mancala.direction = 1; //Switch direction
        console.log('Direction set to: ' + mancala.direction);
        row === 0 ? row = 1 : row = 0;// Don't change the index when you're changing row
        mancala.board[row][index]++;  // Just sow right where you are
        mancala.hand--;               // And remove a seed from the hand
        console.log(mancala.hand +' seeds in the hand');
      } else {
      index = index + mancala.direction;  // Advance to the next pit
      mancala.board[row][index]++;        // Sow a seed
      mancala.hand--;                     // Remove one from the hand
      console.log(mancala.hand +' seeds in the hand');
      }
    }
  if(mancala.hand === 0 && mancala.board[row][index] === 1 && row === mancala.turn){ // If you finish your turn on an empty spot on your row
    mancala.board[row][index]--;                                                     // Remove that seed
    mancala.mancala[mancala.turn]++;                                                 // and put it in your mancala
    var oppositeRow = 0;
    row === 0 ? oppositeRow = 1 : oppositeRow = 0;
    mancala.mancala[mancala.turn] = mancala.board[mancala.oppositeRow][index];       // Put the seeds in the opposite row in your mancala
    mancala.board[mancala.oppositeRow][index] = 0;                                   // (and empty the pit)
  }
  mancala.turn === 0 ? mancala.turn = 1 : mancala.turn = 0;
  console.log('Player turn set to ' + mancala.turn);
  }
}
mancala.checkValidSow = function(row, index) {
  if(mancala.turn !== row) {
    console.log('Invalid move. You can only sow from your own row.');
    return false;
  } else if(mancala.board[row][index] === 0) {
    console.log('The pit you selected is empty. Pick another one.');
    return false;
  }
  return true;
}
mancala.takeSeeds = function(row, index) {
  mancala.hand = mancala.board[row][index]; // move the seeds from the board to the hand
  console.log(mancala.hand +' seeds in the hand');
  mancala.board[row][index] = 0;
}
mancala.checkVictory = function() {
  var enemyRow = 0;
  mancala.turn === 0 ? enemyRow = 1 : enemyRow = 0;
  if(!mancala.board[enemyRow].reduce(function(a,b){return a + b;})) {                                // If the enemy row is empty
    mancala.mancala[mancala.turn] = mancala.board[mancala.turn].reduce(function(a,b){return a + b;}) // Add all the remaining seeds on your side
    for(i = 0; i < mancala.board[mancala.turn].length; i++) {                                        // to your mancala. 
      mancala.board[mancala.turn][i] = 0; // Empty the board.
    }
    console.log('Game over');
    mancala.mancala[0] > mancala.mancala[1] ? console.log('Player 0 wins') : console.log ('Player 1 wins');
    continuePlaying = false;
  }
}