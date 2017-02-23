var phantom = require('phantom');

var render_PDF = function(html, write_path, callback){
  console.log('render_PDF: ', write_path);
  var _ph;
  var _page;

  phantom.create().then(function(ph){
    _ph = ph;
    return ph.createPage();
  }).then(function(page){
    _page = page;
    page.property('content', html);
    page.property('viewportSize', {
      width:2011,
      height:1554
    });
    page.property('paperSize', {
      width: '8.5in',
      height: '11in'
    });
    return page.render(write_path);
  }).then(function(status){
    console.log(status);
    console.log('page.render(ed): ' + write_path);
    _page.close();
    _ph.exit();
  }).catch(function(e){
    console.log(e);
  });

  /*
  phantom.create(function (ph) {
    console.log('phantom.create');
    ph.createPage(function (page) {
      console.log('ph.createPage FileName: %s', write_path);
      page.content = html;
      page.set('viewportSize', {width:2011,height:1554});
      page.paperSize = {
        width: '8.5in',
        height: '11in'
      };
      page.render(write_path, function() {
        console.log('page.render(ed): ' + write_path);
        ph.exit();

        if(callback) callback(write_path);
      });
    });
  },{
    dnodeOpts: {weak: false}
  });
  */

};

module.exports = render_PDF;
