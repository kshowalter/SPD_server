var phantom = require('phantom');
var fs = require('fs');
var shelljs = require('shelljs');
//var _ = require('lodash');
var render_PDF = require('./render_PDF.js');
var f = require('./functions/functions.js');

var pdfDirectory = global.server_settings.local_config.pdfDirectory;
var specSheetDirectory = global.server_settings.local_config.specSheetDirectory;

var spec_sheets = [];
spec_sheets.push('systemLimitations.pdf');
spec_sheets.push('structuralLimitaions.pdf');
spec_sheets.push('NEC_Label_Specifications.pdf');
//Add spec sheet directory, and make sure the extension is ".pdf"
for(var n=0; n<spec_sheets.length; n++) {
  spec_sheets[n] = specSheetDirectory + spec_sheets[n];
  if(!/[.]pdf$/i.test(spec_sheets[n])) spec_sheets[n] = spec_sheets[n] + '.pdf';
  //console.log("SPEC SHEET " + n + " IS THIS >>>> " + spec_sheets[n]);
}



/*****************************************************************************************************
 * Takes a list of PDF files and merges them together to make one PDF.
 * @param {string[]} inputFiles - array of pdf file names to merge together, file names do not contain directory
 * @param {string} outputFile - name of pdf to create
 * @param {function} callback - called with name of newly created PDF
 *****************************************************************************************************/
var mergePDF = function(inputFiles, outputFile, callback){

  var options = {silent: true, async: this.async};
  var command = 'gs -dBATCH -dNOPAUSE -q -sDEVICE=pdfwrite -sOutputFile=' + pdfDirectory + outputFile + ' \'' + inputFiles.join('\' \'') + '\'';

  //console.log('Command: %s', command);
  shelljs.exec(command, options, function(code, output){
    //TODO: Check for error

    if(callback) callback(outputFile);  //pass result back to user supplied callback function
  });

};





function mk_PDFs(system_settings, callback) {
  var system_id = system_settings.system_id;

  // Format HTML to be rendered, and create list of paths for PDF rendering.
  var output_PDF_write_paths = [];
  var pages = system_settings.drawing.svgs.map(function(svg, i){
    var svg_string = svg.outerHTML;
    svg_string = svg_string.replace(/<svg /g, '<svg style="position:absolute; top:0px; left:0px;" ');
    var html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div> ';
    html += svg_string;
    html += ' </div></body></html>';
    var page_num = i + 1;
    var pdfName = 'permit_'+system_id+'_p'+page_num+'.pdf';
    var write_path = pdfDirectory + pdfName;
    output_PDF_write_paths.push(write_path);
    return {
      html: html,
      write_path: write_path
    };
  });


  // run a function when all PDF renders report they are done.
  var run_function_when_all_PDFs_are_ready = f.mk_ready(output_PDF_write_paths, function(){
    //console.log('run_function_when_all_PDFs_are_ready ');
    output_PDF_write_paths.push.apply(output_PDF_write_paths, spec_sheets);
    var file_name = 'permit_' + system_id + '_' + (new Date()).valueOf() + '.pdf';
    mergePDF(output_PDF_write_paths, file_name, function(pdf6) {
      callback(pdf6);
    });
  });

  // Start the rendering of PDFs from SVGs in HTML.
  pages.forEach(function(page){
    //console.log('render_PDF() ', page.write_path);
    render_PDF(page.html, page.write_path, run_function_when_all_PDFs_are_ready);
  });


}


module.exports = mk_PDFs;
