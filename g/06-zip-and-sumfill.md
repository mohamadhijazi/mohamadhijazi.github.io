# 06 — Game Modules: Zip and SumBreak

## Shared game-module rule

Implement only `games/zip.js` and `games/sum.js`, plus their catalog entries in `puzzles-db.js` when integrating. Keep validators pure: input state and puzzle data in, a result out. A result should identify validity/completion and include a useful reason for invalid input. No game module may read the DOM, localStorage, or the clock.

## Zip

### Player goal

Trace a single orthogonally connected path from numbered waypoint 1 through waypoint N in order. The path must visit every open grid cell exactly once, never enter a blocked cell, never cross/revisit itself, and pass through each waypoint only at its matching step.

### Puzzle data

```js
{
  size: 5,                 // 5 or 6
  blocked: [[r, c], ...],  // zero-based
  waypoints: [
    { step: 1, r: 0, c: 0 },
    { step: 2, r: 2, c: 1 }
  ],
  solutionPath: [[0, 0], [0, 1], [1, 1], [2, 1]]
}
```

Coordinates must be in bounds. No blocked cell may be a waypoint. Waypoint steps are unique, contiguous from 1, and all positions are unique. The start is step 1 and the final numbered waypoint is N. `solutionPath` is a canonical full solution, not shown to players; validate it and prove it is the only full path.

### State and validation

Store `path` as ordered `[r,c]` coordinates. A next move must be an unvisited open cell sharing an edge with the last path cell. Backtracking may remove only the last path cell. The player cannot skip or enter a future numbered waypoint out of order. Completion is true only when every open cell appears once and all waypoints occur at the correct path positions/order. Validate restored state before rendering it.

### Tutorial and UI behavior

Tutorial: connect waypoints in numeric order, move only to an orthogonally adjacent open cell, and cover every open cell exactly once. Explain that diagonal moves and revisits are invalid.

Draw an accessible square grid with blocked cells, numbered waypoint labels, and the current path. Pointer/touch and keyboard operation must not require dragging only: select the start/next adjacent cell by tap/click, or focus a cell and use arrow keys followed by Enter/Space to extend the path. Backspace undoes the last step; provide a clear-path action. Make the current waypoint and legal-next-cell affordance explicit.

### Hints

Provide a pure progressive hint helper. Level 1 restates the next relevant path rule; level 2 identifies one useful next waypoint/path constraint without revealing the full path.

## SumBreak

### Player goal

Clear the grid by merging identical adjacent numbered tiles until only a single tile remains (similar to LinkedIn SumBreak). Drag or tap a number onto an orthogonally adjacent matching number to combine them into their sum (e.g. 2 + 2 = 4). The origin cell becomes empty.

### Puzzle data

```js
{
  rows: 3,
  cols: 3,
  board: [[2, 2, 4], [2, 4, 8], [null, 4, 8]],
  target: 32
}
```

### Tutorial and state behavior

Represent empty cells as `null`; filled values are integers. Drag or select a number and tap an orthogonally adjacent matching number to merge. The origin cell becomes `null`, and the target cell doubles its value. Completion requires reducing the board to exactly 1 tile.

Provide undo and reset actions to backtrack from dead ends.

### Hints

Level 1 reminds the player of the merge rule and single-tile goal. Level 2 points to an available valid merge without solving the entire board.

### Acceptance checks

- Zip rejects diagonal steps, repeats, blocked cells, skipped/future waypoints, and paths ending before all open cells are visited.
- Zip accepts a known valid full path from a catalog puzzle.
- SumBreak combines adjacent identical numbers into their sum and leaves the origin cell empty.
- SumBreak detects completion when exactly 1 tile remains.
- Both modules reject malformed dimensions/coordinates without throwing.

- Both tutorials explain objective, legal moves, input, and undo; keyboard and touch controls are discoverable.
- Hints provide a rule reminder before a state-specific nudge and never return the full solution.
