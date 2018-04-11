var mk_page = function(settings){
  var state = settings.state;
  var system = settings.state.system;

  var data_to_display = state.db_info_tables;

  var f = settings.f;

  var d = settings.f.Drawing(settings.drawing_settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var top = size.sheet.frame_padding + size.tables.table_spacing;
  var x_ca = size.sheet.frame_padding + size.tables.table_spacing/2;
  var x_cb = settings.drawing_settings.size.sheet.w/2 + size.sheet.frame_padding ;
  var y_ca = top;
  var y_cb = top;

  var x = x_ca;
  var y = y_ca;

  var text_cell_size_fixed = size.tables.text_cell_size_fixed;
  var font_letter_width = size.tables.font_letter_width;



  data_to_display = state.system_requirements;

  x = x_ca;
  y = Math.max( y_ca, y_cb );



  d.layer('table');

  var col_widths = [null,
    size.sheet.w*0.487,
    size.sheet.w*0.487
  ];

  for( var section_name in data_to_display ){
    var section = data_to_display[section_name];

    var n = Object.keys(section).length;

    var n_rows = section.length;
    var n_cols = 2;  //section[0].length;
    var table_spacing = size.tables.table_spacing;

    var row_height = size.tables.row_height;
    var table_width_min = 0;

    var t = d.table(n_rows,n_cols);
    t.row_size('all', row_height);
    t.all_cells().forEach(function(cell){
      cell.font('table_left_calc').border('all');
    });


    for( var r = 1; r <= section.length; r++ ){
      if(section[r-1].length === 1){
        t.cell(r,1).text( section[r-1][0] );
        for( var c = 1; c <= 2; c++ ){
          t.cell(r,c).font('table_subtitle').border('L',false);
        }
        t.cell(r,1).border('L',true);
        table_width_min = Math.max( table_width_min, section[r-1][0].length  * font_letter_width + text_cell_size_fixed );
      } else if(section[r-1][1] === '' ){
        t.cell(r,1).text( section[r-1][0] );
        for( var c = 1; c <= 2; c++ ){
          t.cell(r,c).font('table_note').border('L',false);
        }
        t.cell(r,1).border('L',true);
        table_width_min = Math.max( table_width_min, section[r-1][0].length  * font_letter_width + text_cell_size_fixed );
      } else {
        for( var c = 1; c <= section[r-1].length; c++ ){

          var max_characters = Math.ceil( ( col_widths[c] / font_letter_width + text_cell_size_fixed  ) * 0.95 );
          var cell_content = f.split_string_by_length( section[r-1][c-1], max_characters);

          t.cell(r,c).text( cell_content );
          //if(section[r-1][c-1].length){
          //  col_widths[c] = col_widths[c] || 0;
          //  col_widths[c] = Math.max(col_widths[c], section[r-1][c-1].length * font_letter_width + text_cell_size_fixed );
          //}
        }
      }
    }


    if(col_widths.length){
      var table_width = col_widths.reduce((a,c)=>a+c);
    }
    //var comment_table_ratio = table_width_min / table_width;
    //table_width = Math.max( table_width, table_width_min );

    col_widths.forEach(function(cw,i){
      //if(comment_table_ratio>1){
      //  cw *= comment_table_ratio;
      //}
      t.col_size(i, cw);
    });


    t.loc(x,y);
    d.text( [x+row_height, y-row_height*1/2], f.pretty_name(section_name),'table', 'table_col_title_left' );

    //for( var c=1; c<=n_cols; c++){
    //  t.cell(1,c).font('table_col_title_left');
    //}
    t.border_layer('border_light');

    t.mk();

    var table_height = t.height();
    y += table_height + table_spacing;
  }

  d.layer();






  return d;
};

module.exports = mk_page;
