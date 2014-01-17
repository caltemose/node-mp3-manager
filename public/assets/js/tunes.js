$(function(){

  // track items
  $('.playlist-tracks li').each(function(){
    var button = $('button', this);
    button.click(function(){
      $(this).parent().toggleClass('listed');
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

});
