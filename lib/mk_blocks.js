var mk_blocks = function(settings){
  var f = settings.f;
  var state = settings.state;
  //logger.info("** Making blocks");
  var d = f.Drawing(settings);


  var system = state.system;

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;




  var x, y, h, w, l;
  var offset;

  // Define d.blocks





    //#inverter symbol
    d.block_start('microinverter');

    x = 0;
    y = 0;

    w = size.microinverter.w;
    h = size.microinverter.h;

    var space_w = w*1/7;
    var space_h = w*1/6;

    // Inverter symbol
    d.layer('box');
    // box
    d.rect(
      [x,y],
      [w, h]
    );
    // diaganal
    d.line([
      [x-w/2, 0],
      [x+w/2, 0],
    ]);
    // DC
    d.line([
      [x - w/2 + space_w, y - h/2 + space_h],
      [x - w/2 + space_w*6, y - h/2 + space_h],
    ]);
    d.line([
      [x - w/2 + space_w, y - h/2 + space_h*2],
      [x - w/2 + space_w*2, y - h/2 + space_h*2],
    ]);
    d.line([
      [x - w/2 + space_w*3, y - h/2 + space_h*2],
      [x - w/2 + space_w*4, y - h/2 + space_h*2],
    ]);
    d.line([
      [x - w/2 + space_w*5, y - h/2 + space_h*2],
      [x - w/2 + space_w*6, y - h/2 + space_h*2],
    ]);
    // AC
    var curve_factor_w = w*2.5/7;
    var curve_factor_h = h*1/5;
    x = x - w/2 + space_w;
    y = y + h/4;

    var path_string = 'm '+x+' '+y+' c ';
    var path_array = [
       '0 '+curve_factor_h,
       curve_factor_w+' '+curve_factor_h,
       curve_factor_w+' 0',
       '0 -'+curve_factor_h,
       curve_factor_w+' -'+curve_factor_h,
       curve_factor_w+' 0'
    ];
    path_string += path_array.join(', ');

    d.path(
      path_string,
      'box'
    );

    d.layer();
    d.block_end();






  // Module
  d.block_start('module');

  x = 0;
  y = 0;
  w = size.module.frame.w;
  h = size.module.frame.h;
  var jb = {
    x: x + size.module.w/2,
    y: y,
    w: w*0.2,
    h: w*0.2
  };

  d.layer('module');

  // JB
  x = jb.x;
  d.rect( [x,y], [jb.w, jb.h] );
  // frame
  y += h*1/3;
  d.rect( [x,y], [w,h] );

  y = 0;

  // leads
  d.layer('DC_neg');
  //d.layer('DC_pos');
  d.line([
    [ x-(w*0.2)/3, y ],
    [ x-w/2-size.module.lead, y ]
  ]);
  d.layer('DC_neg');
  d.line([
    [ x+(w*0.2)/3, y ],
    [ x+w/2+size.module.lead, y ]
  ]);
  // pos sign
  d.layer('text');
  d.text(
    [ x + (w*0.2), y + 5 ],
    '+',
    null,
    'signs'
  );
  // neg sign
  d.text(
    [ x - (w*0.2), y + 5 ],
    '-',
    null,
    'signs'
  );

  // ground
  /*
  d.layer('DC_ground');
  d.line([
    [x-w/2+5, y],
    [x-w/2+5, y+h+size.module.lead*2],
  ]);
  //*/

  d.layer();
  d.block_end();





  // connector
  d.block_start('connector');
  d.layer('AC_connector');
  x = 0;
  y = 0;
  w = size.connector.w;
  h = size.connector.h;

  var path_string = 'M '+(x-w/4)+' '+(y+h/2)+' ';
  path_string += 'L '+ (x+w/4) +' '+(y+h/2)+' ';
  path_string += 'C '+(x+w/2)+' '+(y+h/2)+', '+(x+w/2)+' '+(y-h/2)+', '+(x+w/4)+' '+(y-h/2)+' ';
  path_string += 'L '+ (x-w/4) +' '+(y-h/2)+' ';
  path_string += 'C '+(x-w/2)+' '+(y-h/2)+', '+(x-w/2)+' '+(y+h/2)+', '+(x-w/4)+' '+(y+h/2)+' ';
  d.path(path_string);
  d.line([
    [ x, y+h/2 ],
    [ x, y-h/2 ],
  ]);

  d.layer();
  d.block_end();









  // Module, microinverter
  d.block_start('module microinverter');

  x = 0;
  y = 0;
  w = size.module.frame.w;
  h = size.module.frame.h;
  var jb = {
    w: w*0.45,
    h: w*0.25
  };

  d.layer('module');

  x = size.module.w/2,

  // frame
  y = h*1/2;
  d.rect( [x,y], [w,h] );

  // JB
  y = jb.h*0.8;
  d.rect( [x,y], [jb.w, jb.h] );
  d.layer('text');
  d.text(
    [ x + jb.w/4, y],
    '+',
    null,
    'signs'
  );
  // neg sign
  d.text(
    [ x - jb.w/4, y],
    '-',
    null,
    'signs'
  );

  y += jb.h/2;

  // leads
  d.layer('DC_neg');
  d.line([
    [ x - jb.w/4, y ],
    [ x - jb.w/4, h/2-size.microinverter.h/2 ],
  ]);
  d.layer('DC_pos');
  d.line([
    [ x + jb.w/4, y ],
    [ x + jb.w/4, h/2-size.microinverter.h/2 ],
  ]);


  y = h/2;
  d.block('microinverter', [x,y]);

  y += size.microinverter.h/2;
  // microinverter cables
  d.layer('AC_cable');
  //d.line([
  //  [ x + size.microinverter.w/2, y ],
  //  [ x + size.module.w/2, y ],
  //]);
  var cable_l = size.module.w/2 - size.microinverter.w/2
  d.line([
    [ x, y ],
    [ x, y + cable_l*0.3 ],
  ]);
  d.block('connector', [ x, y + cable_l*0.5  ]).rotate(90);
  d.line([
    [ x, y + cable_l*0.7  ],
    [ x, y + cable_l*1.0  ],
  ]);
  // pos sign

  // ground
  /*
  d.layer('DC_ground');
  d.line([
    [x-w/2+5, y],
    [x-w/2+5, y+h+size.module.lead*2],
  ]);
  //*/

  d.layer();
  d.block_end();





  // Module string
  d.block_start('string');

  x = 0;
  y = 0;
  w = size.module.frame.w;
  h = size.module.frame.h;
  for( var r=0; r<settings.drawing.displayed_modules; r++){
    d.block('module', [x,y]);
    x += size.module.w;
  }

  if( settings.drawing.break_string ) {
    d.line(
      [
        [x,y],
        [x+size.string.gap_missing,y],
      ],
      'DC_intermodule'
    );
    x += size.string.gap_missing;
    d.block('module', [x,y]);
  }


  //TODO: add loop to jump over negative return wires
  //d.layer('DC_ground');
  //d.line([
  //  [x-size.module.frame.w*3/4, y+size.module.h/2],
  //  [x-size.module.frame.w*3/4, y+size.string.h_max + size.DC_wire_offset.ground],
  //  //[x-size.module.frame.w*3/4, y+size.string.h + size.DC_wire_offset.ground ],
  //]);

  d.layer();
  d.block_end();












  // terminal
  d.block_start('terminal');
  x = 0;
  y = 0;

  d.layer('terminal');
  d.circ(
    [x,y],
    size.terminal_diam/2
  );
  d.layer();
  d.block_end();





  // fuse
  d.block_start('fuse');
  x = 0;
  y = 0;
  l = size.fuse.l;
  w = size.fuse.w;

  d.layer('base');

  d.block('terminal', [x, y] );

  d.line( [
    [x,y],
    [x+l/8, y]
  ]);
  x += l*1/8;

  x += l*3/8;
  d.rect(
    [x,y],
    [l*6/8,w]
  );
  d.line( [
    [x-l*7/32, y-w/2],
    [x-l*7/32, y+w/2]
  ]);
  d.line( [
    [x+l*7/32, y-w/2],
    [x+l*7/32, y+w/2]
  ]);
  x += l*3/8;

  d.line( [
    [x,y],
    [x+l/8, y]
  ]);
  x += l/8;

  d.block('terminal', [x, y] );

  d.layer();
  d.block_end();





  // Disconect
  d.block_start('disconect');
  x = 0;
  y = 0.1;

  d.layer('base');

  d.block('terminal', [x, y] );

  d.line( [
    [x,y],
    [x+size.disconect.l/4, y]
  ]);

  x = x + size.disconect.l*1/4;

  //switch
  d.line( [
    [x,y],
    [x+size.disconect.l/2 *5/6, y-size.disconect.l/2 *1/3]
  ]);

  x = x + size.disconect.l*1/2;
  d.line( [
    [x,y],
    [x+size.disconect.l/4, y]
  ]);

  d.block('terminal', [size.disconect.l, y] );

  d.layer();
  d.block_end();



  // circuit breaker
  d.block_start('circuit_breaker');
  d.layer('base');
  x = 0;
  y = 0;
  w = size.circuit_breaker.w;
  h = size.circuit_breaker.h;

  d.block('terminal', [x-w/2, y] );
  d.block('terminal', [x+w/2, y] );

  var path_string = 'M '+(x-w/2)+' '+(y-h/2)+' ';
  path_string += 'C '+(x-w/2)+' '+(y-h)+', '+(x+w/2)+' '+(y-h)+', '+(x+w/2)+' '+(y-h/2)+' ';
  d.path(path_string);

  d.layer();
  d.block_end();




  // ground symbol
  d.block_start('ground');
  x = 0;
  y = 0;

  d.layer('AC_ground_block');
  d.line([
    [x,y],
    [x,y+40],
  ]);
  y += 25;
  d.line([
    [x-7.5,y],
    [x+7.5,y],
  ]);
  y += 5;
  d.line([
    [x-5,y],
    [x+5,y],
  ]);
  y += 5;
  d.line([
    [x-2.5,y],
    [x+2.5,y],
  ]);
  d.layer();

  d.block_end();



  // North arrow
  x = 0;
  y = 0;

  var arrow_h = 50;
  var arrow_w = 7;
  var head_h = 14;

  d.block_start('north arrow_up');
  d.layer('north_letter');
  d.line([
    [x,         y-arrow_h/2+head_h],
    [x,         y-arrow_h/2       ],
    [x+arrow_w, y-arrow_h/2+head_h],
    [x+arrow_w, y-arrow_h/2       ],
  ]);
  d.layer('north_arrow');
  d.line([
    [x, y-arrow_h/2],
    [x, y+arrow_h/2],
  ]);
  d.line([
    //[x-arrow_w, y-arrow_h/2+head_h],
    [x,         y-arrow_h/2       ],
    [x+arrow_w, y-arrow_h/2+head_h],
  ]);
  d.layer();
  d.block_end('north arrow_up');



  //*/
  /// Slope arrow

  x = 0;
  y = 0;

  var arrow_h = 50;
  var arrow_w = 7;
  var head_h = 14;

  d.block_start('slope_arrow_down');

  d.text(
    [x+arrow_w*2,y],
    'DOWN SLOPE',
    'base'
  ).rotate(-90);

  d.layer('north_arrow');
  d.line([
    [x, y-arrow_h/2],
    [x, y+arrow_h/2],
  ]);
  d.line([
    [x-arrow_w/2, y+arrow_h/2-head_h],
    [x,           y+arrow_h/2       ],
    [x+arrow_w/2, y+arrow_h/2-head_h],
  ]);
  d.layer();
  d.block_end('slope_arrow_down');





  //////////
  /// simple_house

  d.block_start('simple_house');
  d.layer('site_map');

  w = 150;
  h = 100;

  // building
  d.rect(
    [x,y],
    [w,h]
  );
  // ridge line
  d.line([
      [x-w/2,y],
      [x+w/2,y],
    ]
  );
  d.text(
    [ x, y-5 ],
    'ridge line',
    'base'
  );

  // down slope arrow
  d.block( 'slope_arrow_down', {
    x: x + w*1/2 + 10,
    y: y + h/4
  }); //.rotate(rotations[state.system.roof.side_of_building]);

  // array rectagle
  var array_w = w/2;
  var array_h = h/4;
  y += h/4;

  d.rect(
    [x,y],
    [array_w,array_h]
  );

  // module lines
  // horizontal
  d.line([
      [x-array_w/2,y],
      [x+array_w/2,y],
    ]
  );
  // vert
  d.line([
      [x-array_w/4, y-array_h/2],
      [x-array_w/4, y+array_h/2],
    ]
  );
  d.line([
      [x, y-array_h/2],
      [x, y+array_h/2],
    ]
  );
  d.line([
      [x+array_w/4, y-array_h/2],
      [x+array_w/4, y+array_h/2],
    ]
  );



  d.layer();
  d.block_end('simple_house');
  //*/



  //////////
  /// road

  d.block_start('road');
  d.layer('site_map');

  w = 250;
  h = 25;

  d.line([
      [x-w/2,y+h/2],
      [x+w/2,y+h/2],
    ]
  );
  d.line([
      [x-w/2,y],
      [x+w/2,y],
    ],
    'road_center'
  );
  d.line([
      [x-w/2,y-h/2],
      [x+w/2,y-h/2],
    ]
  );

  d.layer();
  d.block_end('road');
  //*/




  return d;
};

module.exports = mk_blocks;
