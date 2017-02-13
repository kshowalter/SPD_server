module.exports = function(app){

  // GET method route
  app.get('/', function (req, res) {
    res.send('Nothing here. Try /drawing/[system id.]');
  });

  app.get('/drawing/:id', function (req, res) {
    var responce_string = req.method + ': ' + req.url;
    console.log(responce_string);
    res.send(responce_string);
  });


};
