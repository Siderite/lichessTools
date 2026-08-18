# CevalDecimals Tool

## Purpose

Shows more decimal places (2 decimals instead of default) in computer evaluation displays: the main eval pearl, PV box evaluations, and static analysis move evaluations.

## How It Works

### Eval Rendering

`renderEval(cp, mate)` → if mate: "#mate"; if cp: "+/-" + (cp/100 clamped to [-99,99]) with 2 decimal places.

### Main Eval Display

MutationObserver on `div.ceval pearl` and `div.ceval.enabled ~ div.pv_box .pv`:
- Replaces eval text in pearl button with rendered value
- Also replaces strong element text in each PV box entry for matching UCI moves

### Static Analysis Move Evaluations

When showStaticAnalysis setting enabled:
- Traverses tree from root, for each node with eval/ceval (depth >= 16):
  - Creates `<eval class="lichessTools-cevalDecimals">` element in move DOM
  - Replaces text with rendered evaluation value
  - Removes duplicate eval elements if more than one exists

### Settings Wrap

Wraps `analysis.settings.set`:
- After call when setting is 'showStaticAnalysis': removes old eval elements, shows decimals for main and moves

## Dependencies

- EmitRedraw

## Preferences

- `cevalDecimals` — single type (false/true), default false, advanced/true, category: analysis2

## Key Methods

- `renderEval(cp, mate)` → renders evaluation text with 2 decimals
- `showDecimalsDirect()` → updates main eval and PV box displays
- `showDecimalsMovesDirect()` → traverses tree for static analysis move evaluations
- `setupObserver()` → sets up MutationObserver on analyse tools area
