var mancala = mancala || {};
// 6 pockets each side of the board.
mancala.board = [[  4,4,4,4,4,4  ],    // mancala.board[0] is the far side
                 [  4,4,4,4,4,4  ]];   // mancala.board[1] is the near side
mancala.mancala = [0,0] // mancala.mancala[0] is the far side. We track it seperately because the players can't pick them as a move.
                        // Also we use it for scoring.
mancala.turn = 1; //Alternates between 0 and 1. We'll start with the player sitting closest the screen (near side)
mancala.hand = 0;
mancala.renderQueue = [];
mancala.continuePlaying = true;
$(document).ready(function(){
  mancala.renderEverything();
  mancala.setListeners();
});
mancala.sow = function(row, index) {
  if(mancala.continuePlaying === false) { return; }
  mancala.checkVictory();
  if(mancala.continuePlaying === false) { return; }
  // if(mancala.renderQueue !== []) {mancala.renderBoard()};
  if(mancala.checkValidSow(row, index)) {
    mancala.takeSeeds(row,index);
    // Sowing moves to the right. Player 0 is facing towards the screen so their sowing goes relatively to the left. 
    row === 0 ? mancala.direction = -1 : mancala.direction = 1; // Set initial sow direction
    console.log('Direction set to: ' + mancala.direction);
    while(mancala.hand > 0 ) {
      if(index + mancala.direction < 0 || index + mancala.direction > 5) {  // If you hit the end of the row
        if( (mancala.turn === 0 && index + mancala.direction < 0)||(mancala.turn === 1 && index + mancala.direction > 5) ){ // and you're on your row
          mancala.mancala[mancala.turn]++;                                    // you must be at your mancala. Put a seed in there.
          mancala.renderQueue.push(['m'+','+mancala.turn]);
          console.log('Seeds in mancala: ' + mancala.mancala[mancala.turn]);
          mancala.hand--; // Remove a seed from your hand
          // mancala.renderBoard();
          console.log(mancala.hand +' seeds in the hand');
          mancala.checkLoss();
          if(mancala.continuePlaying === false) { return; }
          if(mancala.hand === 0) {
            console.log('You finished your turn in your mancala. Take another turn.')
            mancala.renderChange();
            return;
          }
        }
        mancala.direction === 1 ? mancala.direction = -1 : mancala.direction = 1; //Switch direction
        console.log('Direction set to: ' + mancala.direction);
        row === 0 ? row = 1 : row = 0;// Don't change the index when you're changing row
        mancala.board[row][index]++;  // Just sow right where you are
        mancala.renderQueue.push([row+','+index]); // Record changes
        mancala.hand--;               // And remove a seed from the hand
        // mancala.renderBoard();
        console.log(mancala.hand +' seeds in the hand');
      } else {
      index = index + mancala.direction;  // Advance to the next pit
      mancala.board[row][index]++;        // Sow a seed
      mancala.renderQueue.push([row+','+index]); // Record changes
      mancala.hand--;                     // Remove one from the hand
      // mancala.renderBoard();
      console.log(mancala.hand +' seeds in the hand');
      }
    }
  if(mancala.hand === 0 && mancala.board[row][index] === 1 && row === mancala.turn){ // If you finish your turn on an empty spot on your row
    mancala.board[row][index]--;                                                     // Remove that seed
    mancala.mancala[mancala.turn]++;                                                 // and put it in your mancala
    mancala.renderQueue.push(['m'+','+mancala.turn]);
    var oppositeRow = 0;
    row === 0 ? oppositeRow = 1 : oppositeRow = 0;
    mancala.mancala[mancala.turn] += mancala.board[oppositeRow][index];       // Put the seeds in the opposite row in your mancala
    console.log('Captured ' + mancala.board[oppositeRow][index] + ' seeds')
    mancala.board[oppositeRow][index] = 0;                                   // (and empty the pit)
    // debugger;
    mancala.renderQueue.push([oppositeRow + ','+index]);
    mancala.renderChange();
  }
  mancala.checkLoss();
  if(mancala.continuePlaying === false) { return; }
  mancala.turn === 0 ? mancala.turn = 1 : mancala.turn = 0;
  mancala.renderChange();
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
  mancala.renderQueue.push([row+','+index]);
  console.log(mancala.hand +' seeds in the hand');
  mancala.board[row][index] = 0;
}
mancala.checkVictory = function() {
  var enemyRow = 0;
  mancala.turn === 0 ? enemyRow = 1 : enemyRow = 0;
  if(!mancala.board[enemyRow].reduce(function(a,b){return a + b;})) {                                // If the enemy row is empty
    mancala.mancala[mancala.turn] += mancala.board[mancala.turn].reduce(function(a,b){return a + b;}) // Add all the remaining seeds on your side
    for(i = 0; i < mancala.board[mancala.turn].length; i++) {                                        // to your mancala. 
      mancala.board[mancala.turn][i] = 0; // Empty the board.
    }
    console.log('Game over');
    mancala.renderEverything();
    if(mancala.mancala[0] === mancala.mancala[1]) {
      console.log("It's a draw");
    } else if(mancala.mancala[0] > mancala.mancala[1]) {
      console.log('Player 0 wins');
    } else {
      console.log ('Player 1 wins');
    }
    mancala.continuePlaying = false;
  }
}
mancala.checkLoss = function() { // This is the opposite of DRY. I really need to figure out how to combine this and checkVictory()
  var enemyRow = 0;
  mancala.turn === 0 ? enemyRow = 1 : enemyRow = 0;
  if(!mancala.board[mancala.turn].reduce(function(a,b){return a + b;})) {                     // If your row is empty
    mancala.mancala[enemyRow] += mancala.board[enemyRow].reduce(function(a,b){return a + b;}) // Add all the remaining seeds on the enemies side
    for(i = 0; i < mancala.board[enemyRow].length; i++) {                                     // to the enemy mancala. 
      mancala.board[enemyRow][i] = 0; // Empty the board.
    }
    console.log('Game over');
    mancala.renderEverything();
    mancala.mancala[0] > mancala.mancala[1] ? console.log('Player 0 wins') : console.log ('Player 1 wins');
    mancala.continuePlaying = false;
  }
}
mancala.renderChange = function() {
  var row = '';
  for(i = 0; i < mancala.renderQueue.length; i++) {
    var renderNext = mancala.renderQueue[i];
    renderNext = renderNext[0].split(',')
    if(renderNext[0] === "m") {
      var temp = '#mancala-'+renderNext[1];
      $(temp).hide().text(mancala.mancala[renderNext[1]]);
      var delayStagger = 200 * i + 200;
      $(temp).delay(delayStagger).slideDown(100);
    } else {
      // debugger;
      parseInt(renderNext[0]) === 0 ? row = 'far' : row = 'near';
      var temp = '#'+row+'-pit-'+renderNext[1];
      $(temp).hide().text(mancala.board[renderNext[0]][renderNext[1]]); // Hide each altered element and update it's text
      var delayStagger = 200 * i + 200;           // Each successive element gets 200ms more delay before it appears
      $(temp).delay(delayStagger).slideDown(100); // After the incremental delay, slide the updated text down
      // console.log(mancala.renderQueue[i]);
    }
  }
  mancala.renderQueue = [];
}
mancala.renderEverything = function() {
  $('#mancala-0').text(mancala.mancala[0])
  $('#mancala-1').text(mancala.mancala[1])
  for(i = 0; i < mancala.board[0].length; i++) {
    $('#far-pit-'+i).text(mancala.board[0][i]);
  }
  for(i = 0; i < mancala.board[1].length; i++) { //repeating myself on the off chance I decide to allow assymmetrical rows
    $('#near-pit-'+i).text(mancala.board[1][i]);
  }
}
mancala.setListeners = function() {
  $('.near').each(function(index, element) {
    $(element).on('click', function(e) {
      mancala.sow(1,index);
    })
  })
  $('.far').each(function(index, element) {
    $(element).on('click', function(e) {
      mancala.sow(0,index);
    })
  })
}