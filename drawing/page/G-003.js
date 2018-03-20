var mk_page = function(settings){
  var state = settings.state;

  var data_to_display = state.calculation_tables;

  var f = settings.f;

  var d = settings.f.Drawing(settings.drawing_settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x = size.sheet.frame_padding*6;

  var top = size.sheet.frame_padding*6 +10;
  var y = top;

  var text_cell_size_fixed = 20;
  var font_letter_width = 4.1;

  d.layer('table');


  for( var section_name in data_to_display ){
    var section = data_to_display[section_name];

    var n = Object.keys(section).length;

    var n_rows = section.length;
    var n_cols = section[0].length;
    var table_spacing = 30;

    var row_height = 15;
    var col_widths = [];
    var table_width_min = 0;

    var t = d.table(n_rows,n_cols);
    t.row_size('all', row_height);
    t.all_cells().forEach(function(cell){
      cell.font('table_left').border('all');
    });

    for( var r = 1; r <= section.length; r++ ){
      if(section[r-1].length === 1){
        t.cell(r,1).text( section[r-1][0] );
        for( var c = 1; c <= section[0].length; c++ ){
          t.cell(r,c).font('table_note').border('L',false);
        }
        t.cell(r,1).border('L',true);
        table_width_min = Math.max( table_width_min, section[r-1][0].length  * font_letter_width + text_cell_size_fixed );
      } else {
        for( var c = 1; c <= section[r-1].length; c++ ){
          t.cell(r,c).text( section[r-1][c-1] );
          if(section[r-1][c-1].length){
            col_widths[c] = col_widths[c] || 0;
            col_widths[c] = Math.max(col_widths[c], section[r-1][c-1].length * font_letter_width + text_cell_size_fixed );
          }
        }
      }
    }


    if(col_widths.length){
      var table_width = col_widths.reduce((a,c)=>a+c);
    }
    var comment_table_ratio = table_width_min / table_width;
    table_width = Math.max( table_width, table_width_min );

    col_widths.forEach(function(cw,i){
      if(comment_table_ratio>1){
        cw *= comment_table_ratio;
      }
      t.col_size(i, cw);
    });

    var table_height = n_rows*row_height;
    if( ( y+table_height+table_spacing) > ( settings.drawing_settings.size.sheet.h * 0.9 ) ) {
      y = top;
      x += table_width*1.1;
    }
    t.loc(x,y);
    d.text( [x+table_width/2, y-row_height*2/3], f.pretty_name(section_name),'table' );

    for( var c=1; c<=n_cols; c++){
      t.cell(1,c).font('table_col_title_left');
    }
    t.border_layer('border_light');

    t.mk();

    y += table_height + table_spacing;
  }

  d.layer();

  return d;
};

module.exports = mk_page;
