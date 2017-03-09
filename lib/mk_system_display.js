var mk_system_display = function(system_settings){
  var system_display = {};
  var state = system_settings.state;

  ////////////////
  // Module info
  if(state.system.array.module){
    state.system['module'] = {};
    [
      'pmp',
      'isc',
      'voc',
      'imp',
      'vmp',
      'width',
      'length',
      'max_series_fuse',
      'ul1703',
    ].forEach(function(value_name){
      state.system['module'][value_name] = state.system.array.module[value_name];
    });
  }


  for( var section_name in state.system ){
    if( section_name === 'conduits' ) continue;
    if( section_name === 'conductors' ) continue;

    system_display[section_name] = {};

    var section = state.system[section_name];
    var value;
    for( var value_name in section ){
      if( system_settings.info.inputs[section_name] && system_settings.info.inputs[section_name][value_name] && system_settings.info.inputs[section_name][value_name].onDrawing === false ){
        continue;
      }
      if( section_name === 'array' && value_name === 'selected_modules'){ continue; }

      var system_value = section[value_name];

      //var label = settings.info.inputs[section_name] &&
      //    settings.info.inputs[section_name][value_name] &&
      //    settings.info.inputs[section_name][value_name].label;
      //var parameter_name = label || f.pretty_name(value_name);

      if( typeof system_value === 'undefined' || system_value === null || isNaN(system_value) ) {
        value = false;
      } else if( section[value_name].constructor === Array ){
        value = section[value_name].join(', ');
      } else if( section[value_name].constructor === Object ){
        value = false;
      } else if( isNaN(section[value_name]) ){
        value = section[value_name];
      } else {
        value = parseFloat(section[value_name]).toFixed(2);
      }

      if( value !== false ){
        system_display[section_name][value_name] = value;
      }
    }
  }


  return system_display;
};

module.exports = mk_system_display;
