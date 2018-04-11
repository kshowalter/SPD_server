var f = require('functions');

var mk_system_requirements = function(system_settings){
  var system_requirements = {};
  var system = system_settings.state.system;

  var module = system_settings.state.system.module;
  var array = system_settings.state.system.array;
  var source = system_settings.state.system.source;
  var inverter = system_settings.state.system.inverter;
  var error_check = system_settings.state.system.error_check;
  var intercon = system_settings.state.system.interconnection;
  /*
  var circuits = system_settings.state.system.circuits;
  //*/



  system_requirements['General Information'] = [
    ['User-specified equipment and design elements shall be compliant with current adopted codes and standards, including 2017 FBC, 2014 NEC, 6th Ed FFPC (NFPA 1) and ASCE 7-10.','2014 NEC, 2017 FBC, FFPC, ASCE7-10.'],
    ['All equipment shall be listed and installed in accordance with manufacturer\'s instructions.','NEC 110.3(B)'],
    ['All PV systems and associated equipment shall be installed only by licensed contractors and qualified persons.','NEC 690.4(E), FS Ch 489'],
  ];
  system_requirements['Disclaimers'] = [
    ['User assumes full responsibility for providing accurate and valid input data.',''],
    ['Program results verify minimum requirements for code compliance only.',''],
    ['System performance and design optimization is not considered.',''],
    ['This program does not evaluate impact from shading on arrays.',''],
    ['This program may not consider all aspects of product installation manuals for listed equipment.','AHJs verify compliance with 110.3(B), product installation manuals (and specifications) shall be included in permitting documents for reference.']

  ];
  system_requirements['Limitations'] = [
    ['System Restrictions'],
    ['Simple interactive PV systems only, no battery-based systems.','See NEC 690.2 for standard definitions for PV system circuits used in this document.'],
    ['Program addresses string inverter systems only.','PV systems using AC modules, microinverters and arrays using dc electronics at the module level are not considered in this initial version. Additional algorithms will be added for systems using module-level electronics (ac modules, microinverters and dc-dc converters). '],
    ['Building Restrictions'],
    ['Risk Caterory II structures, single-family residential buildings only.','Limits structural calculations required'],
    ['Installed only on buildings with 2x4 pre-engineered truss systems, 24" OC spacing.','Limits structural calculations required'],
    ['Minimum electrical service requirements 150 A @ 240 V, split-phase.','Limits electrical configurations'],
    ['Interconnections to load side of service disconncting means only.','Limits electrical configurations'],
  ];
  system_requirements['Equipment Restrictions'] = [
    ['Inverters'],
    ['Shall be listed to UL1741 standard, and identified for use with ungrounded PV arrays.','690.4(D) requires inverters listed and identified for interactive PV systems. 690.35(G) requires inverters used in systems with ungrounded photovoltaic source and output circuits to be listed for the purpose.'],
    ['Shall have integral dc disconnect, source circuit combiner ','This limitation assumes all PV source circuits are terminated/parallel at the inverter, and no PV output circuit calculations required.'],
    ['Shall have integral ground-fault protection','690.5 and 690.35(C) require ground-fault protection. PV systems requiring ground-fault protection devices are permitted to have the single-point grounding connection made inside the ground-fault protection equipment or inside the utility-interactive inverter and additional external bonding connections are not permitted. Connections are to be made in accordance with markings on the equipment or in the installation instructions.'],
    ['Shall have integral dc arc-fault protection per UL1699B','690.11 (2011) requires dc arc-fault protection for PV arrays on buildings operating over 80 V.'],
    ['Shall be located in a readily accessible location inside or outside a building','Avoids special labeling and disconnect requirements for inverters installed in not readily accessible locations, such as attics or on rooftops per 690.14(D).'],
    ['Shall be limited to maximum 56 A rated continuous ac output current','This limitation is based on the maximum inverter overcurrent device rating permitted in a residential load center with 200 A OCPD and 225 A busbar rating for load side interconnections.'],
    ['PV Modules'],
    ['Shall be listed to UL1703 standard','Required by 690.4(D), 110.3(B)'],
    ['Flat-plate crystalline silicon modules only','Industry standard'],
    ['Minimum Class C fire rating','For installation on rooftops, must have equla to or greater fire classification than rofing materials.'],
    ['Load ratings shall be provided in manufacturer\'s specifications','Required for wind calculations.'],
    ['Other BOS'],
    ['Racking systems shall be listed to UL 2703 standard and have integrated equipment grounding','Industry standard. Proper bonding between structrual elements required, must use manufacturer approved bonding jumbers and equipment bonding washers as applicable, installed according to manufacturer\'s instructions. 250.136(A) permits bonded metal racking materials to be used for the equipment grounding conductor, and transition to an appropriate size conductor to be run with the PV output circuits. 690.43(C) also permits structures to be used as the equipment grounding conductor. Devices listed and identified for grounding the metallic frames of PV modules or other equipment shall be permitted to bond the exposed metal surfaces or other equipment to mounting structures. Metallic mounting structures, other than building steel, used for grounding purposes shall be identified as equipment-grounding conductors or shall have identified bonding jumpers or devices connected between the separate metallic sections and shall be bonded to the grounding system. 690.43(F) Requires equipment grounding conductors for the PV array and structure (where installed) to be contained within the same raceway or cable or otherwise run with the PV array circuit conductors when those circuit conductors leave the vicinity of the PV array.'],
    ['Shall use minimum 6 AWG CU equipment grounding conductors where exposed, smaller size EGCs shall be installed in raceways','Does not require phyical protection for exposed EGC at array per 690.46 and 250.120(C).'],
    ['PV  module frames are bonded to metal racking with listed equipment bonding washers or piercing clamps.','690.43(D) permits devicesand systems used for mounting PV modules that are also used to provide grounding of the module frames shall be identified for the purpose of grounding PV modules.'],
    ['Listed PV wire shall be used for all exposed single-conductor PV module interconnections','Industry standard, USE-2 permitted by 690.31(B) is not permitted as exposed single-conductor for ungrounded arrays per 690.35(D).'],
    ['Listed PV fuses shall be used for all PV source circuits, if required','PV-rated fuses do not normally require temperature de-rating.'],
    ['All source combiner boxes listed to UL 1741 standard','Shall have proper NEMA rating, number of poles, approriate current and voltage ratings, fuses for both positive and negative circuits (required for ungronded arrays), and be installed according to manufacturer\'s instructions.'],
    ['Other junction boxes and enclosures','Have appropriate ratings and be installed according to manufacturer\'s instructions.'],
    ['All electrical terminals in dc circuits rated for 90C','Allows 90C rated conductor ampacities to be used from Tables 310.15(B)(16) and (17). This includes dc combiner boxes and any installer supplied splices or terminations. Inverter ac output circuits used 75 C ampacity based on connection to standard circuit breakers with 75 C terminals.'],
  ];











  return system_requirements;
};

module.exports = mk_system_requirements;
