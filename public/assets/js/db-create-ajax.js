$(function(){
  var resultsContainer = $('#results'), resultsList, 
      paths, currentPath=0, tracks = [],
      getNextTrack;

  getNextTrack = function() {
    if (currentPath < paths.length-1) {
      //load next
      $.getJSON('/api/tracks/?id=' + encodeURIComponent(paths[currentPath]), function(data){
        tracks.push(data);
        resultsList.append('<li>' + data.title + ' :: ' + data.album + '</li>');
        currentPath++;
        getNextTrack();
      });
    } else {
      //done
      resultsList.append('<li>Done!</li>');
      //process and clean track data ->
      var music = [], track, album, i, j;
      for(i in tracks) {
        track = tracks[i];
        //delete comment property
        if (track.comment) delete track.comment;
        //loop through all properties
        for(j in track) {
          if (typeof track[j]==="string") {
            //delete properties containing only spaces
            if (track[j].match(/^\s+$/i))
              delete track[j];
            //@TODO remove forward slashes...
          }
        }
        if (album && track.album === album.album) {
          //same album
          album.tracks.push(track);
        } else {
          //new album
          album = {};
          album.album = track.album;
          album.artist = track.artist;
          album.genre = track.genre;
          album.date = track.date;
          //@TODO strip file name (included in above TODO)
          album.path = track.path;
          album.tracks = [];
          album.tracks.push(track);
          music.push(album);
        }
      }
      $.post('/api/save-db', {"music":music}, function(data){
        //console.log(data);
        resultsList.append('<li>Database written to: ' + data.filepath);
      });
    }
  }

  $.getJSON('/api/paths', function(data){
    paths = data;
    resultsContainer.html('<h1>Results:</h1><ul><li>Path data loaded</li></ul>');
    resultsList = $('ul', resultsContainer);
    getNextTrack();
  });

});