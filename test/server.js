/* eslint-env node, mocha, chai */
/* global it */
var request = require('request');
var assert = require('assert');


var urls = {
  'Local (dev)': {
    url: 'http://localhost:3333',
    valid_system_id: '1411'
  },
  'Local (production)': {
    url: 'http://localhost:3300',
    valid_system_id: '1411'
  },
  'TCPtest 251 (production)': {
    url: 'http://10.173.64.251:3300',
    valid_system_id: '1454'
  },
  'SCP 250 (production)': {
    url: 'http://10.173.64.250:3300',
    valid_system_id: '1411'
  },
};

for( var server_name in urls ){
  describe(server_name, function(){
    var server = urls[server_name];
    var url = server.url;
    var system_id = server.valid_system_id;

    var request_result_SVG;
    var request_result_DB;
    var result_SVG = {};
    var result_DB = {};

    describe('Server functions with sample data', function(){
      before('Requests', function load_request(done){
        request( url+'/t/SVG?pv_system_id='+system_id, function(error, response, body) {
          request_result_SVG = {
            error: error,
            response: response,
            body: body
          };
          if( body ){
            result_SVG = JSON.parse(body);
          }
          done();
        });
      });

      it('returns status 200', function(done) {
        assert.ok(request_result_SVG.response, 'Server does not return response.');
        assert.equal(request_result_SVG.response.statusCode, 200, 'Server request was not filled.');
        done();
      });


      it('system passes', function(done) {
        if( request_result_SVG.response && request_result_SVG.response.statusCode === 200 ){
          assert.equal(result_SVG.status, 'pass', 'Sample system design is not valid.');
        } else {
          this.skip();
        }
        done();
      });

      it('returns 3 SVGs', function(done){
        if( result_SVG.SVGs ){
          assert.equal(result_SVG.SVGs.length, 3);
          done();
        } else {
          this.skip();
        }
      });

      it('circuit details fully calculated', function(done){
        if( request_result_SVG.response && request_result_SVG.response.statusCode === 200 ){
          for( var circuit_name in result_SVG.state.circuits ){
            var circuit = result_SVG.state.circuits[circuit_name];
            for( var parameter_name in circuit ){
              assert.notEqual( circuit[parameter_name], null );
              assert.notEqual( circuit[parameter_name], undefined );
            }
          }
        } else {
          this.skip();
        }
        done();
      });


    });



    describe('DB connected test, with system: '+system_id, function(){
      before('Request DB', function load_request(done){
        if( system_id ){
          this.timeout(10000);
          request( url+'/d/db?pv_system_id='+system_id, function(error, response, body) {
            request_result_DB = {
              error: error,
              response: response,
              body: body
            };
            if( body ){
              result_DB = JSON.parse(body);
            } else {
              result_DB = false;
            }
            done();
          });

        } else {
          request_result_DB = false;
          done();
        }
      });


      it('DB returns status 200', function(done) {
        if( request_result_DB ){
          assert.ok(request_result_SVG.response, 'Server does not return response.');
          assert.equal(request_result_DB.response.statusCode, 200, 'Server does not return response.');
          done();
        } else {
          this.skip();
        }
      });

      it('DB contains system', function(done) {
        if( result_DB ){
          assert.equal(result_DB.status, 'success', 'DB failed to find system_id: '+system_id);
          done();
        } else {
          this.skip();
        }
      });

    });

  });
}
