var oracledb = require('oracledb');
var oracle_credentials = require('../private/sensitive_data/oracle_credentials.js');

oracledb.outFormat = oracledb.OBJECT;

var get_DB_data = function(query, section, res){
  console.log(query);
  oracledb.getConnection(oracle_credentials, function(err, connection){
    console.log(query);
    if (err){ console.error(err.message); return; }

    connection.execute(

      query,
      [],  // bind value for :id
      function(err, result){

        if (err) { console.error(err.message); return; }
        //console.log(result);

        var mapped_data = {};

        mapped_data[section] = mapped_data[section] || {};
        for( var id in result.rows[0] ){
          mapped_data[section][id.toLowerCase()] = result.rows[0][id];
        }

        console.log(mapped_data);

        res.json({
          status: 'returned',
          mapped_data: mapped_data,
          result: result
        });

      }
    );
  });
};

module.exports = get_DB_data;
