var Moment = require('moment');

var mk_page = function(settings){
  var state = settings.state;

  var f = settings.f;

  var d = f.Drawing(settings.drawing_settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x, y, h, w, nl;
  d.layer('text');

  var x = size.sheet.w*1/2;
  var y = 50;


  y += 30;
  d.text(
    [x,y],
    [
      'Created on: ' + Moment().format('YYYY-MM-DD'),
      'Based on ' + settings.info.building_code,
    ],
    'text',
    'title2'
  );

  x = 20;
  y += 50;
  d.text(
    [x,y],
    [
      'ELECTRICAL NOTES',
      '1.) CONTRACTOR IS RESPONSIBLE FOR COMPLYING WITH ALL LOCAL OR NATIONAL CODE REQUIREMENTS AND EQUIPMENT INSTALLATION INSTRUCTIONS.',
      '2.) ALL COMPONENTS MUST BE GROUNDED PER NEC 690.43.',
      '3.) EACH MODULE MUST BE GROUNDED ACCORDING TO THE MANUFACTURER\'S INSTRUCTIONS.',
      '4.) PER 690.4(D), ALL EQUIPMENT FOR USE IN PHOTOVOLTAIC POWER SYSTEMS SHALL BE IDENTIFIED AND LISTED FOR THE APPLICATION.',
      '5.) ALL EQUIPMENT TO BE LISTED BY UL OR OTHER NRTL, AND LABELED FOR ITS APPLICATION.',
      '6.) ALL CONDUCTORS SHALL BE COPPER, RATED FOR 600 V AND 90 DEGREE C WET ENVIRONMENT.',
      '7.) WIRING, CONDUIT, AND RACEWAYS MOUNTED ON ROOFTOPS SHALL BE ROUTED DIRECTLY TO, AND LOCATED AS CLOSE AS POSSIBLE TO THE NEAREST RIDGE, HIP, OR VALLEY.',
      '8.) WORKING CLEARANCES AROUND ALL NEW AND EXISTING ELECTRICAL EQUIPMENT SHALL COMPLY WITH NEC 110.26.',
      '9.) CONTRACTOR SHALL FURNISH ALL NECESSARY OUTLETS, SUPPORTS, FITTINGS AND ACCESSORIES TO FULFILL APPLICABLE CODES AND STANDARDS.',
      '10.) WHERE SIZES OF JUNCTION BOXES, RACEWAYS, AND CONDUITS ARE NOT SPECIFIED, THE CONTRACTOR SHALL SIZE THEM ACCORDINGLY.',
      '11.) ALL WIRE TERMINATIONS SHALL BE APPROPRIATELY LABELED AND READILY VISIBLE.',


    ],
    'text',
    'notes'
  );



  return d;
};

module.exports = mk_page;
