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


  // if 'array' section is defined:
  d.section('array');

  var micro_array_offset = 50;
  x = loc.array.left + micro_array_offset;
  y = loc.array.lower - size.string.h*system.array.num_of_strings - 20;
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

    if( settings.drawing.break_string[i] ) {
      d.line(
        [
          [x_string,y_string],
          [x_string+size.string.gap_missing,y_string],
        ],
        'DC_intermodule'
      );
      x_string += size.string.gap_missing;
      d.block('module microinverter', [x_string,y_string]);
    }

    d.block('connector_block',
      [ loc.array.right[i]+micro_array_offset+7, y_string + size.module.h*6.5/8 ]
    );
    d.line([
      [ loc.array.right[i]+micro_array_offset+7, y_string + size.module.h*6.5/8 ],
      [ ground_left + offset_wire, y_string + size.module.h*6.5/8 ],
      [ ground_left + offset_wire, loc.AC_jb_box.y],
    ], 'AC_cable');



    d.line([
      [ ground_left + offset_wire , loc.AC_jb_box.y],
      [ ground_left + offset_wire -s , loc.AC_jb_box.y +s],
    ], 'AC_neutral');
    d.line([
      [ ground_left + offset_wire -s , loc.AC_jb_box.y +s],
      [ ground_left + offset_wire -s, ground_bottom +s - offset_wire],
      [ loc.AC_loadcenter.N.x, ground_bottom  +s -offset_wire],
    ], 'AC_neutral');
    d.block( 'terminal', [ loc.AC_loadcenter.N.x, ground_bottom  +s -offset_wire]);
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
    console.log(i, offset_wire);
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


    d.line([
      [ loc.array.right[i]+micro_array_offset, y_string + size.module.h*7.2/8 ],
      [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground , y_string + size.module.h*7.2/8 ],
    ], 'DC_ground');

    y_string += size.string.h;
  }


  d.rect(
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y-6],
    [3,20],
    'AC_ground_block'
  );

  // DC ground run from array to JB
  d.layer('DC_ground');
  //d.line([
  //  [ ground_left + offset_wire , loc.AC_jb_box.y],
  //  [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y],
  //]);
  d.line([
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, y + size.module.h*7.2/8 ],
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y ]
  ]);
  d.layer();


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


  // Conduit callout: array to JB
  w = 140;
  h = 15;
  x = loc.AC_jb_box.x;
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
    ['MANUFACTURER SUPPLIED CABLE'],
    'text',
    'label_left'
  );





  // DC ground run from JB to combiner
  d.line([
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.AC_jb_box.y ],
    [ loc.array.left - loc.array.offset - size.DC_wire_offset.ground, loc.ground.y],
    [ loc.AC_loadcenter.groundbar.x - size.AC_loadcenter.groundbar.w/2 , loc.ground.y],
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
      [ x + 16, y + h/2 + 32 ]
    ],
    'wire_callout'
  );
  d.text(
    [ x + 16 + 10, y + h/2 + 32 ],
    ['(1)'],
    'text',
    'label_center'
  );

















  //#AC load center
  d.section("AC load center");

  x = loc.AC_loadcenter.x;
  y = loc.AC_loadcenter.y;
  w = size.AC_loadcenter.w;
  h = size.AC_loadcenter.h;

  d.rect([x,y],
    [w,h],
    'box'
  );

  d.text(
    [ x, y-h/2-27 ],
    [
      'LOAD',
      'CENTER'
    ],
    'text',
    'label_center'
  );

  // AC bus bars
  d.rect(
    [ loc.AC_loadcenter.L1.x, loc.AC_loadcenter.bar.y ],
    [ size.AC_loadcenter.bar.w, size.AC_loadcenter.bar.h ],
    'box'
  );
  d.text(
    //[ loc.AC_loadcenter.x-10, loc.AC_loadcenter.bottom - size.AC_loadcenter.bar.h - 7 - size.terminal_diam*5 ],
    [ loc.AC_loadcenter.L1.x, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 7 ],
    'L1',
    'text',
    'table_col_title'
  );
  d.rect(
    //[ loc.AC_loadcenter.x+10, loc.AC_loadcenter.bottom - size.AC_loadcenter.bar.h/2  - size.terminal_diam*5 ],
    [ loc.AC_loadcenter.L2.x, loc.AC_loadcenter.bar.y ],
    [ size.AC_loadcenter.bar.w, size.AC_loadcenter.bar.h ],
    'box'
  );
  d.text(
    [ loc.AC_loadcenter.L2.x, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 7 ],
    //[ loc.AC_loadcenter.x+10, loc.AC_loadcenter.bottom - size.AC_loadcenter.bar.h - 7 - size.terminal_diam*5 ],
    'L2',
    'text',
    'table_col_title'
  );
  d.rect(
    //[ loc.AC_loadcenter.x+10, loc.AC_loadcenter.bottom - size.AC_loadcenter.bar.h/2  - size.terminal_diam*5 ],
    [ loc.AC_loadcenter.N.x, loc.AC_loadcenter.bar.y ],
    [ size.AC_loadcenter.bar.w, size.AC_loadcenter.bar.h ],
    'AC_neutral'
  );
  d.text(
    [ loc.AC_loadcenter.N.x, loc.AC_loadcenter.bar.y - size.AC_loadcenter.bar.h/2 - 7 ],
    //[ loc.AC_loadcenter.x+10, loc.AC_loadcenter.bottom - size.AC_loadcenter.bar.h - 7 - size.terminal_diam*5 ],
    'N',
    'text',
    'table_col_title'
  );




  l = loc.AC_loadcenter.groundbar;
  s = size.AC_loadcenter.groundbar;
  d.rect([l.x,l.y], [s.w,s.h], 'AC_ground_block' );
  d.block('ground', [l.x,l.y+s.h/2]);























  ////////////////////////
  // circuit table
  d.section('Wire table');
  ///*

  x = loc.wire_table.x;
  y = loc.wire_table.y;
  w = 0;



  var circuit_names = [
    'PV Microinverter AC source circuits',
  ];

  var text_cell_size_fixed = 20;
  var font_letter_width = 3.75;

  var circuit_parameters = {
    'max_current': {
      top:'circuit',
      bottom: 'current',
      units: 'A'
    },
    'conductor': {
      top:'conductor'
    },
    'type': {
      top:'type'
    },
    'conductor_size_min': {
      top:'cond.',
      bottom: 'min. size',
      units: ' AWG'
    },
    'material': {
      top:'material'
    },
    'conductor_current': {
      top:'max. cond.',
      bottom: 'current',
      units: 'A'
    },
    'wet_temp_rating': {
      top:'wet_temp',
      bottom: 'rating',
      units: ' F'
    },
    'location': {
      top:'location'
    },
    'conduit_type': {
      top:'conduit',
      bottom: 'type'
    },
    'min_conduit_size': {
      top:'conduit',
      bottom: 'size'
    },
    'ocpd_type': {
      top:'ocpd_type'
    },
    'OCPD': {
      units: 'A'
    },
  };
  var circuit_parameter_list = Object.keys(circuit_parameters);
  var circuit_parameter_labels = {};
  circuit_parameter_list.forEach(function(circuit_parameter_name){
    circuit_parameters[circuit_parameter_name] = circuit_parameters[circuit_parameter_name] || [];
    circuit_parameters[circuit_parameter_name].top = circuit_parameters[circuit_parameter_name].top || circuit_parameter_name;
    circuit_parameters[circuit_parameter_name].bottom = circuit_parameters[circuit_parameter_name].bottom || '';

    var col_size;
    var size0 = circuit_parameters[circuit_parameter_name].top.length * font_letter_width;
    var size1 = circuit_parameters[circuit_parameter_name].bottom.length * font_letter_width;
    if( size0 > size1 ) { col_size = size0; }
    else { col_size = size1; }
    col_size += text_cell_size_fixed;

    circuit_parameter_labels[circuit_parameter_name] = [
      col_size,
      [
        f.table_name(circuit_parameters[circuit_parameter_name].top),
        f.table_name(circuit_parameters[circuit_parameter_name].bottom)
      ]
    ];
  });

  var n_rows = 2 + circuit_names.length;
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


  var row = 3;
  circuit_names.forEach(function(circuit_name){
    var circuit = system.circuits[circuit_name];

    t.cell(row,1).font('table').text( String(row-2) );
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
  t.col_size(1, 25);
  w += 25;

  t.cell(1,2).font('table_col_title').text('CIRCUIT');
  t.cell(1,2).border('B', false);
  t.col_size(2, 190);
  w += 165;

  circuit_parameter_labels['conductor'][0] += 5;
  circuit_parameter_labels['conductor_size_min'][0] += 10;

  // variable columns
  circuit_parameter_list.forEach(function(circuit_parameter_name, i){
    var col_size = circuit_parameter_labels[circuit_parameter_name][0];
    var label = circuit_parameter_labels[circuit_parameter_name][1];
    t.cell(1,i+3).border('B', false);
    t.col_size(i+3, col_size);
    t.cell(1,i+3).font('table_col_title').text(label[0]);
    t.cell(2,i+3).font('table_col_title').text(label[1]);
    w += col_size;
  });

  x = size.sheet.w/2-w/2;
  //logger.info(t.cells);
  t.loc(x,y);
  d.text(
    [ x + 3 , y - 13 ],
    [
      'CIRCUIT SCHEDULE'
    ],
    'text',
    'label_left'
  );

  t.mk();




  return d;
};

module.exports = mk_page;
