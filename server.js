#!/bin/env node

var express = require('express');

// Some "constants"
var DEFAULT_HOST = '127.0.0.1';
var DEFAULT_PORT = 8080;
var SIGNALS = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'];

var HOST = process.env.MECHANICAL_PENCIL_HOST || DEFAULT_HOST;
var PORT = process.env.MECHANICAL_PENCIL_PORT || DEFAULT_PORT;

function log(message) {
  console.log("%s: " + message, Date(Date.now()));
}

// Attach signal handlers
SIGNALS.forEach(function(signal) {
  process.on(signal, function() {
    log("Received " + signal);
    log("Node server stopping")
    process.exit(1);
  });
});

// Start the static server
express()
  .use(express.static('public'))
  .listen(PORT, HOST, function() {
    log('Node server started on ' + HOST + ':' + PORT);
  });
