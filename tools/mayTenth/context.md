# MayTenth Tool (LiChess Tools Day)

## Purpose

A celebratory tool that adds a special visual marker on May 10th (the "LiChess Tools day"). It adds a class to `<body>` and changes the title attribute of the lichess site title link.

## Preference

- **name**: `mayTenth`
- **category**: `general`
- **type**: `single` with three values: `'mayTenth'`, `'never'`, `'always'`
- **defaultValue**: `'mayTenth'` (only on May 10th)
- **offValue**: `'never'`
- **advanced**: true

## Values Meaning

| Value | Behavior |
|-------|----------|
| `mayTenth` | Only activates when the current date is May 10 (`-05-10` in ISO string) |
| `never` | Never activates (off state) |
| `always` | Always activates regardless of date |

## Behavior

When activated (date is May 10 OR preference set to `always`):
1. Adds class `lichessTools-mayTenth` to `<body>`
2. Sets the `title` attribute on site title links (`a.site-title` and `#topnav section a:has(span.home)`) to the translated "Happy LiChess Tools day!" message

When deactivated (date not May 10 AND preference is `never`): removes class and clears title attribute.

## Internationalization

- **en-US**: "Happy LiChess Tools day!"
- **ro-RO**: "La mulți ani, LiChess Tools!"