var mk_page = function(settings){
  var state = settings.state;

  var f = settings.f;

  d = settings.f.Drawing(settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  x = size.sheet.frame_padding*6;

  var top = size.sheet.frame_padding*6 +10;
  y = top;

  d.layer('table');

  var col_widths = [
    null,
    125,
    155
  ];
  var table_width = col_widths[1] + col_widths[2];

  for( var section_name in state.system_display ){
    var section = state.system_display[section_name];

    var n = Object.keys(section).length;

    var n_rows = n+0;
    var n_cols = 2;
    var table_spacing = 30;

    var row_height = 15;
    table_height = n_rows*row_height;

    if( (y+table_height+table_spacing) > ( settings.drawing_settings.size.sheet.h * 0.9 ) ) {
      y = top;
      x += table_width*1.1;
    }

    d.text( [x+table_width/2, y-row_height*2/3], f.pretty_name(section_name),'table' );

    var t = d.table(n_rows,n_cols).loc(x,y);
    t.row_size('all', row_height).col_size(1, col_widths[1]).col_size(2, col_widths[2]);

    var r = 1;
    for( var value_name in section ){
      var label = settings.info.inputs[section_name] &&
          settings.info.inputs[section_name][value_name] &&
          settings.info.inputs[section_name][value_name].label;
      var parameter_name = label || f.pretty_name(value_name);
      t.cell(r,1).text( parameter_name );

      t.cell(r,2).text( state.system_display[section_name][value_name] );
      r++;

    }

    t.all_cells().forEach(function(cell){
      cell.font('table').border('all');
    });

    t.mk();

    y += table_height + table_spacing;
  }

  d.layer();

  return d;
};

module.exports = mk_page;
