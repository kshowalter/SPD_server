//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

/*
var fsec_logo_b64 =  'data:image/gif;base64,R0lGODlhXABcANUAAIWRZU9kdyZDhWp7bneGaru+U3CDtkFZfDROgKm109/f3/z8/NbW1lxvojpTluTfRcDCx1xvc66zV9bUSsnJTqCnXJOcYOzs7PHz+ERdoLjB2+/v793f5H6PvfLy8vLrQRk4iszMzP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABcAFwAAAb/QJFwSCwaj8ikcslsOp/QqHRKrVqv2Kx2yz12Et1w2AACgcXoK7lsTrula3b7TV/G5fO6nnjH5/d1fX5/gGmCg4SFXYeIiYpZjI2Oj1WRkpOUUZaXmJlNm5ydnkmgoaKjRaWmp6gioAJ4CCCwiGetSJYIASAEeAAgA5K2t3ycvxZ4FgK/wsTFfrRsEiAVcggAA7tyEX7DrYKwzGwAEQXaIAAAEucgAcHsrHqHAwcBvWwWFgAFZQIPAw/OCeBH4EC3b40kHCgQrAwFhh8kAKDwIcCHewIoDBhw76CnXBQOfACAgMCHAgI+qPwwwWLAAA8PTGhGCVQFiStPgpCwMlvO/wcyO9Z6dAjegIoVVvJD8OADhTI5BwCoiIdAtDLe6DCSGi2CzqQfkIEoSWvCh38gmhosE6DCVTZZDQ0SYIHeBAABIjT9IMvdtQIFHkooGACWRacRCAQWMECZxzeWFJfLSRVBAco5C8iamtMCTG5D3YA68AAbRZUHjmLGTEB1xAAWgF6Kq0WVSZSpI7heTdlCPQEZP4CeLUYVVJ0gvPLm3fDyTFO0K60CIVLlAH/LeT9gvFKWtUbR4Vyypw9A7JXpsi+vwPkse3V4aaoxxbhCgaYTJGBXv/oBAgl7FVDBdaGE90koUklQwGDetcPfcsMdQICCEjUkn3jT/adSAQa19/8gZb8EYFZYDRY4RQLTyWGSShF4+OFKFSh3UYpYTWGcHIeN5OKLJ7UHzyoa2JhicE4twyOIB5xGwVuhZIABFaowZtZdsKx4pEr3AGBWaSVe4qQVmxCQDza6FEbdlSsZVKY76VggFCJfWnFBA5xEUMGIKrWEJ48T6JXTBDE2+aScIYRAJyKJRRCAO5ephA2aja2k0aItroWIAxxccUGhhR7KSUqogdDoi08dtt0qDkAQwgVVbMppp6GA2hBTL/pXRlLPhZIqp6xK4cGrr3raSFLBtEhAAHupF1A61yUljiS7vtprFAoAy6mwfljQ0gB4EmCZeppZ+QABell4qarWbjD/RbXWGjrIf96ettI9A8ibk0Zl7HbSAQC4dW67DCxABbvWYktWBBQAcIAAPPHFyzoItJhOBAgsBIAA1VXDWEgCWOVHtMAGbAXBwGILzMVsWIRSo89FIAFoSgpgVjR0mcsGyK+KfAXJwcohADwWBdCwSmOpZGtmXllaRpcg4MypzljwfK0kFrDH0l47wQhCnhTt8+wgThcKdRZSwzoXhzPKzNdPW/OTHFATMHkzuiEL3EXZ7vpRwQEDskHABEdZlRSyHfHN77/Wjs0F3tgecMA1OEo0TRkFqMMOSfR8THfOdqPBuB9vJqZQym4OV8abZYQdguJifC4JSdXIIQHkl6jOtLrn7eaNyC9v/vK15gB3XofrgxgEj0Fyzx28IsTTCPbmTwsPSPPOK5+49IVQ77zt2DOfu8nTcX+L9qaITwz5tUMvdvejoI943c4Q4T4e5sc/xPypq786+87MX7/9RUDf/wAYwO8B73oEVELzBphAI7iOgQ104PcgGEEJtkt/t6vgEfCGQA06gYPR8yAUQJhBESYBbyU04Qk7qEJqca6FA1sfDKuggBTOkAn8u6EOd8jDHqIiCAA7';
//*/

