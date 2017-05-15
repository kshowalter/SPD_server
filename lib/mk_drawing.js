var mk_sheet = require('./mk_sheet');

var mk_drawing = function(settings){
  var f = settings.f;
  var array = settings.state.system.array;

  settings.drawing_settings.size.wire_offset.max = settings.drawing_settings.size.wire_offset.min +
                                                   settings.state.system.array.num_of_strings *
                                                   settings.drawing_settings.size.wire_offset.base;
  settings.drawing_settings.size.wire_offset.ground = settings.drawing_settings.size.wire_offset.max +
                                                      settings.drawing_settings.size.wire_offset.base*1;
  //settings.drawing_settings.loc.array.left = settings.drawing_settings.loc.array.right
  //                                          - ( settings.drawing_settings.size.string.w * settings.state.system.array.num_of_strings );
  //                                          //- ( settings.drawing_settings.size.module.frame.w*3/4 );
  settings.drawing_settings.loc.array.upper = settings.drawing_settings.loc.array.lower -
                                            ( settings.drawing_settings.size.string.h *
                                              settings.state.system.array.num_of_strings );


  var max_displayed_modules = 20;
  settings.drawing.break_string = false;
  settings.drawing.displayed_modules = [];
  settings.drawing_settings.size.string.w = [];
  settings.drawing.break_string[i] = [];
  settings.drawing_settings.loc.array.right = [];
  settings.drawing_settings.loc.array.right_max = 0;

  //settings.state.system.array.num_of_modules
  //settings.state.system.array.num_of_strings
  //settings.state.system.array.smallest_string
  //settings.state.system.array.largest_string

  var max_modules = array.largest_string * (array.num_of_strings-1) + array.smallest_string;
  var min_modules = array.smallest_string * (array.num_of_strings-1) + array.largest_string;


  if( settings.state.system.array.num_of_strings === 1 ){
    settings.drawing.displayed_modules[0] = settings.state.system.array.largest_string;
  } else if( settings.state.system.array.num_of_strings === 2 ){
    settings.drawing.displayed_modules[0] = settings.state.system.array.smallest_string;
    settings.drawing.displayed_modules[1] = settings.state.system.array.largest_string;
  } else if( settings.state.system.array.num_of_strings === 3 ){
    var middle_string_number = settings.state.system.array.num_of_modules - settings.state.system.array.largest_string - settings.state.system.array.smallest_string;
    settings.drawing.displayed_modules[0] = settings.state.system.array.smallest_string;
    settings.drawing.displayed_modules[1] = middle_string_number;
    settings.drawing.displayed_modules[2] = settings.state.system.array.largest_string;
  } else if( settings.state.system.array.num_of_strings >= 4){
    for( var i in _.range(settings.state.system.array.num_of_strings)) {
      settings.drawing.displayed_modules[i] = array.largest_string;
    }
    settings.drawing.displayed_modules[0] = array.smallest_string;

    var num_modules_to_remove = max_modules - settings.state.system.array.num_of_modules;
    var i = 1;
    while( num_modules_to_remove > 0 ){
      settings.drawing.displayed_modules[i]--;
      i++;
      if( i === (array.num_of_strings-1) ){
        i = 1;
      }

      num_modules_to_remove--;
    }
  }

  settings.drawing.displayed_modules.forEach(function(displayed_modules, i){
    if( settings.drawing.displayed_modules[i] > max_displayed_modules ){
      settings.drawing.displayed_modules[i] = max_displayed_modules - 1;
      settings.drawing.break_string[i] = true;
    }
    var width = settings.drawing_settings.size.module.w * displayed_modules;
    settings.drawing_settings.loc.array.right[i] = settings.drawing_settings.loc.array.left + width;
    if( width > settings.drawing_settings.size.string.w ){
      settings.drawing_settings.size.string.w = width;
      settings.drawing_settings.loc.array.right_max = settings.drawing_settings.loc.array.left + settings.drawing_settings.size.string.w;
    }
  });


  // Make blocks
  f.mk_blocks(settings);

  // Make drawing

  settings.drawing_settings.sheets = [];
  if( settings.state.system.config.system_type === 'string' ){
    settings.drawing_settings.sheets.push(
      {
        sheet_id: 'W-001_string',
        num: 'W-001',
        desc: 'Wiring Diagram'
      }
    );
  } else if( settings.state.system.config.system_type === 'micro' ){
    settings.drawing_settings.sheets.push(
      {
        sheet_id: 'W-001_micro',
        num: 'W-001',
        desc: 'Wiring Diagram'
      }
    );
  }
  settings.drawing_settings.sheets.push(
    {
      sheet_id: 'W-002',
      num: 'W-002',
      desc: 'System Specifications'
    }
  );
  settings.drawing_settings.sheets.push(
    {
      sheet_id: 'L-001',
      num: 'L-001',
      desc: 'Label Requirements'
    }
  );



  var i, p;
  settings.drawing.parts = {};
  settings.drawing.svgs = [];
  settings.drawing_settings.sheets.forEach(function(sheet_info, i){
    p = i+1;
    settings.drawing.parts[p] = mk_sheet(settings, sheet_info);
    settings.drawing.svgs.push(f.mk_svg(settings.drawing.parts[p], settings));
  });

  settings.report.parts = {};
  settings.report.svgs = [];
  settings.report_settings.pages.forEach(function(sheet_info, i){
    p = i+1;
    settings.report.parts[p] = mk_report_page(settings, sheet_info);
    settings.report.svgs.push(
      f.mk_svg(settings.report.parts[p], settings)
    );
  });

  /*

  // Convert svgs to strings for storage
  svgs_strings = [];
  system_settings.drawing.svgs.forEach(function(svg){
    svgs_strings.push(svg.outerHTML);
  });
  // Store svg strings
  User_systems.upsert(
    {system_id:system_id},
    {$set:
      {svgs:[]}
    }
  );
  User_systems.update(
    {system_id:system_id},
    {$push:
      {svgs:
        { $each: svgs_strings }
      }
    }
  );

  */


  return settings;
};

module.exports = mk_drawing;
