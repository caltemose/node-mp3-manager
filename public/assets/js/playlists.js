$(function(){
  nmm.init();
  $.getJSON('/api/playlists', function(data) {
    $('section.playlists').html(
      Templates.playlistsUl({playlists: data})
    );
  });
});