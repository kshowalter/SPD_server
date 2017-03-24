// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

global.server_settings = require('./lib/server_settings.js')();

var logger = require('winston');
var express = require('express');
var http = require('http');
var port = process.env.PORT || '3300';

logger.add(logger.transports.File, {
  filename: 'spd_server.log',
  handleExceptions: true,
  humanReadableUnhandledException: true
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
logger.info('w server started on http://localhost:'+port);
