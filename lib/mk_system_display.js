var add_to_section = function(section, parameter_name, parameter_value, system_display_section){
  var value;


  if( typeof parameter_value === 'undefined' || parameter_value === null ) {
    value = false;
  } else if( parameter_value.constructor === Array ){
    value = parameter_value.join(', ');
  } else if( parameter_value.constructor === Object ){
    value = false;
  } else if( isNaN(parameter_value) ){
    value = parameter_value;
  } else {
    value = parseFloat(parameter_value).toFixed(2);
  }

  if( value !== false ){
    system_display_section[parameter_name] = value;
  }

};




var mk_system_display = function(system_settings){
  var system_display = {};
  var system = system_settings.state.system;
  var section_name;


  section_name = 'array';
  [
    'num_of_modules',
    'num_of_strings',
    'smallest_string',
    'largest_string',
    'max_temp',
    'min_temp',
    'code_limit_max_voltage',
    'voltage_correction_factor',
    'max_sys_voltage',
    'min_voltage',
    'circuits_per_MPPT',
    'combined_Isc_adjusted',
    'pmp',
    'voc',
    'isc',
    'vmp',
    'imp',
    'imp_adjusted',
    'vmp_adjusted',
  ].forEach(function(parameter_name){
    system_display[section_name] = system_display[section_name] || {};
    var parameter_value = system[section_name][parameter_name];
    add_to_section( system_display[section_name], parameter_name, parameter_value, system_display[section_name] );
  });

  section_name = 'module';
  [
    'device_model_number',
    'device_name',
    'manufacturer_name',
    'pvsystem_id',
    'pvmodule_id',
    'num_of_modules',
    'num_of_strings',
    'smallest_string',
    'largest_string',
    'nameplaterating',
    'cell_type',
    'total_number_cells',
    'number_cell_inseries',
    'number_cells_inparallel',
    'pmp',
    'voc',
    'isc',
    'vmp',
    'vnoct',
    'vlow',
    'imp',
    'inoct',
    'ilow',
    'noct',
    'max_series_fuse',
    'max_system_v',
    'tc_voc_percent',
    'tc_vpmax_percent',
    'tc_isc_percent',
    'tc_ipmax_percent',
    'tc_pmp_percent',
    'fire_class',
    'fire_type',
    'max_unitsperbranch',
    'max_power_output',
    'max_accurrent_120',
    'max_accurrent_208',
    'max_accurrent_240',
    'max_accurrent_277',
    'max_accurrent_480',
    'eff',
    'min_temp',
    'max_temp',
    'user_category_code',
    'certificationlab_id',
  ].forEach(function(parameter_name){
    system_display[section_name] = system_display[section_name] || {};
    var parameter_value = system[section_name][parameter_name];
    add_to_section( system_display[section_name], parameter_name, parameter_value, system_display[section_name] );
  });





  return system_display;
};

module.exports = mk_system_display;
