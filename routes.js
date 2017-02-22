var express = require('express');
var router = express.Router();

var mk_drawing = require('./lib/mk_drawing.js');
var mk_settings = require('./lib/mk_settings.js');
var process_system = require('./lib/process_system.js');
var mk_PDF = require('./lib/mk_PDF.js');




/////////////////////////////////////////////////
router.get('/test', function(req, res) {
  //var system_id = req.query.pv_system_id;
  var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'d/PDF?pv_system_id='+system_id;

  console.log('//////');
  for( var sec in req){
    console.log(sec);
  }
  console.log('//////');
  console.log('???', req.query);


  res.end('good');
});


/////////////////////////////////////////////////
router.get('/d/:system_id/check', function(req, res) {
  //var system_id = req.query.pv_system_id;
  var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'d/PDF?pv_system_id='+system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  // update system calculations
  var system_settings = mk_settings(system_id);
  system_settings.server.host = req.headers.host;
  system_settings = process_system(system_settings);

  ///////////////////////////////////////////
  var status = system_settings.state.notes.errors.length ? 'error' : 'pass';

  res.json({
    system_id: system_id,
    status: status,
    notes: system_settings.state.notes,
    SVG_url: SVG_url,
    PDF_url: PDF_url,
    SVGs: {
      //1: [SVG string?],
      //2: [SVG string?],
      //3: [SVG string?]
    }
  });

});

///////////////////////////////////////////
router.get('/d/:system_id/SVG', function(req, res) {
  //var system_id = req.query.pv_system_id;
  var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'d/PDF?pv_system_id='+system_id;


  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);


  // update system calculations
  var system_settings = mk_settings(system_id);
  system_settings.server.host = req.headers.host;
  system_settings = process_system(system_settings);

  // update drawing
  system_settings = mk_drawing(system_settings);

  res.json({
    system_id: system_id,
    status: status,
    notes: system_settings.state.notes,
    SVG_url: SVG_url,
    PDF_url: PDF_url,
    SVGs: {
      //1: [SVG string?],
      //2: [SVG string?],
      //3: [SVG string?]
    }
  });

});



////////////////////////////////////////////
router.get('/d/:system_id/SVG_page', function(req, res) {
  //var system_id = req.query.pv_system_id;
  var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'d/PDF?pv_system_id='+system_id;


  console.log('server route', system_id);

  // update system calculations
  var system_settings = mk_settings(system_id);
  system_settings.server.host = req.headers.host;
  system_settings = process_system(system_settings);

  // update drawing
  system_settings = mk_drawing(system_settings);

  var svgs = system_settings.drawing.svgs;

  var html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div> ';
  svgs.forEach(function(svg){
    html += svg.outerHTML;
    //htmls.push(html);
  });

  html += ' <iv></body></html>';



  res.end(html);

});


/*******************************************************************
* Serves the permit to the user as a PDF for the passed system_id
*******************************************************************/
router.get('/d/:system_id/PDF', function(req, res) {
  //var system_id = req.query.pv_system_id;
  var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'d/PDF?pv_system_id='+system_id;

  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  // update system calculations
  var system_settings = mk_settings(system_id);
  system_settings.server.host = req.headers.host;
  system_settings = process_system(system_settings);

  // update drawing
  system_settings = mk_drawing(system_settings);


  mk_PDF.download( system_settings );


  res.json({
    system_id: system_id,
    status: status,
    notes: system_settings.state.notes,
    SVG_url: SVG_url,
    PDF_url: PDF_url,
    SVGs: {
      //1: [SVG string?],
      //2: [SVG string?],
      //3: [SVG string?]
    }
  });


});

////////////////////
// Attachments

router.get('/d/:system_id/attachments/:num', function(req, res) {
  //var system_id = req.query.pv_system_id;
  var system_id = req.params.system_id;
  var SVG_url = req.headers.host+'d/SVG?pv_system_id='+system_id;
  var PDF_url = req.headers.host+'d/PDF?pv_system_id='+system_id;

  var uint8Array = User_systems.findOne({system_id:this.params.system_id}).attachments[this.params.num].content;
  var attachment = Buffer.from(uint8Array.buffer);
  if( attachment ){
    this.res.write(attachment);
    this.res.end();
  } else {
    this.res.end();
  }
});




module.exports = router;
