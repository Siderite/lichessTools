# Chess Pursuit 🏰 — Make Your Own Game

**You are the Black King (k).** You run up the board while the **White pieces** (uppercase letters) chase you. Reach the top — or a castle — to win!

The whole game lives in **one file**: `ChessPursuit.dat`. Change the file, change the game.

There are only **three kinds of lines**:

| Line | What it is |
| --- | --- |
| `@something` | a **command** or **speech** |
| 8 letters | a **row of the board** |
| `// ...` | a **note** for you (the game skips it) |
| *(empty)* | a gap between blocks |

---

## 1. The board

Every board row is exactly **8 letters**. Each letter is one square.

- `.` = empty (a space works too)
- one of the piece letters below = a piece (nothing else is allowed on the board)

### The pieces

**UPPERCASE = the White army (your enemies).** They attack squares. Step on an attacked square and you get captured.

**lowercase = the Black army (your friends).** They block you like walls.

| Letter | Piece |
| --- | --- |
| `K` | White King (the boss) |
| `Q` | White Queen |
| `R` | White Rook |
| `B` | White Bishop |
| `N` | White Knight |
| `P` | White Pawn |
| `k` | Black King — **that's YOU** |
| `q` `r` `b` `n` `p` | Black Queen, Rook, Bishop, Knight, Pawn |

**Special pieces:**

| Letter | Piece |
| --- | --- |
| `L` / `l` | 💣 Land mine — white `L` is deadly, black `l` just blocks |
| `W` / `w` | 🐻 War bear — white `W` is deadly (like a mine), black `w` just blocks |
| `C` / `c` | 🏰 Castle — your goal |

### A board example

```
........
..P.....
...R....
........
```

- 1st line = the **top** (far away)
- 2nd line = a White Pawn in column 3
- 3rd line = a White Rook in column 4
- last line = the **bottom** (right next to you)

> **Which way is up?** You walk from the **bottom** (last line) to the **top** (first line).

---

## 2. Speech — the `@` lines

### Someone talks

Write the piece's letter after `@`, then what they say on the next lines:

```
@K
I am the White King!
You cannot escape!
```

The White King says this. The player clicks (or presses SPACE) for each line.

Make several pieces talk at once with commas:

```
@K,k
We meet again!
```

Both the White King and you bounce while talking.

Pick ONE specific piece by adding its column letter and/or row number:

```
@Ra2
I am the rook on a2.
```

### The title screen

```
@title
CHESS PURSUIT
```

Shows a big title at the start. Click to dismiss.

### Text with nobody talking

```
@screen
Deep inside the castle...
```

Shows a text box with no piece bouncing. Great for storytelling.

---

## 3. When things happen — triggers

Speech normally plays when the player **enters the block**. To play it only when something special happens, add a **trigger** after a `/`:

```
@K/4-rank
You reached row 4!
```

This plays only when the player steps onto **row 4** of this block.

### The triggers

| Trigger | Fires when... |
| --- | --- |
| `start` | the player enters the block (default) |
| `<n>-rank` | the player is on row *n* of this block |
| `<f>-file` | the player is on column *f* (`a`–`h`) |
| `capture` | the player captures any piece |
| `<piece>-capture` | the player captures that piece — e.g. `p-capture` |
| `win` | the block is won |
| `lose` | the player loses |

> **Tip — gating a conversation:** if the *first* text in a block has a trigger, nothing plays when you enter — the block waits. When the trigger finally happens, that text shows, and only *after* you dismiss it do the triggerless texts that follow play in order.

A comma (`,`) means **AND** — all parts must be true:

```
@K/capture,4-rank
A capture on row 4?!
```

Fires when the player captures a piece **while on row 4**.

### Rows and columns

- **rank** = the row number, counted from the **bottom**. The bottom (last line) is **rank 1**.
- **file** = the column letter, `a` to `h`, from the **left**.

```
........   ← rank 5 (top)
........   ← rank 4
........   ← rank 3
........   ← rank 2
........   ← rank 1 (bottom)
```

---

## 4. Changing the board — states