var Moment = require('moment');

var mk_border = function(settings, sheet_info){
  var f = settings.f;
  var state = settings.state;
  var system = state.system;

  var d = f.Drawing(settings.drawing_settings);


  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;




  var x, y, h, w, p;
  var offset;

  p = size.sheet.titlebox.text_pad;


  ////////////////////////////////////////
  // Frame
  d.section('Frame');

  w = size.sheet.w;
  h = size.sheet.h;
  var padding = size.sheet.frame_padding;

  d.layer('border_lines');

  //border
  d.rect( [w/2 , h/2], [w - padding*2, h - padding*2 ] );

  var right_offset = size.sheet.titlebox;

  // title box
  var titlebox = size.sheet.titlebox;

  // border line
  x = w - padding;
  y = h - padding - titlebox.bottom.h;
  d.line([
    [ x, y],
    [ 0 + padding, y],
  ]);




  // Project/FSEC logo
  x = 0 + padding;
  y = h - padding;
  var FSEC_logo_width = titlebox.bottom.h - 4;
  y += -FSEC_logo_width;

  d.image(
    [x+2,y-2],
    [FSEC_logo_width,FSEC_logo_width],
    '/s/logo/FSEC.gif'
    //fsec_logo_b64
  );
  /*
  d.line([
    [x,y-4],
    [x+4+FSEC_logo_width,y-4],
    [x+4+FSEC_logo_width, h-padding],
  ]);

  d.line([
    [ x , y ],
    [ x , y+titlebox.bottom.h ],
  ]);
  //*/

  x += FSEC_logo_width +8;
  y = h - padding - titlebox.bottom.h -2;
  d.text([x+p,y+p*1.6],
    [
      'Florida',
      'Solar',
      'Energy',
      'Center',
    ],
    'text',
    'title_FSEC'
  );



  y = h - padding - titlebox.bottom.h;

  //section 1
  x += 27;
  d.line([
    [ x , y ],
    [ x , y+titlebox.bottom.h ],
  ]);
  d.text([x+p,y+p*1.6],
    [
      'PV System Design. Created: ' + Moment().format('YYYY-MM-DD'),
      'Based on ' + settings.info.building_code + '.',
      'Produced by the Solar Plans Designer.',
    ],
    'text',
    'border_info'
  );

  //section 2
  x += 218;
  d.line([
    [ x , y ],
    [ x , y+titlebox.bottom.h ],
  ]);
  d.text([x+p,y+p*1.6],
    [
      'Registered by: ' + state.system.company.name,
      state.system.company.line_1,
      state.system.company.city + ', ' + state.system.company.state + ' ' + state.system.company.zipcode + ', ' + state.system.company.country,
    ],
    'text',
    'border_info'
  );




  //section 3
  x += 225;
  d.line([
    [ x , y ],
    [ x , y+titlebox.bottom.h ],
  ]);

  var inverter_output = state.system.inverter.nominal_ac_output_power;
  if( system.config.system_type === 'micro' ){
    inverter_output *= state.system.array.num_of_modules;
  }

  d.text([x+p,y+p*1.6],
    [
      'System size: ' + state.system.array.num_of_modules + ' modules, ' + parseFloat(state.system.array.pmp/1000).toFixed(1) + 'kW DC, ' + parseFloat(inverter_output/1000).toFixed(1) + 'kW AC',
      'Inverter: ' + state.system.inverter.manufacturer_name + ', ' + state.system.inverter.device_model_number,
      'Module(s): ' + state.system.module.manufacturer_name + ', ' + state.system.module.device_model_number,
    ],
    'text',
    'border_info'
  );


  // Sheet title & num
  x = w - padding - titlebox.side.w;
  y = h - padding - titlebox.bottom.h;
  d.line([
    [ x, y ],
    [ x, y+titlebox.bottom.h ],
  ]);

  // Sheet title
  x = w - padding - titlebox.side.w/2;
  d.text([x,y+p*1.6],
    [
      sheet_info.desc,
    ],
    'text',
    'sheet_title'
  );

  // Sheet number
  y = h - padding - titlebox.bottom.h;
  y += titlebox.side.w /10;
  d.text(
    [ x, y+20 ],
    [
      sheet_info.num,
    ],
    'text',
    'sheet_num'
  );





  return d;
};

module.exports = mk_border;
