var oracledb = require('oracledb');
var oracle_credentials = require('../private/sensitive_data/oracle_credentials.js');

var get_DB_data = function(res){
  oracledb.getConnection(oracle_credentials, function(err, connection){
    if (err){ console.error(err.message); return; }

    connection.execute(
      //'select count(*) from devices ',
      'SELECT sysdate FROM dual',
      [],  // bind value for :id
      function(err, result){

        if (err) { console.error(err.message); return; }
        console.log(result.rows[0][0]);
        res.json({
          status: 'returned',
          date: result.rows[0][0]
        });

      }
    );
  });
};

module.exports = get_DB_data;
