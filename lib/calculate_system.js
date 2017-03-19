var settings_constants = require('./settings/settings_constants.js');
var tables = require('./tables.js');
var f = require('./functions/functions.js');
var math = require('mathjs');
var sf = require('spreadsheet_functions');

var PI = function(){
  return math.pi;
};

var lookup = function(search_key, table, col, reverse){
  col -= 1;
  var key_last_match;

  if( isNaN(search_key) ){ // search_key is string, not a number
    if( table[search_key] !== undefined ){
      key_last_match = search_key;
    } else {
      return false;
    }
  } else { // else is number
    var search_value = Number(search_key);
    key_last_match = Object.keys(table)[0];

    for( var key in table){
      var key_number = Number(key);
      if( key_number === search_value ){ // Exact match
        key_last_match = key;
        break;
      } else if( !reverse && key_number < search_value ){ // Possible match, but we might find a closer one.
        key_last_match = key;
      } else if( reverse && key_number > search_value ){ // Possible match, but we might find a closer one.
        key_last_match = key;
      }
    }
  }
  if( col === -1 ){
    return key_last_match;
  } else {
    return table[key_last_match][col];
  }
};

var calculate_system = function(system_settings){
  var notes = system_settings.state.notes;

  var array = system_settings.state.system.array;
  var module = system_settings.state.system.module;
  var source = system_settings.state.system.source;
  var system = system_settings.state.system.module;
  var inverter = system_settings.state.system.inverter;
  var interconnection = system_settings.state.system.interconnection;
  var circuits = system_settings.state.system.circuits;







  array.max_temp = 36;
  array.min_temp = -9;
  inverter.AC_OCPD_max = sf.if( sf.not( inverter.max_ac_ocpd ), inverter.max_ac_output_current * 1.25, inverter.max_ac_ocpd );
  inverter.nominal_ac_output_power = inverter['nominal_ac_output_power_'+inverter.grid_voltage];
  inverter.max_ac_output_current = inverter['max_ac_ouput_current_'+inverter.grid_voltage];
  array.code_limit_max_voltage = 600;
  source.max_power = module.pmp * array.largest_string;
  source.voc = module.voc * array.largest_string;
  source.isc = module.isc;
  source.vmp = module.vmp * array.largest_string;
  source.imp = module.imp;
  source.Isc_adjusted = module.isc * 1.25;
  array.voltage_correction_factor = sf.if( array.min_temp < -5, 1.12, 1.14);
  array.max_sys_voltage_1 = source.voc * array.voltage_correction_factor;
  array.max_sys_voltage_2 = source.voc * ( 1 + module.tc_voc_percent / 100 * ( array.min_temp - 25));
  array.max_sys_voltage = sf.max( array.max_sys_voltage_1, array.max_sys_voltage_2 );
  array.min_voltage = array.smallest_string * module.vmp * ( 1 + module.tc_vpmax_percent / 100 * ( array.max_temp - 25 ) );
  array.test_1 = array.max_sys_voltage > module.max_system_v;
  array.test_2 = array.max_sys_voltage > array.code_limit_max_voltage;
  array.test_3 = array.max_sys_voltage > inverter.vmax;
  array.test_4 = array.min_voltage < inverter.voltage_range_min;
  array.circuits_per_MPPT = array.num_of_strings / inverter.MPPT_inputs;
  array.combined_Isc_adjusted = module.isc * 1.25 * array.circuits_per_MPPT;
  array.max_sys_voltage_2 = array.max_sys_voltage_2;
  array.test_5 = array.combined_Isc_adjusted > inverter.imax_channel;
  array.pmp = array.num_of_modules * module.pmp;
  array.voc = source.voc;
  array.isc = module.isc * array.num_of_strings;
  array.vmp = module.vmp * array.largest_string;
  array.imp = module.imp * array.num_of_strings;
  array.imp_adjusted = array.isc * 1.25;
  array.vmp_adjusted = array.max_sys_voltage_2;
  array.current_check_inverter = array.imp_adjusted > inverter.imax_channel;
  array.power_check_inverter = array.pmp > 10000;
  interconnection.subpanel = inverter.grid_voltage;
  interconnection.check_1 = ( ( interconnection.inverter_output_cur_sum * 1.25 ) + interconnection.supply_ocpd_rating ) > interconnection.bussbar_rating;
  interconnection.check_2 = ( interconnection.inverter_output_cur_sum * 1.25 ) + interconnection.supply_ocpd_rating > interconnection.bussbar_rating * 1.2;
  interconnection.check_3 = ( interconnection.inverter_ocpd_dev_sum + interconnection.load_breaker_total ) > interconnection.bussbar_rating;
  interconnection.bus_pass = sf.not(sf.or( interconnection.check_1, interconnection.check_2, interconnection.check_3 ));
  interconnection.check_4 = interconnection.supply_ocpd_rating > interconnection.bussbar_rating;





  if( array.test_1 ){ notes.errors.push('Maximum system voltage exceeds the modules max system voltage.'); }
  if( array.test_2 ){ notes.errors.push('Maximum system voltage exceeds the maximum voltage allows by code.'); }
  if( array.test_3 ){ notes.errors.push('Maximum system voltage exceeds the inverter maximum voltage rating?'); }
  if( array.test_4 ){ notes.errors.push('Minimum Array Vmp is less than the inverter minimum operating voltage.'); }
  if( array.test_5 ){ notes.errors.push('PV output circuit maximum current exceeds the inverter maximum dc current per MPPT input.'); }
  if( array.current_check_inverter ){ notes.errors.push('Inverter maximum DC operating current per input exceeds the PV source circuit maximum current.'); }
  if( array.power_check_inverter ){ notes.errors.push('Array voltage exceeds 10kW'); }
  if( interconnection.bus_pass ){ notes.errors.push('The busbar is not compliant.'); }
  if( interconnection.check_4 ){ notes.errors.push('The rating of the overcurrent device protecting the busbar exceeds the rating of the busbar. '); }





  /******************
    conductors and conduits
  ******************/
  var circuit_names = [
    'PV DC SOURCE CIRCUITS',
    'PV DC COMBINED OUTPUT CIRCUITS',
    'INVERTER AC OUTPUT CIRCUIT',
  ];

  circuit_names.forEach(function(circuit_name){
    circuits[circuit_name] = {};
    //console.log(circuit_name);
    var circuit = circuits[circuit_name];

    circuit.temp_adder = lookup( module.array_offset_from_roof, tables[1] );
    circuit.max_conductor_temp = array.max_temp + circuit.temp_adder;
    circuit.temp_correction_factor = lookup( circuit.max_conductor_temp, tables[2] );
    circuit.total_CC_conductors = array.num_of_strings * 2 + [1,1,2,3];
    circuit.conductors_adj_factor = lookup( circuit.total_CC_conductors , tables[3] );
    circuit.min_req_cond_current_1 = circuit.max_current * 1.25;
    circuit.min_req_cond_current_2 = circuit.max_current / ( circuit.temp_correction_factor * circuit.conductors_adj_factor );
    circuit.min_req_cond_current = sf.max( circuit.min_req_cond_current_1, circuit.min_req_cond_current_2 );
    circuit.conductor_current = lookup( circuit.min_req_cond_current, tables[4], 0, true );
    circuit.conductor_size_min = lookup( circuit.conductor_current, tables[4] );
    circuit.conductor_label = sf.index( ['DC+/DC-, EGC', 'DC+/DC-, EGC', 'L1/L2, N, EGC', 'L1/L2, N, EGC, GEC'], circuit.id );
    circuit.location_label = sf.index( ['Conduit/Exterior', 'Conduit/Interior', 'Conduit/Interior', 'Conduit/Exterior'], circuit.id );
    circuit.material_label = 'CU';
    circuit.type_label = sf.index( ['PV Wire, bare', 'THWN-2', 'THWN-2', 'THWN-2, bare'], circuit.id );
    circuit.volt_rating = 600;
    circuit.wet_temp_rating = 90;
    circuit.conductor_strands = lookup( circuit.conductor_size_min, tables[5], 2 );
    circuit.conductor_diameter = lookup( circuit.conductor_size_min, tables[5], 3 );
    circuit.min_req_conduit_area_40 = circuit.total_CC_conductors * ( 0.25 * PI() * lookup( circuit.conductor_size_min, tables[5], 3 ) ^2 );
    circuit.conduit_type = sf.index( ['PVC (80)', 'EMT', 'EMT', 'EMT'], circuit.id );
    circuit.OCPD_required = sf.index( [ array.num_of_strings > 2, false, true, true ], circuit.id );
    circuit.ocpd_type = sf.index( ['PV Fuse', 'NA', ' Circuit Breaker', 'Circuit Breaker'], circuit.id );
    circuit.OCPD_min = circuit.min_req_cond_current_1 * 1.25;
    circuit.conductor_current_CU = circuit.conductor_current * circuit.temp_correction_factor * circuit.conductors_adj_factor;
    circuit.next_largest_OCPD = lookup( circuit.min_req_cond_current, tables[8], 0, true);
    circuit.ocpd_check_2 = circuit.OCPD_min <= circuit.next_largest_OCPD;

    if( circuit.ocpd_check_2 ){ notes.errors.push('Check Adj. Conductor Amapacity > OCPD Rating '); }


  });



  /*
  conduits[f.name_to_id('Intermodule Wiring')+'_'+'location'] = 'FREE AIR';
  conduits[f.name_to_id('PV DC Source Circuits')+'_'+'location'] = '3/4" EMT';
  conduits[f.name_to_id('PV DC Output Circuits')+'_'+'location'] = '3/4" EMT';
  conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'location'] = '3/4" EMT';
  conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'location'] = '3/4" EMT';
  conduits[f.name_to_id('Main Service Equipment')+'_'+'location'] = '3/4" EMT';

  conduits[f.name_to_id('Intermodule Wiring')+'_'+'minimum_size_awg'] = '10, RACKING/6';
  conduits[f.name_to_id('PV DC Source Circuits')+'_'+'minimum_size_awg'] = '10, 6';
  conduits[f.name_to_id('PV DC Output Circuits')+'_'+'minimum_size_awg'] = '10, 6';
  conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'minimum_size_awg'] = '8, 8, 6';
  conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'minimum_size_awg'] = '4, 4, 6, 4';
  conduits[f.name_to_id('Main Service Equipment')+'_'+'minimum_size_awg'] = '4/0, 2/0, 4, 4';

  conduits[f.name_to_id('Intermodule Wiring')+'_'+'type'] = 'PV WIRE, BARE';
  conduits[f.name_to_id('PV DC Source Circuits')+'_'+'type'] = 'THWN-2';
  conduits[f.name_to_id('PV DC Output Circuits')+'_'+'type'] = 'THWN-2';
  conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'type'] = 'THWN-2';
  conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'type'] = 'THWN-2, BARE';
  conduits[f.name_to_id('Main Service Equipment')+'_'+'type'] = 'THWN-2, BARE';

  conduits[f.name_to_id('Intermodule Wiring')+'_'+'conductor_ampacity'] = '40';
  conduits[f.name_to_id('PV DC Source Circuits')+'_'+'conductor_ampacity'] = '40';
  conduits[f.name_to_id('PV DC Output Circuits')+'_'+'conductor_ampacity'] = '40';
  //conductor_ampacity? or max OCPD? = nominal_ac_output_current * 1.25
  conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'conductor_ampacity'] = '55';
  conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'conductor_ampacity'] = '85';
  conduits[f.name_to_id('Main Service Equipment')+'_'+'conductor_ampacity'] = '200';

  conduits[f.name_to_id('Intermodule Wiring')+'_'+'diameter_inches'] = [0.164];
  conduits[f.name_to_id('PV DC Source Circuits')+'_'+'diameter_inches'] = [0.164, 0.254];
  conduits[f.name_to_id('PV DC Output Circuits')+'_'+'diameter_inches'] = [0.164, 0.254];
  conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'diameter_inches'] = [0.216, 0.216, 0.254];
  conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'diameter_inches'] = [0.324, 0.324, 0.216];
  conduits[f.name_to_id('Main Service Equipment')+'_'+'diameter_inches'] = [0.642, 0.532, 0.324];

  var n = array.num_of_strings * 2;
  conduits[f.name_to_id('Intermodule Wiring')+'_'+'qty'] = [2];
  conduits[f.name_to_id('PV DC Source Circuits')+'_'+'qty'] = [n, 1];
  conduits[f.name_to_id('PV DC Output Circuits')+'_'+'qty'] = [n, 1];
  conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'qty'] = [2,1,1];
  conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'qty'] = [2,1,1];
  conduits[f.name_to_id('Main Service Equipment')+'_'+'qty'] = [2,1,1];

  */



  return system_settings;
};

module.exports = calculate_system;
