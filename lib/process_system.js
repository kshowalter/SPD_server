var SDA = require('./SDA.js');
var SDA_string = require('./SDA_string.js');
var SDA_micro = require('./SDA_micro.js');
var SDA_optimizer_string = require('./SDA_optimizer_string.js');
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

  if( system.array.num_of_strings === 1 && ( system.array.smallest_string !== system.array.largest_string ) ){
    state.notes.warnings.push('For a single string system, smallest and largest string should be the same. Using largest string size.');
    system.array.smallest_string = system.array.largest_string;
  }

  var max_modules = system.array.largest_string * (system.array.num_of_strings-1) + system.array.smallest_string;
  var min_modules = system.array.smallest_string * (system.array.num_of_strings-1) + system.array.largest_string;
  if( system.array.num_of_modules > max_modules ){
    state.notes.warnings.push('Module total exceeds the number possible with selected string sizes. Using the maximum number of modules possible based on string configuration.');
    system.array.num_of_modules = max_modules;
  }
  if( system.array.num_of_modules < min_modules ){
    state.notes.warnings.push('Module total is less than the number possible with selected string sizes. Using the minimum number of modules possible based on string configuration.');
    system.array.num_of_modules = min_modules;
  }






  /////////////////////////////
  // Assign grid voltage specific values based on selected grid voltage.
  /////////////////////////////

  if( system.inverter.grid_voltage ) {
    system.inverter.conductors = settings.data.opt.inverter.conductors[system.inverter.grid_voltage+'V'];
    system.inverter.num_conductors = system.inverter.conductors.length;
  }

  system.inverter.nominal_ac_output_power = system.inverter['nominal_ac_output_power_'+system.inverter.grid_voltage];
  system.inverter.max_ac_output_current = system.inverter['max_ac_output_current_'+system.inverter.grid_voltage];


  /////////////////////////////
  // Calculate system
  /////////////////////////////
  logger.info('device_type_id: ', system.inverter.device_type_id);
  //*
  if( system.inverter.device_type_id === 53 ){
    system.config.system_type = 'string';
  } else if(system.inverter.device_type_id === 54){
    system.config.system_type = 'micro';
  } else if(system.inverter.device_type_id === 55){
    system.config.system_type = 'optimizer';
  } else {
    logger.error('System type unknown');
  }
  //*/

  //system.config.system_type = 'string';


  settings = SDA(settings);

  if( system.config.system_type === 'string' ){
    settings = SDA_string(settings);
  } else if( system.config.system_type === 'micro'){
    settings = SDA_micro(settings);
  } else if( system.config.system_type === 'optimizer'){
    settings = SDA_optimizer_string(settings);
  } else {
    logger.info('system_type: ', system.config.system_type, ' can not be handled');
  }




  /////////////////////////////
  // Prepare display values
  /////////////////////////////
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
