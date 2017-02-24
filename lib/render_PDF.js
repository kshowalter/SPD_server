var phantom = require('phantom');

var render_PDF = function(html, write_path, callback){
  //console.log('render_PDF: ', write_path);
  var _ph;
  var _page;

  phantom.create().then(function(ph){
    _ph = ph;
    return ph.createPage();
  }).then(function(page){
    _page = page;
    page.property('content', html);
    page.property('viewportSize', {
      height: '1198px',
      width: '1554px',
      margin: '0px'
    });
    page.property('paperSize', {
      height: '8.5in',
      width: '11in'
    });
    return page.render(write_path);
  }).then(function(status){
    //console.log(status);
    //console.log('page.render(ed): ' + write_path);
    callback(write_path);
    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });

};

module.exports = render_PDF;
