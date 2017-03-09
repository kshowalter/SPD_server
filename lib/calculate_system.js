var settings_constants = require('./settings/settings_constants.js');
var f = require('./functions/functions.js');

var spreadsheet_functions = require('spreadsheet_functions');
//console.log( 'if', spreadsheet_functions.if(2>1,'yes','no') );
//console.log( 'or', spreadsheet_functions.or(false,false,true,false) );
//console.log( 'and', spreadsheet_functions.and(true,true,true) );
//console.log( 'and', spreadsheet_functions.and(true,true,false,true) );
//console.log( 'max', spreadsheet_functions.max(0,-1,2,3,3,2,2,1,0) );
//console.log( 'min', spreadsheet_functions.min(0,-1,2,3,3,2,2,1,0) );

var calculate_system = function(settings){
  var state = settings.state;
  var system = state.system;
  var active_system = state.status.active_system;



  system.array = system.array || {};
  system.array.isc = system.module.isc * system.array.number_of_strings;
  system.array.voc = system.module.voc * system.array.modules_per_string;
  system.array.imp = system.module.imp * system.array.number_of_strings;
  system.array.vmp = system.module.vmp * system.array.modules_per_string;
  system.array.pmp = system.array.vmp  * system.array.imp;
  system.array.number_of_modules = system.array.modules_per_string * system.array.number_of_strings;

  // Fuses
  system.array.isc_OCPD = system.array.isc * 1.25 * 1.25; // TODO: get the real caclulations
  var fuses = [1,5,7.5,10];
  for( var i = 0; i<fuses.length; i++){
    if( system.array.isc_OCPD < fuses[i] ){
      system.array.fuse_size = fuses[i];
      return true;
    }
  }


  //System limitation
  if( system.array.pmp > 10000 ){
    state.notes.errors.push('System size exceeds 10kW');
    state.status.inCompliance = false;
  }






  /***********
  Array
  ***********/

  //Maximum Number of Series-Connected Modules per Source Circuit
  system.array.maximum_modules_in_series = system.array.modules_per_string;
  //Minimum Number of Series-Connected Modules per Source Circuit
  system.array.minimum_modules_in_series = system.array.modules_per_string;

  //Maximum Source Circuit Ratings@ STC
  //Maximum Power (W)
  //Open-Circuit Voltage (V)
  //Short-Circuit Current (A)
  //Maximum Power Voltage (V)
  //Maximum Power Current (A)

  //Source Circuit Maximum Current (A), Isc x 1.25
  system.array.max_amps_source_circuit = system.module.isc * 1.25;

  //Voltage Correction Factor
  var temperature_correction_factor_Voc;
  if( system.module.TC_VOC_PERCENT ){
    temperature_correction_factor_Voc = 1 + system.module.TC_VOC_PERCENT/100 * ( system.closest_station['Extreme min']- 25);
  } else {
    temperature_correction_factor_Voc = settings_constants.voltage_correction_factor; //TODO: needs table lookup, 690.7
  }
  system.array.voltage_max = system.array.voc * temperature_correction_factor_Voc;


  //Minimum array voltage (lowest source circuit Vmp corrected for highest operating temperature): Vmin = Vmp[1 + Cvmp(Tmax - 25)]

  //Maximum System Voltage < Module Maximum Voltage Rating?
  if( false ){
    system.notes.errors.push('Maximum voltage rating has been exceeded.');
  }
  //Maximum System Voltage < Inverter Maximum Voltage Rating?
  if( false ){
    system.notes.errors.push('Inverter maximum voltage rating has been exceeded.');
  }
  //Minimum Array Vmp > Inverter Minimum Operating Voltage
  if( false ){
    system.notes.note.push('Minimum array voltage is greater than minimum inverter operating or MPPT voltage. Not a code requirement. If "No", one or more strings may mave too few series-connected modules.');
  }

  //PV Output Circuit Maximum Current (A), Isc x 1.25
  system.array.Maximum_isc = system.array.isc * 1.25;
  //Maximum PV Output Circuit Voltage at Lowest Temperature

  //PV output circuit maximum current <= Inverter maximum dc current per MPPT input?
  if( false ){
    system.notes.note.push('PV output circuit maximum current <= Inverter maximum dc current per MPPT input');
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
    system.notes.note.push('Inverter maximum dc operating current per input >= PV source circuit maximum current');
  }


  /***********
  Inverter
  ************/

  var max_strings = system.inverter.mppt_channels; // MPPT_CHANNELS

  // Maximum Source Circuit Voltage < Inverter Maximum Voltage Rating
  if( system.array.voc > system.inverter.vmax ){
    state.notes.errors.push('Maximum Source Circuit Voltage exceeds Inverter Maximum Voltage Rating');
  }

  system.inverter.nominal_ac_output_power = system.inverter['nominal_ac_output_power_'+system.inverter.grid_voltage];
  system.inverter.max_ac_ouput_current = system.inverter['max_ac_ouput_current_'+system.inverter.grid_voltage];


  /******************
  Interconection
  ******************/

  if( system.interconnection.inverter_subpanel_used === 'Yes' ){

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
  // system.inverter.max_ac_ouput_current
  //28 Sum of inverter
  // system.interconnection.
  //29 Total of load breakers (A)
  // system.interconnection.load_breaker_total


  //Busbar Checks: Shall comply with one of the following methods (a-c)
  var busbar_checks = [];

  //(a) The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar shall not exceed the ampacity of the busbar.
  //=IF(B25>=((B27*1.25)+B24),"Yes (Good)", "No (Bad)")
  if( system.interconnection.bussbar_rating >=
      ( ( system.inverter.max_ac_ouput_current * 1.25 ) +
         system.interconnection.supply_ocpd_rating ) ){
    busbar_checks.push(true);
  } else {
    state.notes.info.push('The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar exceeded the ampacity of the busbar.');
    busbar_checks.push(false);
  }

  //(b) Where two sources, one a utility and the other an inverter, are located at opposite ends of a busbar that contains loads, the sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar shall not exceed 120 percent of the ampacity of the busbar.
  //=IF((B27*1.25)+B24<=B25*1.2,"Yes (Good)", "No (Bad)")
  if ( ( system.inverter.max_ac_ouput_current * 1.25 +
               system.interconnection.supply_ocpd_rating ) <=
               system.interconnection.bussbar_rating * 1.2 ) {
    busbar_checks.push(true);
  } else {
    state.notes.info.push('The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar exceeded 120 percent of the ampacity of the busbar.');
    busbar_checks.push(false);
  }

  //(c) The sum of the ampere ratings of all overcurrent devices on panelboards, both load and supply devices, excluding the rating of the overcurrent device protecting the busbar, shall not exceed the ampacity of the busbar.
  //=IF((B26+B29)<=B25,"Yes (Good)", "No (Bad)")
  if( ( system.interconnection.sum_of_inverter_output_ocpd_devices +
              system.interconnection.load_breaker_total ) <=
              system.interconnection.bussbar_rating ) {
    busbar_checks.push(true);
  } else {
    state.notes.info.push('The sum of the ampere ratings of all overcurrent devices on panelboards exceeded the ampacity of the busbar.');
    busbar_checks.push(false);
  }

  var busbar_pass = false;
  busbar_checks.forEach(function(check){
    if( check ){
      busbar_pass = true;
    }
  });
  if( ! busbar_pass ){
    state.notes.errors.push('The busbar is not compliant.');
  }

  //"The rating of the overcurrent device protecting the busbar shall not exceed the rating of the busbar. "
  //=IF(B24<=B25,"Yes (Good)", "No (Bad)")
  if( system.interconnection.supply_ocpd_rating > system.interconnection.bussbar_rating ){
    state.notes.errors.push('The rating of the overcurrent device protecting the busbar exceeded the rating of the busbar.');
  }



  /******************
    conductors and conduits
  ******************/




  system.conduits[f.name_to_id('Intermodule Wiring')+'_'+'location'] = 'FREE AIR';
  system.conduits[f.name_to_id('PV DC Source Circuits')+'_'+'location'] = '3/4" EMT';
  system.conduits[f.name_to_id('PV DC Output Circuits')+'_'+'location'] = '3/4" EMT';
  system.conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'location'] = '3/4" EMT';
  system.conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'location'] = '3/4" EMT';
  system.conduits[f.name_to_id('Main Service Equipment')+'_'+'location'] = '3/4" EMT';

  system.conduits[f.name_to_id('Intermodule Wiring')+'_'+'minimum_size_awg'] = '10, RACKING/6';
  system.conduits[f.name_to_id('PV DC Source Circuits')+'_'+'minimum_size_awg'] = '10, 6';
  system.conduits[f.name_to_id('PV DC Output Circuits')+'_'+'minimum_size_awg'] = '10, 6';
  system.conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'minimum_size_awg'] = '8, 8, 6';
  system.conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'minimum_size_awg'] = '4, 4, 6, 4';
  system.conduits[f.name_to_id('Main Service Equipment')+'_'+'minimum_size_awg'] = '4/0, 2/0, 4, 4';

  system.conduits[f.name_to_id('Intermodule Wiring')+'_'+'type'] = 'PV WIRE, BARE';
  system.conduits[f.name_to_id('PV DC Source Circuits')+'_'+'type'] = 'THWN-2';
  system.conduits[f.name_to_id('PV DC Output Circuits')+'_'+'type'] = 'THWN-2';
  system.conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'type'] = 'THWN-2';
  system.conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'type'] = 'THWN-2, BARE';
  system.conduits[f.name_to_id('Main Service Equipment')+'_'+'type'] = 'THWN-2, BARE';

  system.conduits[f.name_to_id('Intermodule Wiring')+'_'+'conductor_ampacity'] = '40';
  system.conduits[f.name_to_id('PV DC Source Circuits')+'_'+'conductor_ampacity'] = '40';
  system.conduits[f.name_to_id('PV DC Output Circuits')+'_'+'conductor_ampacity'] = '40';
  //conductor_ampacity? or max OCPD? = nominal_ac_output_current * 1.25
  system.conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'conductor_ampacity'] = '55';
  system.conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'conductor_ampacity'] = '85';
  system.conduits[f.name_to_id('Main Service Equipment')+'_'+'conductor_ampacity'] = '200';

  system.conduits[f.name_to_id('Intermodule Wiring')+'_'+'diameter_inches'] = [0.164];
  system.conduits[f.name_to_id('PV DC Source Circuits')+'_'+'diameter_inches'] = [0.164, 0.254];
  system.conduits[f.name_to_id('PV DC Output Circuits')+'_'+'diameter_inches'] = [0.164, 0.254];
  system.conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'diameter_inches'] = [0.216, 0.216, 0.254];
  system.conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'diameter_inches'] = [0.324, 0.324, 0.216];
  system.conduits[f.name_to_id('Main Service Equipment')+'_'+'diameter_inches'] = [0.642, 0.532, 0.324];

  var n = settings.state.system.array.number_of_strings * 2;
  system.conduits[f.name_to_id('Intermodule Wiring')+'_'+'qty'] = [2];
  system.conduits[f.name_to_id('PV DC Source Circuits')+'_'+'qty'] = [n, 1];
  system.conduits[f.name_to_id('PV DC Output Circuits')+'_'+'qty'] = [n, 1];
  system.conduits[f.name_to_id('Inverter AC Output Circuit')+'_'+'qty'] = [2,1,1];
  system.conduits[f.name_to_id('Feeder Circuit to Inverter Subpanel')+'_'+'qty'] = [2,1,1];
  system.conduits[f.name_to_id('Main Service Equipment')+'_'+'qty'] = [2,1,1];


  return settings;
};

module.exports = calculate_system;
