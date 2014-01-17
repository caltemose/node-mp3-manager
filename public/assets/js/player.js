var player = {};
player.audioElement = $('audio');
player.processJSON = function(data) {
  console.log('player.processJSON()');
  console.log(data);
  player.music = data;
  player.currentAlbum = 0;
  player.currentTrack = 0;
  player.play();
}
player.play = function() {
  console.log('player.play()');
  var track = player.music[player.currentAlbum].tracks[player.currentTrack];
  console.log('  track: ' + track.path);
  player.audioElement.attr('src', track.path).get(0).play();
  player.audioElement.bind('ended', player.playEnded);
}
player.playEnded = function() {
  console.log('player.playEnded()');
  player.playNext();
}
player.playNext = function() {
  console.log('player.playNext()');
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

$(function(){
  $.getJSON('/api/albums', player.processJSON);
});