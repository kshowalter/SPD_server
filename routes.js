var express = require('express');
var router = express.Router();

var mk_drawing = require('./lib/mk_drawing.js');
var mk_settings = require('./lib/mk_settings.js');
var process_system = require('./lib/process_system.js');
var mk_PDFs = require('./lib/mk_PDFs.js');
var get_DB_data = require('./lib/get_DB_data.js');
var html_wrap_svg = require('./lib/html_wrap_svg.js');
var map_DB_data = require('./lib/map_DB_data.js');


var sample_DB_data = require('./TEMP/DB_sample.json');
var TEST_get_DB_data = function(req, callback){
  console.log('USING TEST DATABASE DATA');
  callback(sample_DB_data);
};





///////////////////////////////////////////
router.get('/t/data', function(req, res) {
  var system_id = req.query.pv_system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  //get_DB_data(req, function(data){
  TEST_get_DB_data(req, function(data){
    data = map_DB_data(data);

    // update system calculations
    var system_settings = mk_settings(data);
    system_settings.server.host = req.headers.host;
    system_settings = process_system(system_settings);

    var settings_sections = Object.keys(system_settings.state.system);

    res.json({
      settings_sections: settings_sections,
      state_system: system_settings.state.system,
      //size: system_settings.drawing_settings.size,
      //loc: system_settings.drawing_settings.loc,
    });

  });
});



///////////////////////////////////////////
router.get('/t/db', function(req, res) {
  var system_id = req.query.pv_system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  //get_DB_data(req, function(data){
  get_DB_data(req, function(data){

    res.json(data);

  });
});









///////////////////////////////////////////
router.get('/d/SVG', function(req, res) {
  var system_id = req.query.pv_system_id;
  //var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'/d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'/d/PDF?pv_system_id='+system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  //get_DB_data(req, function(data){
  get_DB_data(req, function(data){
    data = map_DB_data(data);

    // update system calculations
    var system_settings = mk_settings(data);
    system_settings.server.host = req.headers.host;
    system_settings = process_system(system_settings);

    var status = system_settings.state.notes.errors.length ? 'error' : 'pass';

    if( status === 'pass'){
      // update drawing
      system_settings = mk_drawing(system_settings);

      var svgs = system_settings.drawing.svgs.map(function(svg){
        return svg.outerHTML;
      });

      //var svg_string = svgs[1];
      //if( svg_string ){
      //  var html = html_wrap_svg(svg_string);
      //  res.end(html);
      //} else {
      //  res.end();
      //}

      //mk_PDFs(system_settings, function(PDF_file_name){
      res.json({
        system_id: system_id,
        status: status,
        notes: system_settings.state.notes,
        SVG_url: SVG_url,
        PDF_url: PDF_url,
        SVGs: svgs
      });
      //});

    } else if( status === 'error' ){

      res.json({
        system_id: system_id,
        status: status,
        notes: system_settings.state.notes,
        SVG_url: SVG_url,
        PDF_url: PDF_url,
        SVGs: []
      });
    }
  });
});



///////////////////////////////////////////
router.get('/t/SVG', function(req, res) {
  var system_id = req.query.pv_system_id;
  var sheet_num = req.query.sheet_num;
  //var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'/d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'/d/PDF?pv_system_id='+system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  //get_DB_data(req, function(data){
  TEST_get_DB_data(req, function(data){
    data = map_DB_data(data);

    // update system calculations
    var system_settings = mk_settings(data);
    system_settings.server.host = req.headers.host;
    system_settings = process_system(system_settings);

    var status = system_settings.state.notes.errors.length ? 'error' : 'pass';

    if( status === 'pass'){
      // update drawing
      system_settings = mk_drawing(system_settings);

      var svgs = system_settings.drawing.svgs.map(function(svg){
        return svg.outerHTML;
      });

      //var svg_string = svgs[sheet_num-1];
      //if( svg_string ){
      //  var html = html_wrap_svg(svg_string);
      //  res.end(html);
      //} else {
      //  res.end();
      //}

      //mk_PDFs(system_settings, function(PDF_file_name){
      res.json({
        system_id: system_id,
        status: status,
        notes: system_settings.state.notes,
        SVG_url: SVG_url,
        PDF_url: PDF_url,
        SVGs: svgs
      });
      //});

    } else if( status === 'error' ){

      res.json({
        system_id: system_id,
        status: status,
        notes: system_settings.state.notes,
        SVG_url: SVG_url,
        PDF_url: PDF_url,
        SVGs: []
      });
    }
  });
});



