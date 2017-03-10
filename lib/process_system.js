var calculate_system = require('./calculate_system.js');
var mk_system_display = require('./mk_system_display.js');

var process_system = function(settings){
  var state = settings.state;
  var system = state.system;
  //var active_system = state.status.active_system;


  state.notes = {
    info: [],
    warnings: [],
    errors: [],
  };






  if( system.inverter.grid_voltage ) {
    system.inverter.conductors = settings.data.opt.inverter.conductors[system.inverter.grid_voltage+'V'];
    system.inverter.num_conductors = system.inverter.conductors.length;
  }

  /////////////////////////////
  //
  /////////////////////////////

  system.inverter.nominal_ac_output_power = system.inverter['nominal_ac_output_power_'+system.inverter.grid_voltage];
  system.inverter.max_ac_ouput_current = system.inverter['max_ac_ouput_current_'+system.inverter.grid_voltage];


  /////////////////////////////
  // Calculate system
  /////////////////////////////




  settings = calculate_system(settings);
  settings.state.system_display = mk_system_display(settings);





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
