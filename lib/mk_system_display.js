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
    var value_float = parseFloat(parameter_value);
    if( (value_float%1) === 0 ){ // if is intiger
      value = parseFloat(parameter_value).toFixed(0);
    } else {
      value = parseFloat(parameter_value).toFixed(2);
    }
  }

  if( value !== false ){
    system_display_section[parameter_name] = value;
  }

};




var mk_system_display = function(system_settings){
  var system_display = {};
  var system = system_settings.state.system;
  var section_name;




  section_name = 'module';
  [
    'device_model_number',
    'manufacturer_name',
    'nameplaterating',
    'cell_type',
    'total_number_cells',
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
    'eff',
    'min_temp',
    'max_temp',
  ].forEach(function(parameter_name){
    system_display[section_name] = system_display[section_name] || {};
    var parameter_value = system[section_name][parameter_name];
    add_to_section( system_display[section_name], parameter_name, parameter_value, system_display[section_name] );
  });

  section_name = 'source';
  var section_label = 'source_circuit';
  [
    'max_power',
    'voc',
    'isc',
    'vmp',
    'imp',
    'Isc_adjusted',
  ].forEach(function(parameter_name){
    system_display[section_label] = system_display[section_label] || {};
    var parameter_value = system[section_name][parameter_name];
    add_to_section( system_display[section_label], parameter_name, parameter_value, system_display[section_label] );
  });


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

  section_name = 'inverter';
  [
    'device_model_number',
    'manufacturer_name',
    'num_of_inverters',
    'grid_voltage',
    'mppt_channels',
    'vmax',
    'vstart',
    'mppt_min',
    'mppt_max',
    'imax_channel',
    'voltage_range_min',
    'voltage_range_max',
    'nominal_ac_output_power',
    'max_ac_output_current',
  ].forEach(function(parameter_name){
    system_display[section_name] = system_display[section_name] || {};
    var parameter_value = system[section_name][parameter_name];
    add_to_section( system_display[section_name], parameter_name, parameter_value, system_display[section_name] );
  });



  section_name = 'interconnection';
  [
    'bussbar_rating',
    'supply_ocpd_rating',
    'inverter_ocpd_dev_sum',
    'inverter_output_cur_sum',
    'load_breaker_total',

  ].forEach(function(parameter_name){
    system_display[section_name] = system_display[section_name] || {};
    var parameter_value = system[section_name][parameter_name];
    add_to_section( system_display[section_name], parameter_name, parameter_value, system_display[section_name] );
  });

  section_name = 'company';
  [
    'name',
    'line_1',
    'line_2',
    'line_3',
    'city',
    'state',
    'zipcode',
    'country',
    'primary_phone_number',
    'web_site',
    'email',

  ].forEach(function(parameter_name){
    system_display[section_name] = system_display[section_name] || {};
    var parameter_value = system[section_name][parameter_name];
    add_to_section( system_display[section_name], parameter_name, parameter_value, system_display[section_name] );
  });








  return system_display;
};

module.exports = mk_system_display;
