var mk_label = function(d, x, y, title, text_list, notes){
  var label_width = 115;
  var line_spacing = 14;
  var value_box_width = 50;
  var unit_label_width = 7.5;
  var value_box_height = line_spacing * 1.5;
  var margin = 7.5;
  var w = margin + label_width + margin + value_box_width + unit_label_width + margin;
  var h = margin * 2;
  var offset_y = line_spacing * 0.3;
  text_list.forEach(function(list_item, i){
    var value = list_item[1];
    if( value !== undefined ){
      h += line_spacing*2;
    } else {
      h += line_spacing;
    }
  });
  if( title ){
    if( title.constructor === Array ){
      h += line_spacing * 1.7 * title.length;
    } else {
      h += line_spacing * 1.7;
    }
    offset_y += line_spacing * 0.2;
  }
  var value_x = x + w - margin - unit_label_width - value_box_width;
  var value_center_x = x + w - margin - unit_label_width - value_box_width/2;
  var label_x = x + w - margin/2 - unit_label_width - value_box_width - margin;
  var center_x = x + w/2;

  var top = y + 10;
  var x_local = x+w/2;
  var y_local = y+h/2;

  d.text([x+w+margin/2,top-line_spacing/4],notes,'NEC_label_notes_text','NEC_label_notes_text');

  d.rect([x_local,y_local],[w,h],'NEC_label_back');
  if( title ){
    d.text([center_x,top+offset_y],title,'NEC_label_text','NEC_label_title');
    if( title.constructor === Array ){
      offset_y += line_spacing * 1.7 * title.length;
    } else {
      offset_y += line_spacing * 1.7;
    }
  }
  text_list.forEach(function(list_item, i){
    var label = list_item[0];
    var value = list_item[1];
    var unit = list_item[2];
    if( value !== undefined ){
      if( label.constructor === Array ){
        d.text([label_x,top+offset_y+line_spacing*0.2],label[0],'NEC_label_text','NEC_label_text_end');
        d.text([label_x,top+offset_y+line_spacing*0.9],label[1],'NEC_label_text','NEC_label_text_end');
      } else {
        d.text([label_x,top+offset_y],label,'NEC_label_text','NEC_label_text_end');
      }
      //var value_box_width = list_item[1].length * character_width;
      d.rect([value_x+value_box_width/2,top+offset_y+line_spacing/2],[value_box_width,value_box_height],'NEC_label_value_box');
      d.text([value_x+value_box_width/2,top+offset_y+line_spacing/2],value,'NEC_label_value_text','NEC_label_value_text');
      d.text([value_x+value_box_width+unit_label_width*0.75,top+offset_y+line_spacing/2],unit,'NEC_label_text','NEC_label_value_text');
      offset_y += line_spacing*2;
    } else {
      d.text([center_x,top+offset_y],label,'NEC_label_text','NEC_label_text_middle');
      offset_y += line_spacing;
    }
  });

  return h;
};




