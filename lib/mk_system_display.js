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
  var section_display_name;


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


  section_name = 'module';
  system_display[section_name] = {};
  [
    ['manufacturer_name', 'Manufacturer'],
    ['device_model_number', 'Model'],
    ['nameplaterating', 'Nameplate Power Rating', 'W'],
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
    ['max_system_v', 'Max System Voltage', 'V'],
    ['tc_voc_percent', 'TC Voc Percent'],
    ['tc_isc_percent', 'TC Isc Percent'],
    ['tc_vpmax_percent', 'TC Vmp Percent'],
    ['tc_ipmax_percent', 'TC Imp Percent'],
    ['tc_pmp_percent', 'TC Pmp Percent'],
    ['fire_class'],
    ['fire_type'],
    ['max_unitsperbranch'],
    ['max_power_output', undefined, 'W'],
    ['eff'],
    ['min_temp', undefined, ' C'],
    ['max_temp', undefined, ' C'],
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
    ['max_temp', undefined, ' C'],
    ['min_temp', undefined, ' C'],
    ['code_limit_max_voltage', 'Code Defined Voltage Limit', 'V'],
    ['voltage_correction_factor'],
    ['max_sys_voltage', 'Max System Voltage', 'V'],
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
    ['manufacturer_name', 'Manufacturer'],
    ['device_model_number', 'Model'],
    ['num_of_inverters'],
    //['grid_voltage', undefined, 'V'],
    ['mppt_channels', 'MPPT Channels'],
    ['vmax', undefined, 'V'],
    ['vstart', undefined, 'V'],
    ['mppt_min', 'MPPT Max.', 'V'],
    ['mppt_max', 'MPPT Min.', 'V'],
    ['isc_channel', "Max. Isc per MPPT", 'A'],
    ['imax_channel', "Max. Imp per MPPT", 'A'],
    ['voltage_range_min', undefined, 'V'],
    ['voltage_range_max', undefined, 'V'],
    ['nominal_ac_output_power', 'Nominal AC Output Power', 'W'],
    ['max_ac_output_current', 'Max AC Output Current', 'A'],
  ].forEach(function(parameter){
    add_to_section( system[section_name], parameter, system_display[section_name] );
  });


  if( system.config.system_type === 'optimizer' ){
    section_name = 'inverter';
    section_display_name = 'optimizer';
    system_display[section_display_name] = {};
    [
      ['opti_manufacturer_name', 'Manufacturer'],
      ['opti_name', 'Model'],
      ['opti_rated_max_power', 'Rated Max. Power', 'W'],
      ['opti_max_input_voltage', 'Max. Input Voltage', 'V'],
      ['opti_mppt_op_range_min', 'MPPT Oper. Range Min.', 'V'],
      ['opti_mppt_op_range_max', 'MPPT Oper. Range Max.', 'V'],
      ['opti_max_isc', 'Max. Isc', 'A'],
      ['opti_max_output_current', 'Max Output Current', 'A'],
      ['opti_max_output_voltage', 'Max Output Voltage', 'V'],
      ['opti_min_optis_per_string', 'Min Optimizers Per String'],
      ['opti_max_optis_per_string', 'Max Optimizers Per String'],
      ['opti_max_power_per_string', 'Max Power Per String', 'W'],
    ].forEach(function(parameter){
      add_to_section( system[section_name], parameter, system_display[section_display_name] );
    });

  }


  section_name = 'interconnection';
  system_display[section_name] = {};
  [
    ['grid_voltage', undefined, 'VAC'],
    ['bussbar_rating', 'Busbar Rating', 'A'],
    ['supply_ocpd_rating', 'Supply OCPD Rating', 'A'],
    ['inverter_ocpd_dev_sum', 'Inverter OCPD Device Sum', 'A'],
    ['inverter_output_cur_sum', undefined, 'A'],
    ['max_ac_current_125', 'Inverter Max Cur. * 125%', 'A'],
    ['load_breaker_total', 'Bussbar Loads', 'A'],

  ].forEach(function(parameter){
    add_to_section( system[section_name], parameter, system_display[section_name] );
  });


  /*
  section_name = 'Label Values';
  system_display[section_name] = {};
  system_display[section_name]['Rated Maximum Power-Point Current'] = f.format_value(system.source.imp)+'A';
  system_display[section_name]['Rated Maximum Power-Point Voltage'] = f.format_value(system.source.vmp)+'V';
  system_display[section_name]['Maximum System Voltage'] = f.format_value(system.array.max_sys_voltage)+'V';
  system_display[section_name]['Maximum Circuit Current'] = f.format_value(system.source.isc)+'A';
  system_display[section_name]['Rated AC Output Current'] = f.format_value(system.inverter.max_ac_output_current)+'A';
  system_display[section_name]['Nominal Operating AC Voltage'] = f.format_value(system.interconnection.grid_voltage)+'V';
  */








  return system_display;
};

module.exports = mk_system_display;
