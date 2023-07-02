(()=>{
  class FriendsRefreshTool extends LiChessTools.Tools.ToolBase {

    friendsInterval=0;
    friendsFrequency=5000;
    async start() {
      const parent=this.lichessTools;
      const value=(
           parent.currentOptions.getValue('friendsPlaying')
        || ['true','open','menu'].includes(parent.currentOptions.getValue('openFriends'))
        || (parent.currentOptions.getValue('liveFriendsPage') && parent.isFriendsPage())
      );
      this.logOption('Friend list refresh', value?this.friendsFrequency+'ms':'No');
      const lichess=parent.lichess;
      if (!lichess) return;
      const setInterval=parent.global.setInterval;
      const clearInterval=parent.global.clearInterval;
      const $=parent.$;
      clearInterval(this.friendsInterval);
      this.friendsInterval=0;
      if (value) {
        this.friendsInterval = setInterval(() => {
          if (!$('#friend_box .content_wrap').is('.none')) {
            lichess.pubsub.emit("socket.send", "following_onlines");
          }
        }, this.friendsFrequency);
      }
    }

  }
  LiChessTools.Tools.FriendsRefresh=FriendsRefreshTool;
})();
