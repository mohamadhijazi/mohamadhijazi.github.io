# 08 — Game Modules: Tango and Queens

## Shared game-module rule

Implement only `games/tango.js` and `games/queens.js`, plus their catalog entries when integrating. Keep validation deterministic and testable without the DOM.

## Tango (Sun and Moon)

### Player goal

Fill every cell in a 6x6 grid with Sun or Moon. Each row and column contains exactly three of each. No three identical symbols may be consecutive horizontally or vertically. Every `=` clue pair contains equal symbols; every `x` clue pair contains opposite symbols.

### Puzzle data

```js
{
  size: 6,
  givens: [{ r: 0, c: 1, value: "sun" }],
  solution: [["sun", "moon", ...], ...],
  edges: [
    { a: [0, 0], b: [0, 1], relation: "=" },
    { a: [1, 2], b: [2, 2], relation: "x" }
  ]
}
```

An edge connects two orthogonally adjacent in-bounds cells. No duplicate or contradictory edge clues. Givens are valid `sun`/`moon` values. `solution` is a complete answer grid, not shown to players; validate it and prove it is the only solution.

### State and validation

Cells are `sun`, `moon`, or `null`. Givens are locked. Provide immediate feedback for a row/column over-count, a triple, or a violated edge. Incomplete rows/columns are not failures until a constraint is already impossible. Completion requires all 36 cells assigned and every rule satisfied.

Use icons/text labels, not color alone. In accessible names say `Sun`, `Moon`, row, and column. The `=` and `x` clue must include explanatory accessible text.

### Tutorial, controls, and hints

Tutorial: balance each row/column at three Suns and three Moons, avoid triples, and satisfy every equality/opposite clue. Select a cell, choose Sun or Moon, and explain locked starters.

Use a focusable cell grid with arrow-key navigation and explicit Sun/Moon buttons that work by keyboard and touch. Backspace clears the selected non-given cell. Undo restores the previous cell edit; reset clears editable cells only.

Level 1 hint reminds the player of a relevant balance/triple/edge rule. Level 2 identifies a forced symbol or one useful constraint interaction without revealing the whole solution.

## Queens

### Player goal

Place exactly one Queen in each row, each column, and each colored region. Queens must not touch; touching means occupying neighboring cells, including diagonals (king-move adjacency). Do not apply a full chess-diagonal attack rule unless a puzzle explicitly declares it; the default rule is adjacency only.

### Puzzle data

```js
{
  size: 6, // 6 or 7
  regions: [
    ["A", "A", "B", "B", "C", "C"],
    ["A", "D", "D", "B", "C", "E"]
  ],
  solution: [{ r: 0, c: 1 }, { r: 1, c: 3 }, ...],
  lockedQueens: [{ r: 0, c: 1 }]
}
```

`regions` must be a square `size x size` matrix. Exactly `size` region IDs must occur, and each region must contain at least one cell. `solution` is a full canonical placement, not shown to players; validate it and prove it is the only valid placement. Locked Queens must be unique and mutually valid.

### State and validation

Represent Queen placements as coordinate pairs. Reject out-of-range positions and duplicates. A placement is conflicting if another Queen shares its row, column, or region, or is within one cell in both row and column (including diagonal). Show conflicts with text/icons/patterns as well as color. Completion requires exactly `size` Queens and exactly one in every row, column, and region, with no touching pair.

Do not mark a partial valid board as complete. Locked Queens cannot be removed.

### Tutorial, controls, and hints

Tutorial: place one Queen in each row, column, and region; Queens may not touch, including diagonally adjacent cells. Explicitly distinguish this adjacency rule from full chess-diagonal attacks.

Use a focusable cell grid with arrow-key navigation and Enter/Space or a visible button to place/remove a Queen. Backspace removes the most recently placed unlocked Queen; reset removes all unlocked Queens.

Level 1 restates the row/column/region/non-touching rules. Level 2 points to a highly constrained row, region, or candidate cell without revealing the full placement.

## Catalog and acceptance checks

- Include 42 unique Tango and 42 unique Queens boards. Each must have at least one valid solution; prefer a unique solution.
- Tango tests cover row/column counts, a horizontal and vertical triple, each edge relation, givens, and a full valid board.
- Queens tests cover row, column, region, diagonal-touching neighbor, non-touching diagonal separation, locks, and a valid full arrangement.
- Malformed matrices and edge coordinates return validation errors rather than crashing.
- Tutorials explain the objective, exact adjacency rule, controls, and undo/reset behavior.
- Hints offer a rule reminder followed by a state-specific nudge and never reveal the full solution.
