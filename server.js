global.project = require('./package.json');

// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');
global._ = require('lodash');
global.server_settings = require('./lib/server_settings.js')();
global.f = require('functions');

var logger = require('winston');
var express = require('express');
var http = require('http');


var port = process.env.NODE_ENV === 'dev' ? '3333' : '3300'
port = process.env.PORT || port;

/*
logger.add(logger.transports.File, {
  filename: 'spd_server.log',
  json: false,
  handleExceptions: true,
  humanReadableUnhandledException: true
});
*/
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
