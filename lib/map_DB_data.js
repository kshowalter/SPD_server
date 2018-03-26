var map_DB_data = function(DB_data){
  var data = {
    company: {},
    array: {},
    inverter: {},
    optimizer: {},
    module: {},
    source: {},
    subpannel: {},
    interconnection: {},
    circuits: {},
    error_check: {},
  };






  for( var name in DB_data.module ){
    data.module[name] = DB_data.module[name];
  }

  data.array['num_of_modules'] = DB_data.module['num_of_modules'];
  data.array['num_of_strings'] = DB_data.module['num_of_strings'];
  data.array['smallest_string'] = DB_data.module['smallest_string'];
  data.array['largest_string'] = DB_data.module['largest_string'];

  for( var name in DB_data.inverter ){
    data.inverter[name] = DB_data.inverter[name];
  }

  data.interconnection['grid_voltage'] = DB_data['inverter']['grid_voltage'];
  data.interconnection['bussbar_rating'] = DB_data['system']['bussbar_rating'];
  data.interconnection['supply_ocpd_rating'] = DB_data['system']['supply_ocpd_rating'];
  data.interconnection['inverter_ocpd_dev_sum'] = DB_data['system']['inverter_ocpd_dev_sum'];
  data.interconnection['inverter_output_cur_sum'] = DB_data['system']['inverter_output_cur_sum'];
  data.interconnection['load_breaker_total'] = DB_data['system']['load_breaker_total'];


  data.optimizer['id'] = DB_data.inverter['opti_id'];
  data.optimizer['manufacturer_name'] = DB_data.inverter['opti_manufacturer_name'];
  data.optimizer['name'] = DB_data.inverter['opti_name'];
  data.optimizer['rated_max_power'] = DB_data.inverter['opti_rated_max_power'];
  data.optimizer['max_input_voltage'] = DB_data.inverter['opti_max_input_voltage'];
  data.optimizer['mppt_op_range_min'] = DB_data.inverter['opti_mppt_op_range_min'];
  data.optimizer['mppt_op_range_max'] = DB_data.inverter['opti_mppt_op_range_max'];
  data.optimizer['max_isc'] = DB_data.inverter['opti_max_isc'];
  data.optimizer['max_output_current'] = DB_data.inverter['opti_max_output_current'];
  data.optimizer['max_output_voltage'] = DB_data.inverter['opti_max_output_voltage'];
  data.optimizer['min_optis_per_string'] = DB_data.inverter['opti_min_optis_per_string'];
  data.optimizer['max_optis_per_string'] = DB_data.inverter['opti_max_optis_per_string'];
  data.optimizer['max_power_per_string'] = DB_data.inverter['opti_max_power_per_string'];


  for( var name in DB_data.company ){
    data.company[name] = DB_data.company[name];
  }

  //////////////
  /// TEMP DB fixes
  data.array.circuits_per_MPPT = data.array.circuits_per_MPPT || 1;
  data.inverter.tranformerless = true;
  data.module.array_offset_from_roof = data.module.array_offset_from_roof || 0;

  data.inverter.mppt_channels = data.inverter.mppt_channels || 1;
  data.inverter.vmax = data.inverter.vmax || 600;

  if( ! data.inverter.device_type_id ){
    data.inverter.device_type_id = 53;
  }

  if( data.inverter.device_type_id == 56 ){

  } else if( ! data.inverter.isc_channel && data.inverter.imax_total === null ){ // older SMA data
    data.inverter.isc_channel = data.inverter.imax_channel;
    data.inverter.imax_channel = null;
    data.inverter.imax_total = null;
  } else if( ! data.inverter.isc_channel && data.inverter.imax_total ) { // old field names
    data.inverter.isc_channel = data.inverter.imax_total;
    data.inverter.imax_total = null;
    //data.inverter.imax_channel = data.inverter.imax_channel;
  } // else: field names have been updated, do nothing.

  data.inverter.arc_fault_circuit_protection = 'Yes';
  data.inverter.gfdi = 'Yes';

  if( data.inverter.device_type_id === 53 ){
    data.inverter.system_type = 'string';
    data.inverter.oversize_limit = 1.20;
  } else if(data.inverter.device_type_id === 54){
    data.inverter.system_type = 'micro';
  } else if(data.inverter.device_type_id === 56){
    data.inverter.system_type = 'optimizer';
    if( data.inverter.device_name &&
        data.inverter.device_name.split('-')[0] &&
        data.inverter.device_name.split('-')[0].slice(-1) === 'H' ){
      data.inverter.oversize_limit = 1.55;
    } else {
      data.inverter.oversize_limit = 1.35;
    }

  }


  //////////////////////////
  for( var section_name in data ){
    for( var value_name in data[section_name] ){
      if( data[section_name][value_name] === true ){
        data[section_name][value_name] = 'Yes';
      }
      if( data[section_name][value_name] === false ){
        data[section_name][value_name] = 'No';
      }
    }
  }


  return data;
};

module.exports = map_DB_data;
