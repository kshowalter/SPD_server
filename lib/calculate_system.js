var settings_constants = require('./settings/settings_constants.js');
var f = require('./functions/functions.js');

var calculate_system = function(settings){
  var state = settings.state;
  var system = state.system;
  var active_system = state.status.active_system;



  system.array = system.array || {};
  system.array.isc = system.array.module.isc * system.array.number_of_strings;
  system.array.voc = system.array.module.voc * system.array.modules_per_string;
  system.array.imp = system.array.module.imp * system.array.number_of_strings;
  system.array.vmp = system.array.module.vmp * system.array.modules_per_string;
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



  var slope = Number(system.roof.slope.split(':')[0]) / 12;
  var angle_rad = Math.atan( slope );
  length_p = system.roof.section_length * Math.cos(angle_rad);
  var height_diff = system.roof.section_length * Math.sin(angle_rad);
  system.roof.angle = angle_rad * 180 / Math.PI;


  if( system.roof.mean_height >= 30 ) {
    state.notes.errors.push('Mean roof height is greater than 30 ft.');
  }

  // This needs a new calculation, or other input
  // if( system.roof.section_width < system.roof.width3 ){
  // system.roof.least_horizontal_distance = system.roof.section_width;
  // } else {
  // system.roof.least_horizontal_distance = system.roof.width3;
  // }
  system.roof.least_horizontal_distance = system.roof.section_width;
  /////

  var a_MRH = 0.4 * system.roof.mean_height;
  var a_LHD = 0.1 * system.roof.least_horizontal_distance;
  var a_calc = Math.min(a_MRH, a_LHD );
  if( a_calc > 3 ){
    system.roof.a = a_calc;
  } else {
    system.roof.a = 3;
  }



  //system.roof.uplift_pressure_min = codeTables.RAS127(settings);







  /***********
  Module
  ***********/

  if( system.closest_station ){
    //Estimated PV module maximum temperature, Tmax(pv) (°C)
    system.array.module.max_temperature = system.closest_station['High Temp 2% Avg'] + 30;
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
  system.array.max_amps_source_circuit = system.array.module.isc * 1.25;

  //Voltage Correction Factor
  var temperature_correction_factor_Voc;
  if( system.array.module.TC_VOC_PERCENT ){
    temperature_correction_factor_Voc = 1 + system.array.module.TC_VOC_PERCENT/100 * ( system.closest_station['Extreme min']- 25);
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
  if( system.inverter.inverter_specs ){

    var max_strings = system.inverter.inverter_specs.mppt_channels; // MPPT_CHANNELS

    // Maximum Source Circuit Voltage < Inverter Maximum Voltage Rating
    if( system.inverter.inverter_specs && ( system.array.voc > system.inverter.inverter_specs.vmax ) ){
      state.notes.errors.push('Maximum Source Circuit Voltage exceeds Inverter Maximum Voltage Rating');
    }

  }




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
  //"main_panel_supply_ocpd_rating": 200,
  //"main_panel_bussbar_rating": 200,
  //"sum_of_inverter_output_ocpd_devices": 20,
  //"total_of_load_breakers": 20
  //}

  // 2. Main Service Equipment
  //24 Main panel supply OCPD rating (A)
  // system.interconnection.main_panel_supply_ocpd_rating
  //25 Main panel busbar rating (A)
  // system.interconnection.main_panel_bussbar_rating
  //26 Sum of inverter output overcurrent protection devices (A)
  // system.interconnection.sum_of_inverter_output_ocpd_devices
  //27 Sum of inverter(s) output circuit current (A)
  // system.interconnection.sum_of_inverter_output_circuit_current
  //28 Sum of inverter
  // system.interconnection.
  //29 Total of load breakers (A)
  // system.interconnection.total_of_load_breakers


  //Busbar Checks: Shall comply with one of the following methods (a-c)
  var busbar_checks = [];

  //(a) The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar shall not exceed the ampacity of the busbar.
  //=IF(B25>=((B27*1.25)+B24),"Yes (Good)", "No (Bad)")
  if( system.interconnection.main_panel_bussbar_rating >=
      ( ( system.interconnection.sum_of_inverter_output_circuit_current * 1.25 ) +
         system.interconnection.main_panel_supply_ocpd_rating ) ){
    busbar_checks.push(true);
  } else {
    state.notes.info.push('The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar exceeded the ampacity of the busbar.');
    busbar_checks.push(false);
  }

  //(b) Where two sources, one a utility and the other an inverter, are located at opposite ends of a busbar that contains loads, the sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar shall not exceed 120 percent of the ampacity of the busbar.
  //=IF((B27*1.25)+B24<=B25*1.2,"Yes (Good)", "No (Bad)")
  if ( ( system.interconnection.sum_of_inverter_output_circuit_current * 1.25 +
               system.interconnection.main_panel_supply_ocpd_rating ) <=
               system.interconnection.main_panel_bussbar_rating * 1.2 ) {
    busbar_checks.push(true);
  } else {
    state.notes.info.push('The sum of 125 percent of the inverter(s) output circuit current and the rating of the overcurrent device protecting the busbar exceeded 120 percent of the ampacity of the busbar.');
    busbar_checks.push(false);
  }

  //(c) The sum of the ampere ratings of all overcurrent devices on panelboards, both load and supply devices, excluding the rating of the overcurrent device protecting the busbar, shall not exceed the ampacity of the busbar.
  //=IF((B26+B29)<=B25,"Yes (Good)", "No (Bad)")
  if( ( system.interconnection.sum_of_inverter_output_ocpd_devices +
              system.interconnection.total_of_load_breakers ) <=
              system.interconnection.main_panel_bussbar_rating ) {
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
  if( system.interconnection.main_panel_supply_ocpd_rating > system.interconnection.main_panel_bussbar_rating ){
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


  /*
  settings.info.user_input_table.conduits.row_names.forEach(function(conduit_name){
    var conduit_id = f.name_to_id(conduit_name);

    system.conduits[conduit_id+'_'+ 'conductors'] = [];
    settings.info.user_input_table.conduits.conduit_conductors[conduit_name].forEach(function(conductor_name){
      system.conduits[conduit_id+'_'+ 'conductors'].push(conductor_name);
    });

    system.conduits[conduit_id+'_'+f.name_to_id('Total Conductor CSA (in2)')] = [];
    var num_of_types = system.conduits[ conduit_id + '_' + 'qty' ].length;
    for( var i = 0; i < num_of_types; i++){
      var diam = system.conduits[ conduit_id + '_' + f.name_to_id('diameter_inches') ][i];
      var qty = system.conduits[ conduit_id + '_' + 'qty' ][i];
      system.conduits[conduit_id+'_'+f.name_to_id('Total Conductor CSA (in2)')].push( qty * ( 0.25 * Math.PI * Math.pow(diam,2) ) );
    }
    system.conduits[conduit_id+'_'+f.name_to_id('Minimum Required Conduit Area 40% Fill (in2)')] =
      system.conduits[conduit_id+'_'+f.name_to_id('Total Conductor CSA (in2)')].reduce(function(previous_value, current_value){
        return previous_value + current_value;
      });
    if( conduit_name === 'Intermodule Wiring'){
      system.conduits[conduit_id+'_'+f.name_to_id('Minimum Required Conduit Area 40% Fill (in2)')] = 'NA';
    } else if( num_of_types > 2 ){
      system.conduits[conduit_id+'_'+f.name_to_id('Minimum Required Conduit Area 40% Fill (in2)')] =
        system.conduits[conduit_id+'_'+f.name_to_id('Minimum Required Conduit Area 40% Fill (in2)')] / 0.4;
    }


    system.conduits[conduit_id+'_'+ 'material'] = 'CU';
    system.conduits[conduit_id+'_'+ 'voltage_rating'] = '600';
    system.conduits[conduit_id+'_'+ 'wet_temp_rating_°c'] = '90';


    if( system.conduits[conduit_id+'_'+ f.name_to_id('Conduit Area 40% Fill (in2)')] > system.conduits[conduit_id+'_'+ f.name_to_id('Minimum Required Conduit Area 40% Fill (in2)')] ){
      system.conduits[conduit_id+'_'+f.name_to_id('Conduit Size Check')] = 'Yes';
    } else {
      system.conduits[conduit_id+'_'+f.name_to_id('Conduit Size Check')] = 'No';
    }





  });
  */


  return settings;
};

module.exports = calculate_system;
