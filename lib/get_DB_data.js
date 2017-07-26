var f = require('functions');

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
    logger.info('-- DONE --');

    if( query_responces && query_responces['1'] && query_responces['1'].data['device_id'] ){
      //doRelease();
      var data = {};
      for( var n in query_responces){
        var section_data = query_responces[n].data;
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
    } else {
      logger.info('No data from DB');
      callback(false);
    }

  });


  logger.info('-- connecting to database --');
  //logger.info(oracle_credentials);
  oracledb.getConnection(oracle_credentials, function(err, connection){
    if(err){
      logger.error('DB connection error');
      logger.error(err.message);
      run_function_when_all_queries_are_ready(false); return;
    }

    logger.info('-- connected --');
    g_connection = connection;

    for( var section in queries ){
      var query = queries[section];
      //logger.info('-> section: ', section, ' query: ', query);
      connection.execute(
        query,
        [],  // bind value for :id
        function(err, result){
          if (err) { logger.error(err.message); return; }
          //logger.info(result);

          var section_data = {};
          for( var id in result.rows[0] ){
            section_data[id.toLowerCase()] = result.rows[0][id];
          }
          //logger.info(mapped_data);
          run_function_when_all_queries_are_ready(section_data);
        }
      );
    }

    //do something when app is closing
    process.on('exit', function(){ logger.info('exit');  if(connection.close){connection.close();}});
    //catches ctrl+c event
    process.on('SIGINT', function(){ logger.info('SIGINT'); if(connection.close){connection.close();}});
    //catches uncaught exceptions
    process.on('uncaughtException', function(){ logger.info('uncaughtException'); if(connection.close){connection.close();}});

    setTimeout(function(){
      connection.close(function(err) {
        if(err) {
          logger.error(err.message);
          callback(false);
        } else {
          logger.info('-- disconnect --');
          callback(false);
        }
      });
    }, 5000);
  });
};



var get_DB_system_ids = function(req, callback){
  var system_id = req.query.pv_system_id;
  //var system_id = 37;
  var g_connection;


  var queries = {
    //'system_id_list_1': `SELECT
    //                        *
    //                      FROM
    //                        pvsystem_details`,
  };
  [53,54,56].forEach(function(device_type_id){
    queries['sytem_list_'+device_type_id] = `SELECT
      inner_query.device_id as system_id,
      inner_query.date_status_updated,
      pvsystem_inverters_view.device_type_id,
      pvsystem_inverters_view.manufacturer_name as inverter_manufacturer,
      pvsystem_modules_view.manufacturer_name as module_manufacturer
      FROM
      (
        SELECT
        *
        FROM
        pvsystem_details
        INNER JOIN device_details USING(device_id)
        INNER JOIN current_device_status USING(device_id)
        INNER JOIN device_status_lkp USING(device_status_id)
      ) inner_query
      INNER JOIN pvsystem_inverters_view ON inner_query.device_id = pvsystem_inverters_view.pvsystem_id
      INNER JOIN pvsystem_modules_view ON inner_query.device_id = pvsystem_modules_view.pvsystem_id
      WHERE
        pvsystem_inverters_view.device_type_id = `+device_type_id+`
      ORDER BY inner_query.date_status_updated DESC`

  });
  //INNER JOIN pvsystem_inverters_view
  //ON device_details.device_id = pvsystem_inverters_view.pvsystem_id


  var section_list = Object.keys(queries);

  var run_function_when_all_queries_are_ready = f.mk_ready_count(3, function(query_responces){
    logger.info('-- DONE --');


    if( query_responces ){
      /*
      var systems = {};
      for( var n in query_responces){
        var response_data = query_responces[n].rows;
        var device_type_id = response_data[0].DEVICE_TYPE_ID;
        systems[device_type_id] = response_data
      }
      callback(systems);
      */
      callback(query_responces);
    } else {
      logger.info('No data from DB');
      callback(false);
    }

  });


  logger.info('-- connecting to database --');
  //logger.info(oracle_credentials);
  oracledb.getConnection(oracle_credentials, function(err, connection){
    if(err){
      logger.error('DB connection error');
      logger.error(err.message);
      run_function_when_all_queries_are_ready(false);
      return;
    }

    logger.info('-- connected --');
    g_connection = connection;

    for( var section in queries ){
      var query = queries[section];
      //logger.info('-> section: ', section, ' query: ', query);
      connection.execute(
        query,
        [],  // bind value for :id
        function(err, result){
          if (err) { logger.error(err.message); return; }
          //logger.info(result);

          var section_data = {};
          for( var id in result.rows[0] ){
            section_data[id.toLowerCase()] = result.rows[0][id];
          }
          //logger.info(mapped_data);
          run_function_when_all_queries_are_ready(result);
        }
      );
    }

    //do something when app is closing
    process.on('exit', function(){ logger.info('exit');  if(connection.close){connection.close();}});
    //catches ctrl+c event
    process.on('SIGINT', function(){ logger.info('SIGINT'); if(connection.close){connection.close();}});
    //catches uncaught exceptions
    process.on('uncaughtException', function(){ logger.info('uncaughtException'); if(connection.close){connection.close();}});

    setTimeout(function(){
      connection.close(function(err) {
        if(err) {
          logger.error(err.message);
          callback(false);
        } else {
          logger.info('-- disconnect --');
          callback(false);
        }
      });
    }, 5000);
  });
};



module.exports = {
  get_DB_data: get_DB_data,
  get_DB_system_ids: get_DB_system_ids
};
