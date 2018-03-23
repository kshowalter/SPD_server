var f = require('functions');

var mk_system_display = function(system_settings){
  var system_display = {};
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

  system_display['Database_calculations'] = [
    ['DESCRIPTION','SYMBOL','CALCULATION','VALUE'],
    ['If max_ac_ocpd is not provided by the manufacturer, it is calculated as follows:'],
    ['Inverter AC OCPD max','inverter.AC_OCPD_max','max_ac_output_current * 1.25',inverter.AC_OCPD_max.toFixed(2) + ' A'],
  ];

  if( system.config.system_type === 'string' ){
    system_display['string_inverter_calculations'] = [
      ['DESCRIPTION','SYMBOL','CALCULATION','VALUE'],
      ['Maximum Power (W)                                                   ','source.max_power           ','module.pmp * array.largest_string                                                                   ',source.max_power.toFixed(2)+' W'],
      ['Open-Circuit Voltage (V)                                            ','source.voc                 ','module.voc * array.largest_string                                                                   ',source.voc.toFixed(2)+' V'],
      ['Short-Circuit Current (A)                                           ','source.isc                 ','module.isc                                                                                          ',source.isc.toFixed(2)+' A'],
      ['Maximum Power Voltage (V)                                           ','source.vmp                 ','module.vmp * array.largest_string                                                                   ',source.vmp.toFixed(2)+' V'],
      ['Maximum Power Current (A)                                           ','source.imp                 ','module.imp                                                                                          ',source.imp.toFixed(2)+' A'],
      ['Source Circuit Maximum Current (A), Isc x 1.25                      ','source.Isc_adjusted        ','module.isc * 1.25                                                                                   ',source.Isc_adjusted.toFixed(2)+' A'],
      ['Maximum system voltage Option 1 ( module temp. correction factor )  ','array.max_sys_voltage_2    ','source.voc * ( 1 + module.tc_voc_percent / 100 * ( array.min_temp - 25))                            ',array.max_sys_voltage_2.toFixed(2)+' V'],
      ['Maximum system voltage Option 1 ( general temp. correction factor)  ','array.max_sys_voltage_1    ','source.voc * array.voltage_correction_factor                                                        ',array.max_sys_voltage_1.toFixed(2)+' V'],
      ['Maximum system voltage                                              ','array.max_sys_voltage      ','sf.max( array.max_sys_voltage_1, array.max_sys_voltage_2 )                                          ',array.max_sys_voltage.toFixed(2)+'  '],
      ['Minimum array voltage ( module temp. correction factor )            ','array.min_voltage          ','array.smallest_string * module.vmp * ( 1 + module.tc_voc_percent / 100 * ( array.max_temp - 25 ) )',array.min_voltage.toFixed(2)+' V'],
      ['Maximum Power (W)                                                   ','array.pmp                  ','array.num_of_modules * module.pmp                                                                   ',array.pmp.toFixed(2)+' W'],
      ['Open-Circuit Voltage (V)                                            ','array.voc                  ','source.voc                                                                                          ',array.voc.toFixed(2)+' V'],
      ['Short-Circuit Current (A)                                           ','array.isc                  ','module.isc * array.num_of_strings                                                                   ',array.isc.toFixed(2)+' A'],
      ['Maximum Power Voltage (V)                                           ','array.vmp                  ','module.vmp * array.largest_string                                                                   ',array.vmp.toFixed(2)+' V'],
      ['Maximum Power Current (A)                                           ','array.imp                  ','module.imp * array.num_of_strings                                                                   ',array.imp.toFixed(2)+' A'],
      ['PV Power Source Maximum Current (A)                                 ','array.isc_adjusted         ','array.isc * 1.25                                                                                    ',array.isc_adjusted.toFixed(2)+' A'],
      ['PV Power Source Maximum Voltage (V)                                 ','array.vmp_adjusted         ','array.max_sys_voltage_2                                                                             ',array.vmp_adjusted.toFixed(2)+' V'],
      //['PV Power Source Minimum Voltage (V)                                 ','array.vmp_adjusted_min     ','???                                                                                                 ',array.vmp_adjusted_min.toFixed(2)+'  '],
      ['Maximum Number of Parallel Source Circuits per Output Circuit (1-2) ','array.circuits_per_MPPT    ','Math.ceil( array.num_of_strings / inverter.mppt_channels )                                          ',array.circuits_per_MPPT.toFixed(2)+'  '],
      ['PV Output Circuit Maximum Current (A)                               ','array.combined_isc         ','source.isc * array.circuits_per_MPPT                                                                ',array.combined_isc.toFixed(2)+' A'],
      ['PV Output Circuit Maximum Current (A), Isc x 1.25                   ','array.combined_isc_adjusted','module.isc * 1.25 * array.circuits_per_MPPT                                                         ',array.combined_isc_adjusted.toFixed(2)+' A'],
      ['Maximum PV Output Circuit Voltage at Lowest Temperature             ','array.max_sys_voltage_2    ','array.max_sys_voltage_2                                                                             ',array.max_sys_voltage_2.toFixed(2)+' V'],
    ];
  }


  if( system.config.system_type === 'micro' ){
    system_display['microinverter_calculations'] = [
      ['DESCRIPTION','SYMBOL','CALCULATION','RESULT'],
      ['Maximum source/branch power  ','source.max_power','module.pmp * array.largest_string                            ',source.max_power.toFixed(2) + ' W'],
      ['Maximum source/branch current','source.current  ','inverter.nominal_ac_output_power / 240 * array.largest_string',source.current.toFixed(2) + ' A'],
      ['Maximum array power          ','array.pmp       ','array.num_of_modules * module.pmp                            ',array.pmp.toFixed(2) + ' W'],
      ['Array total power exceeds 10kW','-','error_check.power_check_array = array.pmp > 10000',error_check.power_check_array?'FAIL':'PASS'],
      ['The system has too many inverters per branch circuit.','-','array.largest_string > inverter.max_unitsperbranch',error_check.micro_branch_too_many_modules?'FAIL':'PASS'],
      ['The system has too many inverters per branch circuit.','-','array.smallest_string < inverter.min_unitsperbranch',error_check.micro_branch_too_few_modules?'FAIL':'PASS'],
      ['The branch circuit power limit has exceeded the manufacturer\'s limit.','-','source.max_power > inverter.max_watts_per_branch',error_check.micro_branch_too_much_power?'FAIL':'PASS'],
      ['Module voltage does not meet inverter minimum.','-','module.vmp < inverter.mppt_min',error_check.module_voltage_min?'FAIL':'PASS'],
      ['Module voltage exceeds inverter maximum.','-','module.vmp > inverter.mppt_max',error_check.module_voltage_max?'FAIL':'PASS'],
      ['Module current exceeds inverter maximum.','-','module.isc > inverter.isc_channel',error_check.module_current?'FAIL':'PASS'],
      ['Module cell count exceeds the maximum allowed by the inverter.','-','module.total_number_cells > inverter.max_module_cells',error_check.module_cells?'FAIL':'PASS'],
    ];
  }


  if( system.config.system_type === 'optimizer' ){
    system_display['optimizer_calculations'] = [
      ['DESCRIPTION','SYMBOL','CALCULATION','RESULT'],
      ['Maximum Power (W)                                             ','inverter.dc_voltage_nominal','inverter.mppt_max                                                                                   ', inverter.dc_voltage_nominal.toFixed(2) +' V'],
      ['Maximum Power (W)                                             ','source.max_power           ','module.pmp * array.largest_string                                                                   ', source.max_power.toFixed(2) +'  '],
      ['Maximum Power Voltage (V)                                     ','source.vmp                 ','inverter.dc_voltage_nominal                                                                         ', source.vmp.toFixed(2) +'  '],
      ['Maximum Power Current (A)                                     ','source.imp                 ','source.max_power / source.vmp                                                                       ', source.imp.toFixed(2) +'  '],
      ['Open-Circuit Voltage (V)                                      ','source.voc                 ','1 * array.largest_string                                                                            ', source.voc.toFixed(2) +'  '],
      ['Short-Circuit Current (A)                                     ','source.isc                 ','0.6                                                                                                 ', source.isc.toFixed(2) +'  '],
      ['Maximum Circuit Current (A)                                   ','source.i_max               ','optimizer.max_output_current                                                                        ', source.i_max.toFixed(2) +'  '],
      ['Source Circuit Maximum Current (A), Isc x 1.25                ','source.Isc_adjusted        ','module.isc * 1.25                                                                                   ', source.Isc_adjusted.toFixed(2) +' A'],
      ['Maximum system voltage                                        ','array.max_sys_voltage      ','500                                                                                                 ', array.max_sys_voltage.toFixed(2) +'  '],
      ['Maximum system current                                        ','array.max_sys_current      ','15 * array.num_of_strings                                                                           ', array.max_sys_current.toFixed(2) +'  '],
      ['Minimum array voltage ( module temp. correction factor )      ','array.min_voltage          ','array.smallest_string * module.vmp * ( 1 + module.tc_vpmax_percent / 100 * ( array.max_temp - 25 ) )', array.min_voltage.toFixed(2) +' V'],
      ['Maximum Power (W)                                             ','array.pmp                  ','array.num_of_modules * module.pmp                                                                   ', array.pmp.toFixed(2) +' W'],
      ['Maximum Power Voltage (V)                                     ','array.voc                  ','source.voc                                                                                          ', array.voc.toFixed(2) +' V'],
      ['Maximum Power Current (A)                                     ','array.isc                  ','source.isc                                                                                          ', array.isc.toFixed(2) +' A'],
      ['Open-Circuit Voltage (V)                                      ','array.vmp                  ','string_nominal_voltage[inverter.grid_voltage]                                                       ', array.vmp.toFixed(2) +' V'],
      ['Short-Circuit Current (A)                                     ','array.imp                  ','array.pmp / array.vmp                                                                               ', array.imp.toFixed(2) +' A'],
      ['Short-Circuit Current (A)                                     ','array.imp                  ','array.imp > inverter.imax_channel ? inverter.imax_channel : array.imp                               ', array.imp.toFixed(2) +' A'],
      ['Maximum Number of Parallel Source Circuits per Output Circuit.','array.circuits_per_MPPT    ','Math.ceil( array.num_of_strings / inverter.mppt_channels )                                          ', array.circuits_per_MPPT.toFixed(2) +'  '],
      ['PV Output Circuit Maximum Current per MPPT (A)                ','array.combined_isc         ','source.isc * array.circuits_per_MPPT                                                                ', array.combined_isc.toFixed(2) +' A'],
      ['Total PV Output Circuit Maximum Current (A)                   ','array.total_isc            ','optimizer.max_output_current * array.num_of_strings                                                 ', array.total_isc.toFixed(2) +' A'],
      ['Maximum module voltage                                        ','module.max_voltage         ','module.voc * ( 1 + module.tc_voc_percent / 100 * ( array.min_temp - 25))                            ', module.max_voltage.toFixed(2) +' V'],
    ];
  }



  system_display['interconnection_calculations'] = [
    ['DESCRIPTION','SYMBOL','CALCULATION','RESULT'],
    ['Sum of inverter output current.','intercon.inverter_output_cur_sum', 'source.current * array.num_of_strings',intercon.inverter_output_cur_sum.toFixed(2)+' A'],
    ['Sum of inverter OCPD.','intercon.inverter_ocpd_dev_sum', 'inverter.OCPD * array.num_of_strings',intercon.inverter_ocpd_dev_sum.toFixed(2)+' A'],
    ['Maximum AC current.','intercon.max_ac_current', 'source.current',intercon.max_ac_current.toFixed(2)+' A'],
    ['Maximum AC current (125%)','intercon.max_ac_current_125', 'intercon.max_ac_current * 1.25',intercon.max_ac_current_125.toFixed(2)+' A'],
    ['At least one of the following checks must not fail:'],
    ['(1) The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar exceeded the ampacity of the busbar.'  ],
    ['(2) The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar exceeded 120 percent of the ampacity of the busbar.'  ],
    ['(3) The sum of the ampere ratings of all overcurrent devices on panelboards exceeded the ampacity of the busbar.'  ],
    ['705.12(D)(2)(3)(a)','-','( ( intercon.inverter_output_cur_sum * 1.25 ) + intercon.supply_ocpd_rating ) <= intercon.bussbar_rating',intercon.check_a?'No':'Yes'],
    ['705.12(D)(2)(3)(b)','-','( intercon.inverter_output_cur_sum * 1.25 ) + intercon.supply_ocpd_rating <= intercon.bussbar_rating * 1.2',intercon.check_b?'No':'Yes'],
    ['705.12(D)(2)(3)(c)','-','( intercon.inverter_ocpd_dev_sum + intercon.load_breaker_total ) <= intercon.bussbar_rating',intercon.check_c?'No':'Yes'],
    ['The busbar is not compliant.','-','and( intercon.check_1, intercon.check_2, intercon.check_3 )',error_check.intercon_bus_pass?'FAIL':'PASS'],
    ['Busbar main OCPD exceeds the rating of the busbar.','-','intercon.supply_ocpd_rating > intercon.bussbar_rating',error_check.intercon_check_4?'FAIL':'PASS'],
  ];

  system_display['DC_circuit_calculations'] = [
    ['DESCRIPTION','SYMBOL','CALCULATION'],
    ['Maximum voltage','circuit.max_voltage', 'source.voc'],
    ['Maximum current','circuit.max_current', 'array.combined_isc'],
    ['Total current carring conductors','circuit.total_cc_conductors', '( array.num_of_strings * 2 )'],
    ['Total conductors','circuit.total_conductor', '( array.num_of_strings * 2 ) + 1'],
  ];
  system_display['AC_circuit_calculations'] = [
    ['DESCRIPTION','SYMBOL','CALCULATION'],
    ['Maximum voltage','circuit.max_voltage', 'inverter.grid_voltage'],
    ['Maximum current','circuit.max_current', 'inverter.max_ac_output_current'],
    ['Total current carring conductors','circuit.total_cc_conductors', 'inverter.num_conductors - 1'],
    ['Total conductors','circuit.total_conductor', 'inverter.num_conductors'],

  ];
  system_display['circuit_calculations'] = [
    ['DESCRIPTION','SYMBOL','CALCULATION'],
    ['Temerature adder','circuit.temp_adder', 'lookup module.array_offset_from_roof in NEC TABLE 310.15(B)(3)(c)'],
    ['Max. conductor temoerature','circuit.max_conductor_temp', 'array.max_temp + circuit.temp_adder'],
    // Use Table 2, lookup: circuit.max_conductor_temp, return the first column.
    ['Temperature correction factor','circuit.temp_correction_factor', 'lookup circuit.max_conductor_temp in NEC TABLE 310.15(B)(2)(a)'],
    // Use Table 3, lookup: circuit.total_cc_conductors, return the first column.
    ['Conduit adjustment factor','circuit.conductors_adj_factor', 'lookup circuit.total_cc_conductors in NEC TABLE 310.15(B)(3)(a)'],
    ['Conduit adjustment factor','circuit.conductors_adj_factor', 'if circuit.location = \'Free air\', circuit.conductors_adj_factor = 1'],
  ];
  /*
    The array maximum temperature of the array is equal to the 2% maximum temperature at the install location, or nearest weather station.
    For a state wide design, the largest maximum temperature for the state is used.
    Rooftop array circuits also have a temperature adjustment defined above.

    circuit.max_conductor_temp = array.max_temp + circuit.temp_adder;
    // Use Table 2, lookup: circuit.max_conductor_temp, return the first column.
    circuit.temp_correction_factor = lookup circuit.max_conductor_temp in NEC TABLE 310.15(B)(2)(a);
    // Use Table 3, lookup: circuit.total_cc_conductors, return the first column.
    circuit.conductors_adj_factor = lookup circuit.total_cc_conductors in NEC TABLE 310.15(B)(3)(a);
    if(circuit.location==='Free air') circuit.conductors_adj_factor = 1;
    For AC circuits, the maximum of #1 and #2 is used. For DC circuits, the maximum of #2 and #3 is used.

    circuit.min_req_cond_current    = sf.max( circuit.min_req_cond_current_1, circuit.min_req_cond_current_2 );

    For OCPD calculations, DC uses #3, and AC uses #1.

    circuit.min_req_OCPD_current = sf.if( circuit.power_type === 'DC', circuit.min_req_cond_current_3, circuit.min_req_cond_current_1);


    For strings per MPP tracker of 2 or less, or for inverters with built in OCPD, additional DC OCPD is not required. The AC circuits do require OCPD at the panel.

    circuit.OCPD_required = sf.index( [false, false, true ], circuit.id );
    circuit.ocpd_type = sf.index( ['NA', 'PV Fuse', 'Cir. Breaker'], circuit.id );


    Choose the OCPD that is greater or equal to the minimum required current.

      // Use Table 9, lookup: circuit.min_req_OCPD_current, find the next highest or matching value, return the index column.
      circuit.OCPD = sf.lookup( circuit.min_req_OCPD_current, tables[9], 0, true, true);
      if( circuit_name === 'inverter ac output circuit' ){ inverter.OCPD = circuit.OCPD;



  //*/


  return system_display;
};

module.exports = mk_system_display;
