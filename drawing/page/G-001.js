var Moment = require('moment');

var mk_page = function(settings){
  var state = settings.state;
  var system = state.system;

  var f = settings.f;

  var d = f.Drawing(settings.drawing_settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var circuit = system.circuits['exposed source circuit wiring'];




  var x, y, h, w, nl;
  d.layer('text');

  x = size.sheet.w*1/2;
  y = 30;

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

  var notes =     [
    'ELECTRICAL NOTES',
    '1.) CONTRACTOR IS RESPONSIBLE FOR COMPLYING WITH ALL LOCAL OR NATIONAL CODE REQUIREMENTS AND EQUIPMENT INSTALLATION INSTRUCTIONS.',
    '2.) ALL COMPONENTS MUST BE GROUNDED PER NEC 690.43 AND ACCORDING TO THE MANUFACTURER\'S INSTRUCTIONS.',
    '3.) ALL EQUIPMENT TO BE LISTED BY UL OR OTHER NRTL, AND LABELED FOR ITS APPLICATION PER NEC 690.4(D).',
    '4.) ALL CONDUCTORS SHALL BE COPPER, RATED FOR 600 V AND 90 DEGREE C WET ENVIRONMENT.',
    '5.) WIRING, CONDUIT, AND RACEWAYS MOUNTED ON ROOFTOPS SHALL BE ROUTED DIRECTLY TO, AND LOCATED AS CLOSE AS POSSIBLE TO THE NEAREST RIDGE, HIP, OR VALLEY.',
    '6.) WORKING CLEARANCES AROUND ALL NEW AND EXISTING ELECTRICAL EQUIPMENT SHALL COMPLY WITH NEC 110.26.',
    '7.) CONTRACTOR SHALL FURNISH ALL NECESSARY OUTLETS, SUPPORTS, FITTINGS AND ACCESSORIES TO FULFILL APPLICABLE CODES AND STANDARDS.',
    '8.) WHERE SIZES OF JUNCTION BOXES, RACEWAYS, AND CONDUITS ARE NOT SPECIFIED, THE CONTRACTOR SHALL SIZE THEM ACCORDINGLY.',
    '9.) ALL WIRE TERMINATIONS SHALL BE APPROPRIATELY LABELED AND READILY VISIBLE.',
    '10.) NEGATIVE GROUNDED SYSTEMS DC CONDUCTORS SHALL BE COLOR CODED AS FOLLOWS: DC POSITIVE- RED (OR MARKED RED), DC NEGATIVE- GREY (OR MARKED GREY).',
    '11.) POSITIVE GROUNDED SYSTEMS DC CONDUCTORS COLOR CODED: DC POSITIVE- GREY (OR MARKED GREY), DC NEGATIVE- BLACK (OR MARKED BLACK).',
    '12.) IF CONDUIT IS DETERMINED TO BE RAN THROUGH ATTIC IN FIELD THEN CONDUIT WILL BE EITHER EMT, FMC, OR MC CABLE,',
    '     COMPLYING WITH NEC 690.31, NEC 250.118(10) AND DISCONNECTING MEANS SHALL COMPLY WITH 690.13(B) AND (C) AND 690.15(A) AND (B). ',
    '     CONDUIT RAN THROUGH ATTIC WILL BE AT LEAST 18" BELOW ROOF SURFACE.',
    '13.) IF APPLICABLE, MODULE GROUNDING LUGS MUST BE INSTALLED AT THE MARKED GROUNDING LUG HOLES PER THE MANUFACTURER\' INSTALLATION REQUIREMENTS',
    '14.) AS INDICATED BY DESIGN, OTHER NTRL LISTED MODULE GROUNDING DEVICES MAY BE USED IN PLACE OF STANDARD GROUNDING LUGS AS SHOWN IN MANUFACTURER DOCUMENTATION,',
    '     AND APPROVED BY THE AHJ.',
    '15.) CONDUIT AND WIRE SPECIFICATIONS ARE BASED ON A MINIMUM CODE REQUIREMENTS AND ARE NOT MEANT TO LIMIT UP-SIZING AS REQUIRED BY FIELD CONDITIONS.',
    '16.) THE AMBIENT TEMPERATURE CORRECTION FACTORS ARE BASED ON 30 DEGREE C (86 DEGREE F)',
    '17.) THE UTILITY WILL NEED TO CHANGE THE METER TO ONE THAT IS APPROVED FOR NET METERING PER FBC 107',
    ' ',
    'EQUIPMENT LOCATIONS',
    '1.) ALL EQUIPMENT SHALL MEET MINIMUM SETBACKS AS REQUITED BY (NEC 110.26)',
    '2.) EQUIPMENT INSTALLED IN DIRECT SUNLIGHT MUST BE RATED FOR EXPECTED OPERATING TEMPERATURE AS SPECIFIED BY (NEC 690.31(A-B)) AND (NEC TABLE 310.15(B)(2)(C))',
    '3.) ADDITIONAL AC DISCONNECTS SHALL BE PROVIDED WHERE THE INVERTER IS NOT ADJACENT TO THE UTILITY AC DISCONNECT, OR NOT WITHIN SIGHT OF THE UTILITY AC DISCONNECT.',

  ];

  if( circuit ){
    var minimum_design_current_test = circuit.conductor_current_cor > circuit.max_current ? 'PASS' : 'FAIL';
    var adjusted_wire_ampacity_test = circuit.conductor_current_cor > circuit.max_current ? 'PASS' : 'FAIL';
    
    notes = notes.concat([
      ' ',
      'CALCULATIONS',
      '1.) MINIMUM DESIGN CURRENT',
      '    A.) THE MAXIMUM OF TWO CALCULATIONS IS SELECTED AS THE DESIGN CURRENT TO SELECT THE WIRE SIZE:',
      '      * MAX_CURRENT * 1.25 * 1.25',
      '      * (FOR AC CIRUITS: MAX_CURRENT * 1.25)',
      '      * MAX_CURRENT  / ( TEMP_CORRECTION_FACTOR * CONDUCTORS_ADJ_FACTOR )',
      '    B.) ROOFTOP MINIMUM DESIGN CURRENT',
      '      * ' + circuit.max_current + ' * 1.25 * 1.25 = ' + circuit.min_req_cond_current_3.toFixed(2),
      '      * ' + circuit.max_current + ' / ( ' + circuit.temp_correction_factor + ' * ' + circuit.conductors_adj_factor + ') = ' + circuit.min_req_cond_current_2.toFixed(2),
      '      * MINIMUM DESIGN CURRENT (' + circuit.min_req_cond_current.toFixed(2) + ') < CONDUCTOR AMPACITY(' + circuit.conductor_current + ') = ' + minimum_design_current_test,
      '2.) ADJUSTED WIRE AMPACITY',
      '    A.) THE RATED AMPACY OF THE CONDUCTOR IS ADJUSTED BASED ON THE TEMPERATURE AND CONDUIT FILL FACTORS.',
      '      * CONDUCTOR_CURRENT * TEMP_CORRECTION_FACTOR * CONDUCTORS_ADJ_FACTOR',
      '    B.) ROOFTOP MINIMUM DESIGN CURRENT',
      '      * ' + circuit.conductor_current + ' * ' + circuit.temp_correction_factor + ' * ' +  circuit.conductors_adj_factor + ' = ' + circuit.conductor_current_cor.toFixed(2),
      '      * ADJUSTED WIRE AMPACITY (' + circuit.conductor_current_cor.toFixed(2) + ') > CIRCUIT AMPACITY(' + circuit.max_current + ') = ' + adjusted_wire_ampacity_test,
    ]);
  }



  d.text(
    [x,y],
    notes,
    'text',
    'notes'
  );



  return d;
};

module.exports = mk_page;
