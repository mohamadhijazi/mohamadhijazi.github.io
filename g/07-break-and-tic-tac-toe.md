# 07 — Game Modules: BreakLogic and Tic-Tac-Toe

## Shared game-module rule

Implement only `games/break.js` and `games/tictactoe.js`, plus their catalog entries when integrating. Keep game rules pure and independent of browser APIs. Puzzle data is immutable; run state is separate.

## BreakLogic

### Player goal

Deduce a hidden sequence of colored/numbered symbols in a limited number of guesses. After each guess, show exact-position matches and correct-symbol/wrong-position matches. Do not reveal which individual positions are exact/partial unless the product UI explicitly opts in; the standard feedback is counts.

### Puzzle data

```js
{
  symbols: ["A", "B", "C", "D", "E", "F"],
  length: 4,                 // 4 or 5
  allowDuplicates: false,
  target: ["B", "D", "A", "C"],
  maxAttempts: 8
}
```

The target must use allowed symbols and satisfy duplicate policy. `maxAttempts` is a positive integer. Ensure the catalog target is not exposed in rendered text or accessibility labels until the run ends.

### Guess and feedback rules

For one guess, first count symbols in the target/guess and exact matches. Then calculate total symbol overlap with a frequency map; partial matches equal total overlap minus exact matches. This avoids overcounting repeated symbols. Validate guess length, symbol set, and duplicate policy before accepting it.

A run ends as solved when exact matches equal sequence length, or as failed when attempts reach `maxAttempts`. The shell records completion for either solved or failed state only if product policy is explicitly set; default policy is that only solved puzzles earn score, while a failed run is shown without score. Do not treat exhausted attempts as a correct completion.

### Tutorial and controls

Tutorial: submit a sequence, use exact-position and correct-symbol/wrong-position counts to narrow candidates, and solve before attempts run out. Explain symbol selection and submission.

Use accessible symbol buttons or a focused sequence editor operable by keyboard. Allow undo/clear of the current unsubmitted guess. A submitted guess is final and cannot be undone. Show attempts remaining and feedback in text as well as visual markers.

### Hints

Level 1 explains how exact and partial counts differ. Level 2 gives a non-positional clue such as whether a specific symbol appears in the target, without exposing the target sequence. Never reveal the target through accessible labels before the run ends.

## Tic-Tac-Toe

### Product mode

Use prebuilt tactical positions as the scheduled challenge. A position is a 3x3 board containing `X`, `O`, and `null`, plus `nextPlayer` (must be `X`) and a verified forced-win goal. Do not require a separate free-play match mode.

### Puzzle data

```js
{
  board: ["X", "O", "X", "O", "X", null, null, null, "O"],
  nextPlayer: "X",
  objective: "force-win",
  maxPlayerMoves: 2
}
```

The catalog must contain a valid nonterminal position where the player to move can force a win within `maxPlayerMoves` placements by the user, counting the opponent's responses between them. The UI must state whose turn it is and the objective (for example, "X to play and force a win in 2 moves"). User plays `X`; the built-in opponent plays `O` using minimax. Minimax must prefer wins, avoid losses, and draw when no forced win is available. The catalog solver must verify the win against every legal opponent response, not only one hand-picked line.

### Tutorial and state behavior

Only place a mark in an empty in-range cell. Alternate turns. Do not allow moves after a win or full-board draw. Detect wins across rows, columns, and both diagonals. A challenge is complete only when the user has met its forced-win objective; a loss/draw is a failed attempt and does not earn completion points by default.

Add a deterministic solver/test helper that checks the catalog challenge is winnable within the declared user-move limit against optimal legal opponent responses. Avoid relying on hand-authored claims.

Tutorial: X plays first in the displayed position; find a line that forces a win within the stated number of player moves despite O's best response. Explain how to place a mark and how the AI responds.

Use a 3x3 button grid navigable with arrow keys; Enter/Space places X in an empty cell. Undo removes the most recent player move and its paired AI response, if any, only before the game ends. Provide restart-to-original-position. Do not permit undo to alter a scored completion.

### Hints

Level 1 gives a tactical reminder (look for an immediate win, forced response, or fork). Level 2 highlights a useful square or threat to consider without supplying the complete winning line.

### Acceptance checks

- BreakLogic computes exact/partial counts correctly with and without repeated symbols, rejects malformed guesses, and ends at the attempt limit.
- The target never appears in normal UI before the run ends.
- Tic-Tac-Toe rejects occupied-cell and post-game moves, detects every winning line and draw, and AI never chooses an immediate forced loss when another legal move avoids it.
- Every tactical catalog board passes the forced-win solver.
- Tutorials and controls describe the objective, legal moves, AI response, undo, and restart behavior.
- Hints are progressive and do not reveal a full sequence of moves.