var mk_page = function(settings){
  var state = settings.state;
  var system = settings.state.system;

  var f = settings.f;

  var d = settings.f.Drawing(settings.drawing_settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;


  var x;
  var y;
  var w;
  var h;

  var text_list;
  var title;
  var notes;

  var label_spacing = 20;
  var column_width = 310;

  d.layer('base');

  x = size.sheet.frame_padding*6;
  y = size.sheet.frame_padding*6;


  if( system.config.system_type !== 'micro'){

    x += 0;
    y += 0;
    title = 'WARNING';
    text_list = [
      ['PHOTOVOLTAIC POWER SOURCE'],
    ];
    notes = [
      'Per Code:',
      'NEC 690.31.G.3',
    ];
    h = mk_label(d, x, y, title, text_list, notes);


    x += 0;
    y += h + label_spacing;
    title = [
      'PHOTOVOLTAIC DC',
      'DISCONNECT'
    ];
    text_list = [];
    notes = [
      'Per Code:',
      'NEC 690.14.C.2',
    ];
    h = mk_label(d, x, y, title, text_list, notes);


    x += 0;
    y += h + label_spacing;
    title = undefined;
    text_list = [
      [['MAXIMUM POWER-','POINT CURRENT (Imp)'], f.format_value(system.array.imp), 'A' ],
      [['MAXIMUM POWER-', 'POINT VOLTAGE (Vmp)'], f.format_value(system.array.vmp), 'V'],
      [['MAXIMUM SYSTEM', 'VOLTAGE (Voc)'], f.format_value(system.array.max_sys_voltage), 'V'],
      [['SHORT-CIRCUIT', 'CURRENT (Isc)'], f.format_value(system.array.isc), 'A'],
    ];
    notes = [
      'Per Code:',
      'NEC 690.53'
    ];
    h = mk_label(d, x, y, title, text_list, notes);

  } else {
    h = -label_spacing;
  }

  x += 0;
  y += h + label_spacing;
  title = 'WARNING';
  text_list = [
    ['ELECTRIC SHOCK HAZARD IF'],
    ['A GROUND FAULT IS INDICATED'],
    ['NORMALLY GROUNDED'],
    ['CONDUCTORS MAY BE'],
    ['UNGROUNDED AND ENERGIZED'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.5(C)'
  ];
  h = mk_label(d, x, y, title, text_list, notes);

  x += 0;
  y += h + label_spacing;
  title = 'WARNING';
  text_list = [
    ['ELECTRIC SHOCK HAZARD'],
    ['DO NOT TOUCH TERMINALS'],
    ['TERMINALS ON BOTH LINE AND'],
    ['LOAD SIDES MAY BE ENERGIZED'],
    ['IN THE OPEN POSITION'],
    [''],
    ['DC VOLTAGE IS'],
    ['ALWAYS PRESENT WHEN'],
    ['SOLAR MODULES ARE'],
    ['EXPOSED TO SUNLIGHT'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.17(4)'
  ];
  h = mk_label(d, x, y, title, text_list, notes);



  ///////
  // Column 2

  x += column_width;
  y = size.sheet.frame_padding*6;
  title = [
    'PHOTOVOLTAIC AC',
    'DISCONNECT'
  ];
  text_list = [];
  notes = [
    'Per Code:',
    'NEC 690.14.C.2'
  ];
  h = mk_label(d, x, y, title, text_list, notes);



  x += 0;
  y += h + label_spacing;
  title = undefined;
  text_list = [
    [['MAXIMUM AC','OPERATING CURRENT'], f.format_value(system.inverter.max_ac_output_current), 'A'],
    [['MAXIMUM AC', 'OPERATING VOLTAGE'], f.format_value(system.interconnection.grid_voltage ), 'V'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.54'
  ];
  h = mk_label(d, x, y, title, text_list, notes);



  x += 0;
  y += h + label_spacing;
  title = 'WARNING';
  text_list = [
    ['ELECTRIC SHOCK HAZARD'],
    ['DO NOT TOUCH TERMINALS'],
    ['TERMINALS ON BOTH LINE AND'],
    ['LOAD SIDES MAY BE ENERGIZED'],
    ['IN THE OPEN POSITION'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.17.E'
  ];
  h = mk_label(d, x, y, title, text_list, notes);


  x += 0;
  y += h + label_spacing;
  title = undefined;
  text_list = [
    ['PHTOVOLTAIC POINT OF'],
    ['INTERCONNECTION'],
    ['WARNING: ELECTRIC SHOCK'],
    ['HAZARD. DO NOT TOUCH'],
    ['TERMINALS. TERMINALS ON'],
    ['BOTH THE LINE AND LOAD SIDES'],
    ['MAY BE ENERGIZED IN THE OPEN '],
    ['POSITION. FOR SERVICE'],
    ['DE-ENERGIZE BOTH SOURCE'],
    ['AND MAIN BREAKER.'],
    ['PV POWER SOURCE'],
    [['MAXIMUM AC','OPERATING CURRENT'], f.format_value(system.inverter.max_ac_output_current), 'A'],
    [['MAXIMUM AC', 'OPERATING VOLTAGE'], f.format_value(system.interconnection.grid_voltage ), 'V'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.17.4;',
    'NEC 690.54',
  ];
  h = mk_label(d, x, y, title, text_list, notes);



  x += 0;
  y += h + label_spacing;
  title = 'CAUTION';
  text_list = [
    ['DUAL POWER SOURCE'],
    ['SECOND SOURCE IS'],
    ['PHTOVOLTAIC SYSTEM'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.64.B.4',
  ];
  h = mk_label(d, x, y, title, text_list, notes);


  ///////
  // Column 3

  x += column_width;
  y = size.sheet.frame_padding*6;
  title = 'CAUTION';
  text_list = [
    ['PHOTOVOLTAIC SYSTEM'],
    ['CIRCUIT IS BACKFED'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.64.B.4',
  ];
  h = mk_label(d, x, y, title, text_list, notes);


  x += 0;
  y += h + label_spacing;
  title = 'WARNING';
  text_list = [
    ['INVERTER OUTPUT'],
    ['CONNECTION'],
    ['DO NOT RELOCATE'],
    ['THIS OVERCURRENT'],
    ['DEVICE'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.64.B.7',
  ];
  h = mk_label(d, x, y, title, text_list, notes);




  x += 0;
  y += h + label_spacing;
  title = 'WARNING';
  text_list = [
    ['ELECTRIC SHOCK HAZARD'],
    ['THE DC CONDUCTORS OF THIS'],
    ['PHOTOVOLTAIC SYSTEM ARE'],
    ['UNGROUNDED AND'],
    ['MAY BE ENERGIZED'],
  ];
  notes = [
    'Per Code:',
    'NEC 690.35(F)',
    'TO BE USED WHEN',
    'INVERTER IS',
    'UNGROUNDED',
  ];
  h = mk_label(d, x, y, title, text_list, notes);


  d.layer();

  return d;
};

module.exports = mk_page;