Pieces can appear or disappear while you play. That's a **state**.

A row can hold more than one board, separated by `/`:

```
......../........
......../PPPPPPPP
```

- part 1 (before `/`) = **state 1** — what you see first
- part 2 (after `/`) = **state 2** — shown after a speech with `/2`

Every block has its **own** state and always starts at **state 1**.

### Example — pieces appear, then vanish

```
@screen/2
Look! The pawns appear!

@k/2-rank/1
And now they vanish!

......../........
......../........
PPPPPPPP/........
```

1. Player enters the block → the block switches to **state 2** (pawns appear) and "Look! The pawns appear!" shows.
2. Player steps on rank 2 → the block switches back to **state 1** (pawns vanish) and "And now they vanish!" shows.

How to read `@k/2-rank/1`:

| Part | Meaning |
| --- | --- |
| `k` | you talk |
| `2-rank` | only when on rank 2 |
| `1` | change the block's state to 1 |

> **The number at the very end is always the state.** Everything before it is the trigger.

---

## 5. Block commands

Some `@` lines are not speech — they are **commands**. They run when the player enters the block:

| Command | What it does |
| --- | --- |
| `@2d` | look at the board from above (flat) |
| `@iso` | look at the board in 3D (tilted) |
| `@stop` | stop the screen from scrolling up |
| `@start` | start the screen scrolling up again |
| `@block` | hold the king and the story until the block scrolls fully into view |
| `@hide` | make the king invisible (he's still there) |
| `@show` | make the king visible again |
| `@checkpoint` | a save point — die, and you restart here |
| `@showThreat P` | highlight every square that piece attacks (here: all pawns) |

Example:

```
@iso
@start
@showThreat R

........
...R....
........
```

The view tilts to 3D, the screen starts moving, and the Rook's attack squares light up so the player sees where NOT to step.

> The screen starts **stopped**. Use `@start` to make it chase the player.

---

## 6. Checkpoints

A checkpoint is a save point. If the player dies, they restart at the last checkpoint.

```
@checkpoint

```

Just put `@checkpoint` on its own line, with empty lines around it.

---

## 7. Winning and losing

### Default rules

- **Win** — reach the very top of the board.
- **Lose** — get captured (checkmate), or the screen catches up.

### Win in a special way

Put `@win/<trigger>` before a block:

```
@win/8-rank

c.......
........
........
........
........
........
........
........
```

Reach rank 8 (the top row) and you win — there's the castle!

### Lose in a special way

```
@loss/1-rank

........
....P...
........
```

Step onto rank 1 and you lose — it's a trap!

### End-of-game text

At the very end of the file:

```
@win
You escaped!

@loss
You were captured. Try again!
```

This text shows on the win/lose screen. You can also use `@screen/win` or `@screen/lose` for one last line of speech right before that screen.

---

## 8. A complete mini-game

Let's build a tiny game:

```
@title
Run, Little King!

@K
Reach the castle at the top!

@iso
@start
@win/8-rank

c.......
....P...
........
........
........
........
........
........
```

What happens:

1. The title shows: "Run, Little King!"
2. The White King says: "Reach the castle at the top!"
3. The view tilts to 3D and the screen starts scrolling.
4. The player climbs past the pawn to the castle.
5. Reaching the castle (rank 8) wins the game.

---

## 9. Cheat sheet

| You write | It means |
| --- | --- |
| `@K` | the White King speaks |
| `@screen` | text with no speaker |
| `@title` | title screen |
| `@K/3-rank` | speaks only on rank 3 |
| `@K/2` | speaks and changes state to 2 |
| `@K/3-rank/2` | on rank 3, speaks, then state 2 |
| `@iso` / `@2d` | 3D / flat view |
| `@stop` / `@start` | stop / start scrolling |
| `@checkpoint` | save point |
| `@showThreat R` | highlight rook threats |
| `@win/8-rank` | win when reaching rank 8 |
| `@loss/1-rank` | lose on rank 1 |
| `// note` | a comment |
| `........` | an empty board row |

That's it — now go build your own game! 🎉
