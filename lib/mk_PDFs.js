var phantom = require('phantom');
var fs = require('fs');
var shelljs = require('shelljs');
//var _ = require('lodash');
var f = require('functions');

var html_wrap_svg = require('./html_wrap_svg.js');

var binDirectory = process.env.PWD + '/docker_install/';

var pdfDirectory = global.server_settings.local_config.pdfDirectory;
var pdfTempDirectory = process.env.PWD + '/private/pdf_temp_files/';
var specSheetDirectory = global.server_settings.local_config.specSheetDirectory;

var spec_sheets = [];
//spec_sheets.push('systemLimitations.pdf');
//spec_sheets.push('structuralLimitaions.pdf');
//spec_sheets.push('NEC_Label_Specifications.pdf');
//Add spec sheet directory, and make sure the extension is ".pdf"
for(var n=0; n<spec_sheets.length; n++) {
  spec_sheets[n] = specSheetDirectory + spec_sheets[n];
  if(!/[.]pdf$/i.test(spec_sheets[n])) spec_sheets[n] = spec_sheets[n] + '.pdf';
  //logger.info("SPEC SHEET " + n + " IS THIS >>>> " + spec_sheets[n]);
}




/*****************************************************************************************************
 * Takes a list of PDF files and merges them together to make one PDF.
 * @param {string[]} inputFiles - array of pdf file names to merge together, file names do not contain directory
 * @param {string} PDF_file_name - name of pdf to create
 * @param {function} callback - called with name of newly created PDF
 *****************************************************************************************************/
var mergePDF = function(inputFiles, PDF_file_name, callback){

  var options = {silent: true, async: this.async};
  var command = binDirectory + 'gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=' + pdfDirectory + PDF_file_name + ' \'' + inputFiles.join('\' \'') + '\'';

  //logger.info('Command: %s', command);
  shelljs.exec(command, options, function(code, output){
    //TODO: Check for error
    var pdf_write_success = true;
    if(callback) callback(pdf_write_success);  //pass result back to user supplied callback function
  });

};

var simple_svg = '<svg viewBox="0 0 1000 780" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect width="990" height="770" x="5" y="5" stroke="#8e8e8e" fill="none" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" stroke-opacity="1"></rect></svg>';


var render_PDF = function(svg_string, write_path, callback){
  //logger.info('render_PDF: ', write_path);
  var _ph;
  var _page;

  //html = html_wrap_svg(html);

  //html = simple_svg;
  svg_string = svg_string.replace(/<svg /g, '<svg style="position:absolute; top:0px; left:0px; padding=0px; margin:0px;" ');
  svg_string = svg_string.replace('viewBox="0 0 1000 772 "', 'viewBox="0 115 1010 780"');

  phantom.create().then(function(ph){
    _ph = ph;
    return ph.createPage();
  }).then(function(page){
    _page = page;
    //var page_width = 1554;
    //var page_height =  1198;
    //var page_width = 2011;
    //var page_height =  1554;
    var page_width = 1010;
    var page_height =  800;
    page.property('content', svg_string);
    page.property('viewportSize', {
      //height: page_height+'px',
      //width: page_width+'px',
      height: page_height,
      width: page_width,
    });
    page.property('paperSize', {
      //height: '8.5in',
      //width: '11in',
      //margin: '0in'
      format: 'letter',
      orientation: 'landscape',
      margin: '0in'
    });
    //page.property('zoomFactor', 0.821980);
    //page.property('zoomFactor', 1);
    page.property('clipRect', {
      top: 0,
      left: 0,
      width: page_width-80,
      height: page_height-200
    });
    return page.render(write_path+'_temp.pdf');
  }).then(function(status){
    //var options = {silent: true, async: this.async};
    var options = {silent: true};
    //var command = 'gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -dSAFER -dFirstPage=1 -dLastPage=1 -sOutputFile='+write_path+' '+write_path+'';
    var command = 'pdftk '+write_path+'_temp.pdf cat 1 output '+write_path+'';
    //logger.info('Command: ', command);
    shelljs.exec(command, options, function(code, output){
      if(callback) callback(write_path);  //pass result back to user supplied callback function
    });
    ///callback(write_path);
    _page.close();
    _ph.exit();
  }).then(function(status){

  }).catch(function(e){
    logger.info(e);
  });

};


function mk_PDFs(system_settings, PDF_file_name, callback) {
  var system_id = system_settings.system_id;


  // Format HTML to be rendered, and create list of paths for PDF rendering.
  var output_PDF_write_paths = [];
  var pages = system_settings.drawing.svgs.map(function(svg, i){
    //var html = html_wrap_svg(svg.outerHTML);
    var svg_string = svg.outerHTML;

    var page_num = i + 1;
    var pdfName = 'permit_'+system_id+'_p'+page_num+'.pdf';
    var write_path = pdfTempDirectory + pdfName;
    output_PDF_write_paths.push(write_path);
    return {
      svg_string: svg_string,
      write_path: write_path
    };
  });


  // run a function when all PDF renders report they are done.
  var run_function_when_all_PDFs_are_ready = f.mk_ready(output_PDF_write_paths, function(){
    logger.info('PDF is ready ');
    output_PDF_write_paths.push.apply(output_PDF_write_paths, spec_sheets);
    mergePDF(output_PDF_write_paths, PDF_file_name, function(pdf_write_success) {
      callback(pdf_write_success);
    });
  });

  // Start the rendering of PDFs from SVGs in HTML.
  pages.forEach(function(page, i){
    //logger.info('render_PDF() ', i, page.write_path);
    //logger.info(page.html);
    render_PDF(page.svg_string, page.write_path, run_function_when_all_PDFs_are_ready);
  });


}


module.exports = mk_PDFs;
