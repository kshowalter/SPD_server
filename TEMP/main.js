_ = require("lodash");
fs = require("fs");
path = require("path");
jsdom_module = require("jsdom");
var jsdom = jsdom_module.jsdom;

wkhtmltopdf = require("wkhtmltopdf");

document = jsdom();



Meteor.startup(function () {
	//// code to run on server at startup
	PV_Components.remove({});

	load_data();

});


var oracledb = require('oracledb');
//var oracledb = Meteor.npmRequire('oracledb');
oracledb.getConnection(
		{
			user          : "pv_cert",
			password      : "PASSWORD_GOES_HERE",
			connectString : "oraquest.fsec.ucf.edu:1530/FSTST1"
		},
		function(err, connection)
		{
			if (err) { console.error(err.message); return; }

			connection.execute(
					"select count(*) from devices ",
					[],  // bind value for :id
					function(err, result)
					{
						if (err) { console.error(err.message); return; }
						console.log(result.rows);
					});
		});

