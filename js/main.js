var mancala = mancala || {};
// 6 pockets each side of the board.
mancala.board = [[  [4],[4],[4],[4],[4],[4]  ],    // mancala.board[0] is the far side
                 [  [4],[4],[4],[4],[4],[4]  ]];   // mancala.board[1] is the near side
mancala.mancala = [0,0] // mancala.mancala[0] is the far side. We track it seperately because the players can't pick them as a move.
                        // Also we use it for scoring.
mancala.turn = 0; //Alternates between 0 and 1
