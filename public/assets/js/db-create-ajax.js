$(function(){
  var resultsContainer = $('#results'), resultsList, infoContainer = $('#info'), 
      paths, currentPath=0, tracks = [],
      getNextTrack;

  getNextTrack = function() {
    if (currentPath < paths.length) {
      //load next
      $.getJSON('/api/tracks/?id=' + encodeURIComponent(paths[currentPath]), function(data){
        tracks.push(data);
        resultsList.append('<li>' + data.title + ' :: ' + data.album + ' :: ' + data.path + '</li>');
        currentPath++;
        infoContainer.text(currentPath + '/' + paths.length);
        getNextTrack();
      });
    } else {
      //done
      resultsList.append('<li>Done!</li>');
      //process and clean track data ->
      var music = [], track, album, i, j,
          allow = [
                    'album', 'artist', 'title', 'track', 'path', 'genre', 'date'
                  ];
      for(i in tracks) {
        track = tracks[i];
        //loop through remaining properties
        for(j in track) {
          if (typeof track[j]==="string") {
            //delete unwanted properties
            if ($.inArray(j, allow) < 0) {
              //console.log('deleting: ' + j + ' from track: ' + track.title);
              delete track[j];
            } else {
              //delete properties containing only spaces
              if (track[j].match(/^\s+$/i))
                track[j] = '';
              //@TODO remove forward slashes...?
            }
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
      $.ajax({
        type: "POST",
        url: '/api/save-db',
        data: {"music":music},
        dataType: 'json',
        success: function(data) {
          resultsList.append('<li>Database written to: ' + data.filepath);
        }
      });
    }
  }

  $.getJSON('/api/paths', function(data){
    paths = data;
    resultsContainer.html('<h2>Results:</h2><ul><li>Path data loaded</li></ul>');
    resultsList = $('ul', resultsContainer);
    getNextTrack();
  });

});