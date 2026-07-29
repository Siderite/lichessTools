# ExtraPieceSets Tool — Context Summary

## Purpose

The **ExtraPieceSetsTool** adds custom chess piece visual sets (PNG/SVG images) to lichess's piece selector UI. It injects buttons for various community-contributed piece designs into the `#dasher_app .sub.piece.d2 .list` element, allowing users to switch between different piece aesthetics.

## Dependencies

- **D3** — used for building visual representations (tree/grid) of piece sets in a dialog modal

## Preferences

- **name**: `extraPieceSets`
- **category**: `appearance`
- **type**: multiple (checkboxes)
- **possibleValues**: 23 named categories: `siderite`, `chesscom`, `hollowleaf`, `fordCrownVictoria`, `bend-n`, `comfysage`, `tage64`, `OwOHamper`, `DragurKnight`, `LichessHelper`, `basedpolymer`, `FelixKling`, `Moldenke1`, `sharechess`, `NayukiMafuyu`, `tsoj`, `davidssmith`, `Djapec`, `olliecampbell`, `mowi12`, `swapnilvasave24-web`, `withmy27`, `BrayanGuti`, `code-and-chill`, `mannubhai1`, `lukasmonk`
- **defaultValue**: `siderite,chesscom,hollowleaf`
- **advanced**: true

Each checkbox enables a category of piece sets. When enabled, buttons for that category's pieces are added to the piece selector list.

## How It Works

### Piece Set Data Loading
The tool fetches `pieceSets.json` from service worker via `lt.comm.getData`. Each piece set object has: `name`, `category`, `url`, `type`, `cap` (URL pattern code), `hashes` (base64 hashes for distance calculation), and optionally `coordinates` (for grid layout). Names are appended with `_+category` suffix.

### URL Pattern Construction (`getUrl`)
Determines the file URL for a specific piece/color based on `pieceSet.cap` or `pieceSet.category`:
- **wN**: `url + color[0] + pieceLetter(N for knight, first char uppercase) + type`
- **wn**: `url + color[0] + pieceLetter(n for knight, first char lowercase) + type`
- **nw**: `url + pieceLetter + color[0] + type`
- **WN**: `url + color[0].toUpperCase() + pieceLetter + type`
- **basedpolymer**: uses a special ring mapping table (bp→j2WrNG, br→fzAmF1, etc.) for each piece/color combination
- **comfysage**: `url + color[0]/ + color[0]+pieceLetter + type`
- **DragurKnight**: `url + color[0]_ + piece name + type`

### CSS Style Injection
Creates a `<style id="lichessTools-extraPieceSets">` in `<head>` with CSS custom properties: `---white-pawn`, `---black-pawn`, etc. for each piece/color, set to the URL of the corresponding image. This overrides lichess's default piece styling via `:root body.lichessTools`.

### Style Mutation Observer
Two HTML observers:
1. **style observer**: detects when lichess style containing `---white-king` is added or when lt's own style is removed — restores lt's stored style from `lt.storage.get('extraPieceSets-lastStyle')`
2. **body style observer**: removes lt's CSS attributes when body style changes

### UI Addition (`addPieces`)
Adds buttons to the piece selector list:
- Creates a search container with text input (filter by name), grid button (shows grid visual), tree button (shows tree visual)
- Each enabled category's piece sets get cloned buttons with `title`, `data-setName`, class tags, knight-white image preview
- Click on button → `setPieceSet(name)` → switches to that piece set via storage + CSS update
- Handles collapsed state: only shows current selected piece set when collapsed
- Adds infoIcon link to user manual blog page

### Piece Set Visuals (`buildPieceSetVisual`)
Opens a dialog modal with header "Piece sets". Renders either **grid** or **tree** mode using D3:

#### PieceSetTree (D3 tree visualization)
- Builds distance matrix between piece sets using **hamming distance** on base64 hashes (convert base64→bytes, XOR each byte, popcount bits)
- Builds Minimum Spanning Tree via Prim's algorithm with slight vertex bias (`v * 1e-9`)
- Builds hierarchy from MST parent array
- Renders D3 tree layout (size [4000,4000]) with vertical links, circles + images per node, zoom behavior
- Force simulation tick(60) for collision avoidance (radius+padding=36)
- Click on image → selects that piece set

#### PieceSetGrid (D3 grid visualization)
- Uses `ps.coordinates` (x,y) to determine grid dimensions Nx/Ny
- Cell size = 90px. Each piece set placed at `floor(x)*cellSize, floor(y)*cellSize`
- SVG with viewBox matching total dimensions
- Circle background + image per cell, zoom extent [0.1,8]
- Click on image → selects that piece set

### Selection Management (`setPieceSet`)
Sets/removes `lt.storage.get('extraPieceSets-set')` storage key. Triggers `updatePieceSet(true)` to rebuild CSS style.

### Initialization (`init()`)
HTML observers for style/body mutations, checks enableLichessTools and preference value.

### Start (`start()`)
Reads preference value via `lt.isOptionSet`. Removes existing lt elements. If no pieceSets loaded: fetches from comm then updates. Otherwise: updates immediately. Binds dasher_app observer + adds pieces.