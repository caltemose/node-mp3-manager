var player = {
  audioElement: $('audio'),

  processJSON: function(data) {
    console.log('player.processJSON()');
    //console.log(data);
    player.music = data;
    player.currentAlbum = 0;
    player.currentTrack = 0;

    var playlist = player.audioElement.attr('data-playlist');
    //console.log(playlist);
    if (playlist && playlist != "undefined") {
      //load playlist
      $.get(playlist, function(data) {
        //console.log('playlist retrieved');
        //console.log(data);
        player.playlist = data.split("\n");
        player.play();
      });
    } else
      player.play();
  },

  play: function() {
    console.log('player.play()');
    var track, path, info;

    if (player.playlist) {
      path = player.playlist[player.currentTrack];
      var i, j, tune;
      for(i in player.music) {
        for(j in player.music[i].tracks) {
          tune = player.music[i].tracks[j].path;
          tune = tune.replace("../", '').replace("./", '');
          if (path.indexOf(tune) > -1) {
            track = player.music[i].tracks[j];
            break;
          }
        }
        if (track) break;
      }
    } else
      track = player.music[player.currentAlbum].tracks[player.currentTrack];
    
    player.audioElement.attr('src', track.path).get(0).play();
    player.audioElement.bind('ended', player.playEnded);

    info = "<h3>Track Info:</h3>";
    info += "<ul><li>Track: " + track.title + "</li>";
    info += "<li>Album: " + track.album + "</li>";
    info += "<li>Artist: " + track.artist + "</li>";
    info += "<li>Path: " + track.path + "</li>";
    info += "</ul>";
    $('#player-info').html(info);

  },

  playEnded: function() {
    console.log('player.playEnded()');
    player.playNext();
  },

  playNext: function() {
    console.log('player.playNext()');
    if (player.playlist) {
      if (player.currentTrack < player.playlist.length-1) {
        player.currentTrack++;
        player.play();
      } else {
        console.log("Done playing playlist.");
      }
    } else {
      var album = player.music[player.currentAlbum];
      if (player.currentTrack < album.tracks.length -1) 
        player.currentTrack++;  
      else {
        player.currentTrack = 0;
        //comment out to loop an album
        if (player.currentAlbum < player.music.length-1) 
          player.currentAlbum++;
        else player.currentAlbum = 0;
      }
      player.play();
    }
    
  }
};

$(function(){
  $.getJSON('/api/albums', player.processJSON);
});