var _ = require('lodash');
var process_user_input_section = require('./process_user_input_section.js');

var getManufacturerList = function(type){
  // temp replacement for:
  // _.uniq(PV_Components.find({category:'modules'}).map(function(doc){return doc.make;}))
  if( type === 'module'){
    return [
      'Suniva',
      'SolarWorld',
      'Sun Edison'
    ];
  } else if( type === 'inverters' ){
    return [
      'Solectria',
      'ABB',
      'SMA',
      'Fromius'
    ];
  }
};


var mk_inputs = function(settings){
  settings = settings || {};
  settings.state = settings.state || {};
  settings.info = settings.info || {};
  var state = settings.state;

  settings.info.inputs = {
    contractor: {
      contractor_name: {
        type: 'text_input',
      },
      hidden_input: {
        type: 'text_input',
        disabled: true
      },
      contractor_license: {
        type: 'text_input',
      },
      license_type: {
        options:[
          'State Certified Solar Contractor',
          'State Licensed Electrical Contractor'
        ]
      },
      confirm_contractor_will_comply_with_AHJ: {
        type: 'confirm',
        onDrawing: false,
        label: 'The Licensed Solar Installer shall comply with the requirements of the Authority Having Jurisdiction (AHJ) and use properly licensed subcontractors for work in conjunction with the PV installation that exceeds the scope of their license?'
      },
      confirm_is_permitted_roof_structure: {
        type: 'confirm',
        onDrawing: false,
        label: 'Is the PV Array to be installed on defined, permitted roof structure?'
      },
      confirm_array_will_comply_with_AHJ: {
        type: 'confirm',
        onDrawing: false,
        label: 'Does the PV Array comply with all requirements of the Authority Having Jurisdiction for fire ratings?'
      },
      confirm_compliance_with_NEC_2011: {
        type: 'confirm',
        onDrawing: false,
        label: 'Does the PV system design and installation comply with all of the the requirements of the 2011 version of the NEC Article 690?'
      },
      confirm_compliance_with_manufacturer_requirements: {
        type: 'confirm',
        onDrawing: false,
        label: 'Are the PV modules and required components listed installed in accordance with the manufacturer\'s installation requirements?'
      },


    },
    location: {
      county: {
        options:['Broward', 'Miami-Dade', 'Orange', 'Alachua', 'Brevard' ]
      },
      address: {
        type: 'text_input',
      },
      city: {
        type: 'text_input',
      },
      zip_code: {
        type: 'text_input',
      },
      //building_type: {
      //  options: ['Residential', 'Commercial']
      //},
      direction_to_road: {
        note: 'Direction of the road relative to the building.',
        options: ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'],
        onDrawing: false,
      },
      //risk_category: {
      //  //type: 'radio',
      //  options: ['I','II','III','IV'],
      //  default: 'II',
      //},
      exposure_category: {
        //type: 'radio',
        options: ['C','D'],
        value: 'C',
      },
      wind_speed: {
        note: 'ASCE 7-10 Windspeeds',
        type: 'number_input',
      },
    },
    roof: {
      confirm_wood_structural_members_spacing: {
        type: 'confirm',
        onDrawing: false,
        label: [
          'Are the supporting wood structural members',
          'spaced a maximum of 2 feet on center?'
        ]
      },
      //confirm_install_zone: {
      //  type: 'confirm',
      //  onDrawing: false,
      //  label: [
      //    'Is the PV Array installed in',
      //    'Zone P(1) Field of the roof only?'
      //  ]
      //},
      //confirm_gable_roof: {
      //  type: 'confirm',
      //  onDrawing: false,
      //  label: 'Will this PV Array to be installed on a Gable Roof only?'
      //},
      mean_height: {
        units: 'ft.',
        note: 'This is average of the eave and ridge heights. Must be under 30\'.',
        type: 'number_input',
      },
      least_horizontal_distance: {
        units: 'ft.',
        note: '',
        type: 'number_input',
      },
      system_type: {
        options: ['Shingle', 'Clay tile', 'Concrete tile']
      },
      wood_structural_member_type: {
        options: ['Trusses','Rafters']
      },
      num_sections: {
        //options: ['Gable','Shed','Hipped'],
        label: 'Number of sections',
        note: 'Number of seperate install locations on roof',
        options: [1],
      },
      section_shape: {
        //options: ['Gable','Shed','Hipped'],
        options: ['Rectangle'],
        onDrawing: false,
      },
      section_zones: {
        //options: ['Gable','Shed','Hipped'],
        options: ['1', '1 and 2'],
      },
      side_of_building: {
        note: 'This defines what side of the house the array is on.',
        options: ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'],
        onDrawing: false,
      },
      slope: {
        options: ['2:12','3:12','4:12','5:12','6:12','7:12','8:12','9:12','10:12','11:12','12:12'],
      },
      section_length: {
        units: 'ft.',
        label: 'Section Length',
        note: 'This the full length of the roof section, measured from low to high. This section must be within the zones selected above.',
        type: 'number_input',
      },
      section_width: {
        units: 'ft.',
        label: 'Section Width',
        note: 'This the full width of the roof section, perpendictular to the slope. This section must be within the zones selected above.',
        type: 'number_input',
      },


    },

    array: {
      module_make: {
        options: getManufacturerList('modules'),
      },
      module_model: {
        options: [],
      },
      module_orientation: {
        options: ['Portrait','Landscape'],
      },
      modules_per_string: {
        options: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
      },
      number_of_strings: {
        options: [1,2,3,4],
      },
    },
    inverter: {
      inverter_make: {
        options: getManufacturerList('inverters'),
      },
      inverter_model: {
        options: 'TBD',
      },
      //loadcenter_type: {
      //  options: ['240V/120V', '208V/120V', '480V/277V'],
      //},
      grid_voltage: {
        options: [
          '120V',
          '240V',
          //'208V',
          //'277V',
          //'480V Wye',
          //'480V Delta'
        ]
      },
      location: {
        options: ['Inside', 'Outside'],
      },
      distance_to_loadcenter: {
        type: 'number_input',
      }
    },
    //conductors: {
    //
    //},
    interconnection: {
      inverter_subpanel_used:{
        options: ['Yes', 'No'],
        disabled: true,
        note: 'Inveter subpanel used (Yes/No)?'
      },
      inverter_subpanel_feeder_size:{
        type: 'number_input',
        disabled: true,
        note: 'Inverter Subpanel Feeder Size'
      },
      inverter_subpanel_feeder_insulation_type:{
        type: 'number_input',
        disabled: true,
        note: 'Inverter Subpanel Feeder Insulation Type'
      },
      inverter_subpanel_feeder_ampacity_75C:{
        type: 'number_input',
        disabled: true,
        note: 'Inverter Subpanel Feeder Ampacity @ 75C'
      },
      inverter_subpanel_feeder_supply_ocpd_rating:{
        type: 'number_input',
        disabled: true,
        units: 'A',
        note: 'Inverter Subpanel Feeder Supply OCPD Rating (A)'
      },
      inverter_subpanel_busbar_rating:{
        type: 'number_input',
        disabled: true,
        units: 'A',
        note: 'Inverter Subpanel Busbar Rating (A)'
      },
      inverter_OC_at_subpannel:{
        label: 'Inverter OCP at Subpanel',
        type: 'number_input',
        disabled: true,
        units: 'A',
        note: 'Sum of Inverter Output Overcurrent Protection Devices (A)'
      },
      inverter_output_current_subpannel:{
        label: 'Inverter output current at subpanel',
        type: 'number_input',
        disabled: true,
        units: 'A',
        note: 'Sum of Inverter(s) Output Circuit Current (A)'
      },
      total_of_load_breakers_at_subpannel:{
        type: 'number_input',
        disabled: true,
        note: 'Total of Load Breakers'
      },
      main_panel_bussbar_rating:{
        label: 'Bussbar rating',
        type: 'number_input',
        units: 'A',
        note: 'Main Panel Busbar Rating (A)'
      },
      main_panel_supply_ocpd_rating:{
        label: 'Supply OCPD rating',
        type: 'number_input',
        units: 'A',
        note: 'Main Panel Supply OCPD Rating (A)'
      },
      sum_of_inverter_output_ocpd_devices:{
        label: 'Inverter OCPD device sum',
        type: 'number_input',
        units: 'A',
        note: 'Sum of Inverter Output Overcurrent Protection Devices (A)'
      },
      sum_of_inverter_output_circuit_current:{
        label: 'Inverter output current sum.',
        type: 'number_input',
        units: 'A',
        note: 'Sum of Inverter(s) Output Circuit Current (A)'
      },
      total_of_load_breakers:{
        type: 'number_input',
        units: 'A',
        note: 'Total of Load Breakers (A)'
      }
    },


  };


  // Fill in other input information
  var order;
  for( var section_name in settings.info.inputs ){
    var input_section = settings.info.inputs[section_name];

    process_user_input_section(input_section, section_name);

  }

  //add_user_input_table(settings);

  return settings;
};


module.exports = mk_inputs;
