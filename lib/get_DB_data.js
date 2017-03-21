var f = require('./functions/functions.js');

var oracledb = require('oracledb');
var oracle_credentials = require('../private/sensitive_data/oracle_credentials.js');

oracledb.outFormat = oracledb.OBJECT;
oracledb.queueTimeout = 5000;


var get_DB_data = function(req, callback){
  var system_id = req.query.pv_system_id;
  //var system_id = 37;
  var g_connection;


  var queries = {
    'system': 'SELECT * FROM pvsystem_details WHERE device_id = ' + system_id,
    'module': 'SELECT * FROM pvsystem_modules_view WHERE pvsystem_id = ' + system_id,
    'inverter': 'SELECT * FROM pvsystem_inverters_view WHERE pvsystem_id = ' + system_id,
    'company': `SELECT
                  device_id,
                  certification_id,
                  old_certification_number,
                  company_id,
                  name,
                  line_1,
                  line_2,
                  line_3,
                  city,
                  state,
                  zipcode,
                  country,
                  primary_phone_number,
                  web_site,
                  email
                FROM
                  companies
                  JOIN applications USING(company_id)
                  JOIN application_devices USING(application_id)
                  JOIN company_addresses USING(company_id)
                  JOIN addresses USING(address_id)
                  FULL JOIN certification USING(device_id)
                WHERE
                  device_id =` + system_id
  };





  var section_list = Object.keys(queries);

  var run_function_when_all_queries_are_ready = f.mk_ready_count(4, function(query_responces){
    //callback(section, mapped_data);
    console.log('-- DONE --');
    //console.log(query_responces);

    //doRelease();
    var data = {};
    for( var n in query_responces){
      var section_data = query_responces[n];
      //console.log('C ', n, query_responces['pvmodule_id'], query_responces['inverter_id']);
      //console.log(section_data)

      data['other'] = [];
      if( section_data['pvmodule_id'] !== undefined ){
        data['module'] = section_data;
      } else if( section_data['inverter_id'] !== undefined ){
        data['inverter'] = section_data;
      } else if( section_data['service_type'] !== undefined ) {
        data['system'] = section_data;
      } else if( section_data['company_id'] !== undefined ) {
        data['company'] = section_data;
      } else {
        data['other'].push(section_data);
      }
    }


    callback(data);

  });


  console.log('-- connecting to database --');
  //console.log(oracle_credentials);
  oracledb.getConnection(oracle_credentials, function(err, connection){
    if (err){ console.error(err.message); run_function_when_all_queries_are_ready(false); return; }
    console.log('-- connected --');
    g_connection = connection;


    for( var section in queries ){
      var query = queries[section];
      //console.log('-> section: ', section, ' query: ', query);
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


    //do something when app is closing
    process.on('exit', function(){ console.log('exit');  if(connection.close){connection.close();}});
    //catches ctrl+c event
    process.on('SIGINT', function(){ console.log('SIGINT'); if(connection.close){connection.close();}});
    //catches uncaught exceptions
    process.on('uncaughtException', function(){ console.log('uncaughtException'); if(connection.close){connection.close();}});

    setTimeout(function(){
      connection.close(function(err) {
        if(err) {
          console.error(err.message);
        } else {
          console.log('-- disconnect --');
        }
      });
    }, 5000);

  });

};

module.exports = get_DB_data;