///////////////////////////////////////////
router.get('/t/SVG_page', function(req, res) {
  var system_id = req.query.pv_system_id;
  var sheet_num = req.query.sheet_num;
  //var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'/d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'/d/PDF?pv_system_id='+system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  //get_DB_data(req, function(data){
  TEST_get_DB_data(req, function(data){
    data = map_DB_data(data);

    // update system calculations
    var system_settings = mk_settings(data);
    system_settings.server.host = req.headers.host;
    system_settings = process_system(system_settings);

    var status = system_settings.state.notes.errors.length ? 'error' : 'pass';

    if( status === 'pass'){
      // update drawing
      system_settings = mk_drawing(system_settings);

      var svgs = system_settings.drawing.svgs.map(function(svg){
        return svg.outerHTML;
      });

      var svg_string = svgs[sheet_num-1];
      if( svg_string ){
        var html = html_wrap_svg(svg_string);
        res.end(html);
      } else {
        res.end();
      }

      //mk_PDFs(system_settings, function(PDF_file_name){
      //res.json({
      //  system_id: system_id,
      //  status: status,
      //  notes: system_settings.state.notes,
      //  SVG_url: SVG_url,
      //  PDF_url: PDF_url,
      //  SVGs: svgs
      //});
      //});

    } else if( status === 'error' ){

      res.json({
        system_id: system_id,
        status: status,
        notes: system_settings.state.notes,
        SVG_url: SVG_url,
        PDF_url: PDF_url,
        SVGs: []
      });
    }
  });
});





///////////////////////////////////////////
router.get('/d/PDF', function(req, res) {
  var system_id = req.query.pv_system_id;
  //var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'/d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'/d/PDF?pv_system_id='+system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  //get_DB_data(req, function(data){
  get_DB_data(req, function(data){
    data = map_DB_data(data);

    // update system calculations
    var system_settings = mk_settings(data);
    system_settings.server.host = req.headers.host;
    system_settings.system_id = system_id;
    system_settings = process_system(system_settings);

    var status = system_settings.state.notes.errors.length ? 'error' : 'pass';

    if( status === 'pass'){
      // update drawing
      system_settings = mk_drawing(system_settings);

      var svgs = system_settings.drawing.svgs.map(function(svg){
        return svg.outerHTML;
      });

      //var svg_string = svgs[1];
      //if( svg_string ){
      //  var html = html_wrap_svg(svg_string);
      //  res.end(html);
      //} else {
      //  res.end();
      //}

      mk_PDFs(system_settings, function(PDF_file_name){
        res.json({
          system_id: system_id,
          status: status,
          notes: system_settings.state.notes,
          SVG_url: SVG_url,
          PDF_url: PDF_url,
          SVGs: svgs,
          PDF_file_name: PDF_file_name
        });
      });

    } else if( status === 'error' ){

      res.json({
        system_id: system_id,
        status: status,
        notes: system_settings.state.notes,
        SVG_url: SVG_url,
        PDF_url: PDF_url,
        SVGs: [],
        PDF_file_name: false
      });
    }
  });
});


///////////////////////////////////////////
router.get('/t/PDF', function(req, res) {
  var system_id = req.query.pv_system_id;
  //var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'/d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'/d/PDF?pv_system_id='+system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  //get_DB_data(req, function(data){
  TEST_get_DB_data(req, function(data){
    data = map_DB_data(data);

    // update system calculations
    var system_settings = mk_settings(data);
    system_settings.server.host = req.headers.host;
    system_settings.system_id = system_id;
    system_settings = process_system(system_settings);

    var status = system_settings.state.notes.errors.length ? 'error' : 'pass';

    if( status === 'pass'){
      // update drawing
      system_settings = mk_drawing(system_settings);

      var svgs = system_settings.drawing.svgs.map(function(svg){
        return svg.outerHTML;
      });

      //var svg_string = svgs[1];
      //if( svg_string ){
      //  var html = html_wrap_svg(svg_string);
      //  res.end(html);
      //} else {
      //  res.end();
      //}

      mk_PDFs(system_settings, function(PDF_file_name){
        res.json({
          system_id: system_id,
          status: status,
          notes: system_settings.state.notes,
          SVG_url: SVG_url,
          PDF_url: PDF_url,
          SVGs: svgs,
          PDF_file_name: PDF_file_name
        });
      });

    } else if( status === 'error' ){

      res.json({
        system_id: system_id,
        status: status,
        notes: system_settings.state.notes,
        SVG_url: SVG_url,
        PDF_url: PDF_url,
        SVGs: [],
        PDF_file_name: false
      });
    }
  });
});














module.exports = router;
