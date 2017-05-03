var mk_label = function(d, x, y, text_list, w){
  var character_width = 5.5;
  var label_width = 0;
  var value_width = 0;
  text_list.forEach(function(list_item){
    label_width = list_item[0].length > label_width ? list_item[0].length : label_width;
    if( list_item[1] !== undefined ){
      value_width = list_item[1].length > label_width ? list_item[1].length : label_width;
    }
  });
  label_width = ( label_width + 0 ) * character_width;
  value_width = ( value_width + 1 ) * character_width;
  console.log(label_width, value_width);

  w = 20 + label_width + value_width;

  x += 0;
  y += 0;
  var line_spacing = 12;
  var value_box_height = 10;
  var h = 10 + text_list.length * line_spacing;
  var left = x + 5;
  var right_values = x + w - 5 - value_width;
  var top = y + 10;
  var x_local = x+w/2;
  var y_local = y+h/2;
  var offset_y;
  d.rect([x_local,y_local],[w,h],'NEC_label_back');
  text_list.forEach(function(list_item, i){
    var text = list_item[0].toUpperCase();
    var value = list_item[1];
    offset_y = i * line_spacing;
    d.text([left,top+offset_y],text,'NEC_label_text','NEC_label_text');
    if( value !== undefined ){
      //var value_box_width = list_item[1].length * character_width;
      console.log(list_item);
      console.log([right_values,y_local],[value_width,value_box_height]);
      d.rect([right_values+value_width/2,top+offset_y-1],[value_width,value_box_height],'NEC_label_value_box');
      d.text([right_values+character_width/2,top+offset_y],value,'NEC_label_value_text','NEC_label_text');
    }
  });

  return h;
};




var mk_page = function(settings){
  var state = settings.state;

  var f = settings.f;

  var d = settings.f.Drawing(settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;


  var x;
  var y;
  var w;
  var h;

  var text_list;

  var label_spacing = 20;

  d.layer('base');

  x = size.sheet.frame_padding*6;
  y = size.sheet.frame_padding*6;




  x += 0;
  y += 0;
  text_list = [
    ['one'],
    ['two', '234'],
    ['three', '345']
  ];
  h = mk_label(d, x, y, text_list, w);

  x += 0;
  y += h + label_spacing;
  text_list = [
    ['alpha'],
    ['beta'],
    ['gamma', '123V'],
    ['Delta', '23A'],
    ['epsilon'],
    ['zeta'],
    ['eta']
  ];
  h = mk_label(d, x, y, text_list, w);





  d.layer();

  return d;
};

module.exports = mk_page;
