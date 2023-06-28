(()=>{
  class FriendsRefreshTool extends LiChessTools.Tools.ToolBase {

    friendsInterval=0;
    async start() {
      const parent=this.lichessTools;
      const value=(parent.currentOptions.friendsPlaying||['true','open','menu'].includes(parent.currentOptions.openFriends));
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
        }, 5000);
      }
    }

  }
  LiChessTools.Tools.FriendsRefresh=FriendsRefreshTool;
})();
