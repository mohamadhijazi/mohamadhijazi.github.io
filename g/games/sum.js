export function validate(puzzle,state){
  try{
    const b=state.board;
    if(!Array.isArray(b)||b.length!==puzzle.rows||!Array.isArray(b[0])||b[0].length!==puzzle.cols)
      return {valid:false,complete:false,reason:'Board shape is invalid.'};
    const rows=puzzle.rows,cols=puzzle.cols;
    let count=0,hasMerge=false;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const v=b[r][c];
        if(v!=null){
          count++;
          const neighbors=[[r+1,c],[r-1,c],[r,c+1],[r,c-1]];
          for(const [nr,nc] of neighbors){
            if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&b[nr][nc]===v)hasMerge=true;
          }
        }
      }
    }
    if(count===1)return {valid:true,complete:true,reason:'Board cleared! Final tile reached.'};
    if(!hasMerge)return {valid:true,complete:false,reason:'No matching adjacent tiles. Tap Undo or Reset.'};
    return {valid:true,complete:false,reason:`${count} tiles left. Merge matching neighbors.`};
  }catch{
    return {valid:false,complete:false,reason:'Puzzle data is invalid.'};
  }
}

export function transition(state,{from,to},puzzle){
  const board=state.board.map(row=>[...row]);
  const [r1,c1]=from,[r2,c2]=to;
  if(board[r1]?.[c1]==null||board[r2]?.[c2]==null)return state;
  if(board[r1][c1]!==board[r2][c2])return state;
  if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1)return state;
  board[r2][c2]=board[r1][c1]+board[r2][c2];
  board[r1][c1]=null;
  return {board};
}

export function getHint(puzzle,state,level=1){
  if(level===1)return 'Merge two adjacent identical numbers into their sum. Clear the board until one tile remains.';
  const b=state.board;
  const rows=puzzle.rows,cols=puzzle.cols;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const v=b[r][c];
      if(v!=null){
        const neighbors=[[r+1,c],[r,c+1],[r-1,c],[r,c-1]];
        for(const [nr,nc] of neighbors){
          if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&b[nr][nc]===v){
            return `Try merging the matching ${v}s around row ${r+1}, column ${c+1}.`;
          }
        }
      }
    }
  }
  return 'No moves available. Tap Undo to try a different move.';
}
