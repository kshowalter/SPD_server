var express = require('express');
var router = express.Router();

var mk_drawing = require('../lib/mk_drawing.js');

router.get('/d/:system_id/check', function(req, res) {
  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  mk_drawing(req.params.system_id);

  res.json({
    system_id: req.params.system_id,
    status: 'error',
    notes: {
      info: [],
      warnings: [],
      errors: [
        'Module array has too high of voltage for the selected Inverter.'
      ],
      svg_url: '/'+req.params.system_id+'/SVG'

    },
  });
});

router.get('/d/:system_id/SVG', function(req, res) {
  var responce_string = req.method + ': ' + req.url;
  console.log(responce_string);

  res.json({
    system_id: req.params.system_id,
    status: 'ready',
    notes: {
      info: [
        'Please print sample label document if not provided by label manufacturer'
      ],
      warnings: [],
      errors: [],
      svg_url: '/'+req.params.system_id+'/SVG'

    },
  });
});

router.get('/d/:system_id/SVG', function(req, response) {
  console.log('server route', req.params.system_id);

  var system_id = this.params.system_id;

  var svgs = mk_drawing(system_id);


  //console.log(svgs[0].outerHTML);

  //var htmls = [];

// SVG option

  var html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div> ';
  svgs.forEach(function(svg){
    html += svg.outerHTML;
    //htmls.push(html);
  });

  html += ' <iv></body></html>';



  response.end(html);

});

router.get('/d/:system_id/SVG/:page', function(req, response) {
  console.log('server route', req.params.system_id);
  var page_num = req.params.page;
  var system_id = req.params.system_id;

  //var svgs = mk_drawing(system_id);

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




/*******************************************************************
 * Serves the permit to the user as a PDF for the passed system_id
 *******************************************************************/
router.get('/d/:system_id/PDF', function(req, response) {
  permit.download(this.request, this.response, this.params.system_id);
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
