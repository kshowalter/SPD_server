var express = require('express');
var router = express.Router();

var mk_drawing = require('./lib/mk_drawing.js');
var mk_settings = require('./lib/mk_settings.js');
var process_system = require('./lib/process_system.js');
var mk_PDF = require('./lib/mk_PDF.js');


/////////////////////////////////////////////////
router.get('/d/:system_id/check', function(req, res) {
  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  // update system calculations
  var system_settings = mk_settings(req.params.system_id);
  system_settings = process_system(system_settings);

  ///////////////////////////////////////////
  var status = system_settings.state.notes.errors.length ? 'error' : 'pass';

  res.json({
    system_id: req.params.system_id,
    status: status,
    notes: system_settings.state.notes,
    svg_url: '/'+req.params.system_id+'/SVG'
  });
});

///////////////////////////////////////////
router.get('/d/:system_id/SVG', function(req, res) {
  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);


  // update system calculations
  var system_settings = mk_settings(req.params.system_id);
  system_settings = process_system(system_settings);

  // update drawing
  system_settings = mk_drawing(system_settings);



  res.json({
    system_id: req.params.system_id,
    status: 'ready',
    notes: {
      info: [
        'Please print sample label document if not provided by label manufacturer'
      ],
      warnings: [],
      errors: [],
    },
    svg_url: '/'+req.params.system_id+'/SVG'
  });
});

////////////////////////////////////////////
router.get('/d/:system_id/SVG_page', function(req, response) {
  console.log('server route', req.params.system_id);

  // update system calculations
  var system_settings = mk_settings(req.params.system_id);
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



  response.end(html);

});
/*
router.get('/d/:system_id/SVG/:page', function(req, response) {
  console.log('server route', req.params.system_id);
  var page_num = req.params.page;
  var system_id = req.params.system_id;

  //var svgs = mk_system(system_id);

  var html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div> ';

  var svg_string = User_systems.findOne({system_id:system_id}).svgs[page_num-1];

  if( svg_string ){
    svg_string = svg_string.replace(/<svg /g, '<svg style="position:absolute; top:0px; left:0px;" ');
    html += svg_string;

    html += ' <iv></body></html>';

    response.end(html);

  } else {
    response.end();

  }


});
//*/



/*******************************************************************
 * Serves the permit to the user as a PDF for the passed system_id
 *******************************************************************/
router.get('/d/:system_id/PDF', function(req, response) {
  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  // update system calculations
  var system_settings = mk_settings(req.params.system_id);
  system_settings = process_system(system_settings);

  // update drawing
  system_settings = mk_drawing(system_settings);

  system_settings.server.host = req.headers.host;

  mk_PDF.download( system_settings );
});

////////////////////
// Attachments

router.get('/d/:system_id/attachments/:num', function(req, response) {
  var uint8Array = User_systems.findOne({system_id:this.params.system_id}).attachments[this.params.num].content;
  var attachment = Buffer.from(uint8Array.buffer);
  if( attachment ){
    this.response.write(attachment);
    this.response.end();
  } else {
    this.response.end();
  }
});




module.exports = router;
