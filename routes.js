var express = require('express');
var router = express.Router();

var mk_drawing = require('./lib/mk_drawing.js');
var mk_settings = require('./lib/mk_settings.js');
var process_system = require('./lib/process_system.js');
var mk_PDFs = require('./lib/mk_PDFs.js');
var get_DB_data = require('./lib/get_DB_data.js').get_DB_data;
var get_DB_system_ids = require('./lib/get_DB_data.js').get_DB_system_ids;
var html_wrap_svg = require('./lib/html_wrap_svg.js');
var map_DB_data = require('./lib/map_DB_data.js');

var fs = require('fs');
var path = require('path');

var local_path = __dirname;

var sample_DB_data = {
  'string': require('./test_data/DB_sample_string.json'),
  'micro': require('./test_data/DB_sample_micro.json'),
  'optimizer': require('./test_data/DB_sample_optimizer.json'),
};


var TEST_get_DB_data = function(req, callback){
  var system_type = req.query.system_type || 'string';
  logger.info('USING TEST DATABASE DATA');
  callback(sample_DB_data[system_type]);
};






///////////////////////////////////////////
router.get('/status', function(req, res) {
  var start_time = new Date();
  var uptime_miliseconds = start_time - global.server_start_time;

  res.json({
    data: {
      version: global.project.version,
      uptime: f.format_milliseconds(uptime_miliseconds)
    },
    status: 'Running',
    time: ( new Date() - start_time )/1000,
  });
});

///////////////////////////////////////////
router.get('/api', function(req, res) {
  var start_time = new Date();
  res.json({
    data: {
      Status_url: req.headers.host+'/status',
      API_url: req.headers.host+'/api',
      SVG_url: req.headers.host+'/d/SVG?pv_system_id=<system_id>',
      PDF_url: req.headers.host+'/d/PDF?pv_system_id=<system_id>',
    },
    status: 'Running',
    time: ( new Date() - start_time )/1000,
  });
});





///////////////////////////////////////////
router.get('/d/SVG', function(req, res) {
  var start_time = new Date();
  var system_id = req.query.pv_system_id;
  var sheet_num = req.query.sheet_num;
  //var system_id = req.params.system_id;

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

  //get_DB_data(req, function(data){
  get_DB_data(req, function(data){
    if( data ){
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

        var PDF_file_name = 'PV_drawing_' + system_id + '.pdf';

        mk_PDFs(system_settings, PDF_file_name, function(pdf_write_success){
          logger.info( 'pdf_write_success: ', pdf_write_success);
        });

        if(sheet_num){
          var svg_string = svgs[sheet_num-1];
          if( svg_string ){
            var html = html_wrap_svg(svg_string);
            res.end(html);
          } else {
            res.end();
          }
        } else {
          res.json({
            system_id: system_id,
            status: status,
            time: ( new Date() - start_time )/1000,
            notes: system_settings.state.notes,
            SVGs: svgs,
            PDF_file_name: PDF_file_name,
            data: data,
            state: system_settings.state.system,
          });
        }


      } else if( status === 'error' ){

        res.json({
          system_id: system_id,
          status: status,
          time: ( new Date() - start_time )/1000,
          notes: system_settings.state.notes,
          SVGs: [],
          data: data,
          state: system_settings.state.system,
        });
      }

    } else {
      res.json({
        system_id: system_id,
        status: 'DB data not available',
        time: ( new Date() - start_time )/1000,
        notes: false,
        SVGs: false,
        data: false,
        state: false,
      });

    }



  });
});


///////////////////////////////////////////
router.get('/d/system_id_list', function(req, res) {
  var start_time = new Date();

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

  //get_DB_data(req, function(data){
  get_DB_system_ids(req, function(data){
    if( data ){
      res.json({
        data: data,
        status: 'DB list returned',
        time: ( new Date() - start_time )/1000,
      });
    } else {
      res.json({
        data: false,
        status: 'DB list NOT returned',
        time: ( new Date() - start_time )/1000,
      });
    }
  });
});

///////////////////////////////////////////
router.get('/t/SVG', function(req, res) {
  var start_time = new Date();
  var system_id = req.query.pv_system_id;
  var sheet_num = req.query.sheet_num;
  var system_type = req.query.system_type || 'string';
  //var system_id = req.params.system_id;

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

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

      var output_data_dir = path.join(local_path, 'test_data/'+global.project.version);
      /*
      if ( ! fs.existsSync(output_data_dir) ){
        fs.mkdirSync(output_data_dir);
      }
      */
      var output_data_path = path.join(output_data_dir, 'DB_sample_'+system_type+'_data.json');
      fs.writeFileSync(output_data_path, JSON.stringify(data, null, '  '), {encoding: 'utf8'});
      console.log(output_data_path);

      var svgs = system_settings.drawing.svgs.map(function(svg){

        console.log('SENDING' );
        return svg.outerHTML;
      });

      var PDF_file_name = 'PV_drawing_' + system_id + '.pdf';

      mk_PDFs(system_settings, PDF_file_name, function(pdf_write_success){
        logger.info( 'pdf_write_success: ', pdf_write_success);
      });


      if(sheet_num){
        var svg_string = svgs[sheet_num-1];
        if( svg_string ){
          var html = html_wrap_svg(svg_string);
          res.end(html);
        } else {
          res.end();
        }
      } else {
        res.json({
          system_id: system_id,
          status: status,
          time: ( new Date() - start_time )/1000,
          notes: system_settings.state.notes,
          SVGs: svgs,
          PDF_file_name: PDF_file_name,
          data: data,
          state: system_settings.state.system,
        });
      }


    } else if( status === 'error' ){

      res.json({
        system_id: system_id,
        status: status,
        time: ( new Date() - start_time )/1000,
        notes: system_settings.state.notes,
        SVGs: [],
        data: data,
        state: system_settings.state.system,
      });
    }
  });
});








