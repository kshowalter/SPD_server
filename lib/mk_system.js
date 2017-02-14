var mk_settings = require('./mk_settings.js');
var mk_inputs = require('./user_inputs/mk_inputs.js');
var process_system = require('./process_system.js');

//var user_input_sample = require('../TEMP/user_input_sample.json');
var user_system_sample = require('../TEMP/user_system_sample.json');

var settings_state = require('../TEMP/settings.state.json');


var mk_system = function(system_id){
  // This is the counterpart of 'update' on the browser

  console.log('Making: ', system_id);

  var system_settings = mk_settings();
  //system_settings.f = f;

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
  system_settings.state = settings_state;
  system_settings.user_system = user_system_sample;
  system_settings = process_system(system_settings);
  ///////////////////////////////////////////


  /*

  // Convert svgs to strings for storage
  svgs_strings = [];
  system_settings.drawing.svgs.forEach(function(svg){
    svgs_strings.push(svg.outerHTML);
  });
  // Store svg strings
  User_systems.upsert(
    {system_id:system_id},
    {$set:
      {svgs:[]}
    }
  );
  User_systems.update(
    {system_id:system_id},
    {$push:
      {svgs:
        { $each: svgs_strings }
      }
    }
  );

  */

  return system_settings;
};

module.exports = mk_system;
