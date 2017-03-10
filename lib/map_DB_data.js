var map_DB_data = function(DB_data){
  var data = {
    array: {},
    inverter:{},
    module: {},
    source: {},
    subpannel: {},
    interconnection: {},
    conduits: {}
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




  return data;
};

module.exports = map_DB_data;