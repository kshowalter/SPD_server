var f = require('functions');

var display_value = function(value,unit){
  unit = unit || '';
  var value_out = f.display_value(value);
  if( value_out === '' ){
    return '-';
  } else {
    return value_out + ' ' + unit;
  }
};

var mk_db_info_tables = function(system_settings){
  var db_info_tables = {};
  var system = system_settings.state.system;

  var module = system_settings.state.system.module;
  var array = system_settings.state.system.array;
  var source = system_settings.state.system.source;
  var inverter = system_settings.state.system.inverter;
  var error_check = system_settings.state.system.error_check;
  var intercon = system_settings.state.system.interconnection;
  var optimizer = system_settings.state.system.optimizer;
  /*
  var circuits = system_settings.state.system.circuits;
  //*/

  console.log('inverter.isc_channel',inverter.isc_channel);

  db_info_tables['module_specifications_from_database'] = [
    ['Description','Symbol','Value'],
    ['FSEC approved                        ','module.FSEC_approved     ','Yes'],
    ['Maximum power @ STC (W)              ','module.pmp               ',display_value(module.pmp,'W')],
    ['Open-circuit voltage @ STC (V)       ','module.voc               ',display_value(module.voc,'V')],
    ['Short-circuit current @ STC (A)      ','module.isc               ',display_value(module.isc,'A')],
    ['Maximum power voltage @ STC (V)      ','module.vmp               ',display_value(module.vmp,'V')],
    ['Maximum power current @ STC (A)      ','module.imp               ',display_value(module.imp,'A')],
    ['Number of cells                      ','module.total_number_cells',display_value(module.total_number_cells,'-')],
    ['Maximum overcurrent device rating (A)','module.max_series_fuse   ',display_value(module.max_series_fuse,'A')],
    ['Maximum system voltage rating (V)    ','module.max_system_v      ',display_value(module.max_system_v,'V')],
    ['Nameplate rating                     ','module.nameplaterating   ',display_value(module.nameplaterating,'W')],
  ];

  if( system.config.system_type === 'optimizer' ){
    db_info_tables['optimizer_specifications_from_database'] = [
      ['Description','Symbol','Value'],
      ['Manufacturer name              ','optimizer.manufacturer_name   ',display_value(optimizer.manufacturer_name,'-')],
      ['Model name                     ','optimizer.name                ',display_value(optimizer.name,'-')],
      ['Max input voltage              ','optimizer.max_input_voltage   ',display_value(optimizer.max_input_voltage,'V')],
      ['MPPT operating range min       ','optimizer.mppt_op_range_min   ',display_value(optimizer.mppt_op_range_min,'V')],
      ['MPPT operating range max       ','optimizer.mppt_op_range_max   ',display_value(optimizer.mppt_op_range_max,'V')],
      ['Max Short Circuit Current (Isc)','optimizer.max_isc             ',display_value(optimizer.max_isc,'A')],
      ['Max output current             ','optimizer.max_output_current  ',display_value(optimizer.max_output_current,'A')],
      ['Max output voltage             ','optimizer.max_output_voltage  ',display_value(optimizer.max_output_voltage,'V')],
      ['Min optimizers / string        ','optimizer.min_optis_per_string',display_value(optimizer.min_optis_per_string,'-')],
      ['Max optimizers / string        ','optimizer.max_optis_per_string',display_value(optimizer.max_optis_per_string,'-')],
      ['Max power / string             ','optimizer.max_power_per_string',display_value(optimizer.max_power_per_string,'-')],
    ];
  }


  db_info_tables['inverter_specifications_from_database'] = [
    ['Description','Symbol','Value'],
    ['Is inverter tranformerless                                        ','inverter.tranformerless             ',display_value(inverter.tranformerless)],
    ['Maximum dc voltage, Vmax,inv (V)                                  ','inverter.vmax                       ',display_value(inverter.vmax, 'V')],
    ['MPPT minimum dc operating voltage (V)                             ','inverter.mppt_min                   ',display_value(inverter.mppt_min, 'V')],
    ['MPPT maximum operating voltage (V)                                ','inverter.mppt_max                   ',display_value(inverter.mppt_max, 'V')],
    ['Min. dc operating voltage (V)                                     ','inverter.voltage_range_min          ',display_value(inverter.voltage_range_min, 'V')],
    ['Min. dc start voltage (V)                                         ','inverter.vstart                     ',display_value(inverter.vstart, 'V')],
    ['Number of inverter inputs or MPP trackers                         ','inverter.mppt_channels              ',display_value(inverter.mppt_channels, 'A')],
    ['Maximum OCPD Rating (A)                                           ','inverter.max_ac_ocpd                ',display_value(inverter.max_ac_ocpd, 'A')],
    ['Maximum DC short circuit current per inverter input or MPPT','inverter.isc_channel                ',display_value(inverter.isc_channel, 'A')],
    ['Maximum DC operating current per inverter input or MPPT','inverter.imax_channel               ',display_value(inverter.imax_channel, 'A')],
    ['Grid voltage','inverter.grid_voltage',display_value(inverter.grid_voltage, 'V')],
  ];

  if( inverter.max_dc_inputpower ){
    db_info_tables['inverter_specifications_from_database'].push(
      ['Maximum DC input power','inverter.max_dc_inputpower',display_value(inverter.max_dc_inputpower, 'W')]
    );
  }
  if( inverter.nominal_ac_output_powe ){
    db_info_tables['inverter_specifications_from_database'].push(
      ['Maximum DC input power','inverter.nominal_ac_output_power',display_value(inverter.nominal_ac_output_powe, 'W')]
    );
  }
  if( inverter.max_ac_output_current ){
    db_info_tables['inverter_specifications_from_database'].push(
      ['Maximum DC input power','inverter.max_ac_output_current',display_value(inverter.max_ac_output_current, 'W')]
    );
  }
  if( system.config.system_type === 'micro' ){
    db_info_tables['inverter_specifications_from_database'] = db_info_tables['inverter_specifications_from_database'].concat([
      ['Maximum DC input power','inverter.max_ac_output_current',display_value(inverter.max_ac_output_current, 'W')],
      ['Maximum units per branch         ','inverter.max_unitsperbranch  ',display_value(inverter.max_unitsperbranch, '-')],
      ['Minimum units per branch         ','inverter.min_unitsperbranch  ',display_value(inverter.min_unitsperbranch, '-')],
      ['Minimum panel wattage            ','inverter.min_panel_wattage   ',display_value(inverter.min_panel_wattage, 'W')],
      ['Maximum panel wattage            ','inverter.max_panel_wattage   ',display_value(inverter.max_panel_wattage, 'W')],
      ['Maximum number of cells per panel','inverter.max_module_cells    ',display_value(inverter.max_module_cells, '-')],
      ['Maximum watts per string         ','inverter.max_watts_per_branch',display_value(inverter.max_watts_per_branch, '-')],
    ]);
  }
  if( system.config.system_type === 'optimizer' ){
    db_info_tables['inverter_specifications_from_database'].push(
      ['Nominal DC input voltage','inverter.dc_voltage_nominal',display_value(inverter.dc_voltage_nominal, 'V')]
    );
  }


  db_info_tables['constants'] = [
    ['Description','Symbol','Value'],
    ['2% Maximum Temperature                                 ','array.max_temp                 ','36 C'],
    ['Extreme Annual Mean Minimum Design Dry Bulb Temperature','array.min_temp                 ','-9 C'],
    ['Maximum Voltage Rating?                                ','array.code_limit_max_voltage   ','600 V'],
    ['Voltage Correction Factor                              ','array.voltage_correction_factor','1.14'],
  ];

  return db_info_tables;
};

module.exports = mk_db_info_tables;
