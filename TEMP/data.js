load_data = function(){

  //processData( JSON.parse(Assets.getText('data/fsec_copy.json')) )
  //return;

  /******************************************************************************************
  * Grab Module & Inverter Data
  ******************************************************************************************/

  var oracledb =  require('oracledb');
  oracledb.outFormat = oracledb.OBJECT;  //format of result as an object instead of an array

  // Username, Password, and URL of the database are stored in separate file.
	var connection_string =
	{
		"user"          : "pv_cert",
		"password"      : "PASSWORD_GOES_HERE",
		"connectString" : "oraquest.fsec.ucf.edu:1530/FSTST1"
	};
	//var connection_string = JSON.parse(Assets.getText('sensitive_data/db_connection.json'));

	//logger.info("connecting:", connection_string);
  oracledb.getConnection(connection_string, Meteor.bindEnvironment(function(err, connection) {
    if (err) {
			console.error("DB Connection Error:");
      console.error(err.message);
      return;
    }

    connection.execute(
      "select * from pv_cert.modules2",
      [],  // no bind variables
      Meteor.bindEnvironment(function(err, modules) {
        if (err) { console.error(err.message); return; }
        connection.execute(
          "select * from pv_cert.inverters2",
          [],  // no bind variables
          Meteor.bindEnvironment(function(err, inverters) {
            if (err) { console.error(err.message); return; }
            var FSEC_database = { modules: modules.rows, inverters: inverters.rows };
						//logger.info(FSEC_database);
            processData(FSEC_database);
          }));
      }));
    })
  );
};

/*
// This is the importer for the older format
processData = function(FSEC_database) {
  logger.info("[Loading FSEC_database] modules: %s, inverters: %s", FSEC_database.modules.length, FSEC_database.inverters.length);
  //settings.components = f.load_database(FSEC_database);
  FSEC_database = f.lowercase_properties(FSEC_database);
  for( var type in FSEC_database ){
    for( var component_name in FSEC_database[type] ){
      var component = FSEC_database[type][component_name];
      component.type = type;
      if( component['spec_sheet'] ) {
        PV_Components.upsert(component,component);
      }
    }
  }
};
*/

processData = function(FSEC_database) {
  logger.info("[Loading FSEC_database] modules: %s, inverters: %s", FSEC_database.modules.length, FSEC_database.inverters.length);
  //settings.components = f.load_database(FSEC_database);
  FSEC_database = f.lowercase_properties(FSEC_database);
  for( var category in FSEC_database ){

    //var field_list = FSEC_database[category]["metadata"].map(function(database_field){
    //  return database_field.name.toLowerCase();
    //});

    FSEC_database[category].forEach(function(row){
      var component = {};
      //row.forEach(function(value, i){
      //  component[ field_list[i] ] = value;
      //});
      component.category = category;
      //if( component['spec_sheet'] ) {
      PV_Components.upsert(component,component);
      //}
    });
  }
};
