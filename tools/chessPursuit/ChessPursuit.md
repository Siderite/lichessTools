# Chess Pursuit — Data-Driven Interaction Spec

The entire story and level are authored in a single data file (`ChessPursuit.dat`). Only the piece SVG shapes and the code that renders/interprets them remain in code.

## 1. File structure

- `@` lines **precede** blocks (beats + directives); block rows follow. No `@` inside a block.
- Generic `@win` / `@loss` text sits at the **very end**.

```
@<beats/directives for block A>
<block A rows>

@<beats/directives for block B>
<block B rows>

...

@win                  ← generic (end)
<win text lines>
@loss
<loss text lines>
```

## 2. Blocks (board)

- Rows are 8 characters; `.` = empty, otherwise a piece letter (PGN piece names):
  White (enemy, checks the hero): `P` pawn · `N` knight · `B` bishop · `R` rook · `Q` queen · `K` king.
  Black (hero's side, blocks): `p` pawn · `n` knight · `b` bishop · `r` rook · `q` queen · `k` king.
  Specials: `l`/`L` land mine · `w`/`W` war bear · `c`/`C` castle.
- `/`-separated variants = **block states**: `a/b/c`. The current block state (1-based) selects the variant; if a row has fewer variants than the current state, the **last** variant carries forward.
- Block directives: `@checkpoint`, `@showThreat <letter>`.

## 3. Beats (script)

| Beat | Syntax | Meaning |
| --- | --- | --- |
| Title | `@title` + line | game title overlay (hidden on the first `@start`) |
| Text | `@<actor>[/<trigger>][/<state>]` + lines | dialog box; bob the actor(s) |
| Screen | `@screen/<trigger>` + lines | dialog box; **no** bob |
| Action | `@2d` · `@iso` · `@stop` · `@start` | change view / advancement |

- `<actor>` = comma-separated SAN ids (`K`, `n`, `K,k`, `Ra2`, …) — bob all matched pieces.
- `<trigger>` = comma-separated filters (AND).
- `<state>` = block state (1-based); missing → **inherit latest**.
- Parsing: the last `/`-segment is the `<state>` if it is a bare number, otherwise it belongs to the trigger. E.g. `@K` → trigger `start`; `@K/2` → state `2`; `@K/start` → trigger `start`; `@K/7-rank/2` → trigger `7-rank`, state `2`.

## 4. Triggers / conditions (unified)

Comma = AND. Filters:

- `<n>-rank` — player on rank *n* (**1-based, per block**; resets when leaving the block)
- `<f>-file` — player on file *f* (`a`–`h`, global)
- `start` · `win` · `lose` · `capture` · `<piece>-capture` · `check`

Example: `capture,7-rank,c-file` = a capture on **c7**.

## 5. Defaults

| Thing | Default |
| --- | --- |
| View | `2d` (top-down) |
| Advancement | stopped |
| Block state | `1` |
| Text trigger | `start` |

## 6. View (`@2d` / `@iso`)

- Actions that set the projection.
- **Animated** when changing (reuse the perspective tilt); **no-op** if already in that state.
- `@iso` does **not** start advancement — follow it with `@start`.

## 7. Advancement (`@stop` / `@start`)

- Auto-advancement starts **stopped**.
- `@stop` = pause (persistent); `@start` = resume.
- A displayed text also halts advancement while it is shown (returns to the flag's state on dismiss).

## 8. State-change effects

- **Appear** → animate in (knights-spread-like tween).
- **Disappear** → fly off like a captured piece.

## 9. Win / lose

- **Default win**: reach the top of the level — fires only if no block-scoped `@win` fired.
- **Default loss**: checkmate / screen catches up — always on.
- **Block-scoped**: `@win/<trigger>` and/or `@loss/<trigger>` before a block; **multiple allowed** (OR'd).
- `@win` / `@loss` + text → shown in the **overlay** (win/lose screen).
- `@win` / `@loss` (no condition, at the end) + text → **generic** fallback overlay text.
- `@screen/win` / `@screen/lose` → text (no bob) shown *right before* the win/loss overlay.

## 10. Actor resolution

SAN-ish → piece type:

| Actor | Piece | Actor | Piece |
| --- | --- | --- | --- |
| `K` | White king (`K`) | `k` | Black king (`k`) |
| `Q` | White queen (`Q`) | `q` | Black queen (`q`) |
| `R` | White rook (`R`) | `r` | Black rook (`r`) |
| `B` | White bishop (`B`) | `b` | Black bishop (`b`) |
| `N` | White knight (`N`) | `n` | Black knight (`n`) |
| `P` | White pawn (`P`) | `p` | Black pawn (`p`) |
| `W`/`w` | war bear (`w`) | `L`/`l` | land mine (`l`) |
| `C`/`c` | castle (`c`) | | |

Optional file letter then rank number disambiguate (`Ka`, `K2`, `Ka2`); the actor must resolve to exactly one piece. File = global column, rank = per-block row.

## 11. Parsing

A non-`@` line is a **board row** if it is 8 characters, or `/`-separated 8-character segments; otherwise it is a **dialogue line**.
