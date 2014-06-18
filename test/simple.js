
var expect = require('expect.js');
var fs     = require('fs');
var join   = require('path').join;
var parser = require('../');
var split  = require('split');
var reduce = require('stream-reduce');
var mailparser = require('mailparser');

function toArray() {
  return reduce(function(arr, elem){
    arr.push(elem);
    return arr;
  }, []);
}

describe('mbox stream parser', function(){
  it('works', function(done){
    var mbox = fs.createReadStream(join(__dirname, 'test.mbox'));
    mbox
    .pipe(parser())
    .pipe(toArray())
    .on('data', function(mails){
      expect(mails[0].html).to.be("My message\n");
      expect(mails[0].from[0].address).to.be("test@hotmail.com");

      // FIXME: This should actually be "From My message". mailparser issue
      expect(mails[1].html).to.be(">From My message 2\n");
      done();
    });
  });
});
