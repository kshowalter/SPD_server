var settings_constants = require('./settings/settings_constants.js');
var tables = require('./tables.js');
var f = require('./functions/functions.js');

var spreadsheet_functions = require('spreadsheet_functions');
//console.log( 'if', spreadsheet_functions.if(2>1,'yes','no') );
//console.log( 'or', spreadsheet_functions.or(false,false,true,false) );
//console.log( 'and', spreadsheet_functions.and(true,true,true) );
//console.log( 'and', spreadsheet_functions.and(true,true,false,true) );
//console.log( 'max', spreadsheet_functions.max(0,-1,2,3,3,2,2,1,0) );
//console.log( 'min', spreadsheet_functions.min(0,-1,2,3,3,2,2,1,0) );
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

console.log( 'TABLE TEST', lookup(11.9,tables[1], 0));
console.log( 'TABLE TEST', lookup(11.9,tables[1], 0, true));
console.log( 'TABLE TEST', lookup(11.9,tables[1], 1));

var calculate_system = function(system_settings){
  var notes = system_settings.state.notes;

  var array = system_settings.state.system.array;
  var module = system_settings.state.system.module;
  var system = system_settings.state.system.module;
  var inverter = system_settings.state.system.inverter;
  var interconnection = system_settings.state.system.interconnection;
  var conduits = system_settings.state.system.conduits;

  var TEMP_con = {};

  var conduit_names = [
    'DC_array',
    'DC_comb',
    'AC_out',
    'AC_sub_out',
  ];
  conduit_names.forEach(function(conduit_name){
    TEMP_con[conduit_name] = {};
  });


  array.isc = module.isc * array.num_of_strings;
  array.voc = module.voc * array.num_of_modules;
  array.imp = module.imp * array.num_of_strings;
  array.vmp = module.vmp * array.num_of_modules;
  array.pmp = array.vmp  * array.imp;
  array.number_of_modules = array.num_of_modules * array.num_of_strings;

  // Fuses
  array.isc_OCPD = array.isc * 1.25 * 1.25; // TODO: get the real caclulations
  var fuses = [1,5,7.5,10];
  for( var i = 0; i<fuses.length; i++){
    if( array.isc_OCPD < fuses[i] ){
      array.fuse_size = fuses[i];
      return true;
    }
  }


  //System limitation
  if( array.pmp > 10000 ){
    notes.errors.push('System size exceeds 10kW');
  }






  /***********
  Array
  ***********/

  //Maximum Number of Series-Connected Modules per Source Circuit
  array.maximum_modules_in_series = array.num_of_modules;
  //Minimum Number of Series-Connected Modules per Source Circuit
  array.minimum_modules_in_series = array.num_of_modules;

  //Maximum Source Circuit Ratings@ STC
  //Maximum Power (W)
  //Open-Circuit Voltage (V)
  //Short-Circuit Current (A)
  //Maximum Power Voltage (V)
  //Maximum Power Current (A)

  //Source Circuit Maximum Current (A), Isc x 1.25
  array.max_amps_source_circuit = module.isc * 1.25;

  //Voltage Correction Factor
  var temperature_correction_factor_Voc;
  if( module.TC_VOC_PERCENT ){
    temperature_correction_factor_Voc = 1 + module.TC_VOC_PERCENT/100 * ( system.closest_station['Extreme min']- 25);
  } else {
    temperature_correction_factor_Voc = settings_constants.voltage_correction_factor; //TODO: needs table lookup, 690.7
  }
  array.voltage_max = array.voc * temperature_correction_factor_Voc;


  //Minimum array voltage (lowest source circuit Vmp corrected for highest operating temperature): Vmin = Vmp[1 + Cvmp(Tmax - 25)]

  //Maximum System Voltage < Module Maximum Voltage Rating?
  if( false ){
    notes.errors.push('Maximum voltage rating has been exceeded.');
  }
  //Maximum System Voltage < Inverter Maximum Voltage Rating?
  if( false ){
    notes.errors.push('Inverter maximum voltage rating has been exceeded.');
  }
  //Minimum Array Vmp > Inverter Minimum Operating Voltage
  if( false ){
    notes.note.push('Minimum array voltage is greater than minimum inverter operating or MPPT voltage. Not a code requirement. If "No", one or more strings may mave too few series-connected modules.');
  }

  //PV Output Circuit Maximum Current (A), Isc x 1.25
  array.Maximum_isc = array.isc * 1.25;
  //Maximum PV Output Circuit Voltage at Lowest Temperature

  //PV output circuit maximum current <= Inverter maximum dc current per MPPT input?
  if( false ){
    notes.note.push('PV output circuit maximum current <= Inverter maximum dc current per MPPT input');
  }

  //Maximum Power (W)
  //Open-Circuit Voltage (V)
  //Short-Circuit Current (A)
  //Maximum Power Voltage (V)
  //Maximum Power Current (A)

  //PV Power Source Maximum Current (A)
  //PV Power Source Maximum Voltage (V)

  //Inverter maximum dc operating current per input >= PV source circuit maximum current
  if( false ){
    notes.note.push('Inverter maximum dc operating current per input >= PV source circuit maximum current');
  }


  /***********
  Inverter
  ************/

  var max_strings = inverter.mppt_channels; // MPPT_CHANNELS

  // Maximum Source Circuit Voltage < Inverter Maximum Voltage Rating
  if( array.voc > inverter.vmax ){
    notes.errors.push('Maximum Source Circuit Voltage exceeds Inverter Maximum Voltage Rating');
  }




  /******************
  Interconection
  ******************/

  if( interconnection.inverter_subpanel_used === 'Yes' ){

    // 1. Inverter Collection SubPanel
    //Busbar Checks: Shall comply with one of the following methods (a-c)
    //(a) The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar shall not exceed the ampacity of the busbar.
    //=IF(B11>=((B13*1.25)+B10),"Yes (Good)", "No (Bad)")
    //(b) Where two sources, one a utility and the other an inverter, are located at opposite ends of a busbar that contains loads, the sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar shall not exceed 120 percent of the ampacity of the busbar.
    //=IF(((B13*1.25)+B10)<=B11*1.2,"Yes (Good)", "No (Bad)")
    //(c) The sum of the ampere ratings of all overcurrent devices on panelboards, both load and supply devices, excluding the rating of the overcurrent device protecting the busbar, shall not exceed the ampacity of the busbar.
    //=IF((B14+B12)<=B11,"Yes (Good)", "No (Bad)")
    //The rating of the overcurrent device protecting the busbar shall not exceed the rating of the busbar.
    //=IF(B10<=B11,"Yes (Good)", "No (Bad)")

  }


  //settings.state.system.interconnection = {
  //"supply_ocpd_rating": 200,
  //"bussbar_rating": 200,
  //"sum_of_inverter_output_ocpd_devices": 20,
  //"load_breaker_total": 20
  //}

  // 2. Main Service Equipment
  //24 Main panel supply OCPD rating (A)
  // system.interconnection.supply_ocpd_rating
  //25 Main panel busbar rating (A)
  // system.interconnection.bussbar_rating
  //26 Sum of inverter output overcurrent protection devices (A)
  // system.interconnection.sum_of_inverter_output_ocpd_devices
  //27 Sum of inverter(s) output circuit current (A)
  // inverter.max_ac_output_current
  //28 Sum of inverter
  // system.interconnection.
  //29 Total of load breakers (A)
  // system.interconnection.load_breaker_total


  //Busbar Checks: Shall comply with one of the following methods (a-c)
  var busbar_checks = [];

  //(a) The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar shall not exceed the ampacity of the busbar.
  //=IF(B25>=((B27*1.25)+B24),"Yes (Good)", "No (Bad)")
  if( interconnection.bussbar_rating >=
      ( ( inverter.max_ac_output_current * 1.25 ) +
         interconnection.supply_ocpd_rating ) ){
    busbar_checks.push(true);
  } else {
    notes.info.push('The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar exceeded the ampacity of the busbar.');
    busbar_checks.push(false);
  }

  //(b) Where two sources, one a utility and the other an inverter, are located at opposite ends of a busbar that contains loads, the sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar shall not exceed 120 percent of the ampacity of the busbar.
  //=IF((B27*1.25)+B24<=B25*1.2,"Yes (Good)", "No (Bad)")
  if ( ( inverter.max_ac_output_current * 1.25 +
               interconnection.supply_ocpd_rating ) <=
               interconnection.bussbar_rating * 1.2 ) {
    busbar_checks.push(true);
  } else {
    notes.info.push('The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar exceeded 120 percent of the ampacity of the busbar.');
    busbar_checks.push(false);
  }

  //(c) The sum of the ampere ratings of all overcurrent devices on panelboards, both load and supply devices, excluding the rating of the overcurrent device protecting the busbar, shall not exceed the ampacity of the busbar.
  //=IF((B26+B29)<=B25,"Yes (Good)", "No (Bad)")
  if( ( interconnection.sum_of_inverter_output_ocpd_devices +
              interconnection.load_breaker_total ) <=
              interconnection.bussbar_rating ) {
    busbar_checks.push(true);
  } else {
    notes.info.push('The sum of the ampere ratings of all overcurrent devices on panelboards exceeded the ampacity of the busbar.');
    busbar_checks.push(false);
  }

  var busbar_pass = false;
  busbar_checks.forEach(function(check){
    if( check ){
      busbar_pass = true;
    }
  });
  if( ! busbar_pass ){
    notes.errors.push('The busbar is not compliant.');
  }

  //"The rating of the overcurrent device protecting the busbar shall not exceed the rating of the busbar. "
  //=IF(B24<=B25,"Yes (Good)", "No (Bad)")
  if( interconnection.supply_ocpd_rating > interconnection.bussbar_rating ){
    notes.errors.push('The rating of the overcurrent device protecting the busbar exceeded the rating of the busbar.');
  }









  /******************
    conductors and conduits
  ******************/
  conduit_names.forEach(function(conduit_name){
    console.log(conduit_name);
    var conduit = conduits[conduit_name];


  });




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


  return system_settings;
};

module.exports = calculate_system;
