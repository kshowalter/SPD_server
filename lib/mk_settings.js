var system_limitations = require('./settings/settings_system_limitations.js');
var layer_attr = require('./settings/settings_layers.js');
var fonts = require('./settings/settings_fonts.js');
var settings_drawing = require('./settings/settings_drawing.js');
var mk_inputs = require('./user_inputs/mk_inputs.js');
var user_system_sample = require('../TEMP/user_system_sample.json');
var settings_state = require('../TEMP/settings.state.json');

var mk_settings = function(system_id){
  var system_settings = {
    info: {},
    temp: {},
    webpage: {},
    data: {}
  };

  system_settings.info.building_code = '2011 NEC & 5th Edition (2014) FBC';
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

  system_settings.drawing.blocks = {};

  // Load drawing specific system_settings
  // TODO Fix settings_drawing with new variable locations
  system_settings = settings_drawing(system_settings);

  system_settings.drawing_settings.sheets = [
    {
      num: 'G-001',
      desc: 'Title'
    },
    {
      num: 'W-001',
      desc: 'Wiring Diagram'
    },
    {
      num: 'W-002',
      desc: 'System Specifications'
    },
    {
      num: 'S-001',
      desc: 'Roof Section 1'
    },
  ];

  system_settings.report = {};

  system_settings.report_settings = {};

  system_settings.report_settings.size = {};
  system_settings.report_settings.size.page = {
    w: 215.9,
    h: 279.4
  };

  system_settings.report_settings.pages = [

  ];




  // This section is similar to what is done in setup_system.js on the client
  system_settings.state = {
    status: {
      active_system: system_id
    },
    system: {}
  };


  /*
  var user_system = User_systems.findOne({system_id: system_id});
  if( user_system ){
    system_settings.user_system = user_system.user_system;
  }
  */


  // make inputs
  system_settings = mk_inputs(system_settings);

  // Calculate system specs and drawing from user inputs

  /////////////////////////
  // TODO: replace temporary files with database connection.
  /////////////////////////
  system_settings.state = settings_state;
  system_settings.user_system = user_system_sample;
  ///////////////////////////////////////////




  return system_settings;
};

module.exports = mk_settings;
