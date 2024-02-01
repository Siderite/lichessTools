(()=>{
  class ProfileSliderTextTool extends LiChessTools.Tools.ToolBase {

    preferences=[
      {
        name:'profileSliderText',
        category: 'general',
        type:'single',
        possibleValues: [false,true],
        defaultValue: true,
        advanced: true
      }
    ];

    intl={
      'en-US':{
        'options.general': 'General',
        'options.profileSliderText': 'Show dates for Profile slider',
        'sliderLabelTitle': 'LiChess Tools - show dates for Profile slider'
      },
      'ro-RO':{
        'options.general': 'General',
        'options.profileSliderText': 'Arat\u0103 data pentru slider-ul din Profil',
        'sliderLabelTitle': 'LiChess Tools - arat\u0103 data pentru slider-ul din Profil'
      }
    }

    updateText=(ev)=>{
      const start=new Date(+ev[0]).toDateString().substr(4);
      const end=new Date(+ev[1]).toDateString().substr(4);
      const text=start+' - '+end;
      $('.time-selector-buttons label.lichessTools-profileSliderText').text(text);
    };

    async start() {
      const parent=this.lichessTools;
      const $=parent.$;
      const trans=parent.translator;
      const value=+(parent.currentOptions.getValue('profileSliderText'));
      this.logOption('Slider dates', value);
      const slider=$('#time-range-slider');
      const uiSlider=$('#time-range-slider')[0]?.noUiSlider;
      if (!uiSlider) return;
      uiSlider.off('update',this.updateText);
      $('.time-selector-buttons label.lichessTools-profileSliderText').remove();
      if (!value) return;
      $('<label class="lichessTools-profileSliderText">')
        .attr('title',trans.noarg('sliderLabelTitle'))
        .appendTo('.time-selector-buttons');
      uiSlider.on('update',this.updateText);
    }

  }
  LiChessTools.Tools.ProfileSliderText=ProfileSliderTextTool;
})();
