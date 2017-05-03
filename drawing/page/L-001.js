var mk_page = function(settings){
  var state = settings.state;

  var f = settings.f;

  var d = settings.f.Drawing(settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x = size.sheet.w/2;
  var y = size.sheet.h/2;


  d.layer('table');




  d.text( [x, y], 'Labels','table' );

  d.layer();

  return d;
};

module.exports = mk_page;
