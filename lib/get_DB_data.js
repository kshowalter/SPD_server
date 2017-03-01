var f = require('./functions/functions.js');

var oracledb = require('oracledb');
var oracle_credentials = require('../private/sensitive_data/oracle_credentials.js');

oracledb.outFormat = oracledb.OBJECT;
oracledb.queueTimeout = 5000;


var get_DB_data = function(req, res){
  var system_id = req.query.pv_system_id;
  //var system_id = 37;
  var g_connection;


  var queries = {
    'system': 'SELECT * FROM pvsystem_details WHERE device_id = ' + system_id,
    'array': 'SELECT * FROM pvsystem_modules_view WHERE pvsystem_id = ' + system_id,
    'inverter': 'SELECT * FROM pvsystem_inverters_view WHERE pvsystem_id = ' + system_id
  };
  var section_list = Object.keys(queries);

  var run_function_when_all_queries_are_ready = f.mk_ready_count(3, function(query_responces){
    //callback(section, mapped_data);
    console.log('-- DONE --');

    //doRelease();
    var data = {};
    for( var n in query_responces){
      var section_data = query_responces[n];
      //console.log('C ', n, query_responces['pvmodule_id'], query_responces['inverter_id']);

      if( section_data['pvmodule_id'] !== undefined ){
        data['array'] = section_data;
      } else if( section_data['inverter_id'] !== undefined ){
        data['inverter'] = section_data;
      } else {
        data['system'] = section_data;
      }
    }


    res.json({
      status: 'returned',
      data: data
    });

  });


  console.log('-- connecting to database --');
  console.log(oracle_credentials);
  oracledb.getConnection(oracle_credentials, function(err, connection){
    if (err){ console.error(err.message); run_function_when_all_queries_are_ready(false); return; }
    console.log('-- connected --');
    g_connection = connection;


    for( var section in queries ){
      var query = queries[section];
      console.log('-> section: ', section, ' query: ', query);
      connection.execute(
        query,
        [],  // bind value for :id
        function(err, result){
          if (err) { console.error(err.message); return; }
          //console.log(result);

          var section_data = {};
          for( var id in result.rows[0] ){
            section_data[id.toLowerCase()] = result.rows[0][id];
          }
          //console.log(mapped_data);
          run_function_when_all_queries_are_ready(section_data);
        }
      );
    }

    setTimeout(function(){
      connection.close(function(err) {
        //run_function_when_all_queries_are_ready(false);
        if(err) {
          console.error(err.message);
        } else {
          console.log('-- disconnect --');
        }
      });

    }, 5000);


  });

  /*
  function doRelease(connection){
    console.log('-- disconnecting --');
    g_connection.close(function(err) {
      if(err) {
        console.error(err.message);
      } else {
        console.log('-- disconnect --');
      }
    });
  }
  */


};

module.exports = get_DB_data;
