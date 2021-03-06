var system_limitations = require('./settings/settings_system_limitations.js');
var layer_attr = require('./settings/settings_layers.js');
var fonts = require('./settings/settings_fonts.js');
var settings_drawing = require('./settings/settings_drawing.js');
var mk_inputs = require('./user_inputs/mk_inputs.js');
var f = require('functions');

//f.mk_sheet_num['G-001'] = require('../drawing/page/G-001.js');
f.mk_sheet_num['W-001_string'] = require('../drawing/page/W-001_string.js');
f.mk_sheet_num['W-001_micro'] = require('../drawing/page/W-001_micro.js');
f.mk_sheet_num['W-001_optimizer_string'] = require('../drawing/page/W-001_optimizer_string.js');
f.mk_sheet_num['G-001'] = require('../drawing/page/G-001.js');
f.mk_sheet_num['G-002'] = require('../drawing/page/G-002.js');
f.mk_sheet_num['G-003'] = require('../drawing/page/G-003.js');
f.mk_sheet_num['W-002'] = require('../drawing/page/W-002.js');
f.mk_sheet_num['L-001'] = require('../drawing/page/L-001.js');

f.mk_blocks = require('./mk_blocks');
f.mk_border = require('./mk_border');
f.mk_svg = require('./mk_svg');
f.Drawing = require('mkDrawing');

var mk_settings = function(system_data){
  var system_settings = {
    system_id: system_data.module.pvsystem_id,
    info: {},
    temp: {},
    webpage: {},
    server: {
      host: null
    },
    data: {},
    f: f
  };

  system_settings.info.building_code = '2014 NEC & 6th Edition (2017) FBC';
  system_settings.info.system_limitations = system_limitations;
  system_settings.info.user_input_table = {};

  system_settings.data.opt = {
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

  // load drawing settings
  system_settings.drawing = {};
  system_settings.drawing_settings = {};
  system_settings.drawing_settings.layer_attr = layer_attr;
  system_settings.drawing_settings.fonts = fonts;

  system_settings.drawing_settings.blocks = {};

  // Load drawing specific system_settings
  // TODO Fix settings_drawing with new variable locations
  system_settings = settings_drawing(system_settings);

  system_settings.report = {};

  system_settings.report_settings = {};

  system_settings.report_settings.size = {};
  system_settings.report_settings.size.page = {
    w: 215.9,
    h: 279.4
  };

  system_settings.report_settings.pages = [

  ];







  // make inputs
  system_settings = mk_inputs(system_settings);

  // Calculate system specs and drawing from user inputs

  /////////////////////////
  // TODO: replace temporary files with database connection.
  /////////////////////////
  system_settings.state = {
    'status': {
      'active_system': 'xxxx',
    },
    'system': system_data
  };
  //ssystem_settings.user_system = user_system_sample;
  ///////////////////////////////////////////
  system_settings.state.system.config = system_settings.state.system.config || {};
  system_settings.state.system.array = system_settings.state.system.array || {};
  system_settings.state.system.module = system_settings.state.system.module || {};
  system_settings.state.system.source = system_settings.state.system.source || {};
  system_settings.state.system.subpannel = system_settings.state.system.subpannel || {};
  system_settings.state.system.interconnection = system_settings.state.system.interconnection || {};
  system_settings.state.system.circuits = system_settings.state.system.circuits || {};
  system_settings.state.system.branch = system_settings.state.system.branch || {};



  return system_settings;
};

module.exports = mk_settings;
