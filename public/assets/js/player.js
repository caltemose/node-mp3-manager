var player = {
  audioElement: $('audio'),

  processJSON: function(data) {
    console.log('player.processJSON()');
    console.log(data);
    player.music = data;
    player.currentAlbum = 0;
    player.currentTrack = 0;

    var playlist = player.audioElement.attr('data-playlist');
    if (playlist) {
      //load playlist
      $.get(playlist, function(data) {
        console.log(data);
      });
    } else
      player.play();
  },

  play: function() {
    console.log('player.play()');
    var track, path;
    if (player.playlist) {
      path = player.playlist[player.currentTrack];
      console.log('playlist path: ' + path);
    } else {
      track = player.music[player.currentAlbum].tracks[player.currentTrack];
      path = track.path;
    }
    player.audioElement.attr('src', path).get(0).play();
    player.audioElement.bind('ended', player.playEnded);
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