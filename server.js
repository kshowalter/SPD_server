// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');

var express = require('express');
var http = require('http');
var port = process.env.PORT || '3300';

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

console.log('server started on http://localhost:'+port);
