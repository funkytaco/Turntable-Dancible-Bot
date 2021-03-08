var imDjing = false;
var getDownAfterSong = false;

export function code() {
  bot.on('roomChanged', function (data) {
    bot.speak('Auto DJ module loaded.');
      // Get the DJ count upon entering the room
      var djcount = data.room.metadata.djcount;
      // If DJ count less than or equal to 1, get on decks
      if (djcount <= 1) {
        bot.addDj();
      }
      bot.speak('DJ Count:', djcount);
  
    });
    
    bot.on('newsong', function (data) {
      // Check if bot is the new DJ when new song begins
      var djid = data.room.metadata.current_song.djid;
      if (djid == settings.USERID) {
        imDjing = true;
      }
    });
    
    bot.on('endsong', function (data) {
      // Update 'imDjing' when Bot's song ends
      var djid = data.room.metadata.current_song.djid;
      if (djid == settings.USERID) {
        imDjing = false;
      }
    
      // If triggered to get down during Bot's song, step down now
      if (getDownAfterSong) {
        bot.remDj();
        getDownAfterSong = false;
      }
    });
    
    bot.on('add_dj', function (data) {
      // Check the DJ count when a new DJ steps up
      bot.roomInfo(false, function (data) {
        var djcount = data.room.metadata.djcount;
        // If there's enough DJ's now, bot steps down.	
        if (djcount >= 3) {
          // If bot's song is currently playing, let's have the bot step down when it ends
          if (imDjing) {
            getDownAfterSong = true;
          } else {
            bot.remDj();
          }
        }
      });
    });
    
    bot.on('rem_dj', function (data) {
      // Checks DJ count when a DJ steps down
      bot.roomInfo(false, function (data) {
        var djcount = data.room.metadata.djcount;
        // If there aren't enough DJ's, bot steps up
        if (djcount <= 1) {
          bot.addDj();
        }
      });
    });
  
}

