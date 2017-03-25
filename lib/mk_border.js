//var drawing_parts = [];
//d.link_drawing_parts(drawing_parts);

/*
var fsec_logo_b64 =  'data:image/gif;base64,R0lGODlhXABcANUAAIWRZU9kdyZDhWp7bneGaru+U3CDtkFZfDROgKm109/f3/z8/NbW1lxvojpTluTfRcDCx1xvc66zV9bUSsnJTqCnXJOcYOzs7PHz+ERdoLjB2+/v793f5H6PvfLy8vLrQRk4iszMzP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABcAFwAAAb/QJFwSCwaj8ikcslsOp/QqHRKrVqv2Kx2yz12Et1w2AACgcXoK7lsTrula3b7TV/G5fO6nnjH5/d1fX5/gGmCg4SFXYeIiYpZjI2Oj1WRkpOUUZaXmJlNm5ydnkmgoaKjRaWmp6gioAJ4CCCwiGetSJYIASAEeAAgA5K2t3ycvxZ4FgK/wsTFfrRsEiAVcggAA7tyEX7DrYKwzGwAEQXaIAAAEucgAcHsrHqHAwcBvWwWFgAFZQIPAw/OCeBH4EC3b40kHCgQrAwFhh8kAKDwIcCHewIoDBhw76CnXBQOfACAgMCHAgI+qPwwwWLAAA8PTGhGCVQFiStPgpCwMlvO/wcyO9Z6dAjegIoVVvJD8OADhTI5BwCoiIdAtDLe6DCSGi2CzqQfkIEoSWvCh38gmhosE6DCVTZZDQ0SYIHeBAABIjT9IMvdtQIFHkooGACWRacRCAQWMECZxzeWFJfLSRVBAco5C8iamtMCTG5D3YA68AAbRZUHjmLGTEB1xAAWgF6Kq0WVSZSpI7heTdlCPQEZP4CeLUYVVJ0gvPLm3fDyTFO0K60CIVLlAH/LeT9gvFKWtUbR4Vyypw9A7JXpsi+vwPkse3V4aaoxxbhCgaYTJGBXv/oBAgl7FVDBdaGE90koUklQwGDetcPfcsMdQICCEjUkn3jT/adSAQa19/8gZb8EYFZYDRY4RQLTyWGSShF4+OFKFSh3UYpYTWGcHIeN5OKLJ7UHzyoa2JhicE4twyOIB5xGwVuhZIABFaowZtZdsKx4pEr3AGBWaSVe4qQVmxCQDza6FEbdlSsZVKY76VggFCJfWnFBA5xEUMGIKrWEJ48T6JXTBDE2+aScIYRAJyKJRRCAO5ephA2aja2k0aItroWIAxxccUGhhR7KSUqogdDoi08dtt0qDkAQwgVVbMppp6GA2hBTL/pXRlLPhZIqp6xK4cGrr3raSFLBtEhAAHupF1A61yUljiS7vtprFAoAy6mwfljQ0gB4EmCZeppZ+QABell4qarWbjD/RbXWGjrIf96ettI9A8ibk0Zl7HbSAQC4dW67DCxABbvWYktWBBQAcIAAPPHFyzoItJhOBAgsBIAA1VXDWEgCWOVHtMAGbAXBwGILzMVsWIRSo89FIAFoSgpgVjR0mcsGyK+KfAXJwcohADwWBdCwSmOpZGtmXllaRpcg4MypzljwfK0kFrDH0l47wQhCnhTt8+wgThcKdRZSwzoXhzPKzNdPW/OTHFATMHkzuiEL3EXZ7vpRwQEDskHABEdZlRSyHfHN77/Wjs0F3tgecMA1OEo0TRkFqMMOSfR8THfOdqPBuB9vJqZQym4OV8abZYQdguJifC4JSdXIIQHkl6jOtLrn7eaNyC9v/vK15gB3XofrgxgEj0Fyzx28IsTTCPbmTwsPSPPOK5+49IVQ77zt2DOfu8nTcX+L9qaITwz5tUMvdvejoI943c4Q4T4e5sc/xPypq786+87MX7/9RUDf/wAYwO8B73oEVELzBphAI7iOgQ104PcgGEEJtkt/t6vgEfCGQA06gYPR8yAUQJhBESYBbyU04Qk7qEJqca6FA1sfDKuggBTOkAn8u6EOd8jDHqIiCAA7';
//*/

var moment = require('moment');

var mk_border = function(settings, sheet_info){
  var f = settings.f;
  var state = settings.state;
  var system = state.system;

  var d = f.Drawing(settings);


  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;




  var x, y, h, w;
  var offset;


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


  // Project/FSEC logo
  x = w - padding;
  y = 0 + padding;
  var FSEC_logo_width = 32;
  x += -FSEC_logo_width;

  d.image(
    [x-2,y+2],
    [FSEC_logo_width,FSEC_logo_width],
    '/s/logo/FSEC.gif'
    //fsec_logo_b64
  );
  d.line([
    [x-4,y],
    [x-4,                y+4+FSEC_logo_width],
    [w-padding,y+4+FSEC_logo_width],
  ]);




  // title boxes

  // title box
  var titlebox = size.sheet.titlebox;


  //bottom
  x = w - padding - titlebox.bottom.w;
  y = h - padding;
  d.line([
    [ x, y],
    [ x, y - titlebox.bottom.h],
    [ x + titlebox.bottom.w , y - titlebox.bottom.h],
  ]);


  // bottom bar content

  // Sheet number
  x = w - padding - titlebox.side.w;
  y = h - padding - titlebox.bottom.h;
  d.line([
    [ x, y ],
    [ x, y+titlebox.bottom.h ],
  ]);
  y += titlebox.side.w /8;
  d.text(
    [ x+titlebox.side.w/2, y+20 ],
    [
      sheet_info.num,
    ],
    'text',
    'sheet_num'
  );


  x = w - padding - titlebox.bottom.w;
  y = h - padding - titlebox.bottom.h;





  //section 1
  d.line([
    [ x , y ],
    [ x , y+titlebox.bottom.h ],
  ]);
  d.text([x+7,y+titlebox.bottom.h *1/5],
    [
      'PV System Design',
      'Registered by: ' + state.system.company.name,
      state.system.company.line_1,
      state.system.company.city + ', ' + state.system.company.state + ' ' + state.system.company.zipcode + ', ' + state.system.company.country,
    ],
    'text',
    'border_info'
  );


  //section 2
  x += 200;
  d.line([
    [ x , y ],
    [ x , y+titlebox.bottom.h ],
  ]);
  d.text([x+10,y+titlebox.bottom.h *1/4],
    [
      'Created on: ' + moment().format('YYYY-MM-DD'),
      'Based on ' + settings.info.building_code
    ],
    'text',
    'border_info'
  );

  //section 3
  x += 250;
  d.line([
    [ x , y ],
    [ x , y+titlebox.bottom.h ],
  ]);

  d.text([x+10,y+titlebox.bottom.h *1/4],
    [
      'System size: ' + Math.round(state.system.array.pmp/1000, 1) + 'kW',
      'Inverter: ' + state.system.inverter.manufacturer_name + ', ' + state.system.inverter.device_model_number,
      'Module(s): ' + state.system.module.manufacturer_name + ', ' + state.system.module.device_model_number,
    ],
    'text',
    'notes'
  );


  return d;
};

module.exports = mk_border;
