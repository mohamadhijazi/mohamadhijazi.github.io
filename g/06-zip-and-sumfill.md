# 06 — Game Modules: Zip and SumFill

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

## SumFill

### Player goal

Fill every playable cell with a digit 1 through 9. Every defined horizontal/vertical run must sum to its target, and a digit cannot repeat within a run. Locked starter digits cannot be changed.

### Puzzle data

```js
{
  rows: 4,
  cols: 4,
  playable: [[true, true, false, true], ...],
  givens: [{ r: 0, c: 0, value: 4 }],
  solution: [[4, 5, null, 2], ...],
  runs: [
    { id: "across-1", direction: "across", target: 9, cells: [[0,0],[0,1]] },
    { id: "down-1", direction: "down", target: 7, cells: [[0,0],[1,0]] }
  ]
}
```

Every playable cell belongs to exactly one across run and one down run. Runs contain 1–9 playable cells, are contiguous in their direction, and do not include blocked cells. Targets must be feasible for run length with distinct digits 1–9. Every given references a playable cell and a value 1–9. `solution` is a full answer matrix with `null` at blocked cells; validate it and prove it is the only solution.

### Tutorial and state behavior

Represent empty cells as `null`; all filled values are integers 1–9. Do not allow edits to givens. Provide per-run feedback for duplicate digits, impossible partial sums, exact target sums, and incomplete values. A puzzle is complete only if all playable cells are filled and every run has distinct digits summing exactly to target.

Tutorial: fill playable cells with 1–9; each across/down run must reach its target without repeated digits. Explain how to select a cell, enter/replace a digit, erase a value, and recognize locked givens.

Use focused-cell navigation with arrow keys/Tab and numeric keys 1–9; provide on-screen digit controls for touch. Backspace/Delete clears the selected editable cell. Provide undo-last-edit and clear-editable-cells actions; never clear givens.

### Hints

Level 1 reminds the player to check the selected cell's across and down sums and no-repeat rule. Level 2 points to one constrained unfilled cell or one candidate-elimination step without filling the whole board. Return no hint when there is no useful safe nudge.

### Acceptance checks

- Zip rejects diagonal steps, repeats, blocked cells, skipped/future waypoints, and paths ending before all open cells are visited.
- Zip accepts a known valid full path from a catalog puzzle.
- SumFill catches a repeated digit even if the run sum happens to match.
- SumFill accepts a known solution, rejects a bad target, and preserves locked starter digits.
- Both modules reject malformed dimensions/coordinates without throwing.
- Both tutorials explain objective, legal moves, input, and undo; keyboard and touch controls are discoverable.
- Hints provide a rule reminder before a state-specific nudge and never return the full solution.
