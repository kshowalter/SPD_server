var system_limitations = require('./settings/settings_system_limitations.js');
var layer_attr = require('./settings/settings_layers.js');
var fonts = require('./settings/settings_fonts.js');
var settings_drawing = require('./settings/settings_drawing.js');

var mk_settings = function(){
  //console.log('making settings');

  var i;
  //var settingsCalculated = require('./settingsCalculated.js');

  // Load 'user' defined settings
  //var mk_settings = require('../data/settings.json.js');
  //f.mk_settings = mk_settings;

  var settings = {
    info: {},
    temp: {},
    webpage: {},
    data: {}
  };


  settings.info.building_code = '2011 NEC & 5th Edition (2014) FBC';
  settings.info.system_limitations = system_limitations;
  settings.info.user_input_table = {};



  settings.data.opt = {
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



  // load layers

  settings.drawing = {};

  settings.drawing_settings = {};
  settings.drawing_settings.layer_attr = layer_attr;
  settings.drawing_settings.fonts = fonts;

  settings.drawing.blocks = {};

  // Load drawing specific settings
  // TODO Fix settings_drawing with new variable locations
  settings = settings_drawing(settings);

  //settings.status_app.version_string = version_string;

  //settings = f.nullToObject(settings);

  settings.drawing_settings.sheets = [
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


  settings.report = {};

  settings.report_settings = {};

  settings.report_settings.size = {};
  settings.report_settings.size.page = {
    w: 215.9,
    h: 279.4
  };

  settings.report_settings.pages = [


  ];


  // Load functions and add them the the global object




  //setSetting('process', false);


  return settings;
};

module.exports = mk_settings;
