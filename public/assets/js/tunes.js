$(function(){

  // track items
  $('.playlist-tracks li').each(function(){
    var button = $('button', this);
    button.click(function(){
      $(this).parent().toggleClass('listed');
      $('#playlist').append(getTrackItem($(this).parent().attr('data-track-path')));
    });
  });

  // make playlist button
  $('input[type="submit"]').click(function(e){
    var paths = [];
    $('.listed').each(function(){
      paths.push($(this).attr('data-track-path'));
    });
    $('input[name="playlist"]').val(paths);
  });

  function getTrackItem(path){
    return '<li>' + path + '</li>';
  }

});
