module.exports = function(app){

  // GET method route
  app.get('/', function (req, res) {
    res.send('Nothing here. Try /drawing/[system id.]');
  });

  app.get('/d/:system_id/check', function (req, res) {
    var responce_string = req.method + ': ' + req.url;
    console.log(responce_string);

    res.json({
      system_id: req.params.system_id,
      status: 'error',
      notes: {
        info: [],
        warnings: [],
        errors: [
          'Module array has too high of voltage for the selected Inverter.'
        ],
        svg_url: '/d/'+req.params.system_id+'/SVG'

      },
    });
  });

  app.get('/d/:system_id/SVG', function (req, res) {
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
        svg_url: '/d/'+req.params.system_id+'/SVG'

      },
    });
  });


};
