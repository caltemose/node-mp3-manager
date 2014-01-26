var nmm = (function($) {

  var config = {}
      player = {},
      playlists = {},
      music = {};

  function init(){
    trace('{nmm}.init()');
    $.getJSON("/assets/js/_nmm.json", function(data){
      console.log("{nmm} JSON config loaded.");
      nmm.setConfig(data);
    });
  }

  function setConfig(data){
    config = data;
    trace('{nmm}.setConfig() --->');
    trace(data);
  }

  function trace(args){
    console.log(args);
  }

  return {
    init: init,
    setConfig: setConfig
  }

})(jQuery);
