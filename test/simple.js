
var expect = require('expect.js');
var debug  = require('debug')('mbox-stream:test')
var lazy   = require('lazy-string');
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
  var mails;

  before(function(done){
    var mbox = fs.createReadStream(join(__dirname, 'test.mbox'));
    mbox
    .pipe(parser())
    .pipe(toArray())
    .on('data', function(data){
      mails = data;
      done()
    });
  });

  // I'm not sure if these newline tests are right
  it('has newline at end of message', function(){
    expect(mails[0].html).to.be("My message\n");
  });

  it('second has newline at end of message', function(){
    expect(mails[1].html).to.be("From My message 2\n");
  });

  it('has two', function(){
    expect(mails.length).to.be(2);
  });

  it('doesnt strip From at start', function(){
    debug("mail[1] headers %s", lazy(function(){
      return JSON.stringify(mails[1].headers, null, 2)
    }))
    expect(mails[1].headers).to.not.have.property('1471268670779796716@xxx wed jun 18 05')
  });
});
