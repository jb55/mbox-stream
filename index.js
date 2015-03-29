
var debug      = require('debug')('mbox-stream');
var MailParser = require('mailparser').MailParser;
var compose    = require('stream-combiner');
var split      = require('split');
var through    = require('through2').obj;

var exports = module.exports = function(opts) {
  opts = opts || {};
  var newParser = opts.mailParser || function(){
    return new MailParser({ streamAttachments: true });
  };
  return compose(
    split(/\n[^>]From\s/),
    through(function(chunk, enc, done){
      chunk = chunk.toString()
      if (!/^From\s/.test(chunk))
        chunk = "From " + chunk
      debug("chunk %s", chunk)
      var self = this;
      var parser = newParser();
      parser.on('end', function(mail){
        self.push(mail);
        done();
      });
      parser.write(chunk);
      parser.end();
    })
  );
};
