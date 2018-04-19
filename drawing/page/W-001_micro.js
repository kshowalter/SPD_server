var mk_page = function(settings){
  var state = settings.state;

  var f = settings.f;
  var d = f.Drawing(settings.drawing_settings);


  var system = state.system;

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x, y, h, w;
  var s, l;
  var label;
  var offset;








  //#AC load center
  d.section('AC load center');

  x = loc.AC_loadcenter.x;
  y = loc.AC_loadcenter.y;
  w = size.AC_loadcenter.w;
  h = size.AC_loadcenter.h;
  offset = size.AC_loadcenter.bar.offset;

  d.rect([x,y],
    [w,h],
    'box'
  );

  d.text(
    [ x - w/2 - 10, y-h/2 + 10 ],
    [
      'SERVICE DISCONNECT',
      '(R.S. INITIATION DEVICE)',
      ' ',
      'LOAD',
      'CENTER'
    ],
    'text',
    'label_right'
  );


  // AC bus bars
  d.rect(
    [ loc.AC_loadcenter.x-offset, loc.AC_loadcenter.bar.y -1],
    [ size.AC_loadcenter.bar.w, size.AC_loadcenter.bar.h - 2 ],
    'box'
  );
  d.text(
    //[ loc.AC_loadcenter.x-offset, loc.AC_loadcenter.bottom - size.AC_loadcenter.bar.h - 7 - size.terminal_diam*5 ],
    [ loc.AC_loadcenter.x-offset-10, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 + 4 ],
    'L1',
    'text',
    'table_col_title'
  );
  d.rect(
    //[ loc.AC_loadcenter.x+offset, loc.AC_loadcenter.bottom - size.AC_loadcenter.bar.h/2  - size.terminal_diam*5 ],
    [ loc.AC_loadcenter.x+offset, loc.AC_loadcenter.bar.y - 1 ],
    [ size.AC_loadcenter.bar.w, size.AC_loadcenter.bar.h - 2 ],
    'box'
  );
  d.text(
    [ loc.AC_loadcenter.x+offset+10, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 + 4 ],
    //[ loc.AC_loadcenter.x+o, loc.AC_loadcenter.bottom - size.AC_loadcenter.bar.h - 7 - size.terminal_diam*5 ],
    'L2',
    'text',
    'table_col_title'
  );

  var s, l;
  d.rect(
    [ loc.AC_loadcenter.N.x, loc.AC_loadcenter.N.y ],
    [ size.AC_loadcenter.N.w, size.AC_loadcenter.N.h ],
    'AC_neutral_bar'
  );
  d.text(
    [ loc.AC_loadcenter.N.x+7, loc.AC_loadcenter.N.y - size.AC_loadcenter.N.h/2 + 4 ],
    'N',
    'text',
    'table_col_title'
  );

  l = loc.AC_loadcenter.groundbar;
  s = size.AC_loadcenter.groundbar;
  d.rect([l.x,l.y], [s.w,s.h], 'AC_ground_block' );
  d.block('ground', [l.x,l.y+s.h/2]);


  //# utility meter
  d.section('AC load center');

  x = loc.meter.x;
  y = loc.meter.y;
  w = size.meter.w;
  h = size.meter.h;
  offset = size.AC_loadcenter.bar.offset;

  d.rect([x,y],
    [w,h],
    'box'
  );
  d.circ(
    [x,y],
    h/2,
    'box'
  );

  d.text(
    [ x - w/2 -34, y-h/2 + 10 ],
    [
      'NET-METER',
      '(UTILITY-',
      'APPROVED)'
    ],
    'text',
    'label_center'
  );

  d.layer('AC_L1');
  // AC bus bars
  d.line([
    [ loc.AC_loadcenter.x-offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 + 2],
    [ loc.AC_loadcenter.x-offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 15],
  ]);
  d.block('terminal',
    [ loc.AC_loadcenter.x-offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 + 2]
  );
  d.block('circuit_breaker',
    [ loc.AC_loadcenter.x-offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 15 - size.circuit_breaker.w/2]
  ).rotate(-90);
  d.line([
    [ loc.AC_loadcenter.x-offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 15 - size.circuit_breaker.w],
    [ loc.AC_loadcenter.x-offset, y + h/2 - 5],
  ]);
  d.block('terminal',
    [ loc.AC_loadcenter.x-offset, y + h/2 - 5]
  );

  d.layer('AC_L2');
  d.line([
    [ loc.AC_loadcenter.x+offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 + 2],
    [ loc.AC_loadcenter.x+offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 15],
  ]);
  d.block('terminal',
    [ loc.AC_loadcenter.x+offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 + 2]
  );
  d.block('circuit_breaker',
    [ loc.AC_loadcenter.x+offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 15 - size.circuit_breaker.w/2]
  ).rotate(-90);
  d.line([
    [ loc.AC_loadcenter.x+offset, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 15 - size.circuit_breaker.w],
    [ loc.AC_loadcenter.x+offset, y + h/2 - 5],
  ]);
  d.block('terminal',
    [ loc.AC_loadcenter.x+offset, y + h/2 - 5]
  );

  d.layer('AC_neutral');
  d.line([
    [ loc.AC_loadcenter.N.x, loc.AC_loadcenter.N.y ],
    [ loc.AC_loadcenter.N.x, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2],
    [ loc.AC_loadcenter.N.x, y + h/2 - 5],
  ]);
  d.block('terminal',
    [ loc.AC_loadcenter.N.x, y + h/2 - 5]
  );

  d.line([
    [ loc.AC_loadcenter.x-offset - size.circuit_breaker.h, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 15 - size.circuit_breaker.w/2],
    [ loc.AC_loadcenter.x+offset - size.circuit_breaker.h, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 15 - size.circuit_breaker.w/2],
  ], 'circuit_breaker_connector');








  // if 'array' section is defined:
  d.section('array');

  var micro_array_offset = 50;
  x = loc.array.left + micro_array_offset;
  y = loc.array.lower - size.string.h*system.array.num_of_strings;
  //y -= size.string.h/2;
  var y_string = y;
  s = size.AC_wire_offset*2/3;
  var ground_left = loc.array.left - loc.array.offset - size.DC_wire_offset.ground + size.AC_wire_offset/2;
  var ground_bottom = loc.ground.y- size.AC_wire_offset*1;

  // DC run from array to JB
  for( var i in _.range(system.array.num_of_strings)) {
    var offset_wire = size.AC_wire_offset + (size.AC_wire_offset * 2) * i;

    var x_string = x;

    for( var r=0; r<settings.drawing.displayed_modules[i]; r++){
      d.block('module microinverter', [x_string,y_string]);
      x_string += size.module.w;
    }
    d.line([
      [ x_string, y_string + size.module.h*6.5/8 ],
      [ ground_left + offset_wire, y_string + size.module.h*6.5/8 ],
      [ ground_left + offset_wire, loc.AC_jb_box.y],
    ], 'AC_cable');

    if( settings.drawing.break_string[i] ) {
      d.line(
        [
          [x_string,y_string + size.module.h*6.5/8],
          [x_string+size.string.gap_missing,y_string + size.module.h*6.5/8],
        ],
        'DC_intermodule'
      );
      x_string += size.string.gap_missing;
      d.block('module microinverter', [x_string,y_string]);
    }

    d.line([
      [ x_string, y_string + size.module.h*6.5/8 ],
      [ loc.array.right[i]+micro_array_offset+7, y_string + size.module.h*6.5/8 ],
    ], 'AC_cable');
    d.block('connector_block',
    [ loc.array.right[i]+micro_array_offset+7, y_string + size.module.h*6.5/8 ]
  );



    d.line([
      [ ground_left + offset_wire , loc.AC_jb_box.y],
      [ ground_left + offset_wire -s , loc.AC_jb_box.y +s],
    ], 'AC_neutral');
    d.line([
      [ ground_left + offset_wire -s , loc.AC_jb_box.y +s],
      [ ground_left + offset_wire -s, ground_bottom +s - offset_wire],
      [ loc.AC_loadcenter.N.x, ground_bottom  +s -offset_wire],
    ], 'AC_neutral');
    d.block( 'terminal', [ ground_left + offset_wire -s, loc.AC_jb_box.y +s]);

    d.line([
      [ ground_left + offset_wire , loc.AC_jb_box.y],
      [ ground_left + offset_wire , loc.AC_jb_box.y +s],
    ], 'AC_L1');
    d.line([
      [ ground_left + offset_wire , loc.AC_jb_box.y +s],
      [ ground_left + offset_wire , ground_bottom - offset_wire],
      [ loc.AC_loadcenter.left + size.AC_wire_offset - size.circuit_breaker.w/2, ground_bottom -offset_wire],
    ], 'AC_L1');
    d.line([
      [ loc.AC_loadcenter.left + size.AC_wire_offset + size.circuit_breaker.w/2, ground_bottom -offset_wire],
      [ loc.AC_loadcenter.L1.x, ground_bottom -offset_wire],
    ], 'AC_L1');
    d.block( 'terminal', [ loc.AC_loadcenter.L1.x, ground_bottom -offset_wire]);
    d.block('circuit_breaker', [ loc.AC_loadcenter.left + size.AC_wire_offset, ground_bottom -offset_wire] );
    d.block( 'terminal', [ ground_left + offset_wire, loc.AC_jb_box.y +s]);

    d.line([
      [ ground_left + offset_wire , loc.AC_jb_box.y],
      [ ground_left + offset_wire +s , loc.AC_jb_box.y +s],
    ], 'AC_L2');
    d.line([
      [ ground_left + offset_wire +s , loc.AC_jb_box.y +s],
      [ ground_left + offset_wire +s, ground_bottom -s - offset_wire],
      [ loc.AC_loadcenter.left + size.AC_wire_offset - size.circuit_breaker.w/2, ground_bottom -s -offset_wire],
    ], 'AC_L2');
    d.line([
      [ loc.AC_loadcenter.left + size.AC_wire_offset + size.circuit_breaker.w/2, ground_bottom -s -offset_wire],
      [ loc.AC_loadcenter.L2.x, ground_bottom  -s -offset_wire],
    ], 'AC_L2');
    d.block( 'terminal', [ loc.AC_loadcenter.L2.x, ground_bottom  -s -offset_wire]);
    d.block('circuit_breaker', [ loc.AC_loadcenter.left + size.AC_wire_offset, ground_bottom -s -offset_wire] );
    d.block( 'terminal', [ ground_left + offset_wire +s , loc.AC_jb_box.y +s]);

    if( system.array.num_of_strings > 1 ){
      d.line([
        [ loc.AC_loadcenter.left + size.AC_wire_offset  , ground_bottom -s -offset_wire - size.circuit_breaker.h/2 -1 ],
        [ loc.AC_loadcenter.left + size.AC_wire_offset  , ground_bottom    -offset_wire - size.circuit_breaker.h/2 -1 ],
      ], 'circuit_breaker_connector');
    }

    d.line([
      [ ground_left + offset_wire , loc.AC_jb_box.y],
      [ ground_left + offset_wire -s , loc.AC_jb_box.y-s/2*i],
    ], 'DC_ground');
    /*
    d.block( 'terminal', [ ground_left+offset_wire-s , loc.AC_jb_box.y]);
    if( i != 0 ){
      var path_string = 'm'+(ground_left+offset_wire-s*2)+' '+(loc.AC_jb_box.y-s/2*i)+' ';
      path_string += 'c '+(0)+' '+(-s)+', '+(-s *2)+' '+(-s)+', '+(-s *2)+' '+(0)+' ';
      d.path(path_string, 'DC_ground');
    }
    */
    d.line([
      [ ground_left+offset_wire-s , loc.AC_jb_box.y-s/2*i],
      [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y-s/2*i],
    ], 'DC_ground');


    //d.line([
    //  [ loc.array.right[i]+micro_array_offset, y_string + size.module.h*7.2/8 ],
    //  [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground , y_string + size.module.h*7.2/8 ],
    //], 'DC_ground');

    y_string += size.string.h;
  }


  d.rect(
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y-6],
    [3,20],
    'AC_ground_block'
  );
  d.line([
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y-6],
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y-6 - 50],
  ], 'DC_ground');

  // DC ground run from array to JB
  d.layer('DC_ground');
  d.text(
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y-6 - 50 - 20],
    ['TO','RACK'],
    'text',
    'label_center_small'
  );
  //d.line([
  //  [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, y + size.module.h*7.2/8 ],
  //  [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y ]
  //]);
  d.layer();



  x = loc.array.right_max;
  y = loc.array.lower;
  var text_offset = 11;
  // array details
  x += 200;
  y -= 125;
  d.text(
    [ x, y ],
    [state.system.module.manufacturer_name + ' ' + state.system.module.device_name + ',' ],
    'text',
    'label_center'
  );
  y += text_offset * 1.5;
  d.text(
    [ x, y ],
    [state.system.inverter.manufacturer_name + ' ' + state.system.inverter.device_model_number ],
    'text',
    'label_center'
  );
  y += text_offset * 1.5;
  d.text(
    [ x+33, y ],
    ['Mod.'],
    'text',
    'label_right'
  );
  d.text(
    [ x+33+42, y ],
    ['Inv.'],
    'text',
    'label_right'
  );
  y += text_offset * 1.5;
  d.text(
    [ x, y ],
    [state.system.array.num_of_strings + ' strings:'],
    'text',
    'label_right'
  );
  y += system.array.num_of_strings * text_offset + text_offset/2;
  d.text(
    [ x, y ],
    ['Total:'],
    'text',
    'label_right'
  );
  x += 30;
  d.text(
    [ x-5, y ],
    [state.system.array.num_of_modules],
    'text',
    'label_right'
  );
  d.text(
    [ x-5+42, y ],
    [state.system.array.num_of_modules],
    'text',
    'label_right'
  );
  y -= text_offset;
  d.line(
    [
      [ x-26, y + text_offset/4 ],
      [ x, y + text_offset/4 ]
    ],
    'text'
  );
  d.line(
    [
      [ x+42-26, y + text_offset/4 ],
      [ x+42, y + text_offset/4 ]
    ],
    'text'
  );
  y -= text_offset/2;
  _.reverse(settings.drawing.module_count);
  for( var i in _.range(system.array.num_of_strings)) {
    var num_of_modules_in_string = settings.drawing.module_count[i];
    d.text(
      [ x, y ],
      ['['+num_of_modules_in_string+']'],
      'text',
      'label_right'
    );
    d.text(
      [ x+42, y ],
      ['['+num_of_modules_in_string+']'],
      'text',
      'label_right'
    );
    y -= text_offset
  }
  _.reverse(settings.drawing.module_count);





  // AC Junction box
  x = loc.AC_jb_box.x;
  y = loc.AC_jb_box.y;
  w = size.AC_jb_box.w;
  h = size.AC_jb_box.h;
  label = ['JUNCTION','BOX'];
  d.rect(
    [x,y],
    [w,h],
    'box'
  );
  d.text(
    [ x + w/2 + 35, y - 7],
    label,
    'text',
    'label_center'
  );

  // Roofline
  x = loc.AC_jb_box.x;
  y = loc.AC_jb_box.y + size.AC_jb_box.h/2 + 10;
  d.line(
    [
      [ x - 60, y],
      [ x + 200, y ]
    ],
    'roof_line'
  );
  d.text(
    [ x + 150, y - 7],
    'ROOFLINE',
    'text',
    'label_center'
  );


  x = loc.array.left;
  y = loc.array.lower;
  var text_offset = 11;
  // array details
  x += 40;
  y += 20;
  d.text(
    [ x, y ],
    [ 'EQUIPMENT BONDED IN ACCORDANCE WITH UL 2703 LISTING' ],
    'text',
    'label_left_small'
  );

  // Conduit callout: array to JB
  w = 100;
  h = 15;
  x = loc.AC_jb_box.x + 15;
  y = loc.AC_jb_box.y - size.AC_jb_box.h/2 - h;
  d.ellipse([x, y],[w, h],'wire_callout');
  d.line(
    [
      [ x + w/2, y],
      [ x + w/2 + 16, y ]
    ],
    'wire_callout'
  );
  d.text(
    [ x + w/2 + 16 + 5, y ],
    ['(1) MANUFACTURER SUPPLIED CABLE TYPE TC-ER'],
    'text',
    'label_left'
  );





  // DC ground run from JB to combiner
  d.line([
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y ],
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.ground.y],
    [ loc.AC_loadcenter.groundbar.x - size.AC_loadcenter.groundbar.w/2 , loc.ground.y],
    [ loc.AC_loadcenter.N.x - size.AC_loadcenter.N.w/2 , loc.ground.y],
  ],'DC_ground');
  //d.block( 'terminal', [ loc.DC_combiner.x - size.DC_combiner.components_width/2 , loc.ground.y]);




  // Conduit callout: JB to combiner
  if( system.array.num_of_strings > 1 ){
    h = 150;
    w = 15;
  } else {
    h = 60;
    w = 10;
  }
  //x = loc.DC_combiner.x - size.DC_combiner.w/2 - w*2;
  x = loc.DC_combiner.x + size.DC_combiner.w/2;
  y = loc.DC_combiner.y + size.DC_combiner.h/2 - h/2;
  d.ellipse([x, y],[w, h],'wire_callout');
  d.line(
    [
      [ x, y + h/2],
      [ x + 10, y + h/2 + 16 ]
    ],
    'wire_callout'
  );
  d.text(
    [ x + 10 + 10, y + h/2 + 16 ],
    ['(2)'],
    'text',
    'label_center'
  );





































  ////////////////////////
  // circuit table
  d.section('Wire table');
  ///*

  x = loc.wire_table.x;
  y = loc.wire_table.y;
  w = 0;



  var circuit_names = [
    'Manufacturer cable',
    'PV Microinverter AC sources',
  ];

  var text_cell_size_fixed = 16;
  var font_letter_width = 3.5;

  var circuit_parameters = {
    'max_current': {
      top:'MAX.',
      middle: 'CURR.',
      bottom: '(A)',
    },
    'location': {
      top:'LOCATION'
    },
    'type': {
      top:'TYPE',
      col_size: 41
    },
    'conductor': {
      top:'CONDUCTOR'
    },
    'conductor_size_min': {
      top:'COND.',
      middle: 'MIN. SIZE',
      bottom: '(AWG)'
    },
    'material': {
      top:'MAT.'
    },
    'total_cc_conductors': {
      top: 'CUR.',
      middle: 'CAR.',
      bottom: 'COND.'
    },
    'conductor_current': {
      top:'MAX.',
      middle: ' CONDUCT.',
      bottom: 'CUR. (A)',
    },
    'temp_correction_factor': {
      top:'TEMP.',
      middle: 'COR.',
      bottom: 'FACTOR',
    },
    'conductors_adj_factor': {
      top:'CONDUIT',
      middle: 'ADJ. FACT.',
    },
    'conductor_current_cor': {
      top:'MAX. COND.',
      middle: 'CUR. (CORR.)',
      bottom: '(A)'
    },
    'wet_temp_rating': {
      top:'WET TEMP.',
      middle: 'RATING',
      bottom: '(deg. C)'
    },
    'conduit_type': {
      top:'CONDUIT',
      middle: 'TYPE'
    },
    'min_conduit_size': {
      top:'CONDUIT',
      middle: 'SIZE',
      bottom: '(in.)'
    },
    'ocpd_type': {
      top:'OCPD TYPE'
    },
    'OCPD': {
      top:'OCPD',
      middle: '(A)'
    },
  };
  var circuit_parameter_list = Object.keys(circuit_parameters);
  var circuit_parameter_labels = {};
  circuit_parameter_list.forEach(function(circuit_parameter_name){
    circuit_parameters[circuit_parameter_name] = circuit_parameters[circuit_parameter_name] || [];
    circuit_parameters[circuit_parameter_name].top = circuit_parameters[circuit_parameter_name].top || f.pretty_name(circuit_parameter_name).toUpperCase();
    circuit_parameters[circuit_parameter_name].middle = circuit_parameters[circuit_parameter_name].middle || '';
    circuit_parameters[circuit_parameter_name].bottom = circuit_parameters[circuit_parameter_name].bottom || '';

    var units_length = 0;
    if( circuit_parameters[circuit_parameter_name].units ){
      units_length = circuit_parameters[circuit_parameter_name].units.length;
    }

    var col_size = circuit_parameters[circuit_parameter_name].col_size;
    if( ! col_size ){
      var size0 = ( circuit_parameters[circuit_parameter_name].top.length + units_length ) * font_letter_width;
      var size1 = ( circuit_parameters[circuit_parameter_name].middle.length + units_length ) * font_letter_width;
      var size2 = ( circuit_parameters[circuit_parameter_name].bottom.length + units_length ) * font_letter_width;
      col_size = Math.max(size0, size1, size2);
      col_size += text_cell_size_fixed;
    }

    circuit_parameter_labels[circuit_parameter_name] = [
      col_size,
      [
        circuit_parameters[circuit_parameter_name].top,
        circuit_parameters[circuit_parameter_name].middle,
        circuit_parameters[circuit_parameter_name].bottom
      ]
    ];
  });

  var n_rows = 3 + circuit_names.length;
  var n_cols = 2 + circuit_parameter_list.length;
  var row_height = 16;
  var row_width = 50;


  h = n_rows*row_height;
  var t = d.table(n_rows,n_cols);
  t.row_size('all', row_height);
  t.col_size('all', row_width);

  t.all_cells().forEach(function(cell){
    cell.font('table').border('all');
  });


  var row = 4;
  circuit_names.forEach(function(circuit_name){
    var circuit = system.circuits[circuit_name];

    t.cell(row,1).font('table').text( String(row-3) );
    t.cell(row,2).font('table_left').text( circuit_name.toUpperCase() );

    var col = 3;
    circuit_parameter_list.forEach(function(circuit_parameter_name){
      var value = circuit[circuit_parameter_name];
      var units = circuit_parameters[circuit_parameter_name].units;
      if( ! units ){ units = ''; }
      if( value === '-' || value === 'NA') { units = ''; }
      value = f.format_value(value);
      //value = value.replace('/', '/');

      var value_size = value.length * font_letter_width;
      value_size += text_cell_size_fixed;
      var current_column_size = circuit_parameter_labels[circuit_parameter_name][0];
      circuit_parameter_labels[circuit_parameter_name][0] = value_size > current_column_size ? value_size : current_column_size;

      t.cell(row,col).font('table_left').text( value + units );

      col++;
    });
    row++;
  });



  // Column setup

  // Fixed columns
  t.cell(1,1).font('table_col_title').text('SYM.');
  t.cell(1,1).border('B', false);
  t.cell(2,1).border('B', false);
  t.col_size(1, 25);
  w += 25;

  t.cell(1,2).font('table_col_title').text('CIRCUIT');
  t.cell(1,2).border('B', false);
  t.cell(2,2).border('B', false);
  t.col_size(2, 150);
  w += 150;

  circuit_parameter_labels['conductor'][0] += 5;
  circuit_parameter_labels['conductor_size_min'][0] += 10;

  // variable columns
  circuit_parameter_list.forEach(function(circuit_parameter_name, i){
    var col_size = circuit_parameter_labels[circuit_parameter_name][0];
    var label = circuit_parameter_labels[circuit_parameter_name][1];
    t.cell(1,i+3).border('B', false);
    t.cell(2,i+3).border('B', false);
    t.col_size(i+3, col_size);
    t.cell(1,i+3).font('table_col_title').text(label[0]);
    t.cell(2,i+3).font('table_col_title').text(label[1]);
    t.cell(3,i+3).font('table_col_title').text(label[2]);
    w += col_size;
  });

  x = size.sheet.w/2-w/2;
  //logger.info(t.cells);
  t.loc(x,y);
  d.text(
    [ x + 3 , y - 13 ],
    [
      'CONDUCTOR AND CONDUIT (OR RACEWAY) SCHEDULE'
    ],
    'text',
    'label_left'
  );

  t.mk();




  return d;
};

module.exports = mk_page;
