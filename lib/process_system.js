var INVERTER_SAMPLE = require('../TEMP/inverter_sample.json');
var MODULE_SAMPLE = require('../TEMP/module_sample.json');
var calculate_system = require('./calculate_system.js');

var process_system = function(settings){
  var state = settings.state;
  var system = state.system;
  //var active_system = state.status.active_system;

  state.status.inCompliance = true;

  state.notes = {
    info: [],
    warnings: [],
    errors: [],
  };

  var inverter_specs = INVERTER_SAMPLE;
  system.inverter.inverter_specs = {};
  if(inverter_specs){
    system.inverter.inverter_specs = inverter_specs;
  } else {
    //console.log('module_specs not found');
  }

  if( system.inverter.grid_voltage ) {
    system.inverter.conductors = settings.data.opt.inverter.conductors[system.inverter.grid_voltage];
    system.inverter.num_conductors = system.inverter.conductors.length;
  }


  system.location.risk_category = 'II';
  system.inverter.loadcenter_type = '240V/120V';

  //if(settings.user_system.location.closest_station){
  //  system.location.low_temp = settings.user_system.location.closest_station['Extreme min'];
  //  system.location.high_temp_max = settings.user_system.location.closest_station['High Temp 0.4%'];
  //  system.location.high_temp = settings.user_system.location.closest_station['High Temp 2% Avg.'];
  //}

  system.array.module = {};
  var module_specs = MODULE_SAMPLE;
  if(module_specs){
    system.array.module = module_specs;
  } else {
    //console.log('module_specs not found');
  }







  /////////////////////////////
  // Calculate system
  /////////////////////////////
  settings = calculate_system(settings);
  //settings.state.system_display = mk_system_display(settings.state);





//*/

//////////////////////////////////////////////////////
  // return values to collection database


  //var user_system_id = User_systems.findOne({system_id: active_system})._id;
  //User_systems.update(
  //  user_system_id,
  //  {$set: {
  //    user_system: settings.user_system

  //  }}
  //);

  return settings;
};

module.exports = process_system;
