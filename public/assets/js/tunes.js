$(function(){

  var albumItems = $('.music > li'),
      audioElement = $('audio'),
      expanded = true;

  $('.music-toggle').click(function(){
    albumItems.each(function(){
      if (!expanded)
        $('.tracks', this).show();
      else
        $('.tracks', this).hide();
    });
    expanded = !expanded;
  });

  // album items
  albumItems.each(function(){
    if (!expanded) $('.tracks', this).hide();
    $('h3', this).click(function(){
      $('.tracks', $(this).parent()).toggle();
    });
  });

  // track items
  $('.tracks li').each(function(){
    var anchor = $('a', this),
        button = $('button', this); //play button

    anchor.click(function(){
      var parent = $(this).parent();
      var track = {
        path: parent.attr('data-track-path'),
        artist: parent.attr('data-track-artist'),
        title: $(this).text()
      };

      var item = '<li data-track-path="' + track.path + '">';
      item += '<button name="up">up</button>';
      item += '<button name="down">down</button>';
      item += '<button name="delete">-</button> ';
      item += $(this).text() + " :: " + track.artist;
      item += '</li>';
      $('#playlist').append(item);

      var last = $('li', '#playlist');
      last = last[last.length-1];
      $('button[name="up"]', last).click(function(){
        var i, indx, li = $(this).parent(),
            items = li.parent().children();
        for(i=0; i<items.length; i++) {
          if (items[i] === li[0]) indx = i;
        }
        if (indx>0) $(items[indx-1]).before(li[0]);
      });
      $('button[name="down"]', last).click(function(){
        var i, indx, li = $(this).parent(),
            items = li.parent().children();
        for(i=0; i<items.length; i++) {
          if (items[i] === li[0]) indx = i;
        }
        if (indx<items.length-1) $(items[indx+1]).after(li[0]);
      });
      $('button[name="delete"]', last).click(function(){
        $(this).parent().remove();
      });
    });

    button.click(function(){
      var path = $(this).parent().attr('data-track-path');
      $(audioElement).attr('src', path).get(0).play();
    });
  });

  // make playlist button
  $('input[type="submit"]').click(function(e){
    var paths = [], i, items = $('li', '#playlist');
    for(i=0; i<items.length; i++) {
      paths.push($(items[i]).attr('data-track-path'));
    }
    $('input[name="playlist"]').val(paths);
  });

});
