History of features added to LiChess Tools in time (reversed order)

11 Nov
  - Streamer TV tab in Current Games

10 Nov
  - Escape blurs the Analysis board PGN and FEN inputs as part of Enhanced import

07 Nov
  - added move list in new window functionality for studies

06 Nov
  - changed Shift-Split study chapter at bookmark to delete following moves (default leaves them there)

05 Nov
  - added Shift-Split study chapter at bookmark to not delete following moves
  - fixed major bookmark and export PGN glyphs bugs

04 Nov
  - added Split study chapter at bookmark functionality

03 Nov
  - added the move colorize theme

02 Nov
  - added board command to show/hide the board on demand
  - added 'trap value' command to calculate the trap value of a position (see https://medium.com/applied-data-science/how-to-calculate-the-trappiest-openings-in-chess-2bc24a6345f7)

31 Oct
  - Expanded move list and Hide left side Analysis options

29 Oct
  - Bookmark collapse/expand all

26 Oct
  - Added the mobile theme

23 Oct
  - Added the performance theme, removed the demo theme

22 Oct
  - Context menu on bookmarked positions to get the URL of the position

16 Oct
  - Option to not see cloud values in computer evaluation

09 Oct
  - Option to change add bookmarks to the move list, allowing for collapse/expand and linking

07 Oct
  - Option and toggle in Analysis Menu to change the move list functionality (only option so far: Indented Variations, showing even inlined variations as tree branches)

04 Oct
  - removed Explorer Players removal feature, as it has been implemented natively in Lichess

02 Oct
  - Button to create study chapter after the selected one
  - Textarea showing the current study chapter PGN, similar to Analysis, but without the import functionality

01 Oct
  - Option to persist settings used on study create/edit for new studies

23 Sep
  - Added preferences buttons on Explorer settings form

19 Sep
  - Show the number of gambits that can be achieved from current position on Explorer moves

17 Sep
  - Playing a game on any browser tab will silence notifications and sound alerts on all of the others (quiet mode)
  - Button to manually set/unset quiet mode

15 Sep
  - Option to remove superfluos context menu entries in analysis (comment and annotation, which have buttons for them under the board)

13 Sep
  - Warning sign on Explorer moves that have a large discrepancy between win statistics and computer eval (indicating traps or gambits)

10 Sep
  - Automatic detection of interesting moves in the Server Computer eval
  - g and alt-g for cycling between your or your opponent's good/brilliant/interesting moves

01 Sep
  - Preference to select which types of Timeline entries to notify when missed
  - Option to lock scroll and zoom when playing games on mobile

29 Aug
  - Feedback box added to LiChess Tools preferences

17 Aug
  - Explorer Eval feature now shows computer evaluation next to Explorer moves

12 Aug
  - Notification for missed Timeline entries (resets when opening Timeline)

06 Aug
  - Shape drawing for mobile while watching/playing games
  - Option to show the standard LiChess buttons during play or TV watching on mobile

02 Aug
  - Page for games played by friends in the Current Games section
  - Menu item for the last opened Study

31 Jul
  - Show LiChess Tools key shortcuts in the key shortcut help modal (shown when pressing ?)
  - Show smiley annotations in Explorer Practice depending on the computer eval at the end of a run

29 Jul
  - Advanced preferences toggle: most trivial feature flags have been hidden until toggling Advanced Preferences

24 Jul
  - Extra charting: plotting more lines on the Server Computer evaluation chart

23 Jul
  - Optimizing the Show Opening feature with an embedded list of openings and showing the openings in more places (like Analysis)

20 Jul
  - Reusing the new LiChess icon that lets the user know they have to enable Sound or make a user gesture

18 Jul
  - Collapsible LiChess Tools Preferences sections
  - Setting for how many colors to use for mobile shape drawing

17 Jul
  - Button to draw shapes (arrows and circles) on mobile in Analysis
  - Button to make a random move from available variations (since Ctrl-Right is not available)

15 Jul
  - Ctrl-Left tries to go to the position where you came from (in case you jumped from another line via transposition variations)
  - Interactive Lesson context menu for moves to specify what message to appear if not playing them
  - Tool to show all glyphs on the board, not just the standard ones, as well as a # glyph when the move is a mate

13 Jul
  - Ctrl-L key shortcut for Explorer Practice 

11 Jul
  - Explorer Practice feature lets you play against the moves available in Explorer (with the probability with which they are shown in the list)

10 Jul
  - Extended Interactive Options are also available in the Study hamburger menu for Interactive Lesson chapters

09 Jul
  - Show eval bar on mobile
  - Themes feature: configurable user supplied CSS themes support
  - Option to only sound friend alerts when playing Standard chess variant
  - Option to clear all PGN tags from a Study chapter
  - Option to easily delete a PGN tag from a Study chapter
  - Option to turn the Friends box into a top button (and it automatically does so for mobile if feature set to menu)
  - Preference for how many moves to look in advance to calculate the probability of a random move (for Ctrl-Right or Interactive Lessons)
  - Option to hide the mascot in Interactive Lessons
  - Friend playing sound alerts do not sound when playing games

07 Jul
  - Documentation link icons to Preferences

06 Jul
  - Option to filter friends in Friends list by online, playing or muted status

05 Jul
  - Customizable chat buttons when playing

04 Jul
  - Option to selectively remove either all glyphs, all comments or all shapes (arrows and circles)

01 Jul
  - Keyboard shortcuts to select variations, computer lines and Explorer lines in Analysis using ., Ctrl-. and Shift-., then a digit
  - Hiding chat members flags as too distracting
  - Showing icon when friend playing alerts cannot be played because of Chrome waiting for a user action first
  - Context menu for showing all transpositions in a PGN in Analysis
  - Global switch to turn on/off LiChess Tools

30 Jun 
  - optimizing country flags
  - configurable behavior of transpositions: exclude if from same line, play moves from transposition, don't show identical moves as variations when coming from diferent transpositions
  - Ctrl-Right and Interactive Lessons can play moves from transpositions, too
  - Added friends page options: live refresh, mute/unmute playing sound alerts per friend
  - Option to hide player tally (history of wins/losses with current opponent) when watching/playing games

28 Jun - Version 2 upload
  - move list context menu options:
    - copy PGN
    - evaluate final moves
  - analysis key shortcuts: i,m,b,alt-i,alt-m,alt-b
  - study chapter name change from PGN tags options
  - study chapter navigation buttons: first, previous, random, next, last
  - colors for PGN comments
  - Ctrl-Right for random variation
  - Ctrl-Space replacement for Space for best computer move
  - Minimum computer eval depth
  - Enhanced PGN import: merge multiple PGNs into one in Analysis
  - Extended Interactive Lessons: play all lines in a PGN, not just the main line
  - Friend box option: open by default, transformed into a menu, hidden
  - Friend playing sound alerts: type of game configurable (ultrabullet, bullet, blitz, rapid, classical)
  - Highlighting of moves in analysis list: final moves, not commented moves, transpositions to current position
  - Moves from transpositions: available as variations from all positions that transpose to the same position
  - Explorer player options: delete users from cached list, Me button to toggle you or the previously configured player
  - Preferences page for LiChess Tools in the main Lichess Preferences
  - Menu item for the previous game watched
  - Save options even when playing in incognito mode (assuming you are logged in into Lichess)
  - Show order of arrows and circles in Analysis
  - Show country flags for players
  - Show opening for games watched
  - Automatically saving Analysis moves for reload
  - Keeping Study Interactive Lessons Preview mode on while navigating from chapter to chapter
  - Game link and option to bookmark currently runnign games that you are watching
  - Show the previous two TV games of a player when watching them play, just like for general categories like blitz or classical
