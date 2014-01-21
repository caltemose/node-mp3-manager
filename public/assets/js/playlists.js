$(function(){
  $.getJSON('/api/playlists', function(data) {
    var i, html;
    html = "<ul>";
    for(i in data) {
      html += "<li>";
      html += '<a href="/player/?id=' + encodeURIComponent(data[i]) + '">';
      html += data[i] + "</a>";
      html += "</li>";
    }
    html += "</ul>";
    $('section.playlists').html(html);
  });
});