#!/usr/bin/env node

var parser = require('../');
var through = require("through2").obj;

process.stdin
.pipe(parser())
.pipe(through(function(mail, enc, done){
  this.push(JSON.stringify(mail) + "\n");
  done();
}))
.pipe(process.stdout);

