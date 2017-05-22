////////// TEMP /////////////////
var user_system_sample = require('../TEMP/user_system_sample.json');
var settings_state = require('../TEMP/settings.state.json');
/////////////////////////////

try {
  // a path we KNOW is totally bogus and not a module
  var local_config = require('../private/sensitive_data/local_config.js');
}
catch (e) {
  logger.info(e);
  /* eslint-disable no-redeclare */
  var local_config = {
    pdfDirectory: process.env.PWD + '/private/.#pdf/',
    specSheetDirectory: process.env.PWD + '/private/.#specsheet/'
  };
  /* eslint-enable no-redeclare */
}

var system_limitations = require('./settings/settings_system_limitations.js');
var layer_attr = require('./settings/settings_layers.js');
var fonts = require('./settings/settings_fonts.js');
var settings_drawing = require('./settings/settings_drawing.js');
var mk_inputs = require('./user_inputs/mk_inputs.js');
var f = require('./functions/functions.js');

//f.mk_sheet_num['G-001'] = require('../drawing/page/G-001.js');
//f.mk_sheet_num['W-001'] = require('../drawing/page/W-001.js');
//f.mk_sheet_num['W-002'] = require('../drawing/page/W-002.js');

f.mk_blocks = require('./mk_blocks');
f.mk_border = require('./mk_border');
f.mk_svg = require('./mk_svg');
f.Drawing = require('mkDrawing');

var mk_settings = function(){
  var server_settings = {
    info: {},
    temp: {},
    webpage: {},
    server: {
      host: null
    },
    data: {},
    f: f,
    local_config: local_config
  };

  server_settings.info.building_code = '2011 NEC & 5th Edition (2014) FBC';
  server_settings.info.system_limitations = system_limitations;
  server_settings.info.user_input_table = {};

  server_settings.data.opt = {
    inverter: {
      loadcenter: {
        '240V/120V': ['240V','120V'],
        '208V/120V': ['208V','120V'],
        '480V/277V': ['480V Wye','480V Delta','277V'],
      },
      conductors: {
        '120V': ['ground','neutral','L1'],
        '240V': ['ground','neutral','L1','L2'],
        '208V': ['ground','neutral','L1','L2'],
        '277V': ['ground','neutral','L1'],
        '480V Wye': ['ground','neutral','L1','L2','L3'],
        '480V Delta': ['ground','L1','L2','L3'],
      },
    },
  };

  server_settings = mk_inputs(server_settings);

  return server_settings;
};

module.exports = mk_settings;
