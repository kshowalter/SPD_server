var add_to_section = function(section, parameter, system_display_section){
  var parameter_name = parameter[0];
  var parameter_label = parameter[1] || f.pretty_name(parameter_name);
  var parameter_units;
  if( parameter[2] && section[parameter_name] ) {
    parameter_units = parameter[2];
  } else {
    parameter_units = '';
  }
  //system_display_section = system_display_section || {};
  var parameter_value = section[parameter_name];
  var display_value = f.format_value(parameter_value);
  display_value = display_value + parameter_units;
  if( parameter_value ){
    system_display_section[parameter_label] = display_value;
  }
};




var mk_system_display = function(system_settings){
  var system_display = {};
  var system = system_settings.state.system;
  var section_name;




  section_name = 'module';
  system_display[section_name] = {};
  [
    ['device_model_number'],
    ['manufacturer_name'],
    ['nameplaterating'],
    ['cell_type'],
    ['total_number_cells'],
    ['pmp', undefined, 'W'],
    ['voc', undefined, 'V'],
    ['isc', undefined, 'A'],
    ['vmp', undefined, 'V'],
    ['vnoct', undefined, 'V'],
    ['vlow', undefined, 'V'],
    ['imp', undefined, 'A'],
    ['inoct', undefined, 'A'],
    ['ilow', undefined, 'A'],
    ['noct'],
    ['max_series_fuse', undefined, 'A'],
    ['max_system_v', undefined, 'V'],
    ['tc_voc_percent'],
    ['tc_vpmax_percent'],
    ['tc_ipmax_percent'],
    ['tc_pmp_percent'],
    ['fire_class'],
    ['fire_type'],
    ['max_unitsperbranch'],
    ['max_power_output', undefined, 'W'],
    ['eff'],
    ['min_temp', undefined, ' F'],
    ['max_temp', undefined, ' F'],
  ].forEach(function(parameter){
    add_to_section( system[section_name], parameter, system_display[section_name] );
  });

  section_name = 'source';
  system_display[section_name] = {};
  var section_label = 'source_circuit';
  [
    ['max_power', undefined, 'W'],
    ['voc', undefined, 'V'],
    ['isc', undefined, 'A'],
    ['vmp', undefined, 'V'],
    ['imp', undefined, 'A'],
    ['Isc_adjusted', undefined, 'A'],
  ].forEach(function(parameter){
    add_to_section( system[section_name], parameter, system_display[section_name] );
  });


  section_name = 'array';
  system_display[section_name] = {};
  [
    ['num_of_modules'],
    ['num_of_strings'],
    ['smallest_string'],
    ['largest_string'],
    ['max_temp', undefined, ' F'],
    ['min_temp', undefined, ' F'],
    ['code_limit_max_voltage', undefined, 'V'],
    ['voltage_correction_factor'],
    ['max_sys_voltage', undefined, 'V'],
    ['min_voltage', undefined, 'V'],
    ['combined_Isc_adjusted', undefined, 'A'],
    ['pmp', undefined, 'W'],
    ['voc', undefined, 'V'],
    ['isc', undefined, 'A'],
    ['vmp', undefined, 'V'],
    ['imp', undefined, 'A'],
    ['imp_adjusted', undefined, 'A'],
    ['vmp_adjusted', undefined, 'V'],
  ].forEach(function(parameter){
    add_to_section( system[section_name], parameter, system_display[section_name] );
  });

  section_name = 'inverter';
  system_display[section_name] = {};
  [
    ['device_model_number'],
    ['manufacturer_name'],
    ['num_of_inverters'],
    ['grid_voltage', undefined, 'V'],
    ['mppt_channels', 'MPPT Channels'],
    ['vmax', undefined, 'V'],
    ['vstart', undefined, 'V'],
    ['mppt_min', 'MPPT Max.', 'V'],
    ['mppt_max', 'MPPT Min.', 'V'],
    ['imax_channel', undefined, 'A'],
    ['voltage_range_min', undefined, 'V'],
    ['voltage_range_max', undefined, 'V'],
    ['nominal_ac_output_power', undefined, 'W'],
    ['max_ac_output_current', undefined, 'A'],
  ].forEach(function(parameter){
    add_to_section( system[section_name], parameter, system_display[section_name] );
  });



  section_name = 'interconnection';
  system_display[section_name] = {};
  [
    ['bussbar_rating', 'Busbar Rating', 'A'],
    ['supply_ocpd_rating', undefined, 'A'],
    ['inverter_ocpd_dev_sum', undefined, 'A'],
    ['inverter_output_cur_sum', undefined, 'A'],
    ['load_breaker_total', undefined, 'A'],

  ].forEach(function(parameter){
    add_to_section( system[section_name], parameter, system_display[section_name] );
  });

  section_name = 'company';
  system_display[section_name] = {};
  [
    ['name'],
    ['line_1', 'Address'],
    ['line_2', 'Address'],
    ['line_3', 'Address'],
    ['city'],
    ['state'],
    ['zipcode', 'Zip Code'],
    ['country'],
    ['primary_phone_number'],
    ['web_site'],
    ['email'],

  ].forEach(function(parameter){
    add_to_section( system[section_name], parameter, system_display[section_name] );
  });






  return system_display;
};

module.exports = mk_system_display;
