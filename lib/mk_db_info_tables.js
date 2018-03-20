var f = require('functions');

var display_value = function(value,unit){
  unit = unit || '';
  value_out = f.display_value(value);
  if( value_out === '' ){
    return '-';
  } else {
    return value_out + ' ' + unit;
  }
}

var mk_db_info_tables = function(system_settings){
  var db_info_tables = {};
  var system = system_settings.state.system;

  var module = system_settings.state.system.module;
  var array = system_settings.state.system.array;
  var source = system_settings.state.system.source;
  var inverter = system_settings.state.system.inverter;
  var error_check = system_settings.state.system.error_check;
  var intercon = system_settings.state.system.interconnection;
  /*
  var circuits = system_settings.state.system.circuits;
  //*/

  console.log('inverter.isc_channel',inverter.isc_channel);

  db_info_tables['Inverter'] = [
    ['DESCRIPTION','SYMBOL','VALUE'],
    ['Is inverter tranformerless                                        ','inverter.tranformerless             ',display_value(inverter.tranformerless)],
    ['Maximum dc voltage, Vmax,inv (V)                                  ','inverter.vmax                       ',display_value(inverter.vmax, 'V')],
    ['MPPT minimum dc operating voltage (V)                             ','inverter.mppt_min                   ',display_value(inverter.mppt_min, 'V')],
    ['MPPT maximum operating voltage (V)                                ','inverter.mppt_max                   ',display_value(inverter.mppt_max, 'V')],
    ['Min. dc operating voltage (V)                                     ','inverter.voltage_range_min          ',display_value(inverter.voltage_range_min, 'V')],
    ['Min. dc start voltage (V)                                         ','inverter.vstart                     ',display_value(inverter.vstart, 'V')],
    ['Number of inverter inputs or MPP trackers                         ','inverter.mppt_channels              ',display_value(inverter.mppt_channels, 'A')],
    ['Maximum OCPD Rating (A)                                           ','inverter.max_ac_ocpd                ',display_value(inverter.max_ac_ocpd, 'A')],
    ['Maximum DC short circuit current per inverter input or MPP tracker','inverter.isc_channel                ',display_value(inverter.isc_channel, 'A')],
    ['Maximum DC operating current per inverter input or MPP tracker    ','inverter.imax_channel               ',display_value(inverter.imax_channel, 'A')],
    ['Grid voltage','inverter.grid_voltage',display_value(inverter.grid_voltage, 'V')],
  ];

  if( inverter.max_dc_inputpower ){
    db_info_tables['Inverter'].push(
      ['Maximum DC input power','inverter.max_dc_inputpower',display_value(inverter.max_dc_inputpower, 'W')]
    );
  }
  if( inverter.nominal_ac_output_powe ){
    db_info_tables['Inverter'].push(
      ['Maximum DC input power','inverter.nominal_ac_output_powe',display_value(inverter.nominal_ac_output_powe, 'W')]
    );
  }
  if( inverter.max_ac_output_current ){
    db_info_tables['Inverter'].push(
      ['Maximum DC input power','inverter.max_ac_output_current',display_value(inverter.max_ac_output_current, 'W')]
    );
  }
  if( system.config.system_type === 'micro' ){
    db_info_tables['Inverter'] = db_info_tables['Inverter'].concat([
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
    db_info_tables['Inverter'].push(
      ['Nominal DC input voltage','inverter.dc_voltage_nominal',display_value(inverter.dc_voltage_nominal, 'V')]
    );
  }


  if( system.config.system_type === 'micro' ){
    db_info_tables['Microinverter Calculations'] = [
      ['DESCRIPTION','SYMBOL','CALCULATION','RESULT'],
    ];
  }


  if( system.config.system_type === 'optimizer' ){
    db_info_tables['Optimizer Calculations'] = [
      ['DESCRIPTION','SYMBOL','CALCULATION','RESULT'],
    ];
  }





  db_info_tables['Interconnection Calculations'] = [
    ['DESCRIPTION','SYMBOL','CALCULATION','RESULT'],
  ];



  return db_info_tables;
};

module.exports = mk_db_info_tables;
