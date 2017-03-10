var mk_sheet = require('./mk_sheet');

var mk_drawing = function(settings){
  var f = settings.f;

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

  if( settings.state.system.array.num_of_modules > max_displayed_modules ){
    settings.drawing.displayed_modules = max_displayed_modules - 1;
    settings.drawing.break_string = true;
    settings.drawing_settings.size.string.w = (settings.drawing_settings.size.module.w * (settings.drawing.displayed_modules+1) ) + settings.drawing_settings.size.string.gap_missing;
  } else {
    settings.drawing.displayed_modules = settings.state.system.array.num_of_modules;
    settings.drawing_settings.size.string.w = (settings.drawing_settings.size.module.w * settings.drawing.displayed_modules);
  }
  //if( settings.drawing.displayed_modules === 1 ) {
  //  size.string.w = (size.module.w * 2);
  //}
  //loc.array.lower = loc.array.upper + size.string.h;
  //size.string.h_max = (size.module.h * max_displayed_modules) + size.string.gap_missing;
  //loc.array.lower_limit = loc.array.upper + size.string.h;
  settings.drawing_settings.loc.array.right = settings.drawing_settings.loc.array.left + settings.drawing_settings.size.string.w;




  // Make blocks
  f.mk_blocks(settings);

  // Make drawing
  var i, p;
  settings.drawing.parts = {};
  settings.drawing.svgs = [];
  settings.drawing_settings.sheets.forEach(function(sheet_info, i){
    p = i+1;
    settings.drawing.parts[p] = mk_sheet(settings, sheet_info);
    settings.drawing.svgs.push(
      f.mk_svg(settings.drawing.parts[p], settings)
    );
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
