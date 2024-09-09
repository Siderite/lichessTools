(() => {
  class TranspositionBehaviorTool extends LiChessTools.Tools.ToolBase {

    preferences = [
      {
        name: 'transpositionBehavior',
        category: 'study',
        type: 'multiple',
        possibleValues: ['excludeSameLine', 'groupSameMove', 'consideredVariations'],
        defaultValue: false,
        advanced: true
      }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.transpositionBehavior': 'Behavior/definition of transpositions',
        'transpositionBehavior.excludeSameLine': 'Exclude if in the same line',
        'transpositionBehavior.consideredVariations': 'Play moves from transpositions',
        'transpositionBehavior.groupSameMove': 'Don\'t add identical next moves'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.transpositionBehavior': 'Comportament/defini\u0163ie a transpozi\u0163iilor',
        'transpositionBehavior.excludeSameLine': 'Exclude dac\u0103 \u00een aceea\u015Fi varia\u0163iune',
        'transpositionBehavior.consideredVariations': 'Joac\u0103 mut\u0103ri de la transpozi\u0163ii',
        'transpositionBehavior.groupSameMove': 'Nu ad\u0103uga mut\u0103ri identice'
      }
    }

    async start() {
      const parent = this.lichessTools;
      const value = parent.currentOptions.getValue('transpositionBehavior');
      this.logOption('Behavior of transpositions', value);
      // this just sets a global basket of parameters for use of other extensions
      parent.transpositionBehavior = {
        excludeSameLine: parent.isOptionSet(value, 'excludeSameLine'),
        consideredVariations: parent.isOptionSet(value, 'consideredVariations'),
        groupSameMove: parent.isOptionSet(value, 'groupSameMove')
      };
    }

  }
  LiChessTools.Tools.TranspositionBehavior = TranspositionBehaviorTool;
})();
