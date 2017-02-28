var f = require('./functions/functions.js');

var oracledb = require('oracledb');
var oracle_credentials = require('../private/sensitive_data/oracle_credentials.js');

oracledb.outFormat = oracledb.OBJECT;





var get_DB_data = function(req, res){
  var system_id = req.query.pv_system_id;
  //var system_id = 37;

  var queries = {
    'system': 'SELECT * FROM pvsystem_details WHERE device_id = ' + system_id,
    'array': 'SELECT * FROM pvsystem_modules_view WHERE pvsystem_id = ' + system_id,
    'inverter': 'SELECT * FROM pvsystem_inverters_view WHERE pvsystem_id = ' + system_id
  };
  var section_list = Object.keys(queries);

  var run_function_when_all_queries_are_ready = f.mk_ready(section_list, function(query_responces){
    //callback(section, mapped_data);
    console.log('-- DONE --');

    res.json({
      status: 'returned',
      result: query_responces
    });

  });

  console.log('-- connecting to database --');
  oracledb.getConnection(oracle_credentials, function(err, connection){
    if (err){ console.error(err.message); run_function_when_all_queries_are_ready(false); return; }

    for( var section in queries ){
      var query = queries[section];
      console.log(' query request: ', query);
      connection.execute(
        query,
        [],  // bind value for :id
        function(err, result){
          if (err) { console.error(err.message); return; }
          //console.log(result);
          console.log(' query responce: ', query);

          var section_data = {};
          for( var id in result.rows[0] ){
            section_data[id.toLowerCase()] = result.rows[0][id];
          }
          //console.log(mapped_data);

          run_function_when_all_queries_are_ready(section, section_data);
        }
      );
    }




  });
};

module.exports = get_DB_data;
