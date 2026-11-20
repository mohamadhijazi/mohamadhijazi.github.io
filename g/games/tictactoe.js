const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
export function winner(b){return lines.find(([a,c,d])=>b[a]&&b[a]===b[c]&&b[a]===b[d])?.map(i=>b[i])[0]||null}
function minimax(b,turn,depth=0){const w=winner(b);if(w)return w==='X'?10-depth:depth-10;if(b.every(Boolean))return 0;const scores=[];for(let i=0;i<9;i++)if(!b[i]){const next=[...b];next[i]=turn;scores.push(minimax(next,turn==='X'?'O':'X',depth+1))}return turn==='X'?Math.max(...scores):Math.min(...scores)}
export function bestMove(board,player='O'){let best=-Infinity,move=-1;for(let i=0;i<9;i++)if(!board[i]){const next=[...board];next[i]=player;const score=minimax(next,player==='X'?'O':'X');if(score>best){best=score;move=i}}return move}
export function validate(puzzle,state){const w=winner(state.board);return {valid:true,complete:w==='X',failed:w==='O'||state.board.every(Boolean),reason:w==='X'?'Forced win found!':w==='O'?'The opponent won.':state.board.every(Boolean)?'Draw.':'Find a forced win.'}}
export function transition(state,index){if(!Number.isInteger(index)||index<0||index>8||state.board[index]||winner(state.board))return state;const board=[...state.board];board[index]='X';if(!winner(board)&&!board.every(Boolean)){const i=bestMove(board,'O');if(i>=0)board[i]='O'}return {board}}
export function getHint(){return 'Look for an immediate win, a forced response, or a fork.'}
