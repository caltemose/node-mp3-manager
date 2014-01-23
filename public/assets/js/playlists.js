$(function(){
  $.getJSON('/api/playlists', function(data) {
    var i, html;
    html = '<ul class="list-group">';
    for(i in data) {
      html += '<li class="list-group-item">';
      html += '<a href="/player/?id=' + encodeURIComponent(data[i]);
      html += '" class="btn btn-primary btn-sm btn-success" role="button">';
      html += "PLAY</a> ";
      html += '<a href="/playlists/?id=' + encodeURIComponent(data[i]);
      html += '" class="btn btn-primary btn-sm" role="button">';
      html += "EDIT</a> &nbsp; ";
      html += data[i] + ' ';
      html += "</li>";
    }
    html += "</ul>";
    $('section.playlists').html(html);
  });
});