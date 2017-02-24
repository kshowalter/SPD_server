var oracledb = require('oracledb');
var oracle_credentials = require('../private/sensitive_data/oracle_credentials.js');

oracledb.outFormat = oracledb.OBJECT;

var get_DB_data = function(query, res){
  oracledb.getConnection(oracle_credentials, function(err, connection){
    if (err){ console.error(err.message); return; }

    connection.execute(

      query,
      [],  // bind value for :id
      function(err, result){

        if (err) { console.error(err.message); return; }
        //console.log(result);
        res.json({
          status: 'returned',
          result: result
        });

      }
    );
  });
};

module.exports = get_DB_data;
