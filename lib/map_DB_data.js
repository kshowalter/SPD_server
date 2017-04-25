var map_DB_data = function(DB_data){
  var data = {
    company: {},
    array: {},
    inverter:{},
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

  data.interconnection['bussbar_rating'] = DB_data['system']['bussbar_rating'];
  data.interconnection['supply_ocpd_rating'] = DB_data['system']['supply_ocpd_rating'];
  data.interconnection['inverter_ocpd_dev_sum'] = DB_data['system']['inverter_ocpd_dev_sum'];
  data.interconnection['inverter_output_cur_sum'] = DB_data['system']['inverter_output_cur_sum'];
  data.interconnection['load_breaker_total'] = DB_data['system']['load_breaker_total'];



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

  if( ! data.inverter.isc_channel && data.inverter.imax_total === null ){ // older SMA data
    data.inverter.isc_channel = data.inverter.imax_channel;
    data.inverter.imax_channel = null;
    data.inverter.imax_total = null;
  } else if( ! data.inverter.isc_channel && data.inverter.imax_total ) { // old field names
    data.inverter.isc_channel = data.inverter.imax_total;
    data.inverter.imax_total = null;
    //data.inverter.imax_channel = data.inverter.imax_channel;
  } // else: field names have been updated, do nothing.


  //////////////////////////


  return data;
};

module.exports = map_DB_data;
