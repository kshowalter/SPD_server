var html_wrap_svg = function(svg_string){

  //svg_string = svg_string.replace(/<svg /g, '<svg style="position:absolute; top:0px; left:0px;" ');
  //svg_string = svg_string.replace(/<svg /g, '<svg style="width:1554px; height:1198px;" ');
  svg_string = svg_string.replace(/<svg /g, '<svg style="position:absolute; top:0px; left:0px; width:1554px;" ');
  //var html = '<!doctype html><html><head></head><body style="width:1554px; height:1198px;"><div> ';
  var html = '<!doctype html><html><head></head><body style="width:1554px;"><div> ';
  //var html = '<!doctype html><html><head></head><body><div> ';
  html += svg_string;
  html += ' </div></body></html>';


  return html;
};

module.exports = html_wrap_svg;
