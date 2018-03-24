global.project = require('./package.json');

var fs = require('fs');
var path = require('path');
var local_path = __dirname;

var logger = require('winston');
logger.configure({
  transports: [
    new logger.transports.File({
      filename: 'spd_server.log',
      json: false,
      handleExceptions: true,
      humanReadableUnhandledException: true
    }),
    new logger.transports.Console()
  ],
  exitOnError: false
});
global.logger = logger;
// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

global._ = require('lodash');
global.server_settings = require('./lib/server_settings.js')();
global.f = require('functions');

global.server_start_time = new Date();

var express = require('express');
var http = require('http');


var port = process.env.NODE_ENV === 'dev' ? '3333' : '3300'
port = process.env.PORT || port;


////////////////////////
/// version history
var version_history_path = path.join(local_path, 'test_data/version_history.json');
var version_history = {};
if( fs.existsSync(version_history_path) ){
  var version_history_string = fs.readFileSync(version_history_path, {encoding: 'utf8'}).trim();
  if( version_history_string ){
    version_history = JSON.parse( version_history_string );
  } else {
    version_history = {};
  }
}
if( ! version_history.versions ){ version_history.versions = {}; }
if( ! version_history.order ){ version_history.order = []; }
if( ! version_history.versions[global.project.version] ){
  var date = new Date();
  version_history.versions[global.project.version] = {
    first_run: date.toISOString(),
  };
  version_history.order.push(global.project.version);
  fs.writeFileSync(version_history_path, JSON.stringify(version_history, null, '  '), {encoding: 'utf8'});
}
global.project.version_history = version_history;


// Start express app
var app = express();

// Create HTTP server.
var server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);

// Add routes
app.get('/', function (req, res) {
  res.send('Nothing here. Try /d/[system id.]');
});
var router_d = require('./routes.js');
app.use('/s', express.static('static'));
app.use('/', router_d);

logger.info('server started on http://localhost:'+port);
