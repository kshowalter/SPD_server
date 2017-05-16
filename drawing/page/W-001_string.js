var mk_page = function(settings){
  var state = settings.state;

  var f = settings.f;
  var d = f.Drawing(settings);


  var system = state.system;

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x, y, h, w;
  var label;
  var offset;


  // if 'array' section is defined:
  d.section('array');

  x = loc.array.left;
  y = loc.array.lower - size.module.h;
  //y -= size.string.h/2;

  // DC run from array to JB
  for( var i in _.range(system.array.num_of_strings)) {
    var offset_wire = size.wire_offset.min + ( size.wire_offset.base * i );

    var x_string = x;
    var y_string = y;


    for( var r=0; r<settings.drawing.displayed_modules[i]; r++){
      d.block('module', [x_string,y_string]);
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
      d.block('module', [x_string,y_string]);
    }

    //d.block('string', [x,y]);





    // positive home run
    d.layer('DC_pos');
    d.line([
      [ loc.array.right[i] , y],
      [ loc.array.right_max + loc.array.offset + offset_wire, y ],
      [ loc.array.right_max + loc.array.offset + offset_wire, loc.array.lower + offset_wire ],
      [ loc.array.left - loc.array.offset + offset_wire, loc.array.lower  + offset_wire ],
      [ loc.array.left - loc.array.offset + offset_wire, loc.DC_jb_box.y],
      //[ loc.DC_jb_box.x , loc.DC_jb_box.y-offset_wire],
    ]);

    // negative home run
    d.layer('DC_neg');
    d.line([
      [ loc.array.left, y],
      [ loc.array.left - loc.array.offset - offset_wire, y ],
      [ loc.array.left - loc.array.offset - offset_wire, loc.array.lower + offset_wire ],
      [ loc.array.left - loc.array.offset - offset_wire, loc.DC_jb_box.y],
      //[ loc.DC_jb_box.x , loc.DC_jb_box.y+offset_wire],
    ]);

    d.line([
      [ loc.array.right[i], y + size.module.h*5/8 ],
      [ loc.array.left - loc.array.offset - size.wire_offset.ground , y + size.module.h*5/8 ],
    ], 'DC_ground');

    y -= size.string.h;
  }



  // DC ground run from array to JB
  d.layer('DC_ground');
  d.line([
    [ loc.array.left - loc.array.offset - size.wire_offset.ground, loc.array.upper + size.module.h*5/8 ],
    [ loc.array.left - loc.array.offset - size.wire_offset.ground, loc.DC_jb_box.y ]
  ]);
  d.layer();


  // DC Junction box
  x = loc.DC_jb_box.x;
  y = loc.DC_jb_box.y;
  w = size.DC_jb_box.w;
  h = size.DC_jb_box.h;
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
  x = loc.DC_jb_box.x;
  y = loc.DC_jb_box.y + size.DC_jb_box.h/2 + 10;
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
  w = 120;
  h = 15;
  x = loc.DC_jb_box.x;
  y = loc.DC_jb_box.y - size.DC_jb_box.h/2 - h;
  d.ellipse([x, y],[w, h],'wire_callout');
  d.line(
    [
      [ x + w/2, y],
      [ x + w/2 + 16, y ]
    ],
    'wire_callout'
  );
  d.text(
    [ x + w/2 + 16 + 10, y ],
    ['(1)'],
    'text',
    'label_center'
  );



  // DC JB to -combiner- inverter
  for( var i in _.range(system.array.num_of_strings)) {
    var offset_wire = size.wire_offset.min + ( size.wire_offset.base * i );

    d.layer('DC_pos');
    d.block( 'terminal', [ loc.DC_jb_box.x + offset_wire , loc.DC_jb_box.y]);
    d.line([
      [ loc.DC_jb_box.x + offset_wire , loc.DC_jb_box.y],
      [ loc.DC_jb_box.x + offset_wire , loc.DC_combiner.y - offset_wire],
    //  [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_combiner.y - offset_wire],
    //]);
    //if( system.array.num_of_strings > 2){
    //  d.block( 'fuse', [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_combiner.y-offset_wire]);
    //} else {
    //  d.block( 'terminal', [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_combiner.y-offset_wire]);
    //  d.line([
    //    [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_combiner.y-offset_wire],
    //    [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l, loc.DC_combiner.y-offset_wire],
    //  ]);
    //}
    //d.line([
    //  [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l, loc.DC_combiner.y-offset_wire],
    //  [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l + size.DC_combiner.fuse_to_bus_spacing, loc.DC_combiner.y-offset_wire],
    //]);
    ////d.block( 'terminal', [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l + size.DC_combiner.fuse_to_bus_spacing, loc.DC_combiner.y-offset_wire]);
    //d.line([
    //  [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l + size.DC_combiner.fuse_to_bus_spacing, loc.DC_combiner.y-offset_wire],
      [ loc.inverter.left_terminal - size.disconect.l , loc.DC_combiner.y-offset_wire],
    ], 'DC_pos');
    d.block( 'terminal', [ loc.inverter.left_terminal -size.disconect.l , loc.DC_combiner.y-offset_wire]);




    // negative home run
    d.layer('DC_neg');
    d.block( 'terminal', [ loc.DC_jb_box.x - offset_wire , loc.DC_jb_box.y]);
    d.line([
      [ loc.DC_jb_box.x - offset_wire , loc.DC_jb_box.y],
      [ loc.DC_jb_box.x - offset_wire , loc.DC_combiner.y + offset_wire],
    //  [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_combiner.y + offset_wire],
    //]);
    //if( system.inverter.tranformerless && system.array.num_of_strings > 2){
    //  d.block( 'fuse', [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_combiner.y + offset_wire]);
    //} else {
    //  d.block( 'terminal', [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_combiner.y + offset_wire]);
    //  d.line([
    //    [ loc.DC_combiner.x - size.DC_combiner.components_width/2, loc.DC_combiner.y + offset_wire],
    //    [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l, loc.DC_combiner.y + offset_wire],
    //  ]);
    //}
    //d.line([
    //  [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l, loc.DC_combiner.y + offset_wire],
    //  [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l + size.DC_combiner.fuse_to_bus_spacing, loc.DC_combiner.y + offset_wire],
    //]);
    ////d.block( 'terminal', [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l + size.DC_combiner.fuse_to_bus_spacing, loc.DC_combiner.y + offset_wire]);
    //d.line([
    //  [ loc.DC_combiner.x - size.DC_combiner.components_width/2 + size.fuse.l + size.DC_combiner.fuse_to_bus_spacing, loc.DC_combiner.y + offset_wire],
      [ loc.inverter.left_terminal - size.disconect.l , loc.DC_combiner.y+offset_wire],
    ], 'DC_neg');
    d.block( 'terminal', [ loc.inverter.left_terminal - size.disconect.l , loc.DC_combiner.y+offset_wire]);



    d.layer();

    x -= size.string.w;
  }

  // DC ground run from JB to combiner
  d.line([
    [ loc.array.left - loc.array.offset - size.wire_offset.ground, loc.DC_jb_box.y ],
    [ loc.array.left - loc.array.offset - size.wire_offset.ground, loc.DC_ground.y],
    [ loc.DC_combiner.x , loc.DC_ground.y],
  ],'DC_ground');
  //d.block( 'terminal', [ loc.DC_combiner.x - size.DC_combiner.components_width/2 , loc.DC_ground.y]);




  // Conduit callout: JB to combiner
  w = 15;
  h = 120;
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
    ['(2)'],
    'text',
    'label_center'
  );




  // DC_combiner
  x = loc.DC_combiner.x;
  y = loc.DC_combiner.y;
  w = size.DC_combiner.w;
  h = size.DC_combiner.h;
  //label = ['COMBINER','BOX'];
  //d.rect(
  //  [x,y],
  //  [w,h],
  //  'box'
  //);
  //d.text(
  //  [ x, y - h/2 - 27],
  //  label,
  //  'text',
  //  'label_center'
  //);

  //var x = x + size.DC_combiner.components_width/2 - size.bus_bar.w/2;
  //d.rect(
  //  [ x, y + (size.wire_offset.min + ( size.wire_offset.base * 5 ))/2 + size.wire_offset.min/2],
  //  [ size.bus_bar.w,      size.wire_offset.min + ( size.wire_offset.base * 5 )                         ],
  //  'DC_neg'
  //);
  //d.rect(
  //  [ x, y - (size.wire_offset.min + ( size.wire_offset.base * 5 ))/2 - size.wire_offset.min/2],
  //  [ size.bus_bar.w,      size.wire_offset.min + ( size.wire_offset.base * 5 )                         ],
  //  'DC_pos'
  //);





  var offset_wire = size.wire_offset.max + ( size.wire_offset.base * 0 );


  d.text(
    [ loc.inverter.left-18 , loc.DC_combiner.y-offset_wire],
    'DC+',
    'text',
    'line_label_left'
  );
  d.text(
    [ loc.inverter.left-18 , loc.DC_combiner.y+offset_wire],
    'DC-',
    'text',
    'line_label_left'
  );
  d.text(
    [ loc.inverter.left-18 , loc.DC_ground.y+size.terminal_diam+1],
    'G',
    'text',
    'line_label_left'
  );


  // DC possative run from combiner to inverter
  //d.line([
  //  [ loc.DC_combiner.x + size.DC_combiner.components_width/2, loc.DC_combiner.y-offset_wire],
  //  [ loc.inverter.left_terminal - size.disconect.l , loc.DC_combiner.y-offset_wire],
  //], 'DC_pos');
  //d.block( 'disconect', [ loc.inverter.left_terminal -size.disconect.l , loc.DC_combiner.y-offset_wire]);


  // DC negative run from combiner to inverter
  //d.line([
  //  [ loc.DC_combiner.x + size.DC_combiner.components_width/2, loc.DC_combiner.y+offset_wire],
  //  [ loc.inverter.left_terminal - size.disconect.l , loc.DC_combiner.y+offset_wire],
  //], 'DC_neg');
  //d.block( 'disconect', [ loc.inverter.left_terminal -size.disconect.l , loc.DC_combiner.y+offset_wire]);

  // DC ground run from DC_combiner to inverter
  d.line([
    [ loc.DC_combiner.x, loc.DC_ground.y],
    [ loc.DC_disconect.x, loc.DC_ground.y],
  ], 'DC_ground');
  //d.block( 'terminal', [ loc.inverter.left_terminal , loc.DC_ground.y]);
  d.line([
    [ loc.DC_disconect.x , loc.DC_ground.y],
    [ loc.inverter.right_terminal , loc.DC_ground.y],
  ], 'DC_ground');
  //d.block( 'terminal', [ loc.inverter.x , loc.DC_ground.y]);







  // Conduit callout: combiner to disconect
  //w = 15;
  //h = 120;
  //x = loc.inverter.left - 42 ;
  //y = loc.inverter.bottom - h/2;
  //d.ellipse([x, y],[w, h],'wire_callout');
  //d.line(
  //  [
  //    [ x, y + h/2],
  //    [ x + 16, y + h/2 + 32 ]
  //  ],
  //  'wire_callout'
  //);
  //d.text(
  //  [ x + 16 + 10, y + h/2 + 32 ],
  //  ['(3)'],
  //  'text',
  //  'label_center'
  //);





  ///////////////////////////////
  //#inverter
  d.section('inverter');

  x = loc.inverter.x;
  y = loc.inverter.y;

  //frame
  d.layer('box');
  d.rect(
    [x,y],
    [size.inverter.w, size.inverter.h]
  );
  // Label at top (Inverter, make, model, ...)
  d.layer('text');
  d.text(
    [loc.inverter.x, loc.inverter.top - 27/2 ],
    [
      'INVERTER',
    ],
    'text',
    'label'
  );
  d.text(
    [loc.inverter.x, loc.inverter.top + size.inverter.text_gap ],
    [
      state.system.inverter.manufacturer_name,
      state.system.inverter.device_model_number
    ],
    'text',
    'label'
  );
  d.layer();

  //#inverter symbol
  d.section('inverter symbol');

  x = loc.inverter.x;
  y = loc.inverter.y + size.inverter.symbol_h/2;

  w = size.inverter.symbol_w;
  h = size.inverter.symbol_h;

  var space = w*1/12;

  // Inverter symbol
  d.layer('box');
  // box
  d.rect(
    [x,y],
    [w, h]
  );
  // diaganal
  d.line([
    [x-w/2, y+h/2],
    [x+w/2, y-h/2],
  ]);
  // DC
  d.line([
    [x - w/2 + space, y - h/2 + space],
    [x - w/2 + space*6, y - h/2 + space],
  ]);
  d.line([
    [x - w/2 + space, y - h/2 + space*2],
    [x - w/2 + space*2, y - h/2 + space*2],
  ]);
  d.line([
    [x - w/2 + space*3, y - h/2 + space*2],
    [x - w/2 + space*4, y - h/2 + space*2],
  ]);
  d.line([
    [x - w/2 + space*5, y - h/2 + space*2],
    [x - w/2 + space*6, y - h/2 + space*2],
  ]);
  // AC

  x = x + 3.5;
  y = y + 3.5;

  d.path(
    'm '+x+','+y+' c 0,5 7.5,5 7.5,0 0,-5 7.5,-5 7.5,0',
    'box'
  );

  d.layer();





  d.section('AC_discconect');

  d.text(
    [loc.AC_disc.x, loc.AC_disc.y - size.AC_disc.h/2 - 45 ],
    [
      'AC DISCONNECT',
      '(OPTIONAL)',
      '60A, 240Vac, Nema 3R'
    ],
    'text',
    'label_center'
  );

  x = loc.AC_disc.x;
  y = loc.AC_disc.y;
  var padding = size.terminal_diam;

  d.layer('box');
  d.rect(
    [x, y],
    [size.AC_disc.w, size.AC_disc.h]
  );
  d.layer();


  //d.circ([x,y],5);



  //#AC load center
  d.section('AC load center');

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
    [ loc.AC_loadcenter.x-10, loc.AC_loadcenter.bottom - 25 - size.terminal_diam*5 ],
    [5,50],
    'box'
  );
  d.rect(
    [ loc.AC_loadcenter.x+10, loc.AC_loadcenter.bottom - 25  - size.terminal_diam*5 ],
    [5,50],
    'box'
  );

  var s, l;
  l = loc.AC_loadcenter.neutralbar;
  s = size.AC_loadcenter.neutralbar;
  d.rect([l.x,l.y], [s.w,s.h], 'AC_neutral' );

  l = loc.AC_loadcenter.groundbar;
  s = size.AC_loadcenter.groundbar;
  d.rect([l.x,l.y], [s.w,s.h], 'AC_ground_block' );
  d.block('ground', [l.x,l.y+s.h/2]);






  // AC lines
  d.section('AC lines');

  x = loc.inverter.right_terminal;
  y = loc.inverter.bottom_right.y;
  y -= size.terminal_diam *2;

  padding = size.terminal_diam;
  //var AC_d.layer_names = ['AC_ground', 'AC_neutral', 'AC_L1', 'AC_L2', 'AC_L2'];

  var x_terminal = x;
  for( var i=0; i < system.inverter.num_conductors; i++ ){
    x = x_terminal;
    var line_name = system.inverter.conductors[i];
    d.block('terminal', [x,y] );
    d.layer('AC_'+line_name);
    // TODO: add line labels
    line_labels = {
      'L1': 'L1',
      'L2': 'L2',
      'L3': 'L3',
      'neutral': 'N',
      'ground': 'G',
    };
    d.text(
      [x+10,y-size.terminal_diam],
      line_labels[line_name],
      'text',
      'line_label_left'
    );
    d.line([
      [x, y],
      [ loc.AC_disc.left + ( size.AC_disc.w - size.disconect.l )/2, y ]
    ]);
    x = loc.AC_disc.left + ( size.AC_disc.w - size.disconect.l )/2; // move to start of disconect
    if( ['ground', 'neutral'].indexOf(line_name)+1 ){
      d.line([
        [ x, y ],
        [ x + size.disconect.l, y ]
      ]);
    } else {
      d.block('disconect', {
        x: x,
        y: y
      });
    }
    d.line([
      [ x + size.disconect.l, y ],
      [ loc.AC_disc.right, y ]
    ]);
    d.line([
      [ loc.AC_disc.right, y ],
      [ loc.AC_loadcenter.left, y ]
    ]);

    x = loc.AC_loadcenter.left;
    if( line_name === 'ground' ){
      d.line([
        [ x, y ],
        [ loc.AC_loadcenter.groundbar.x - size.AC_loadcenter.groundbar.w/2, y ]
      ]);
    } else if( line_name === 'neutral' ){
      d.line([
        [ x, y ],
        [ loc.AC_loadcenter.neutralbar.x - size.AC_loadcenter.neutralbar.w/2, y ]
      ]);
    } else if( line_name === 'L1' ){
      d.line([
        [ x, y ],
        [ loc.AC_loadcenter.x-10 -5/2, y ]
      ]);
    } else if( line_name === 'L2' ){
      d.line([
        [ x, y ],
        [ loc.AC_loadcenter.x+10 -5/2, y ]
      ]);
    }
    /*
    */
    y -= size.terminal_diam *2;
    d.layer();
  }



  // Conduit callout: inverter to AC diconect
  x = loc.inverter.right + 30;
  y = loc.AC_disc.y + size.AC_disc.h/2 - 60/2;
  d.ellipse(
    [x, y],
    [10, 60],
    'wire_callout'
  );
  d.line(
    [
      [ x,      y + 60/2],
      [ loc.AC_disc.x - 15 , y + 60/2 + 30 ]
    ],
    'wire_callout'
  );
  d.text(
    [ loc.AC_disc.x , y + 60/2 + 30 ],
    [
      //'(4)'
      '(3)'
    ],
    'text',
    'label_center'
  );

  // Conduit callout: AC diconect to load center
  x = ( (loc.AC_disc.x + size.AC_disc.w/2) + (loc.AC_loadcenter.x - size.AC_loadcenter.w/2) )/2 ;
  y = loc.AC_disc.y + size.AC_disc.h/2 - 60/2;
  d.ellipse(
    [x, y],
    [10, 60],
    'wire_callout'
  );
  d.line(
    [
      [ x,                 y + 60/2],
      [ loc.AC_disc.x + 15 , y + 60/2 + 30 ]
    ],
    'wire_callout'
  );




  // Wire table
  d.section('Wire table');

  ///*

  x = loc.wire_table.x;
  y = loc.wire_table.y;









  ////////////////////////
  // circuit table

  d.text(
    [ x + 3 , y - 10 ],
    [
      'CIRCUIT SCHEDULE'
    ],
    'text',
    'label_left'
  );

  var circuit_names = [
    'exposed source circuit wiring',
    'pv dc source circuits',
    'inverter ac output circuit',
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

    var size;
    var size0 = circuit_parameters[circuit_parameter_name].top.length * font_letter_width;
    var size1 = circuit_parameters[circuit_parameter_name].bottom.length * font_letter_width;
    if( size0 > size1 ) { size = size0; }
    else { size = size1; }
    size += text_cell_size_fixed;

    circuit_parameter_labels[circuit_parameter_name] = [
      size,
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
  var t = d.table(n_rows,n_cols).loc(x,y);
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

  t.cell(1,2).font('table_col_title').text('CIRCUIT');
  t.cell(1,2).border('B', false);
  t.col_size(2, 165);

  // variable columns
  circuit_parameter_list.forEach(function(circuit_parameter_name, i){

    var size = circuit_parameter_labels[circuit_parameter_name][0];
    var label = circuit_parameter_labels[circuit_parameter_name][1];
    t.cell(1,i+3).border('B', false);
    t.col_size(i+3, size);
    t.cell(1,i+3).font('table_col_title').text(label[0]);
    t.cell(2,i+3).font('table_col_title').text(label[1]);
  });

  //logger.info(t.cells);
  t.mk();





  return d;
};

module.exports = mk_page;
