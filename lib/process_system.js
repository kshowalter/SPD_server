var user_input_sample = require('../TEMP/user_input_sample.json');

var process_system = function(settings){
  var state = settings.state;
  var system = state.system;
  var active_system = state.status.active_system;

  // Update local state with server recorded user inputs
  System_data.find({system_id: active_system}).forEach(function(input_doc){
    state.system[input_doc.section_name] = state.system[input_doc.section_name] || {};
    state.system[input_doc.section_name][input_doc.value_name] = input_doc.value;
  });
  // Request a geocode update on server
  Meteor.call('get_location_information', function(err, returned){
    if( err ) console.log('err: ', err);
    console.log('location returned: ', returned);
  });

  // Load system state from server
  settings.system_state = User_systems.findOne({system_id: active_system}).system_state;




  state.status.inCompliance = true;

  state.notes = {
    info: [],
    warnings: [],
    errors: [],
  };

  if( section_defined(active_system,  'inverter') ){
    var inverter_specs = PV_Components.findOne({
      category:'inverters',
      make:system.inverter.inverter_make,
      model:system.inverter.inverter_model
    });
    system.inverter.inverter_specs = {};
    if(inverter_specs){
      system.inverter.inverter_specs = inverter_specs;
    } else {
      //console.log('module_specs not found');
    }
  }

  if( system.inverter.grid_voltage ) {
    system.inverter.conductors = settings.data.opt.inverter.conductors[system.inverter.grid_voltage];
    system.inverter.num_conductors = system.inverter.conductors.length;
  }


  system.location.risk_category = 'II';
  system.inverter.loadcenter_type = '240V/120V';

  if(settings.system_state.location.closest_station){
    system.location.low_temp = settings.system_state.location.closest_station['Extreme min'];
    system.location.high_temp_max = settings.system_state.location.closest_station['High Temp 0.4%'];
    system.location.high_temp = settings.system_state.location.closest_station['High Temp 2% Avg.'];
  }

  system.array.module = {};
  var module_specs = PV_Components.findOne({ category:'modules', make:system.array.module_make, model:system.array.module_model });
  if(module_specs){
    system.array.module = module_specs;
  } else {
    //console.log('module_specs not found');
  }







  /////////////////////////////
  // Calculate system
  /////////////////////////////
  settings = calculate_system(settings);
  settings.state.system_display = mk_system_display(settings.state);



  ///////////////////////////////////////////////
  // if roof size changes, reset selected modules
  ///////////////////////////////////////////////
  if( section_defined(active_system, 'array') && section_defined(active_system, 'roof') ){
    var mm_to_inches = function(mm) { return mm / (25.4 );  }; // mm per inch
    var row_spacing;
    var col_spacing;
    if( system.array.module_orientation === 'Portrait' ){
      row_spacing = Number(system.array.module.length) + 1;
      col_spacing = Number(system.array.module.width) + 1;
      module_w = (Number(system.array.module.width))/12;
      module_h = (Number(system.array.module.length))/12;
    } else {
      row_spacing = Number(system.array.module.width) + 1;
      col_spacing = Number(system.array.module.length) + 1;
      module_w = (Number(system.array.module.length))/12;
      module_h = (Number(system.array.module.width))/12;
    }
    row_spacing = row_spacing/12; //module dimentions are in inches
    col_spacing = col_spacing/12; //module dimentions are in inches
    var num_rows = Math.floor(system.roof.section_length/row_spacing);
    var num_cols = Math.floor(system.roof.section_width/col_spacing);
    //selected modules
    if( num_cols !== settings.system_state.num_possible_cols || num_rows !== settings.system_state.num_possible_rows ){
      console.log('new roof size, reseting selected modules');
      settings.system_state.selected_modules_total = 0;
      settings.system_state.selected_modules = [];
      for( r=1; r<=num_rows; r++){
        settings.system_state.selected_modules[r] = [];
        for( c=1; c<=num_cols; c++){
          settings.system_state.selected_modules[r][c] = false;
        }
      }
      settings.system_state.num_possible_cols = num_cols;
      settings.system_state.num_possible_rows = num_rows;
    }
    settings.system_state.selected_modules_total = 0;
    settings.system_state.selected_modules.slice(1).forEach(function(row){
      row.slice(1).forEach(function(column){
        if(column){
          settings.system_state.selected_modules_total++;
        }
      });
    });
  }





  /////////////////////////////
  // update drawing
  /////////////////////////////
  settings = update_drawing(settings);




/*
//*/

//////////////////////////////////////////////////////
  // return values to collection database

  //Meteor.call('update_user_data', function(err){
  //  console.log('called update_user_data');
  //  if(err) console.log('error: ', err);
  //});

  var user_system_id = User_systems.findOne({system_id: active_system})._id;
  User_systems.update(
    user_system_id,
    {$set: {
      system_state: settings.system_state

    }}
  );

  return settings;
};

module.exports = process_system;