///////////////////////////////////////////
router.get('/d/PDF', function(req, res) {
  var start_time = new Date();
  var system_id = req.query.pv_system_id;
  //var system_id = req.params.system_id;

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

  //get_DB_data(req, function(data){
  get_DB_data(req, function(data){
    if( data ){
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

        var PDF_file_name = 'PV_drawing_' + system_id + '.pdf';

        mk_PDFs(system_settings, PDF_file_name, function(pdf_write_success){
          res.json({
            system_id: system_id,
            status: status,
            time: ( new Date() - start_time )/1000,
            notes: system_settings.state.notes,
            SVGs: svgs,
            PDF_file_name: PDF_file_name
          });
        });

      } else if( status === 'error' ){

        res.json({
          system_id: system_id,
          status: status,
          time: ( new Date() - start_time )/1000,
          notes: system_settings.state.notes,
          SVGs: [],
          PDF_file_name: false
        });
      }

    } else {
      res.json({
        system_id: system_id,
        status: 'DB data not available',
        time: ( new Date() - start_time )/1000,
        notes: false,
        SVGs: false,
        data: false,
        state: false,
      });
    }

  });
});


///////////////////////////////////////////
router.get('/t/PDF', function(req, res) {
  var start_time = new Date();
  var system_id = req.query.pv_system_id;
  //var system_id = req.params.system_id;

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

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

      var PDF_file_name = 'PV_drawing_' + system_id + '.pdf';

      mk_PDFs(system_settings, PDF_file_name, function(pdf_write_success){
        res.json({
          system_id: system_id,
          status: status,
          time: ( new Date() - start_time )/1000,
          notes: system_settings.state.notes,
          SVGs: svgs,
          PDF_file_name: PDF_file_name
        });
      });

    } else if( status === 'error' ){

      res.json({
        system_id: system_id,
        status: status,
        time: ( new Date() - start_time )/1000,
        notes: system_settings.state.notes,
        SVGs: [],
        PDF_file_name: false
      });
    }
  });
});









///////////////////////////////////////////
router.get('/d/data', function(req, res) {
  var start_time = new Date();
  var system_id = req.query.pv_system_id;

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

  //get_DB_data(req, function(data){
  get_DB_data(req, function(data){
    data = map_DB_data(data);

    // update system calculations
    var system_settings = mk_settings(data);
    system_settings.server.host = req.headers.host;
    system_settings = process_system(system_settings);

    var settings_sections = Object.keys(system_settings.state.system);

    res.json({
      settings_sections: settings_sections,
      time: ( new Date() - start_time )/1000,
      state_system: system_settings.state.system,
      //size: system_settings.drawing_settings.size,
      //loc: system_settings.drawing_settings.loc,
    });

  });
});


///////////////////////////////////////////
router.get('/t/data', function(req, res) {
  var start_time = new Date();
  var system_id = req.query.pv_system_id;

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

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
      time: ( new Date() - start_time )/1000,
      state_system: system_settings.state.system,
      //size: system_settings.drawing_settings.size,
      //loc: system_settings.drawing_settings.loc,
    });

  });
});



///////////////////////////////////////////
router.get('/d/db', function(req, res) {
  var start_time = new Date();
  var system_id = req.query.pv_system_id;

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

  //get_DB_data(req, function(data){
  get_DB_data(req, function(data){
    if( data ){
      res.json({
        status: 'success',
        time: ( new Date() - start_time )/1000,
        data: data,
      });
    } else {
      res.json({
        status: 'fail',
        time: ( new Date() - start_time )/1000,
        data: data,
      });
    }

  });
});

///////////////////////////////////////////
router.get('/t/db', function(req, res) {
  var start_time = new Date();
  var system_id = req.query.pv_system_id;

  var responce_string = req.method + ': ' + req.url;
  logger.info(responce_string);

  //get_DB_data(req, function(data){
  TEST_get_DB_data(req, function(data){
    if( data ){
      res.json({
        status: 'success',
        time: ( new Date() - start_time )/1000,
        data: data,
      });
    } else {
      res.json({
        status: 'fail',
        time: ( new Date() - start_time )/1000,
        data: data,
      });
    }

  });
});









module.exports = router;
