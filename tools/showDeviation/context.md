# Show Deviation Tool

## Purpose

Shows rating deviation (±rd) on player perf ratings in user comparison UI (upt__info), and optionally predicts rating change based on Glicko2 calculation if you are also logged-in.

## Functionality

- Depends on `EmitContentLoaded`.
- Advanced preference (`advanced: true`). Default disabled (`defaultValue: false`).
- **getPerfKey(ch)**: Maps icon to perf key: UltraBullet→ultraBullet, Bullet→bullet, FlameBlitz→blitz, Rabbit→rapid, Turtle→classical, PaperAirplane→correspondence, DieSix→chess960; default→null.

- **addDeviation(el)**: On contentLoaded event for each `.upt__info` element:
  - Extracts userId from user-link href `/@/userId` via regex
  - Fetches both userId and yourId (lt.getUserId()) via lt.api.user.getUsers
  - For each rating span in `upt__info__ratings>span`: if text contains digit, gets perfKey from data-icon, checks user.perfs[key] exists and not prov:
    - Removes existing deviation element, adds new `<span class="lichessTools-showDeviation"` with text "±rd" (Unicode ± character)
    - If perf.prog exists → adds 'good' or 'bad' class based on prog>0
    - If you exists and yourPerf[key] not prov → calculates predicted rating change via getGlickoOutcomes, updates title: originalTitle + " (Predicted rating change: %s)"

- **getGlickoOutcomes(player1, player2)**: Calculates Glicko2 rating changes for three results (1=win, 0.5=draw, 0=loss):
  - Uses Glicko2 constants: SCALE_FACTOR=173.7178, BASE_RATING=1500
  - Functions: g(phi) = 1/sqrt(1+3*phi²/π²), expectedScore(rating1,rd1,rating2,rd2), computeV(expectedScore,phi1,phi2), updatePlayerRating(rating,rd,expectedScore,actualScore,v), calculateGlicko2RatingChange(player1,player2,result)
  - Returns array of three rounded rating changes for player1 joined as string

## Preference

- **name**: `showDeviation`
- **category**: general
- **type**: single (on/off)
- **possibleValues**: [false, true]
- **defaultValue**: false
- **advanced**: true

## Dependencies

`EmitContentLoaded`
